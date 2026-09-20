import { useEffect } from 'react';
import type { FC } from 'react';
import type { LaundrySlot, LaundryMachine } from '../types';
import { 
  Clock, 
  AlertTriangle, 
  Play, 
  RotateCcw, 
  Calendar, 
  Sparkles, 
  Layers, 
  WashingMachine as WashIcon 
} from 'lucide-react';
import { getCurrentDayName } from '../utils/timeHelper';
import { playTapSound, triggerHaptic } from '../utils/feedback';

interface LaundryViewProps {
  schedule: LaundrySlot[];
  machines: LaundryMachine[];
  onUpdateMachines: (updated: LaundryMachine[]) => void;
}

export const LaundryView: FC<LaundryViewProps> = ({
  schedule,
  machines,
  onUpdateMachines,
}) => {
  const currentDay = getCurrentDayName();

  // Decrement running machines timers every minute
  useEffect(() => {
    const timer = setInterval(() => {
      let changed = false;
      const updated = machines.map((m) => {
        if (m.status === 'running' && m.remainingMinutes > 0) {
          changed = true;
          const nextRemaining = m.remainingMinutes - 1;
          if (nextRemaining <= 0) {
            return { ...m, status: 'available' as const, remainingMinutes: 0, currentWing: undefined };
          }
          return { ...m, remainingMinutes: nextRemaining };
        }
        return m;
      });
      if (changed) {
        onUpdateMachines(updated);
      }
    }, 15000);

    return () => clearInterval(timer);
  }, [machines, onUpdateMachines]);

  const handleStartCycle = (machineId: number) => {
    playTapSound();
    triggerHaptic('success');
    const updated = machines.map((m) => {
      if (m.id === machineId) {
        return {
          ...m,
          status: 'running' as const,
          remainingMinutes: 35,
          currentWing: 'Touch Kiosk User'
        };
      }
      return m;
    });
    onUpdateMachines(updated);
  };

  const handleStopCycle = (machineId: number) => {
    playTapSound();
    triggerHaptic('light');
    const updated = machines.map((m) => {
      if (m.id === machineId) {
        return {
          ...m,
          status: 'available' as const,
          remainingMinutes: 0,
          currentWing: undefined
        };
      }
      return m;
    });
    onUpdateMachines(updated);
  };

  const todaySlot = schedule.find((s) => s.day === currentDay) || schedule[0];

  const availableCount = machines.filter((m) => m.status === 'available').length;
  const runningCount = machines.filter((m) => m.status === 'running').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fadeIn">
      
      {/* Today's Active Laundry Allocation Hero */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-slate-950">
        
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-300 border border-blue-800 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Today's Allocated Laundry Day ({currentDay})</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Assigned: <span className="text-cyan-400">{todaySlot.assignedFloors}</span>
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
              <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>{todaySlot.assignedWings}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5 font-mono text-cyan-300">
                <Clock className="w-4 h-4" />
                <span>Operating Window: {todaySlot.timing}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              {todaySlot.guidelines}
            </p>
          </div>

          {/* Machine summary pill */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-800/80 border border-slate-700 text-center space-y-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Laundry Room Live Capacity
            </div>
            
            <div className="flex items-center justify-center gap-6">
              <div>
                <div className="font-mono text-3xl font-bold text-emerald-400">{availableCount}</div>
                <div className="text-[11px] text-slate-400">Available</div>
              </div>
              <div className="h-8 w-px bg-slate-700" />
              <div>
                <div className="font-mono text-3xl font-bold text-blue-400">{runningCount}</div>
                <div className="text-[11px] text-slate-400">Running</div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Bhawan Basement Laundry Facility (8 Commercial Washers)
            </p>
          </div>

        </div>

      </div>

      {/* Interactive Washing Machine Live Kiosk Tracker */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <WashIcon className="w-5 h-5 text-cyan-400" />
              <span>Live Washer Status Board</span>
            </h3>
            <p className="text-xs text-slate-400">
              Touch to start cycle or verify remaining wash duration
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {machines.map((machine) => {
            const isRunning = machine.status === 'running';
            const isMaintenance = machine.status === 'maintenance';

            return (
              <div
                key={machine.id}
                className={`glass-panel rounded-2xl p-4 border transition-all relative overflow-hidden flex flex-col justify-between ${
                  isRunning
                    ? 'border-blue-500/50 bg-slate-900/90 shadow-lg shadow-blue-500/10'
                    : isMaintenance
                    ? 'border-red-500/40 bg-slate-900/60 opacity-75'
                    : 'border-white/5 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-300">
                      Machine #{machine.id}
                    </span>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      isRunning
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : isMaintenance
                        ? 'bg-red-950 text-red-300 border border-red-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {machine.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 font-medium truncate mb-3">
                    {machine.label}
                  </p>
                </div>

                <div className="mt-2 pt-3 border-t border-white/5 space-y-3">
                  {isRunning ? (
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-cyan-300 mb-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 animate-spin" /> Remaining:
                        </span>
                        <span className="font-bold">{machine.remainingMinutes} mins</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
                        <div
                          className="bg-blue-500 h-full rounded-full animate-pulse"
                          style={{ width: `${Math.min(100, (1 - machine.remainingMinutes / 45) * 100)}%` }}
                        />
                      </div>
                      <button
                        onClick={() => handleStopCycle(machine.id)}
                        className="w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold flex items-center justify-center gap-1 active:scale-95"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset / Finish</span>
                      </button>
                    </div>
                  ) : isMaintenance ? (
                    <div className="text-center py-2 text-xs text-red-400 flex items-center justify-center gap-1.5 font-medium">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Service Scheduled</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartCycle(machine.id)}
                      className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Start 35m Cycle</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Weekly Timetable Table */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-xl bg-slate-900/80">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <span>Full Semester Weekly Roster</span>
            </h3>
            <p className="text-xs text-slate-400">
              Rotating floor timetable updated for this semester
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {schedule.map((slot) => {
            const isCurrent = slot.day === currentDay;

            return (
              <div
                key={slot.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
                  isCurrent
                    ? 'border-cyan-500/60 bg-cyan-950/20 ring-1 ring-cyan-500/40 shadow-lg shadow-cyan-500/5'
                    : 'border-white/5 bg-slate-800/40 hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-3 min-w-[140px]">
                  <span className={`text-sm font-bold ${isCurrent ? 'text-cyan-300' : 'text-white'}`}>
                    {slot.day}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950">
                      TODAY
                    </span>
                  )}
                </div>

                <div className="flex-1 space-y-0.5">
                  <div className="text-sm font-semibold text-slate-200">
                    {slot.assignedFloors} <span className="text-xs text-slate-400 font-normal">({slot.assignedWings})</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {slot.guidelines}
                  </div>
                </div>

                <div className="font-mono text-xs font-semibold text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700/80 shrink-0">
                  {slot.timing}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
