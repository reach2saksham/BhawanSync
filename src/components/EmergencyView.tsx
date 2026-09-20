import { useState } from 'react';
import type { FC } from 'react';
import type { EmergencyContact } from '../types';
import { 
  PhoneCall, 
  ShieldAlert, 
  Flame, 
  HeartPulse, 
  Zap, 
  AlertOctagon, 
  MapPin, 
  Clock, 
  Volume2, 
  CheckCircle2, 
  LifeBuoy 
} from 'lucide-react';
import { playTapSound, playEmergencyTone, triggerHaptic } from '../utils/feedback';

interface EmergencyViewProps {
  contacts: EmergencyContact[];
}

export const EmergencyView: FC<EmergencyViewProps> = ({ contacts }) => {
  const [alarmPlaying, setAlarmPlaying] = useState<boolean>(false);

  const handleTestAlarm = () => {
    triggerHaptic('warning');
    setAlarmPlaying(true);
    playEmergencyTone();
    setTimeout(() => {
      playEmergencyTone();
    }, 500);
    setTimeout(() => {
      setAlarmPlaying(false);
    }, 1200);
  };

  const getCategoryIcon = (category: EmergencyContact['category']) => {
    switch (category) {
      case 'medical': return HeartPulse;
      case 'police': return ShieldAlert;
      case 'fire': return Flame;
      case 'utility': return Zap;
      case 'helpline': return LifeBuoy;
      default: return PhoneCall;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fadeIn">
      
      {/* High-Impact SOS Banner */}
      <div className="rounded-3xl p-6 sm:p-8 border border-red-500/40 shadow-2xl relative overflow-hidden bg-gradient-to-br from-red-950/80 via-slate-900/95 to-slate-950">
        
        {/* Urgent red ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/80 text-red-200 border border-red-700 text-xs font-bold uppercase tracking-wider">
              <AlertOctagon className="w-4 h-4 text-red-400 animate-pulse" />
              <span>Campus Emergency & SOS Directory</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Instant 24x7 Emergency Helplines
            </h2>

            <p className="text-sm text-red-100/80 leading-relaxed">
              If someone is in immediate medical danger, there is an electrical hazard, fire outbreak, 
              or security breach, tap the respective helpline button below immediately.
            </p>
          </div>

          {/* Rapid Siren Sound Test */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleTestAlarm}
              className={`w-full sm:w-auto px-5 py-3.5 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl ${
                alarmPlaying
                  ? 'bg-red-600 text-white border-red-400 animate-bounce'
                  : 'bg-red-950/60 hover:bg-red-900/60 text-red-300 border-red-800/80'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{alarmPlaying ? 'ALARM SOUNDING' : 'Test Tablet SOS Alert'}</span>
            </button>
          </div>

        </div>

      </div>

      {/* Critical First Responders Grid */}
      <div className="space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-red-400" />
          <span>Priority Emergency Dispatch Lines</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {contacts.map((contact) => {
            const Icon = getCategoryIcon(contact.category);
            const isCritical = contact.priority === 'critical';

            return (
              <div
                key={contact.id}
                className={`glass-panel rounded-3xl p-6 border flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                  isCritical
                    ? 'border-red-500/50 bg-slate-900/90 shadow-xl shadow-red-950/40'
                    : 'border-white/10 bg-slate-900/70 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${
                      isCritical
                        ? 'bg-red-950 text-red-300 border border-red-800'
                        : 'bg-slate-800 text-cyan-400 border border-slate-700'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                      isCritical
                        ? 'bg-red-950 text-red-300 border border-red-700'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {contact.priority}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white mb-1">{contact.title}</h4>
                  <p className="text-xs text-slate-400 mb-4">{contact.subtitle}</p>

                  <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-1.5 text-xs text-slate-300 mb-5">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span className="truncate">{contact.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-emerald-400">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>{contact.availableHours}</span>
                    </div>
                  </div>
                </div>

                {/* Big Touch-to-Call Button */}
                <a
                  href={`tel:${contact.number.replace(/[^0-9+]/g, '')}`}
                  onClick={() => {
                    playTapSound();
                    triggerHaptic('warning');
                  }}
                  className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all text-white ${
                    isCritical
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 shadow-red-600/30 hover:brightness-110 ring-2 ring-red-400/30'
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 shadow-cyan-600/20 hover:brightness-110'
                  }`}
                  style={{ minHeight: '52px' }}
                >
                  <PhoneCall className="w-4 h-4 animate-pulse" />
                  <span className="tracking-wide">DIAL {contact.number}</span>
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* Emergency First-Aid & Protocol Reminder */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 bg-slate-900/80 space-y-3">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Hostel First-Aid & Incident Protocol</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50">
            <strong className="text-white block mb-1">Ambulance Pickup Point</strong>
            Ravindra Bhawan Main Porch / Gate 1. Keep porch clear of student bicycles.
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50">
            <strong className="text-white block mb-1">First-Aid Kit Location</strong>
            Available 24x7 at the Bhawan Caretaker Desk with emergency bandage & antiseptic.
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50">
            <strong className="text-white block mb-1">Fire Extinguishers</strong>
            Installed on every floor beside staircase landings & dining hall kitchen entrance.
          </div>
        </div>
      </div>

    </div>
  );
};
