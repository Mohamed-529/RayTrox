import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export interface HardwareTelemetry {
  voltage: number;    // Volts (e.g. 5.82V or 12.4V)
  current: number;    // Milliamps (e.g. 180mA)
  power: number;      // Watts (e.g. 1.05W)
  actuatorState: boolean; // GPIO 18 LED/Relay
  timestamp: number;
  rawString?: string;
}

interface HardwareContextType {
  isConnected: boolean;
  isConnecting: boolean;
  portInfo: string | null;
  error: string | null;
  telemetry: HardwareTelemetry;
  rawLogs: string[];
  connectSerial: () => Promise<void>;
  disconnectSerial: () => Promise<void>;
  toggleActuator: (targetState?: boolean) => Promise<void>;
  sendSerialCommand: (cmd: string) => Promise<void>;
  clearLogs: () => void;
  isWebSerialSupported: boolean;
}

const HardwareContext = createContext<HardwareContextType | null>(null);

export const HardwareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [portInfo, setPortInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rawLogs, setRawLogs] = useState<string[]>([
    '[INIT] Hardware Subsystem Loaded · Ready for Web Serial Binding',
  ]);

  const [telemetry, setTelemetry] = useState<HardwareTelemetry>({
    voltage: 5.4,
    current: 165.0,
    power: 0.89,
    actuatorState: false,
    timestamp: Date.now(),
  });

  const portRef = useRef<any>(null);
  const readerRef = useRef<any>(null);
  const keepReadingRef = useRef<boolean>(false);

  const isWebSerialSupported = typeof navigator !== 'undefined' && 'serial' in navigator;

  const appendLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setRawLogs((prev) => [`[${timestamp}] ${msg}`, ...prev.slice(0, 49)]);
  };

  const parseSerialLine = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    try {
      // Expected format: {"v": 5.82, "i": 180.4, "p": 1.05, "actuator": 0}
      if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
        const data = JSON.parse(trimmed);
        const v = typeof data.v === 'number' ? Number(data.v.toFixed(2)) : 0;
        const i = typeof data.i === 'number' ? Number(data.i.toFixed(1)) : 0;
        const p = typeof data.p === 'number' ? Number(data.p.toFixed(2)) : Number(((v * i) / 1000).toFixed(2));
        const act = data.actuator === 1 || data.actuator === true;

        setTelemetry({
          voltage: v,
          current: i,
          power: p,
          actuatorState: act,
          timestamp: Date.now(),
          rawString: trimmed,
        });
        appendLog(`RX: V=${v}V | I=${i}mA | P=${p}W | ACT=${act ? 'ON' : 'OFF'}`);
      } else {
        appendLog(`RAW: ${trimmed}`);
      }
    } catch {
      appendLog(`ERR_PARSE: ${trimmed}`);
    }
  };

  const connectSerial = async () => {
    setError(null);
    if (!isWebSerialSupported) {
      const msg = 'Web Serial API is not supported on this browser. Please use Google Chrome or Microsoft Edge on Desktop.';
      setError(msg);
      appendLog(`[FAIL] ${msg}`);
      return;
    }

    try {
      setIsConnecting(true);
      appendLog('Requesting USB Serial Port access (Prompting user)...');

      // Request port from user
      // @ts-ignore
      const port = await navigator.serial.requestPort();
      portRef.current = port;

      // Open at 115200 baud (Standard for ESP32)
      await port.open({ baudRate: 115200 });
      setIsConnected(true);
      setPortInfo('ESP32 CP2102 @ 115200 Baud');
      appendLog('Connected to USB Serial Port successfully! Reading telemetry...');

      keepReadingRef.current = true;

      // Read text stream
      // @ts-ignore
      const textDecoder = new TextDecoderStream();
      port.readable.pipeTo(textDecoder.writable);
      const reader = textDecoder.readable.getReader();
      readerRef.current = reader;

      let buffer = '';
      (async () => {
        try {
          while (keepReadingRef.current) {
            const { value, done } = await reader.read();
            if (done) break;
            if (value) {
              buffer += value;
              const lines = buffer.split('\n');
              buffer = lines.pop() || '';
              for (const line of lines) {
                parseSerialLine(line);
              }
            }
          }
        } catch (readErr: any) {
          if (keepReadingRef.current) {
            appendLog(`Read Error: ${readErr?.message || readErr}`);
          }
        }
      })();
    } catch (err: any) {
      const errMsg = err?.message || 'Failed to connect to Serial Port.';
      setError(errMsg);
      appendLog(`[ERROR] ${errMsg}`);
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectSerial = async () => {
    keepReadingRef.current = false;
    try {
      if (readerRef.current) {
        await readerRef.current.cancel();
        readerRef.current = null;
      }
      if (portRef.current) {
        await portRef.current.close();
        portRef.current = null;
      }
      setIsConnected(false);
      setPortInfo(null);
      appendLog('[DISCONNECTED] Serial Port closed gracefully.');
    } catch (err: any) {
      appendLog(`[DISCONNECT_ERR] ${err?.message || err}`);
    }
  };

  const sendSerialCommand = async (cmd: string) => {
    if (!portRef.current || !portRef.current.writable) {
      appendLog(`[TX_FAIL] Cannot send '${cmd}': Port not connected or writable.`);
      return;
    }
    try {
      // @ts-ignore
      const textEncoder = new TextEncoderStream();
      const writableStreamClosed = textEncoder.readable.pipeTo(portRef.current.writable);
      const writer = textEncoder.writable.getWriter();
      await writer.write(cmd + '\n');
      writer.releaseLock();
      appendLog(`TX COMMAND: -> ${cmd}`);
    } catch (err: any) {
      appendLog(`TX ERROR: ${err?.message || err}`);
    }
  };

  const toggleActuator = async (targetState?: boolean) => {
    const nextState = targetState !== undefined ? targetState : !telemetry.actuatorState;
    const cmd = nextState ? 'ACTUATOR_ON' : 'ACTUATOR_OFF';
    await sendSerialCommand(cmd);
    setTelemetry((prev) => ({ ...prev, actuatorState: nextState }));
  };

  const clearLogs = () => setRawLogs([]);

  // Auto clean up
  useEffect(() => {
    return () => {
      if (portRef.current) {
        disconnectSerial();
      }
    };
  }, []);

  return (
    <HardwareContext.Provider
      value={{
        isConnected,
        isConnecting,
        portInfo,
        error,
        telemetry,
        rawLogs,
        connectSerial,
        disconnectSerial,
        toggleActuator,
        sendSerialCommand,
        clearLogs,
        isWebSerialSupported,
      }}
    >
      {children}
    </HardwareContext.Provider>
  );
};

export const useHardware = () => {
  const context = useContext(HardwareContext);
  if (!context) {
    throw new Error('useHardware must be used within a HardwareProvider');
  }
  return context;
};
