#!/usr/bin/env python3
"""
GridPulse USB Serial Bridge
Reads real-time physical telemetry packets from Arduino / ESP32 USB COM port
and forwards them to the GridPulse FastAPI backend (http://localhost:8000/api/v1/grid/telemetry).
"""

import sys
import time
import json
import requests

try:
    import serial
    import serial.tools.list_ports
except ImportError:
    print("[!] pyserial is required. Install with: pip install pyserial requests")
    sys.exit(1)

API_ENDPOINT = "http://localhost:8000/api/v1/grid/telemetry"

def auto_detect_serial_port():
    ports = list(serial.tools.list_ports.comports())
    if not ports:
        print("[!] No USB Serial devices detected. Plug in your Arduino / ESP32!")
        return None
    for p in ports:
        if "USB" in p.description or "CH340" in p.description or "CP210" in p.description or "Arduino" in p.description:
            return p.device
    return ports[0].device

def main():
    print("=========================================================")
    print("      GridPulse Hardware-in-the-Loop USB Bridge          ")
    print("=========================================================")

    port = auto_detect_serial_port()
    if not port:
        port = input("Enter COM port manually (e.g. COM3 or /dev/ttyUSB0): ").strip()

    baud_rate = 115200
    print(f"[*] Opening serial connection on {port} @ {baud_rate} baud...")

    try:
        ser = serial.Serial(port, baud_rate, timeout=2)
        time.sleep(2)
        print(f"[+] Connected to physical solar node on {port}!")
        print(f"[*] Forwarding telemetry stream to {API_ENDPOINT}...\n")
    except Exception as e:
        print(f"[-] Error opening serial port: {e}")
        sys.exit(1)

    while True:
        try:
            line = ser.readline().decode('utf-8', errors='ignore').strip()
            if not line or not line.startswith('{'):
                continue

            # Parse JSON from Arduino/ESP32
            payload = json.loads(line)
            print(f"[HW SENSOR] V={payload.get('voltage_v')}V | I={payload.get('current_a')}A | P={payload.get('actual_output_kw')}kW")

            # Post to GridPulse FastAPI
            res = requests.post(API_ENDPOINT, json=payload, timeout=2)
            if res.status_code == 201:
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
