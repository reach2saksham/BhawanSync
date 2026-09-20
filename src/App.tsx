import { useState, useEffect } from 'react';
import type { 
  SemesterConfig, 
  WorkerLogEntry, 
  LaundryMachine, 
  WorkerProfile 
} from './types';
import { 
  INITIAL_SEMESTER_CONFIG, 
  INITIAL_WORKER_LOGS, 
  INITIAL_LAUNDRY_MACHINES 
} from './data/initialData';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import type { NavTab } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { NfcPortalView } from './components/NfcPortalView';
import { MessView } from './components/MessView';
import { LaundryView } from './components/LaundryView';
import { WardenView } from './components/WardenView';
import { EmergencyView } from './components/EmergencyView';
import { NfcActionModal } from './components/NfcActionModal';
import { SemesterAdminModal } from './components/SemesterAdminModal';
import { EmergencyModal } from './components/EmergencyModal';

const STORAGE_KEY_CONFIG = 'bhawansync_semester_config_v2';
const STORAGE_KEY_LOGS = 'bhawansync_worker_logs_v2';
const STORAGE_KEY_MACHINES = 'bhawansync_laundry_machines_v2';
const STORAGE_KEY_SOUND = 'bhawansync_sound_enabled_v2';

export function App() {
  // Semester Configuration
  const [config, setConfig] = useState<SemesterConfig>(() => {
    try {
      // Clear legacy cache from v1
      localStorage.removeItem('bhawansync_semester_config_v1');
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.bhawanName === 'Aryabhata Bhawan') {
          parsed.bhawanName = 'Ravindra Bhawan';
        }
        return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_SEMESTER_CONFIG;
  });

  // Worker NFC Presence Logs
  const [workerLogs, setWorkerLogs] = useState<WorkerLogEntry[]>(() => {
    try {
      localStorage.removeItem('bhawansync_worker_logs_v1');
      const saved = localStorage.getItem(STORAGE_KEY_LOGS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_WORKER_LOGS;
  });

  // Laundry Machines Status
  const [laundryMachines, setLaundryMachines] = useState<LaundryMachine[]>(() => {
    try {
      localStorage.removeItem('bhawansync_laundry_machines_v1');
      const saved = localStorage.getItem(STORAGE_KEY_MACHINES);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_LAUNDRY_MACHINES;
  });

  // Sound preference
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SOUND);
      if (saved !== null) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return true;
  });

  // Active view tab
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  // Modals state
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState<boolean>(false);
  const [nfcActionData, setNfcActionData] = useState<{
    worker: WorkerProfile;
    activeLog?: WorkerLogEntry;
  } | null>(null);

  // Persistence effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    } catch (e) {
      console.error('Storage write error:', e);
    }
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(workerLogs));
    } catch (e) {
      console.error('Storage write error:', e);
    }
  }, [workerLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MACHINES, JSON.stringify(laundryMachines));
    } catch (e) {
      console.error('Storage write error:', e);
    }
  }, [laundryMachines]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SOUND, JSON.stringify(soundEnabled));
    } catch (e) {
      console.error('Storage write error:', e);
    }
  }, [soundEnabled]);

  // Active workers count
  const activeWorkersCount = workerLogs.filter(
    (l) => l.status === 'inside' && !l.exitTime
  ).length;

  // Handle worker badge NFC trigger
  const handleTriggerNfcScan = (worker: WorkerProfile) => {
    const activeLog = workerLogs.find(
      (l) => l.workerId === worker.id && l.status === 'inside' && !l.exitTime
    );
    setNfcActionData({
      worker,
      activeLog,
    });
  };

  // Check in worker
  const handleCheckIn = (
    worker: WorkerProfile,
    assignedLocation: string,
    notes: string
  ) => {
    const newLog: WorkerLogEntry = {
      id: `log-${Date.now()}`,
      workerId: worker.id,
      workerName: worker.name,
      role: worker.role,
      nfcTagUid: worker.nfcTagUid,
      entryTime: new Date().toISOString(),
      exitTime: null,
      durationMinutes: null,
      assignedLocation: assignedLocation || 'Bhawan General Area',
      notes: notes || 'Standard maintenance call',
      status: 'inside',
    };

    setWorkerLogs((prev) => [newLog, ...prev]);
    setNfcActionData(null);
  };

  // Check out worker
  const handleCheckOut = (logId: string) => {
    setWorkerLogs((prev) =>
      prev.map((log) => {
        if (log.id === logId) {
          const entryTimeMs = new Date(log.entryTime).getTime();
          const exitTimeMs = Date.now();
          const duration = Math.max(1, Math.round((exitTimeMs - entryTimeMs) / 60000));
          return {
            ...log,
            exitTime: new Date(exitTimeMs).toISOString(),
            durationMinutes: duration,
            status: 'completed' as const,
          };
        }
        return log;
      })
    );
    setNfcActionData(null);
  };

  // Direct checkout from list
  const handleDirectCheckOut = (logId: string) => {
    handleCheckOut(logId);
  };

  // Save new semester configuration
  const handleSaveSemesterConfig = (updated: SemesterConfig) => {
    setConfig(updated);
  };

  // Reset semester defaults
  const handleResetDefaults = () => {
    setConfig(INITIAL_SEMESTER_CONFIG);
    setWorkerLogs(INITIAL_WORKER_LOGS);
    setLaundryMachines(INITIAL_LAUNDRY_MACHINES);
    localStorage.removeItem(STORAGE_KEY_CONFIG);
    localStorage.removeItem('bhawansync_semester_config_v1');
    localStorage.removeItem(STORAGE_KEY_LOGS);
    localStorage.removeItem('bhawansync_worker_logs_v1');
    localStorage.removeItem(STORAGE_KEY_MACHINES);
    localStorage.removeItem('bhawansync_laundry_machines_v1');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      
      {/* Header with live clock, on-duty worker pill, SOS button & semester indicator */}
      <Header
        config={config}
        activeWorkersCount={activeWorkersCount}
        onOpenAdmin={() => setAdminModalOpen(true)}
        onOpenEmergency={() => setEmergencyModalOpen(true)}
        onNavigateToNfc={() => setActiveTab('nfc')}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-6 pt-5 pb-24 max-w-7xl mx-auto w-full">
        {activeTab === 'dashboard' && (
          <DashboardView
            config={config}
            workerLogs={workerLogs}
            laundryMachines={laundryMachines}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenEmergency={() => setEmergencyModalOpen(true)}
          />
        )}

        {activeTab === 'nfc' && (
          <NfcPortalView
            workers={config.registeredWorkers}
            logs={workerLogs}
            onTriggerNfcScan={handleTriggerNfcScan}
            onDirectCheckOut={handleDirectCheckOut}
          />
        )}

        {activeTab === 'mess' && <MessView meals={config.messSchedule} />}

        {activeTab === 'laundry' && (
          <LaundryView
            schedule={config.laundrySchedule}
            machines={laundryMachines}
            onUpdateMachines={setLaundryMachines}
          />
        )}

        {activeTab === 'warden' && <WardenView wardens={config.wardens} />}

        {activeTab === 'emergency' && (
          <EmergencyView contacts={config.emergencyContacts} />
        )}
      </main>

      {/* Bottom Floating Tablet Touch Navigation Dock */}
      <Navigation
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        activeWorkersCount={activeWorkersCount}
      />

      {/* NFC Entry / Exit Action Confirmation Modal */}
      {nfcActionData && (
        <NfcActionModal
          worker={nfcActionData.worker}
          activeLog={nfcActionData.activeLog}
          onClose={() => setNfcActionData(null)}
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
        />
      )}

      {/* Semester Admin & Configuration Modal */}
      {adminModalOpen && (
        <SemesterAdminModal
          config={config}
          onSaveConfig={handleSaveSemesterConfig}
          onResetDefaults={handleResetDefaults}
          onClose={() => setAdminModalOpen(false)}
        />
      )}

      {/* Quick Emergency SOS Modal */}
      {emergencyModalOpen && (
        <EmergencyModal
          contacts={config.emergencyContacts}
          onClose={() => setEmergencyModalOpen(false)}
        />
      )}

    </div>
  );
}

export default App;
