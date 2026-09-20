import { useState } from 'react';
import type { FC } from 'react';
import type { 
  WorkerProfile, 
  WorkerLogEntry 
} from '../types';
import { 
  Nfc, 
  Radio, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  LogOut, 
  Search, 
  Download, 
  Filter, 
  ScanLine, 
  ChevronRight, 
  ShieldCheck, 
  UserCheck 
} from 'lucide-react';
import { playTapSound, triggerHaptic } from '../utils/feedback';
import { isWebNfcAvailable } from '../utils/nfcManager';
import { formatTimeOnly, getElapsedTimeString } from '../utils/timeHelper';

interface NfcPortalViewProps {
  workers: WorkerProfile[];
  logs: WorkerLogEntry[];
  onTriggerNfcScan: (worker: WorkerProfile) => void;
  onDirectCheckOut: (logId: string) => void;
}

export const NfcPortalView: FC<NfcPortalViewProps> = ({
  workers,
  logs,
  onTriggerNfcScan,
  onDirectCheckOut,
}) => {
  const [selectedFilterRole, setSelectedFilterRole] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [manualUid, setManualUid] = useState<string>('');
  const [webNfcActive, setWebNfcActive] = useState<boolean>(false);
  const [nfcFeedbackMsg, setNfcFeedbackMsg] = useState<string>('Tap your worker badge on this tablet screen to check-in / check-out.');

  const hasNativeNfc = isWebNfcAvailable();

  // Workers currently inside
  const activeLogs = logs.filter(log => log.status === 'inside' && !log.exitTime);

  // Past logs
  const completedLogs = logs.filter(log => log.status === 'completed');

  // Filtered completed logs
  const filteredCompletedLogs = completedLogs.filter(log => {
    const matchesRole = selectedFilterRole === 'all' || log.role === selectedFilterRole;
    const matchesQuery = !searchQuery || 
      log.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.assignedLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesQuery;
  });

  const handleSimulateManualUid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUid.trim()) return;

    playTapSound();
    // Search worker by UID
    const found = workers.find(w => w.nfcTagUid.toLowerCase() === manualUid.trim().toLowerCase());
    if (found) {
      setNfcFeedbackMsg(`NFC Card Verified: ${found.name} (${found.role})`);
      onTriggerNfcScan(found);
      setManualUid('');
    } else {
      triggerHaptic('warning');
      setNfcFeedbackMsg(`Unknown NFC Card ID "${manualUid}". Please register card in Semester Admin.`);
    }
  };

  const startWebNfcListener = async () => {
    playTapSound();
    if (!hasNativeNfc) {
      alert('Native Web NFC is not available on this browser. You can tap worker badges directly on this screen or connect a USB/Bluetooth RFID reader.');
      return;
    }

    try {
      const win = window as unknown as { NDEFReader: new () => { scan: () => Promise<void>; addEventListener: (t: string, cb: (e: { serialNumber?: string }) => void) => void } };
      const ndef = new win.NDEFReader();
      await ndef.scan();
      setWebNfcActive(true);
      setNfcFeedbackMsg('Hardware NFC Reader Active! Bring your card near the tablet antenna.');

      ndef.addEventListener('reading', (event: { serialNumber?: string }) => {
        const serial = event.serialNumber;
        if (serial) {
          const match = workers.find(w => w.nfcTagUid.toLowerCase() === serial.toLowerCase());
          if (match) {
            onTriggerNfcScan(match);
          } else {
            alert(`NFC Tag detected (${serial}), but not registered to any worker.`);
          }
        }
      });
    } catch (err) {
      console.error(err);
      alert('Could not start Web NFC scanner. Please ensure permissions are granted.');
    }
  };

  const exportLogsToCsv = () => {
    playTapSound();
    triggerHaptic('light');
    const headers = ['Log ID', 'Worker Name', 'Role', 'NFC Tag UID', 'Entry Time', 'Exit Time', 'Duration (Mins)', 'Location', 'Notes'];
    const rows = logs.map(l => [
      l.id,
      `"${l.workerName}"`,
      l.role,
      l.nfcTagUid,
      l.entryTime,
      l.exitTime || 'STILL INSIDE',
      l.durationMinutes || 'N/A',
      `"${l.assignedLocation}"`,
      `"${l.notes || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bhawan_Worker_NFC_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fadeIn">
      
      {/* Top Banner / Tablet NFC Terminal Interactive Station */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-slate-950">
        
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left: Terminal Description & Physical Card UID Input */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs font-semibold">
              <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
              <span>NFC Attendance & Access Control Station</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Maintenance Staff Entry & Exit Portal
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              Automatic presence tracking for plumbers, electricians, carpenters, and facility technicians. 
              Tap any worker’s digital badge on screen, or scan physical RFID/NFC cards using a connected reader.
            </p>

            {/* Status notice */}
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{nfcFeedbackMsg}</span>
            </div>

            {/* Hardware NFC / RFID Input Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <form onSubmit={handleSimulateManualUid} className="flex-1 flex items-center gap-2 w-full">
                <div className="relative flex-1">
                  <ScanLine className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={manualUid}
                    onChange={(e) => setManualUid(e.target.value)}
                    placeholder="Scan / Type NFC Card UID (e.g. 04:A2:8B...)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-xs font-mono placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold active:scale-95 transition-all shadow-md shrink-0"
                >
                  Verify UID
                </button>
              </form>

              {hasNativeNfc && (
                <button
                  onClick={startWebNfcListener}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 active:scale-95 transition-all border shrink-0 ${
                    webNfcActive
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/30'
                      : 'bg-slate-800 text-cyan-300 border-cyan-800 hover:bg-slate-700'
                  }`}
                >
                  <Nfc className="w-4 h-4" />
                  <span>{webNfcActive ? 'Hardware NFC Active' : 'Start Web NFC'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Right: Large Interactive Tablet NFC Target Ring */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center p-8">
              
              {/* Outer pulsing ripples */}
              <div className="absolute w-52 h-52 sm:w-60 sm:h-60 rounded-full border border-cyan-500/20 animate-nfc-wave pointer-events-none" />
              <div className="absolute w-44 h-44 sm:w-48 sm:h-48 rounded-full border border-cyan-400/30 animate-ping pointer-events-none" />
              
              {/* Center NFC Touch Pad Target */}
              <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-700 p-1 shadow-2xl shadow-cyan-500/25 flex items-center justify-center ring-4 ring-white/15">
                <div className="w-full h-full rounded-full bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center text-center p-3">
                  <Nfc className="w-10 h-10 text-cyan-300 animate-pulse mb-1" />
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                    NFC SENSOR
                  </span>
                  <span className="text-[9px] text-cyan-300 font-medium">
                    Touch & Hold
                  </span>
                </div>
              </div>

            </div>
            <p className="text-[11px] text-slate-400 text-center font-medium mt-1">
              Active Kiosk Touch Sensor Ready
            </p>
          </div>

        </div>

      </div>

      {/* Staff Quick-Tap Badges Grid (Plumber, Electrician, Carpenter, etc.) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-cyan-400" />
              <span>Registered Maintenance Staff Badges</span>
            </h3>
            <p className="text-xs text-slate-400">
              Tap any worker’s card directly on the tablet screen to simulate physical badge tap-in / tap-out
            </p>
          </div>

          <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
            {workers.length} Registered
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {workers.map((worker) => {
            const activeLog = activeLogs.find(l => l.workerId === worker.id);
            const isInside = !!activeLog;

            return (
              <div
                key={worker.id}
                onClick={() => {
                  playTapSound();
                  triggerHaptic('light');
                  onTriggerNfcScan(worker);
                }}
                className={`glass-card-interactive rounded-2xl p-4 cursor-pointer relative overflow-hidden group ${
                  isInside 
                    ? 'ring-2 ring-emerald-500/70 bg-slate-900/90 shadow-emerald-500/10' 
                    : 'hover:border-slate-600 bg-slate-900/60'
                }`}
              >
                {/* Status top ribbon */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1 ${
                    isInside 
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' 
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isInside ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
                    {isInside ? 'INSIDE BHAWAN' : 'OFF-DUTY'}
                  </span>

                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
                    {worker.role}
                  </span>
                </div>

                {/* Worker Avatar & Info */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={worker.avatarUrl || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=120'}
                      alt={worker.name}
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10"
                    />
                    <span className="absolute -bottom-1 -right-1 p-0.5 rounded-md bg-cyan-900 border border-cyan-700 text-cyan-300">
                      <Nfc className="w-3 h-3" />
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                      {worker.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">{worker.agency}</p>
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5">{worker.phone}</p>
                  </div>
                </div>

                {/* Bottom Tap Action Indicator */}
                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs">
                  {isInside ? (
                    <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{getElapsedTimeString(activeLog!.entryTime)}</span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400">Ready to Check In</span>
                  )}

                  <span className={`text-[11px] font-bold flex items-center gap-0.5 transition-transform group-hover:translate-x-0.5 ${
                    isInside ? 'text-amber-400' : 'text-cyan-400'
                  }`}>
                    {isInside ? 'Tap Out' : 'Tap In'}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Presence Board: Currently Inside Bhawan */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-xl bg-slate-900/80">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Currently Inside Bhawan</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-extrabold">
                  {activeLogs.length} Active
                </span>
              </h3>
              <p className="text-xs text-slate-400">Real-time status of technicians working on premises right now</p>
            </div>
          </div>
        </div>

        {activeLogs.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-800/40 border border-dashed border-slate-700">
            <CheckCircle2 className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">No external workers inside Bhawan right now</p>
            <p className="text-xs text-slate-400 mt-1">Tap any staff badge above to check in arriving maintenance personnel</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeLogs.map((log) => {
              const worker = workers.find(w => w.id === log.workerId);
              return (
                <div key={log.id} className="p-4 rounded-2xl bg-slate-800/70 border border-emerald-800/50 shadow-lg relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                      {log.role}
                    </span>
                    <span className="text-xs font-mono text-slate-300 font-semibold">
                      In: {formatTimeOnly(log.entryTime)}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white">{log.workerName}</h4>
                  
                  <div className="mt-2 space-y-1 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5 text-cyan-300 font-medium">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{log.assignedLocation}</span>
                    </div>
                    {log.notes && (
                      <p className="text-slate-400 italic text-[11px] pl-5">{log.notes}</p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/80 flex items-center justify-between">
                    <div className="text-xs font-mono text-amber-300 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{getElapsedTimeString(log.entryTime)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {worker?.phone && (
                        <a
                          href={`tel:${worker.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-cyan-400 active:scale-95"
                          title="Call Worker"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      )}

                      <button
                        onClick={() => {
                          playTapSound();
                          triggerHaptic('medium');
                          onDirectCheckOut(log.id);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-600/90 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1 active:scale-95 transition-all shadow"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Tap Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Historical Entry & Exit Audit Log */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-xl bg-slate-900/80">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              <span>NFC Entry & Exit History</span>
            </h3>
            <p className="text-xs text-slate-400">Complete timestamped maintenance ledger for this semester</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search staff / room..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedFilterRole}
                onChange={(e) => setSelectedFilterRole(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="all">All Roles</option>
                <option value="Plumber">Plumber</option>
                <option value="Electrician">Electrician</option>
                <option value="Carpenter">Carpenter</option>
                <option value="AC / Cooler Tech">AC / Cooler Tech</option>
                <option value="Pest Control">Pest Control</option>
                <option value="Civil & Mason">Civil & Mason</option>
              </select>
            </div>

            {/* Export CSV */}
            <button
              onClick={exportLogsToCsv}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* History Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 uppercase text-[10px] font-bold tracking-wider text-slate-400 border-b border-slate-700">
              <tr>
                <th className="px-4 py-3">Worker & Role</th>
                <th className="px-4 py-3">Assigned Location</th>
                <th className="px-4 py-3">Check-In Time</th>
                <th className="px-4 py-3">Check-Out Time</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Remarks / Task</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredCompletedLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500 italic">
                    No completed worker shifts found matching current filter.
                  </td>
                </tr>
              ) : (
                filteredCompletedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-white">{log.workerName}</div>
                      <span className="text-[10px] font-semibold text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-900/80">
                        {log.role}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-200">
                      {log.assignedLocation}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-300">
                      {formatTimeOnly(log.entryTime)}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-300">
                      {log.exitTime ? formatTimeOnly(log.exitTime) : '--'}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-1 rounded-md bg-slate-800 text-amber-300 font-mono font-bold">
                        {log.durationMinutes ? `${log.durationMinutes} min` : 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-400 max-w-xs truncate">
                      {log.notes || 'Routine maintenance'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
