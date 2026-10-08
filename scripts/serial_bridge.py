#!/usr/bin/env python3
"""
GridPulse USB Serial Bridge & Virtual In-Memory Telemetry Fallback
Reads real-time physical telemetry packets from Arduino / ESP32 USB COM port
and forwards them to the GridPulse FastAPI backend (http://localhost:8000/api/v1/grid/telemetry).
Supports automatic fallback to simulated synthetic node telemetry if no physical hardware is plugged in.
"""

import sys
import time
import json
import random
import os

try:
    import requests
except ImportError:
    print("[!] requests is required. Install with: pip install requests")
    sys.exit(1)

API_ENDPOINT = os.environ.get("GRIDPULSE_API_URL", "http://localhost:8000/api/v1/grid/telemetry")

def auto_detect_serial_port():
    try:
        import serial.tools.list_ports
        ports = list(serial.tools.list_ports.comports())
        if not ports:
            return None
        for p in ports:
            desc = p.description or ""
            if any(term in desc for term in ["USB", "CH340", "CP210", "Arduino", "FTDI"]):
                return p.device
        return ports[0].device
    except Exception:
        return None

def run_synthetic_simulation():
    print("\n[i] Starting Synthetic Telemetry Simulator Mode (Press Ctrl+C to stop)...")
    print(f"[*] Dispatching simulated solar array payloads to {API_ENDPOINT} every 2 seconds\n")
    
    node_ids = ["NODE-OKHLA-01", "NODE-OKHLA-02", "NODE-OKHLA-03"]
    
    while True:
        try:
            device_id = random.choice(node_ids)
            voltage = round(random.uniform(11.8, 12.6), 2)
            current = round(random.uniform(1.2, 3.8), 2)
            power_kw = round((voltage * current) / 1000.0, 3)
            irradiance = round(random.uniform(750.0, 950.0), 1)

            payload = {
                "device_id": device_id,
                "neighborhood_id": "ZONE-07",
                "actual_output_kw": power_kw,
                "irradiance_w_m2": irradiance,
                "panel_area_m2": 8.0,
                "voltage_v": voltage,
                "current_a": current,
                "module_temp_c": round(random.uniform(26.0, 34.0), 1)
            }

            print(f"[SIM NODE {device_id}] V={voltage}V | I={current}A | P={power_kw}kW | Irr={irradiance}W/m²")
            
            try:
                res = requests.post(API_ENDPOINT, json=payload, timeout=2)
                if res.status_code in (200, 201):
                    data = res.json()
                    verdict = data.get("consensus_action_verdict", "HOLD_ACTION")
                    loss = data.get("calculated_efficiency_loss_pct", 0.0)
                    relay = data.get("relay_pin_state", "GPIO_LOW_STANDBY")
                    print(f"   └──> [API VERDICT]: {verdict} (Loss: {loss}%, Relay: {relay})")
                else:
                    print(f"   └──> [API WARN] HTTP {res.status_code}")
            except Exception as net_err:
                print(f"   └──> [API OFFLINE] FastAPI server not reached at {API_ENDPOINT} ({net_err})")

            time.sleep(2)
        except KeyboardInterrupt:
            print("\n[*] Exiting simulation bridge.")
            break

def main():
    print("=========================================================")
    print("      GridPulse Hardware-in-the-Loop USB Bridge          ")
    print("=========================================================")

    has_serial = False
    try:
        import serial
        has_serial = True
    except ImportError:
        print("[!] pyserial not found. To bridge physical ESP32, run: pip install pyserial")

    port = auto_detect_serial_port() if has_serial else None

    if not port:
        print("[!] No physical USB COM port detected.")
        choice = input("Run synthetic software simulation mode? [Y/n]: ").strip().lower()
        if choice in ("", "y", "yes"):
            run_synthetic_simulation()
            return
        else:
            print("[*] Aborting. Connect ESP32 via micro-USB and try again.")
            return

    baud_rate = 115200
    print(f"[*] Opening serial connection on {port} @ {baud_rate} baud...")

    try:
        import serial
        ser = serial.Serial(port, baud_rate, timeout=2)
        time.sleep(2)
        print(f"[+] Connected to physical solar node on {port}!")
        print(f"[*] Forwarding telemetry stream to {API_ENDPOINT}...\n")
    except Exception as e:
        print(f"[-] Error opening serial port: {e}")
        run_synthetic_simulation()
        return

    while True:
        try:
            line = ser.readline().decode('utf-8', errors='ignore').strip()
            if not line or not line.startswith('{'):
                continue

            payload = json.loads(line)
            print(f"[HW SENSOR] V={payload.get('voltage_v')}V | I={payload.get('current_a')}A | P={payload.get('actual_output_kw')}kW")

            res = requests.post(API_ENDPOINT, json=payload, timeout=2)
            if res.status_code in (200, 201):
                data = res.json()
                verdict = data.get('consensus_action_verdict')
                print(f"   └──> [GRIDPULSE VERDICT]: {verdict} (Loss: {data.get('calculated_efficiency_loss_pct')}%)")
            else:
                print(f"   └──> [API WARN] HTTP {res.status_code}: {res.text}")

        except json.JSONDecodeError:
            pass
        except KeyboardInterrupt:
            print("\n[*] Exiting hardware bridge.")
            ser.close()
            break
        except Exception as e:
            print(f"[!] Stream error: {e}")
            time.sleep(1)

if __name__ == "__main__":
    main()
