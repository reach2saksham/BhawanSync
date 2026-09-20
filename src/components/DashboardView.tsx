import type { FC } from 'react';
import type { 
  SemesterConfig, 
  WorkerLogEntry, 
  LaundryMachine 
} from '../types';
import { 
  UtensilsCrossed, 
  Nfc, 
  Shirt, 
  Users, 
  PhoneCall, 
  ChevronRight, 
  ShieldAlert, 
  Sparkles, 
  Radio 
} from 'lucide-react';
import { calculateMessStatus, getCurrentDayName, getElapsedTimeString } from '../utils/timeHelper';
import { playTapSound, triggerHaptic } from '../utils/feedback';
import type { NavTab } from './Navigation';

interface DashboardViewProps {
  config: SemesterConfig;
  workerLogs: WorkerLogEntry[];
  laundryMachines: LaundryMachine[];
  onNavigate: (tab: NavTab) => void;
  onOpenEmergency: () => void;
}

export const DashboardView: FC<DashboardViewProps> = ({
  config,
  workerLogs,
  laundryMachines,
  onNavigate,
  onOpenEmergency,
}) => {
  const currentMeal = calculateMessStatus(config.messSchedule);
  const currentDay = getCurrentDayName();
  const todayLaundry = config.laundrySchedule.find(s => s.day === currentDay) || config.laundrySchedule[0];
  const activeWorkers = workerLogs.filter(l => l.status === 'inside' && !l.exitTime);
  const availableMachines = laundryMachines.filter(m => m.status === 'available').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fadeIn">
      
      {/* Semester Header & Welcome Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-950">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Campus Hostel Operations Hub</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {config.bhawanName}
            </h2>

            <p className="text-sm text-slate-300 mt-1">
              Active Schedule: <span className="text-white font-semibold">{config.semesterName}</span> ({config.effectiveDateRange})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                playTapSound();
                triggerHaptic('light');
                onNavigate('nfc');
              }}
              className="px-4 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-600/20 active:scale-95 transition-all"
            >
              <Nfc className="w-4 h-4" />
              <span>NFC Staff Tap Station</span>
            </button>

            <button
              onClick={() => {
                playTapSound();
                triggerHaptic('warning');
                onOpenEmergency();
              }}
              className="px-4 py-2.5 rounded-2xl bg-red-600/90 hover:bg-red-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-600/20 active:scale-95 transition-all"
            >
              <ShieldAlert className="w-4 h-4 animate-pulse" />
              <span>Emergency SOS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 3 Interactive Core Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. Live Mess Dining Card */}
        <div 
          onClick={() => {
            playTapSound();
            onNavigate('mess');
          }}
          className="glass-panel rounded-3xl p-6 border border-white/10 bg-slate-900/80 shadow-xl hover:border-cyan-500/40 cursor-pointer group transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-orange-950/80 border border-orange-800 text-orange-400">
                <UtensilsCrossed className="w-6 h-6" />
              </div>

              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                currentMeal.status === 'OPEN_NOW'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                  : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
              }`}>
                {currentMeal.status === 'OPEN_NOW' ? 'Serving Now' : 'Upcoming Meal'}
              </span>
            </div>

            <div className="space-y-1 mb-4">
              <h3 className="text-xl font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                {currentMeal.status === 'OPEN_NOW' ? currentMeal.activeMeal?.name : currentMeal.nextMeal?.name}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2">
                {currentMeal.status === 'OPEN_NOW' ? currentMeal.activeMeal?.description : 'Hostel dining mess schedule and daily rotating menu'}
              </p>
            </div>

            {/* Countdown widget */}
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 mb-4">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-medium">
                <span>{currentMeal.status === 'OPEN_NOW' ? 'Closes In:' : 'Opens In:'}</span>
                <span className="font-mono text-white font-bold">{currentMeal.timeRemainingFormatted}</span>
              </div>
              {currentMeal.status === 'OPEN_NOW' && (
                <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all"
                    style={{ width: `${currentMeal.progressPercent}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-cyan-400 font-bold pt-3 border-t border-white/5">
            <span>View Full Menu & Timings</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* 2. NFC Workers Live Presence Card */}
        <div 
          onClick={() => {
            playTapSound();
            onNavigate('nfc');
          }}
          className="glass-panel rounded-3xl p-6 border border-white/10 bg-slate-900/80 shadow-xl hover:border-emerald-500/40 cursor-pointer group transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-400">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>

              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                {activeWorkers.length} Staff Inside
              </span>
            </div>

            <div className="space-y-1 mb-4">
              <h3 className="text-xl font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                Maintenance NFC Log
              </h3>
              <p className="text-xs text-slate-400">
                Plumbers, electricians & carpenters currently working in Bhawan
              </p>
            </div>

            {/* List of active workers */}
            <div className="space-y-2 mb-4">
              {activeWorkers.length === 0 ? (
                <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 text-center text-xs text-slate-400 italic">
                  No maintenance workers inside right now
                </div>
              ) : (
                activeWorkers.slice(0, 2).map((w) => (
                  <div key={w.id} className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <div>
                        <div className="font-bold text-white">{w.workerName}</div>
                        <div className="text-[10px] text-slate-400">{w.role} • {w.assignedLocation}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-300">
                      {getElapsedTimeString(w.entryTime)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-emerald-400 font-bold pt-3 border-t border-white/5">
            <span>Tap NFC Card to Enter/Exit</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* 3. Today's Laundry Schedule Card */}
        <div 
          onClick={() => {
            playTapSound();
            onNavigate('laundry');
          }}
          className="glass-panel rounded-3xl p-6 border border-white/10 bg-slate-900/80 shadow-xl hover:border-blue-500/40 cursor-pointer group transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-blue-950/80 border border-blue-800 text-blue-400">
                <Shirt className="w-6 h-6" />
              </div>

              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-blue-950 text-blue-300 border border-blue-700">
                {currentDay} Slot
              </span>
            </div>

            <div className="space-y-1 mb-4">
              <h3 className="text-xl font-extrabold text-white group-hover:text-blue-300 transition-colors">
                {todayLaundry.assignedFloors}
              </h3>
              <p className="text-xs text-slate-400">
                {todayLaundry.assignedWings} • {todayLaundry.timing}
              </p>
            </div>

            {/* Washer summary */}
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400 font-medium">Washer Capacity:</div>
                <div className="text-sm font-bold text-white">
                  <span className="text-emerald-400">{availableMachines} Available</span> / {laundryMachines.length} Total
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-mono text-cyan-300 bg-slate-900 px-2 py-1 rounded-md border border-slate-700">
                  Basement Laundry
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-blue-400 font-bold pt-3 border-t border-white/5">
            <span>Check Machine Timers & Roster</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

      {/* Warden Quick Contacts & Emergency Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Warden Quick Call Carousel */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 border border-white/10 bg-slate-900/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Hostel Warden & Administration On Duty</span>
            </h3>
            <button
              onClick={() => {
                playTapSound();
                onNavigate('warden');
              }}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {config.wardens.slice(0, 2).map((w) => (
              <div key={w.id} className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={w.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
                    alt={w.name}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{w.name}</h4>
                    <p className="text-[11px] text-cyan-300 truncate">{w.role}</p>
                    <p className="text-[10px] text-slate-400">{w.officeLocation}</p>
                  </div>
                </div>

                <a
                  href={`tel:${w.phone}`}
                  onClick={() => playTapSound()}
                  className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shrink-0 active:scale-95 shadow"
                  title="Call Warden"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Rapid SOS Helplines */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 border border-red-500/30 bg-slate-900/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>Fast Emergency Helplines</span>
            </h3>
          </div>

          <div className="space-y-2">
            {config.emergencyContacts.slice(0, 2).map((c) => (
              <a
                key={c.id}
                href={`tel:${c.number.replace(/[^0-9+]/g, '')}`}
                onClick={() => {
                  playTapSound();
                  triggerHaptic('warning');
                }}
                className="w-full p-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-800/60 flex items-center justify-between text-xs active:scale-95 transition-all"
              >
                <div>
                  <div className="font-bold text-red-200">{c.title}</div>
                  <div className="text-[10px] text-red-300/80">{c.availableHours}</div>
                </div>
                <span className="font-mono font-bold text-white px-2 py-1 rounded bg-red-600">
                  {c.number}
                </span>
              </a>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
