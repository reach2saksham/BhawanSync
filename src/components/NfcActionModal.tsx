import { useState } from 'react';
import type { FC } from 'react';
import type { 
  WorkerProfile, 
  WorkerLogEntry 
} from '../types';
import { 
  X, 
  CheckCircle2, 
  LogIn, 
  LogOut, 
  Clock, 
  MapPin, 
  Phone, 
  Sparkles,
  Wrench
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playCheckInChime, playCheckOutChime, triggerHaptic, playTapSound } from '../utils/feedback';

interface NfcActionModalProps {
  worker: WorkerProfile;
  activeLog?: WorkerLogEntry;
  onClose: () => void;
  onCheckIn: (worker: WorkerProfile, assignedLocation: string, notes: string) => void;
  onCheckOut: (logId: string) => void;
}

const COMMON_LOCATIONS = [
  'Wing A - 1st Floor',
  'Wing B - 2nd Floor (Washrooms)',
  'Wing C - 3rd Floor',
  'Wing D - 4th Floor',
  'Mess Dining Hall & Kitchen',
  'Main Water Cooler & Tank',
  'Common Study & TV Hall',
  'Main Entrance & Guard Post',
];

export const NfcActionModal: FC<NfcActionModalProps> = ({
  worker,
  activeLog,
  onClose,
  onCheckIn,
  onCheckOut,
}) => {
  const isInside = !!activeLog;
  const [assignedLocation, setAssignedLocation] = useState(
    isInside ? activeLog.assignedLocation : 'Wing B - 2nd Floor (Washrooms)'
  );
  const [notes, setNotes] = useState('');

  // Calculate elapsed time if currently inside
  const [elapsedMinutes] = useState(() => {
    if (activeLog && activeLog.entryTime) {
      const start = new Date(activeLog.entryTime).getTime();
      return Math.max(1, Math.round((Date.now() - start) / 60000));
    }
    return 0;
  });

  const handleAction = () => {
    triggerHaptic('success');
    if (isInside && activeLog) {
      playCheckOutChime();
      onCheckOut(activeLog.id);
    } else {
      playCheckInChime();
      onCheckIn(worker, assignedLocation, notes);
    }

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // Ignore confetti errors
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl relative bg-slate-900/95 overflow-hidden">
        
        {/* Ambient background glow */}
        <div className={`absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl opacity-25 pointer-events-none ${
          isInside ? 'bg-amber-500' : 'bg-emerald-500'
        }`} />

        {/* Close Button */}
        <button
          onClick={() => {
            playTapSound();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 active:scale-90 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tag */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
            isInside 
              ? 'bg-amber-950 text-amber-300 border border-amber-800/80' 
              : 'bg-emerald-950 text-emerald-300 border border-emerald-800/80'
          }`}>
            {isInside ? (
              <>
                <LogOut className="w-3.5 h-3.5 text-amber-400" />
                <span>NFC Check-Out Detected</span>
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                <span>NFC Check-In Detected</span>
              </>
            )}
          </span>
          <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700">
            UID: {worker.nfcTagUid}
          </span>
        </div>

        {/* Worker Profile Card */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/60 border border-white/5 mb-5">
          <div className="relative">
            <img
              src={worker.avatarUrl || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=120'}
              alt={worker.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-cyan-500/40 shadow-md"
            />
            <span className={`absolute -bottom-1 -right-1 p-1 rounded-full text-white text-[10px] ${
              isInside ? 'bg-amber-500' : 'bg-emerald-500'
            }`}>
              <Wrench className="w-3 h-3" />
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white truncate">{worker.name}</h3>
              <span className="px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 text-xs font-semibold border border-cyan-800">
                {worker.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{worker.agency}</p>
            <div className="flex items-center gap-1 text-xs text-slate-300 mt-1 font-mono">
              <Phone className="w-3 h-3 text-cyan-400" />
              <span>{worker.phone}</span>
            </div>
          </div>
        </div>

        {/* Action Content */}
        {isInside ? (
          /* Check-out confirmation */
          <div className="space-y-4 mb-6">
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/40">
              <div className="flex items-center justify-between text-sm text-slate-300 mb-2">
                <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
                  <Clock className="w-4 h-4" /> Entry Time:
                </span>
                <span className="font-mono font-medium">
                  {new Date(activeLog!.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-300 mb-2">
                <span className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                  <MapPin className="w-4 h-4" /> Assigned Area:
                </span>
                <span className="font-medium text-slate-200">{activeLog!.assignedLocation}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-amber-900/50">
                <span className="text-sm font-semibold text-slate-300">Total Shift Duration:</span>
                <span className="text-base font-bold text-amber-300 font-mono">
                  {elapsedMinutes >= 60 ? `${Math.floor(elapsedMinutes / 60)}h ${elapsedMinutes % 60}m` : `${elapsedMinutes} Minutes`}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 text-center">
              Tapping Confirm will mark <strong className="text-slate-200">{worker.name}</strong> as logged out from Bhawan and record the exit timestamp in the maintenance ledger.
            </p>
          </div>
        ) : (
          /* Check-in configuration */
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                Assigned Work Location / Complaint Area
              </label>
              <div className="grid grid-cols-2 gap-2 mb-2">
                {COMMON_LOCATIONS.slice(0, 4).map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => {
                      playTapSound();
                      setAssignedLocation(loc);
                    }}
                    className={`text-left px-2.5 py-1.5 rounded-xl text-xs transition-all ${
                      assignedLocation === loc
                        ? 'bg-cyan-600 text-white font-semibold shadow-md'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/50'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={assignedLocation}
                onChange={(e) => setAssignedLocation(e.target.value)}
                placeholder="Or type custom room (e.g. Room 314, Block C)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Work Purpose / Complaint Summary (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Washroom leakage repair, fan bearing change"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
        )}

        {/* Primary Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playTapSound();
              onClose();
            }}
            className="flex-1 py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm active:scale-95 transition-all"
          >
            Cancel
          </button>
          
          <button
            onClick={handleAction}
            className={`flex-2 py-3 px-6 rounded-2xl text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all ${
              isInside
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 shadow-amber-600/30 hover:brightness-110'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-600/30 hover:brightness-110'
            }`}
          >
            {isInside ? (
              <>
                <LogOut className="w-4 h-4" />
                <span>CONFIRM CHECK-OUT</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>CONFIRM CHECK-IN</span>
              </>
            )}
            <Sparkles className="w-4 h-4 opacity-70" />
          </button>
        </div>

      </div>
    </div>
  );
};
