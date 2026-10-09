import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Cpu,
  Download,
  Flame,
  Globe2,
  Play,
  Plug,
  Power,
  RefreshCw,
  Sun,
  Terminal,
  Trash2,
  Tv,
  Wifi,
  Wrench,
  Zap,
} from 'lucide-react';
import { useHardware } from '../context/HardwareContext';

interface Props {
  onClose: () => void;
  onOpenAwsSection?: () => void;
  initialStep?: 'wiring' | 'code' | 'test' | 'aws';
}

export const ARDUINO_FIRMWARE_SKETCH = `/*
 * =====================================================================
 *  GridPulse v4.2 - Bare-Metal IoT Solar Edge Node Firmware
 *  Target: ESP32 DevKit (30/38 Pin) + INA219 (CJMCU-219) High-Side Shunt
 *  Baud Rate: 115200 | Output: Structured JSON Stream
 * =====================================================================
 */

#include <Wire.h>
#include <Adafruit_INA219.h>

Adafruit_INA219 ina219;

// GPIO Definitions
#define ACTUATOR_PIN 18      // Physical LED or 5V Water Wash Relay
#define I2C_SDA_PIN  21      // ESP32 Hardware I2C Data
#define I2C_SCL_PIN  22      // ESP32 Hardware I2C Clock

bool actuatorActive = false;

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  pinMode(ACTUATOR_PIN, OUTPUT);
  digitalWrite(ACTUATOR_PIN, LOW);

  // Initialize Hardware I2C (SDA=21, SCL=22)
  Wire.begin(I2C_SDA_PIN, I2C_SCL_PIN);

  // Initialize INA219 Current/Voltage Sensor (Default address 0x40)
  if (!ina219.begin()) {
    Serial.println("{\\"error\\":\\"INA219_NOT_DETECTED\\",\\"msg\\":\\"Check I2C SDA/SCL wires\\"}");
    while (1) {
      // Fast blink built-in LED to signal wiring error
      digitalWrite(ACTUATOR_PIN, !digitalRead(ACTUATOR_PIN));
      delay(200);
    }
  }

  // Set sensor calibration for 32V, 2A range (maximum resolution for solar cells)
  ina219.setCalibration_32V_2A();
  
  Serial.println("{\\"status\\":\\"BOOT_OK\\",\\"device\\":\\"ESP32_GRIDPULSE_NODE_1\\"}");
}

void loop() {
  // Check for incoming serial commands from GridPulse Web UI
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\\n');
    cmd.trim();
    if (cmd == "ACTUATOR_ON") {
      actuatorActive = true;
      digitalWrite(ACTUATOR_PIN, HIGH);
    } else if (cmd == "ACTUATOR_OFF") {
      actuatorActive = false;
      digitalWrite(ACTUATOR_PIN, LOW);
    } else if (cmd == "ESTOP") {
      actuatorActive = false;
      digitalWrite(ACTUATOR_PIN, LOW);
    }
  }

  // Read telemetry metrics from INA219
  float shuntVoltage_mV = ina219.getShuntVoltage_mV();
  float busVoltage_V   = ina219.getBusVoltage_V();
  float current_mA     = ina219.getCurrent_mA();
  float power_mW       = ina219.getPower_mW();
  float loadVoltage_V  = busVoltage_V + (shuntVoltage_mV / 1000.0);

  // Filter slight sensor noise at rest
  if (current_mA < 0) current_mA = 0.0;
  if (power_mW < 0) power_mW = 0.0;

  // Emit compact single-line JSON packet for GridPulse Web Serial parser
  Serial.print("{\\"v\\":");
  Serial.print(loadVoltage_V, 2);
  Serial.print(",\\"i\\":");
  Serial.print(current_mA, 1);
  Serial.print(",\\"p\\":");
  Serial.print(power_mW / 1000.0, 2);
  Serial.print(",\\"actuator\\":");
  Serial.print(actuatorActive ? 1 : 0);
  Serial.println("}");

  // Emit at 5 Hz (200ms) for high-responsiveness oscilloscope rendering
  delay(200);
}
`;

export const HardwareWorkbenchModal: React.FC<Props> = ({
  onClose,
  onOpenAwsSection,
  initialStep = 'test',
}) => {
  const {
    isConnected,
    isConnecting,
    portInfo,
    error,
    telemetry,
    rawLogs,
    connectSerial,
    disconnectSerial,
    toggleActuator,
    clearLogs,
    isWebSerialSupported,
  } = useHardware();

  const [activeStep, setActiveStep] = useState<'wiring' | 'code' | 'test' | 'aws'>(initialStep);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(ARDUINO_FIRMWARE_SKETCH);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#0B0F19] border-2 border-cyan-500/50 rounded-3xl max-w-5xl w-full max-h-[94vh] flex flex-col shadow-[0_0_80px_rgba(6,182,212,0.2)] overflow-hidden font-sans">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-[#080C14] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-400 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  GridPulse Hardware Bench &amp; Live Serial Link
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  ESP32 + INA219
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ajantha Student Projects (Ritchie Street) Bill Items Setup Guide &amp; Direct USB Serial Sync
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Connection badge */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold ${
                isConnected
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                }`}
              />
              <span>{isConnected ? 'USB SERIAL LIVE' : 'HARDWARE DISCONNECTED'}</span>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm cursor-pointer transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation */}
        <div className="flex border-b border-slate-800 bg-[#070A11] px-6 text-xs font-mono flex-shrink-0">
          <button
            onClick={() => setActiveStep('wiring')}
            className={`py-3.5 px-4 font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeStep === 'wiring'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>1. Pin-to-Pin Wiring Guide</span>
          </button>

          <button
            onClick={() => setActiveStep('code')}
            className={`py-3.5 px-4 font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeStep === 'code'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>2. Arduino Firmware (.ino)</span>
          </button>

          <button
            onClick={() => setActiveStep('test')}
            className={`py-3.5 px-4 font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeStep === 'test'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>3. Live USB Test &amp; Verification</span>
            {isConnected && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveStep('aws')}
            className={`py-3.5 px-4 font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeStep === 'aws'
                ? 'border-amber-400 text-amber-300 bg-amber-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>4. Next: AWS IoT Cloud</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300 text-xs">
          {/* TAB 1: WIRING GUIDE */}
          {activeStep === 'wiring' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 text-cyan-200 flex items-start gap-3">
                <Zap className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="block text-sm text-cyan-300">
                    No Breadboard Required — Direct Female-to-Female Jumper Wires
                  </strong>
                  <p className="text-slate-300">
                    Using the components from your Ritchie Street bill (ESP32 DevKit, INA219, Solar Panel, 5mm LED, 330Ω Resistor), wire them pin-to-pin as shown below:
                  </p>
                </div>
              </div>

              {/* Soldering & Pin Header Fix Callout */}
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
                  <Wrench className="w-4 h-4 text-amber-400" />
                  <span>INA219 Soldering Guide (6 Pins Total)</span>
                </div>
                <p className="text-xs text-slate-300">
                  INA219 boards arrive with loose 6-pin male strip headers. Because jumper wire sockets cannot grip bare holes, solder the 6 male pins (VCC, GND, SCL, SDA, Vin-, Vin+) once. 
                  ESP32 DevKit already comes with factory pre-soldered pins, so <strong>only 6 solder joints on the INA219</strong> are required for the entire project!
                </p>
                <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-mono">
                  <span className="px-2.5 py-1 rounded-md bg-amber-900/60 border border-amber-600/50 text-amber-200">
                    ⚡ Total Soldering Joints: 6 pins on INA219
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-blue-900/60 border border-blue-600/50 text-blue-200">
                    🔌 Jumper Wires: 4 F-to-F (I2C) + 2 F-to-M (LED)
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-900/60 border border-emerald-600/50 text-emerald-200">
                    ✓ ESP32: Pre-soldered factory pins
                  </span>
                </div>
              </div>

              {/* Pin Mapping Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Table 1: ESP32 to INA219 */}
                <div className="p-5 rounded-2xl bg-[#070B14] border border-slate-800 space-y-3 font-mono">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-sm font-bold text-cyan-400">
                      A. ESP32 ➔ INA219 Current Sensor
                    </span>
                    <span className="text-[10px] text-slate-500">I2C BUS (4 WIRES)</span>
                  </div>
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-800/80">
                        <th className="py-1.5">ESP32 Pin</th>
                        <th className="py-1.5">INA219 Pin</th>
                        <th className="py-1.5">Wire Color</th>
                        <th className="py-1.5">Function</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      <tr>
                        <td className="py-2 font-bold text-white">3V3</td>
                        <td className="py-2 text-rose-400 font-bold">VCC</td>
                        <td className="py-2 text-rose-400">Red</td>
                        <td className="py-2 text-slate-400">3.3V Power</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-bold text-white">GND</td>
                        <td className="py-2 text-slate-400 font-bold">GND</td>
                        <td className="py-2 text-slate-400">Black</td>
                        <td className="py-2 text-slate-400">Common Ground</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-bold text-cyan-300">GPIO 21</td>
                        <td className="py-2 text-cyan-300 font-bold">SDA</td>
                        <td className="py-2 text-blue-400">Blue</td>
                        <td className="py-2 text-slate-400">I2C Data Line</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-bold text-cyan-300">GPIO 22</td>
                        <td className="py-2 text-cyan-300 font-bold">SCL</td>
                        <td className="py-2 text-yellow-400">Yellow</td>
                        <td className="py-2 text-slate-400">I2C Clock Line</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Table 2: Solar Panel to INA219 Terminals */}
                <div className="p-5 rounded-2xl bg-[#070B14] border border-slate-800 space-y-3 font-mono">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-sm font-bold text-amber-400">
                      B. Solar Panel ➔ INA219 Screw Terminals
                    </span>
                    <span className="text-[10px] text-slate-500">POWER MEASUREMENT</span>
                  </div>
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-500 border-b border-slate-800/80">
                        <th className="py-1.5">Solar Panel</th>
                        <th className="py-1.5">Connection</th>
                        <th className="py-1.5">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      <tr>
                        <td className="py-2 font-bold text-rose-400">Panel (+) Wire</td>
                        <td className="py-2 text-emerald-400 font-bold">Vin+ (Screw terminal)</td>
                        <td className="py-2 text-slate-400">Current enters shunt</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-bold text-slate-300">Panel (-) Wire</td>
                        <td className="py-2 text-slate-300 font-bold">ESP32 GND</td>
                        <td className="py-2 text-slate-400">Common circuit return</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-bold text-amber-400">Vin- Terminal</td>
                        <td className="py-2 text-amber-400 font-bold">Load (+) or 330Ω</td>
                        <td className="py-2 text-slate-400">Shunt exit to load</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="text-[11px] text-slate-400 pt-1">
                    💡 <em>Tip: For open-circuit voltage calibration testing, you can leave Vin- open or bridge Vin- through the 330Ω resistor to GND.</em>
                  </p>
                </div>
              </div>

              {/* Table 3: Actuator LED */}
              <div className="p-5 rounded-2xl bg-[#070B14] border border-slate-800 space-y-3 font-mono">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-sm font-bold text-emerald-400">
                    C. Actuator Feedback LED (5V Water Sprinkler Simulation)
                  </span>
                  <span className="text-[10px] text-slate-500">DIGITAL OUTPUT</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-black/60 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">1. SIGNAL SOURCE</span>
                    <strong className="text-white">ESP32 GPIO 18</strong>
                    <p className="text-[11px] text-slate-400 mt-1">Connect to 330Ω resistor first.</p>
                  </div>
                  <div className="p-3 bg-black/60 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">2. CURRENT LIMITER</span>
                    <strong className="text-amber-300">330Ω ¼W Resistor</strong>
                    <p className="text-[11px] text-slate-400 mt-1">Protects the LED from excess current.</p>
                  </div>
                  <div className="p-3 bg-black/60 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">3. 5mm RED/GREEN LED</span>
                    <strong className="text-emerald-300">Long Leg (+) / Short Leg (GND)</strong>
                    <p className="text-[11px] text-slate-400 mt-1">Short leg connects directly to ESP32 GND.</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveStep('code')}
                  className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-lg shadow-cyan-500/25"
                >
                  <span>Wiring Complete ➔ Get Arduino Code</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ARDUINO CODE */}
          {activeStep === 'code' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#080C16] border border-slate-800">
                <div className="space-y-1">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>Arduino IDE Setup Steps</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Adafruit_INA219 Library
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs">
                    1. Open Arduino IDE ➔ <strong>Sketch ➔ Include Library ➔ Manage Libraries</strong> ➔ Search and Install <strong>"Adafruit INA219"</strong>.
                    <br />
                    2. Select Board: <strong>"DOIT ESP32 DEVKIT V1"</strong> (or "ESP32 Dev Module").
                    <br />
                    3. Plug in ESP32 via your Data Cable, select the COM Port, paste code below, and click <strong>Upload (→)</strong>!
                  </p>
                </div>

                <button
                  onClick={handleCopyCode}
                  className="px-4 py-2.5 rounded-xl bg-cyan-950 border border-cyan-400 text-cyan-300 hover:bg-cyan-900 font-mono text-xs font-bold flex items-center gap-2 flex-shrink-0 cursor-pointer transition-all"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Sketch'}</span>
                </button>
              </div>

              {/* Code Viewer */}
              <div className="relative rounded-2xl bg-black border border-slate-800 overflow-hidden font-mono text-xs">
                <div className="bg-[#0A0E18] px-4 py-2 border-b border-slate-800 flex justify-between items-center text-slate-400 text-[11px]">
                  <span>GridPulse_Node_ESP32.ino</span>
                  <span>115200 Baud · JSON Output</span>
                </div>
                <pre className="p-4 overflow-x-auto text-emerald-400 max-h-96 leading-relaxed">
                  <code>{ARDUINO_FIRMWARE_SKETCH}</code>
                </pre>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setActiveStep('wiring')}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white font-mono text-xs cursor-pointer"
                >
                  ← Back to Wiring
                </button>

                <button
                  onClick={() => setActiveStep('test')}
                  className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-lg shadow-cyan-500/25"
                >
                  <span>Code Uploaded ➔ Test Web Serial Link</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: LIVE WEB SERIAL TESTING */}
          {activeStep === 'test' && (
            <div className="space-y-6">
              {/* Connection Console */}
              <div className="p-6 rounded-2xl bg-[#070B14] border-2 border-slate-800 space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-base font-bold text-white flex items-center gap-2 font-mono">
                      <Plug className="w-5 h-5 text-cyan-400" />
                      <span>Physical USB Web Serial Port</span>
                    </div>
                    <p className="text-slate-400 text-xs">
                      Connect your laptop directly to the ESP32 CP2102 chip at 115200 Baud with zero software drivers needed.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {!isConnected ? (
                      <button
                        onClick={connectSerial}
                        disabled={isConnecting}
                        className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-mono text-xs flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-emerald-500/30"
                      >
                        <Plug className="w-4 h-4" />
                        <span>{isConnecting ? 'Selecting Port...' : '🔌 Connect ESP32 (COM Port)'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={disconnectSerial}
                        className="px-5 py-3 rounded-xl bg-rose-950 border border-rose-500 text-rose-300 hover:bg-rose-900 font-mono text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <Power className="w-4 h-4" />
                        <span>Disconnect Port</span>
                      </button>
                    )}
                  </div>
                </div>

                {!isWebSerialSupported && (
                  <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/60 text-rose-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>
                      Web Serial API is supported in Google Chrome, Microsoft Edge, and Opera desktop browsers. (Safari and Firefox do not support native Web Serial).
                    </span>
                  </div>
                )}

                {error && (
                  <div className="p-4 rounded-xl bg-amber-950/80 border-2 border-amber-500/80 text-amber-200 space-y-3 font-mono text-xs">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <strong className="text-white text-sm block">
                          {error.includes('permissions policy') || error.includes('disallowed')
                            ? 'Browser Security: Serial Port blocked inside Preview Frame'
                            : 'Serial Connection Notice'}
                        </strong>
                        <p className="text-amber-200/90 text-xs leading-relaxed">
                          {error.includes('permissions policy') || error.includes('disallowed')
                            ? 'Google Chrome blocks USB Serial access inside an embedded iframe preview. You must open this web app in a direct browser tab (top-level window) for Chrome to grant USB/COM Port access!'
                            : error}
                        </p>
                      </div>
                    </div>

                    {(error.includes('permissions policy') || error.includes('disallowed')) && (
                      <div className="pt-2 border-t border-amber-800/60 flex flex-wrap items-center gap-3">
                        <a
                          href={window.location.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-md"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Open in New Browser Tab (Direct URL)</span>
                        </a>
                        <span className="text-[11px] text-amber-300/80">
                          (Once opened in the new tab, click "Connect ESP32" and Chrome will show the COM port popup!)
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Live Real-Time Gauges (Live from Hardware) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                  <div className="p-4 rounded-xl bg-black border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase block">Solar Bus Voltage</span>
                    <strong className="text-xl text-cyan-400 block tabular-nums">
                      {telemetry.voltage.toFixed(2)} V
                    </strong>
                    <span className="text-[10px] text-slate-500">Panel Range: 0–12.0V (Voc 11.1V)</span>
                  </div>

                  <div className="p-4 rounded-xl bg-black border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase block">Shunt Current</span>
                    <strong className="text-xl text-emerald-400 block tabular-nums">
                      {telemetry.current.toFixed(1)} mA
                    </strong>
                    <span className="text-[10px] text-slate-500">INA219 16-bit ADC</span>
                  </div>

                  <div className="p-4 rounded-xl bg-black border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase block">Calculated Power</span>
                    <strong className="text-xl text-amber-400 block tabular-nums">
                      {telemetry.power.toFixed(2)} W
                    </strong>
                    <span className="text-[10px] text-slate-500">P = V × I</span>
                  </div>

                  <div className="p-4 rounded-xl bg-black border border-slate-800 space-y-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Actuator (GPIO 18)</span>
                      <strong className={`text-sm block ${telemetry.actuatorState ? 'text-amber-400' : 'text-slate-400'}`}>
                        {telemetry.actuatorState ? '● HIGH (LED ON)' : '○ LOW (OFF)'}
                      </strong>
                    </div>

                    <button
                      onClick={() => toggleActuator()}
                      className={`w-full py-1.5 px-2 rounded-lg font-mono text-[10px] font-bold border transition-colors cursor-pointer ${
                        telemetry.actuatorState
                          ? 'bg-amber-950 border-amber-500 text-amber-300'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {telemetry.actuatorState ? 'Turn LED OFF' : 'Test LED Blink'}
                    </button>
                  </div>
                </div>
              </div>

              {/* 3 Step Verification Suite */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block font-mono">
                  Run These 3 Live Physical Hardware Tests:
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-[#070B14] border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold">
                      <Sun className="w-4 h-4" />
                      <span>Test 1: Sunlight / Lamp</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      Flash your mobile torch or hold panel under room light. Voltage will instantly climb above <strong>4.5V</strong> and current will rise.
                    </p>
                    <div className="text-[10px] text-emerald-400 font-bold">
                      Expected Status: NOMINAL
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#070B14] border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 font-bold">
                      <Activity className="w-4 h-4" />
                      <span>Test 2: Hand Shadow (Smog)</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      Place your hand completely over the solar panel. Current drops to &lt; 20 mA. GridPulse detects uniform degradation and triggers automated cleaning!
                    </p>
                    <div className="text-[10px] text-amber-400 font-bold">
                      Expected: 5V RELAY / LED ENGAGED
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#070B14] border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-rose-400 font-bold">
                      <AlertCircle className="w-4 h-4" />
                      <span>Test 3: Wire Disconnect</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      Gently pull out one positive wire from Vin+. Current drops to 0.0 mA while solar cell is in open circuit. Detects isolated diode/cell failure.
                    </p>
                    <div className="text-[10px] text-rose-400 font-bold">
                      Expected: CRACKED DIODE ANOMALY
                    </div>
                  </div>
                </div>
              </div>

              {/* Rolling Serial Console */}
              <div className="rounded-2xl bg-black border border-slate-800 overflow-hidden font-mono text-xs space-y-0">
                <div className="bg-[#0A0E18] px-4 py-2 border-b border-slate-800 flex justify-between items-center text-slate-400 text-[11px]">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Raw Serial UART Stream (115200 Baud)</span>
                  </div>
                  <button
                    onClick={clearLogs}
                    className="text-slate-500 hover:text-slate-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                </div>
                <div className="p-4 bg-[#020504] h-40 overflow-y-auto space-y-1 text-emerald-400 font-mono text-[11px]">
                  {rawLogs.map((log, idx) => (
                    <div key={idx} className="leading-tight">
                      {log}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setActiveStep('code')}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white font-mono text-xs cursor-pointer"
                >
                  ← Back to Code
                </button>

                <button
                  onClick={() => setActiveStep('aws')}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold font-mono text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-lg shadow-amber-500/25"
                >
                  <span>Hardware Verified ➔ Proceed to AWS Section</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: AWS SECTION PREVIEW & ROADMAP */}
          {activeStep === 'aws' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/50 text-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-base font-bold text-amber-300 font-mono">
                  <Globe2 className="w-5 h-5 text-amber-400" />
                  <span>Next Milestone: Connecting Physical ESP32 to AWS Cloud</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Once your ESP32 streams local telemetry over USB Serial, we transition it into an independent <strong>IoT Edge Gateway</strong> that connects directly to your home/mobile WiFi and publishes telemetry to <strong>AWS IoT Core</strong> via MQTT with TLS encryption!
                </p>
              </div>

              {/* AWS Cloud Pipeline Architecture */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-4 rounded-xl bg-[#070B14] border border-slate-800 space-y-1.5">
                  <span className="text-[10px] text-amber-400 font-bold block">STEP 1</span>
                  <strong className="text-white block">AWS IoT Core</strong>
                  <p className="text-[11px] text-slate-400">
                    X.509 device certificates &amp; MQTT topic: <code className="text-amber-300">gridpulse/telemetry</code>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#070B14] border border-slate-800 space-y-1.5">
                  <span className="text-[10px] text-amber-400 font-bold block">STEP 2</span>
                  <strong className="text-white block">AWS IoT Rule</strong>
                  <p className="text-[11px] text-slate-400">
                    SQL rule filters packets in &lt;5ms and invokes serverless Lambda.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#070B14] border border-slate-800 space-y-1.5">
                  <span className="text-[10px] text-amber-400 font-bold block">STEP 3</span>
                  <strong className="text-white block">Lambda Consensus</strong>
                  <p className="text-[11px] text-slate-400">
                    Calculates spatial variance against neighboring array baseline.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#070B14] border border-slate-800 space-y-1.5">
                  <span className="text-[10px] text-amber-400 font-bold block">STEP 4</span>
                  <strong className="text-white block">DynamoDB &amp; Twilio</strong>
                  <p className="text-[11px] text-slate-400">
                    Persists records &amp; dispatches emergency voice call if fault confirmed.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black border border-slate-800 font-mono text-xs space-y-2">
                <span className="text-slate-400 block font-bold">What will be needed for the AWS Section:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li>AWS Free Tier Account (IoT Core is free for 2.25 million messages/month).</li>
                  <li>WiFi SSID and Password configured in the ESP32 sketch.</li>
                  <li>AWS IoT Endpoint (e.g., <code className="text-cyan-300">a3xxxx-ats.iot.ap-south-1.amazonaws.com</code>).</li>
                </ul>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setActiveStep('test')}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white font-mono text-xs cursor-pointer"
                >
                  ← Back to USB Testing
                </button>

                {onOpenAwsSection && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAwsSection();
                    }}
                    className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold font-mono text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-lg shadow-amber-500/25"
                  >
                    <span>Open AWS Cloud Topology View</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
