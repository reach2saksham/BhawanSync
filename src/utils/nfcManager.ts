import type { WorkerLogEntry } from '../types';

export interface NfcScanResult {
  serialNumber: string;
  timestamp: string;
  source: 'hardware-web-nfc' | 'screen-touch-badge' | 'usb-rfid-scanner';
}

// Check if Web NFC (NDEFReader) is available in current browser
export function isWebNfcAvailable(): boolean {
  return typeof window !== 'undefined' && 'NDEFReader' in window;
}

interface WebNfcReaderInstance {
  scan: (options?: { signal?: AbortSignal }) => Promise<void>;
  addEventListener: (type: string, listener: (event: { serialNumber?: string }) => void) => void;
}

// Start native Web NFC reading (supported on Android Chrome, compatible kiosk hardware)
export async function startHardwareNfcListener(
  onScan: (result: NfcScanResult) => void,
  onError: (err: Error) => void
): Promise<AbortController | null> {
  if (!isWebNfcAvailable()) {
    onError(new Error('Web NFC API is not supported on this device/browser. Use tablet touch badge simulator or connected RFID reader.'));
    return null;
  }

  try {
    const controller = new AbortController();
    const win = window as unknown as { NDEFReader: new () => WebNfcReaderInstance };
    const ndef = new win.NDEFReader();
    await ndef.scan({ signal: controller.signal });

    ndef.addEventListener('reading', (event: { serialNumber?: string }) => {
      const serial = event.serialNumber || 'NFC-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      onScan({
        serialNumber: serial,
        timestamp: new Date().toISOString(),
        source: 'hardware-web-nfc'
      });
    });

    return controller;
  } catch (err: unknown) {
    onError(err instanceof Error ? err : new Error(String(err)));
    return null;
  }
}

// Helper to determine if worker is currently inside
export function getWorkerLiveStatus(workerId: string, logs: WorkerLogEntry[]): {
  isInside: boolean;
  activeLog?: WorkerLogEntry;
} {
  const activeLog = logs.find(log => log.workerId === workerId && log.status === 'inside' && !log.exitTime);
  return {
    isInside: !!activeLog,
    activeLog
  };
}

// Format duration into readable string e.g. "42m" or "1h 15m"
export function formatMinutes(minutes: number | null | undefined): string {
  if (minutes === null || minutes === undefined || isNaN(minutes)) return '0m';
  if (minutes < 60) return `${Math.floor(minutes)}m`;
  const hours = Math.floor(minutes / 60);
  const rem = Math.floor(minutes % 60);
  return `${hours}h ${rem}m`;
}
