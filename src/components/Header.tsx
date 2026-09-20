import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { 
  Building2, 
  Clock, 
  PhoneCall, 
  SlidersHorizontal, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX,
  Users2,
  CalendarCheck
} from 'lucide-react';
import type { SemesterConfig } from '../types';
import { playTapSound, triggerHaptic } from '../utils/feedback';

interface HeaderProps {
  config: SemesterConfig;
  activeWorkersCount: number;
  onOpenAdmin: () => void;
  onOpenEmergency: () => void;
  onNavigateToNfc: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: FC<HeaderProps> = ({
  config,
  activeWorkersCount,
  onOpenAdmin,
  onOpenEmergency,
  onNavigateToNfc,
  soundEnabled,
  onToggleSound,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFullscreen = () => {
    playTapSound();
    triggerHaptic('light');
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  const formattedTime = currentTime.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit', 
    hour12: true 
  });

  const formattedDate = currentTime.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="glass-panel sticky top-0 z-30 px-4 md:px-6 py-3 border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left: Bhawan Logo & Semester Info */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-2 ring-white/15">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  Bhawan<span className="text-cyan-400">Sync</span>
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-medium">
                  Tablet Kiosk
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-semibold text-slate-200">{config.bhawanName}</span>
                <span>•</span>
                <span className="hidden sm:inline flex items-center gap-1 text-slate-400">
                  <CalendarCheck className="w-3 h-3 text-emerald-400 inline" />
                  {config.semesterName}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Active Workers Pill for Mobile/Tablet portrait */}
          <button
            onClick={() => {
              playTapSound();
              onNavigateToNfc();
            }}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 active:scale-95 text-xs font-semibold"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
            <span className="text-emerald-400">{activeWorkersCount} On-Duty</span>
          </button>
        </div>

        {/* Center: Live Digital Tablet Clock */}
        <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-inner">
          <Clock className="w-4 h-4 text-cyan-400" />
          <div className="text-center">
            <div className="font-mono text-base font-bold text-slate-100 tracking-wider">
              {formattedTime}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              {formattedDate}
            </div>
          </div>
        </div>

        {/* Right: Actions (Active staff count, Emergency SOS, Fullscreen, Admin Settings) */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          
          {/* Active Workers Badge (Desktop/iPad Landscape) */}
          <button
            onClick={() => {
              playTapSound();
              triggerHaptic('light');
              onNavigateToNfc();
            }}
            className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/40 border border-emerald-800/50 hover:bg-emerald-900/50 active:scale-95 transition-all text-xs font-semibold text-emerald-300"
            title="View workers currently inside Bhawan"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <Users2 className="w-3.5 h-3.5" />
            <span>{activeWorkersCount} Staff On-Site</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              triggerHaptic('light');
            }}
            className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-700/70 active:scale-95 transition-all"
            title={soundEnabled ? 'Mute Touch Sounds' : 'Unmute Touch Sounds'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Fullscreen Button for iPad Kiosk */}
          <button
            onClick={toggleFullscreen}
            className="hidden sm:flex p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-700/70 active:scale-95 transition-all"
            title="Toggle Kiosk Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-cyan-400" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Emergency Quick SOS Button */}
          <button
            onClick={() => {
              playTapSound();
              triggerHaptic('warning');
              onOpenEmergency();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs shadow-lg shadow-red-600/30 hover:brightness-110 active:scale-95 transition-all border border-red-400/40"
          >
            <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
            <span>SOS CONTACTS</span>
          </button>

          {/* Semester Admin / Settings */}
          <button
            onClick={() => {
              playTapSound();
              triggerHaptic('light');
              onOpenAdmin();
            }}
            className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-700/70 active:scale-95 transition-all"
            title="Semester Setup & Admin Portal"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
