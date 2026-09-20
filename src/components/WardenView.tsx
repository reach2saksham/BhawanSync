import { useState } from 'react';
import type { FC } from 'react';
import type { WardenContact } from '../types';
import { 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  QrCode, 
  MessageSquare, 
  X 
} from 'lucide-react';
import { playTapSound, triggerHaptic } from '../utils/feedback';

interface WardenViewProps {
  wardens: WardenContact[];
}

export const WardenView: FC<WardenViewProps> = ({ wardens }) => {
  const [selectedWardenQr, setSelectedWardenQr] = useState<WardenContact | null>(null);

  const openQrModal = (warden: WardenContact) => {
    playTapSound();
    triggerHaptic('light');
    setSelectedWardenQr(warden);
  };

  const closeQrModal = () => {
    playTapSound();
    setSelectedWardenQr(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-slate-950">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 text-xs font-semibold">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>Hostel Administrative Leadership & Warden Council</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Warden Contacts & Visiting Hours
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            Direct communication channels for residential matters, maintenance issues, dining feedback, and student welfare. 
            Tap any contact to dial directly or generate a QR code for your smartphone.
          </p>
        </div>
      </div>

      {/* Warden Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {wardens.map((warden) => (
          <div
            key={warden.id}
            className="glass-panel rounded-3xl p-6 border border-white/10 shadow-xl bg-slate-900/80 flex flex-col justify-between hover:border-slate-700 transition-all duration-300 relative overflow-hidden group"
          >
            {/* Ambient subtle glow */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors pointer-events-none" />

            <div>
              {/* Header: Avatar, Name & Role */}
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={warden.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={warden.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/30 shadow-md shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 inline-block mb-1">
                    {warden.role}
                  </span>
                  <h3 className="text-lg font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                    {warden.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1">{warden.title}</p>
                </div>
              </div>

              {/* Office & Visiting Info */}
              <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/50 space-y-2 mb-5 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-200">Office Location: </span>
                    <span>{warden.officeLocation}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-200">Visiting Hours: </span>
                    <span className="font-medium text-emerald-300">{warden.visitingHours}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="space-y-2.5 pt-3 border-t border-white/5">
              
              <div className="flex items-center gap-2">
                {/* Phone Call */}
                <a
                  href={`tel:${warden.phone}`}
                  onClick={() => playTapSound()}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {warden.phone}</span>
                </a>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${warden.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => playTapSound()}
                  className="p-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white active:scale-95 transition-all shadow-md"
                  title="Chat on WhatsApp"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>

                {/* Email */}
                <a
                  href={`mailto:${warden.email}`}
                  onClick={() => playTapSound()}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 active:scale-95 transition-all"
                  title="Send Email"
                >
                  <Mail className="w-4 h-4" />
                </a>

                {/* Show QR Code */}
                <button
                  onClick={() => openQrModal(warden)}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 active:scale-95 transition-all"
                  title="Show Phone QR Code"
                >
                  <QrCode className="w-4 h-4" />
                </button>
              </div>

              {warden.altPhone && (
                <div className="text-[11px] text-slate-400 text-center font-mono">
                  Alt / Intercom: <span className="text-slate-300 font-semibold">{warden.altPhone}</span>
                </div>
              )}

            </div>
          </div>
        ))}
      </div>

      {/* QR Code Modal for Phone Camera Scanning */}
      {selectedWardenQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel w-full max-w-sm rounded-3xl p-6 border border-white/20 shadow-2xl bg-slate-900 relative text-center">
            
            <button
              onClick={closeQrModal}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-1">Scan Contact to Smartphone</h3>
            <p className="text-xs text-slate-400 mb-4">{selectedWardenQr.name} ({selectedWardenQr.role})</p>

            {/* Clean SVG QR Code Representation */}
            <div className="p-4 bg-white rounded-2xl inline-block shadow-xl mx-auto mb-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=tel:${selectedWardenQr.phone.replace(/[^0-9]/g, '')}`}
                alt="QR Code"
                className="w-44 h-44 object-contain"
                onError={(e) => {
                  // Fallback if offline
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            <p className="text-xs font-mono text-cyan-300 mb-2">
              {selectedWardenQr.phone}
            </p>
            <p className="text-[11px] text-slate-400">
              Point your smartphone camera at this screen to instantly dial or save to contacts.
            </p>

            <button
              onClick={closeQrModal}
              className="mt-5 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
            >
              Done / Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
