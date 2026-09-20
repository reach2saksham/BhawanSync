import type { FC } from 'react';
import type { EmergencyContact } from '../types';
import { 
  X, 
  PhoneCall, 
  AlertOctagon 
} from 'lucide-react';
import { playTapSound, triggerHaptic } from '../utils/feedback';

interface EmergencyModalProps {
  contacts: EmergencyContact[];
  onClose: () => void;
}

export const EmergencyModal: FC<EmergencyModalProps> = ({ contacts, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-red-500/50 shadow-2xl bg-slate-900 relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={() => {
            playTapSound();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <span className="p-2 rounded-xl bg-red-950 text-red-400 border border-red-800">
            <AlertOctagon className="w-5 h-5 animate-pulse" />
          </span>
          <div>
            <h3 className="text-xl font-bold text-white">Emergency SOS Dispatch</h3>
            <p className="text-xs text-red-300">Tap to call emergency personnel immediately</p>
          </div>
        </div>

        <div className="space-y-3 my-5 max-h-[60vh] overflow-y-auto pr-1">
          {contacts.map((contact) => (
            <a
              key={contact.id}
              href={`tel:${contact.number.replace(/[^0-9+]/g, '')}`}
              onClick={() => {
                playTapSound();
                triggerHaptic('warning');
              }}
              className="p-3.5 rounded-2xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/70 flex items-center justify-between gap-3 active:scale-95 transition-all text-white group"
            >
              <div className="min-w-0">
                <div className="font-bold text-sm text-white group-hover:text-red-200 truncate">
                  {contact.title}
                </div>
                <div className="text-[11px] text-red-300/80 truncate">
                  {contact.location} • {contact.availableHours}
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 text-white font-mono font-bold text-xs shrink-0 shadow">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{contact.number}</span>
              </div>
            </a>
          ))}
        </div>

        <button
          onClick={() => {
            playTapSound();
            onClose();
          }}
          className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs active:scale-95"
        >
          Dismiss SOS Screen
        </button>

      </div>
    </div>
  );
};
