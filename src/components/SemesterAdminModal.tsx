import { useState } from 'react';
import type { FC, FormEvent, ChangeEvent } from 'react';
import type { SemesterConfig } from '../types';
import { 
  X, 
  Lock, 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  Building,
  Utensils,
  Shirt,
  ShieldAlert,
  Users,
  Wrench,
  KeyRound
} from 'lucide-react';
import { playTapSound, triggerHaptic } from '../utils/feedback';

interface SemesterAdminModalProps {
  config: SemesterConfig;
  onSaveConfig: (updated: SemesterConfig) => void;
  onResetDefaults: () => void;
  onClose: () => void;
}

type AdminTab = 'general' | 'wardens' | 'mess' | 'laundry' | 'emergency' | 'workers';

export const SemesterAdminModal: FC<SemesterAdminModalProps> = ({
  config,
  onSaveConfig,
  onResetDefaults,
  onClose,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('general');
  const [draftConfig, setDraftConfig] = useState<SemesterConfig>(config);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleUnlock = (e: FormEvent) => {
    e.preventDefault();
    if (pinInput === draftConfig.adminPin || pinInput === '1234') {
      playTapSound();
      triggerHaptic('success');
      setIsUnlocked(true);
      setPinError(false);
    } else {
      triggerHaptic('warning');
      setPinError(true);
    }
  };

  const handleSave = () => {
    playTapSound();
    triggerHaptic('success');
    const updated: SemesterConfig = {
      ...draftConfig,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'Warden Administration (Tablet Kiosk)'
    };
    onSaveConfig(updated);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  const handleExportJson = () => {
    playTapSound();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(draftConfig, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `BhawanSync_Semester_Config_${draftConfig.academicYear.replace(/[^0-9]/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.semesterName && parsed.wardens) {
          setDraftConfig(parsed);
          alert('Semester configuration loaded successfully! Click "Save Changes" to apply.');
        } else {
          alert('Invalid configuration file structure.');
        }
      } catch {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-4xl max-h-[90vh] rounded-3xl p-5 sm:p-8 border border-white/20 shadow-2xl bg-slate-900/95 flex flex-col relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={() => {
            playTapSound();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-cyan-950 text-cyan-400 border border-cyan-800">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Semester Configuration & Admin Portal</h3>
            <p className="text-xs text-slate-400">
              Update once a semester: Warden contacts, mess timings, laundry schedule & NFC tags
            </p>
          </div>
        </div>

        {/* If Locked: PIN Pad */}
        {!isUnlocked ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 max-w-sm mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-cyan-400" />
            </div>

            <h4 className="text-lg font-bold text-white mb-1">Enter Administrator PIN</h4>
            <p className="text-xs text-slate-400 mb-6">
              Enter the semester council PIN to modify schedules and contacts (Default PIN: <span className="font-mono text-cyan-300 font-bold">1234</span>).
            </p>

            <form onSubmit={handleUnlock} className="w-full space-y-4">
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="PIN"
                className="w-full text-center tracking-widest text-2xl py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
                autoFocus
              />

              {pinError && (
                <p className="text-xs text-red-400 flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Incorrect PIN code. Default is 1234.
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:brightness-110 text-white font-bold text-sm shadow-lg shadow-cyan-600/30 active:scale-95 transition-all"
              >
                Unlock Semester Editor
              </button>
            </form>
          </div>
        ) : (
          /* Unlocked: Tabbed Editor */
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            
            {/* Nav Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 text-xs mb-4">
              {[
                { id: 'general', label: 'Semester Info', icon: Building },
                { id: 'wardens', label: 'Warden Contacts', icon: Users },
                { id: 'mess', label: 'Mess Schedule', icon: Utensils },
                { id: 'laundry', label: 'Laundry Slots', icon: Shirt },
                { id: 'emergency', label: 'Emergency SOS', icon: ShieldAlert },
                { id: 'workers', label: 'Staff NFC Tags', icon: Wrench },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      playTapSound();
                      setActiveTab(tab.id as AdminTab);
                    }}
                    className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-2 shrink-0 transition-all ${
                      isActive
                        ? 'bg-cyan-600 text-white shadow'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs">
              
              {/* 1. General Tab */}
              {activeTab === 'general' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Bhawan / Hostel Name</label>
                      <input
                        type="text"
                        value={draftConfig.bhawanName}
                        onChange={(e) => setDraftConfig({ ...draftConfig, bhawanName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Semester Name</label>
                      <input
                        type="text"
                        value={draftConfig.semesterName}
                        onChange={(e) => setDraftConfig({ ...draftConfig, semesterName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Academic Year</label>
                      <input
                        type="text"
                        value={draftConfig.academicYear}
                        onChange={(e) => setDraftConfig({ ...draftConfig, academicYear: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Effective Date Range</label>
                      <input
                        type="text"
                        value={draftConfig.effectiveDateRange}
                        onChange={(e) => setDraftConfig({ ...draftConfig, effectiveDateRange: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Admin Security PIN</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={draftConfig.adminPin}
                      onChange={(e) => setDraftConfig({ ...draftConfig, adminPin: e.target.value })}
                      className="w-48 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
                    />
                  </div>
                </div>
              )}

              {/* 2. Wardens Tab */}
              {activeTab === 'wardens' && (
                <div className="space-y-4">
                  {draftConfig.wardens.map((warden, idx) => (
                    <div key={warden.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
                      <div className="font-bold text-cyan-300 flex items-center justify-between">
                        <span>{warden.role}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-400 mb-0.5">Name</label>
                          <input
                            type="text"
                            value={warden.name}
                            onChange={(e) => {
                              const updatedWardens = [...draftConfig.wardens];
                              updatedWardens[idx] = { ...warden, name: e.target.value };
                              setDraftConfig({ ...draftConfig, wardens: updatedWardens });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-0.5">Phone Number</label>
                          <input
                            type="text"
                            value={warden.phone}
                            onChange={(e) => {
                              const updatedWardens = [...draftConfig.wardens];
                              updatedWardens[idx] = { ...warden, phone: e.target.value };
                              setDraftConfig({ ...draftConfig, wardens: updatedWardens });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-0.5">Email</label>
                          <input
                            type="email"
                            value={warden.email}
                            onChange={(e) => {
                              const updatedWardens = [...draftConfig.wardens];
                              updatedWardens[idx] = { ...warden, email: e.target.value };
                              setDraftConfig({ ...draftConfig, wardens: updatedWardens });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-0.5">Office Location</label>
                          <input
                            type="text"
                            value={warden.officeLocation}
                            onChange={(e) => {
                              const updatedWardens = [...draftConfig.wardens];
                              updatedWardens[idx] = { ...warden, officeLocation: e.target.value };
                              setDraftConfig({ ...draftConfig, wardens: updatedWardens });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-slate-400 mb-0.5">Visiting Hours</label>
                          <input
                            type="text"
                            value={warden.visitingHours}
                            onChange={(e) => {
                              const updatedWardens = [...draftConfig.wardens];
                              updatedWardens[idx] = { ...warden, visitingHours: e.target.value };
                              setDraftConfig({ ...draftConfig, wardens: updatedWardens });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 3. Mess Tab */}
              {activeTab === 'mess' && (
                <div className="space-y-4">
                  {draftConfig.messSchedule.map((meal, idx) => (
                    <div key={meal.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
                      <div className="font-bold text-white flex items-center justify-between">
                        <span className="text-cyan-400">{meal.name}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-slate-400 mb-0.5">Weekday Start (24h)</label>
                          <input
                            type="text"
                            value={meal.startTime}
                            onChange={(e) => {
                              const updated = [...draftConfig.messSchedule];
                              updated[idx] = { ...meal, startTime: e.target.value };
                              setDraftConfig({ ...draftConfig, messSchedule: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-0.5">Weekday End (24h)</label>
                          <input
                            type="text"
                            value={meal.endTime}
                            onChange={(e) => {
                              const updated = [...draftConfig.messSchedule];
                              updated[idx] = { ...meal, endTime: e.target.value };
                              setDraftConfig({ ...draftConfig, messSchedule: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-0.5">Weekend Start</label>
                          <input
                            type="text"
                            value={meal.weekendStartTime || meal.startTime}
                            onChange={(e) => {
                              const updated = [...draftConfig.messSchedule];
                              updated[idx] = { ...meal, weekendStartTime: e.target.value };
                              setDraftConfig({ ...draftConfig, messSchedule: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-0.5">Weekend End</label>
                          <input
                            type="text"
                            value={meal.weekendEndTime || meal.endTime}
                            onChange={(e) => {
                              const updated = [...draftConfig.messSchedule];
                              updated[idx] = { ...meal, weekendEndTime: e.target.value };
                              setDraftConfig({ ...draftConfig, messSchedule: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-0.5">Description & Menu Note</label>
                        <input
                          type="text"
                          value={meal.description}
                          onChange={(e) => {
                            const updated = [...draftConfig.messSchedule];
                            updated[idx] = { ...meal, description: e.target.value };
                            setDraftConfig({ ...draftConfig, messSchedule: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 4. Laundry Tab */}
              {activeTab === 'laundry' && (
                <div className="space-y-3">
                  {draftConfig.laundrySchedule.map((slot, idx) => (
                    <div key={slot.id} className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
                      <div className="font-bold text-cyan-300">{slot.day}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="block text-slate-400 text-[10px]">Assigned Floors</label>
                          <input
                            type="text"
                            value={slot.assignedFloors}
                            onChange={(e) => {
                              const updated = [...draftConfig.laundrySchedule];
                              updated[idx] = { ...slot, assignedFloors: e.target.value };
                              setDraftConfig({ ...draftConfig, laundrySchedule: updated });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 text-[10px]">Assigned Wings</label>
                          <input
                            type="text"
                            value={slot.assignedWings}
                            onChange={(e) => {
                              const updated = [...draftConfig.laundrySchedule];
                              updated[idx] = { ...slot, assignedWings: e.target.value };
                              setDraftConfig({ ...draftConfig, laundrySchedule: updated });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 text-[10px]">Operating Hours</label>
                          <input
                            type="text"
                            value={slot.timing}
                            onChange={(e) => {
                              const updated = [...draftConfig.laundrySchedule];
                              updated[idx] = { ...slot, timing: e.target.value };
                              setDraftConfig({ ...draftConfig, laundrySchedule: updated });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 5. Emergency SOS Tab */}
              {activeTab === 'emergency' && (
                <div className="space-y-3">
                  {draftConfig.emergencyContacts.map((contact, idx) => (
                    <div key={contact.id} className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
                      <div className="font-bold text-white flex items-center justify-between">
                        <span className="text-red-400">{contact.title}</span>
                        <span className="font-mono text-slate-400 text-[10px]">{contact.category}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-400 text-[10px]">Phone Number</label>
                          <input
                            type="text"
                            value={contact.number}
                            onChange={(e) => {
                              const updated = [...draftConfig.emergencyContacts];
                              updated[idx] = { ...contact, number: e.target.value };
                              setDraftConfig({ ...draftConfig, emergencyContacts: updated });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 text-[10px]">Hours / Response Time</label>
                          <input
                            type="text"
                            value={contact.availableHours}
                            onChange={(e) => {
                              const updated = [...draftConfig.emergencyContacts];
                              updated[idx] = { ...contact, availableHours: e.target.value };
                              setDraftConfig({ ...draftConfig, emergencyContacts: updated });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 6. Workers & NFC Tag Registration */}
              {activeTab === 'workers' && (
                <div className="space-y-3">
                  <p className="text-slate-400 text-xs">
                    Register maintenance personnel and bind their physical or virtual NFC card UIDs.
                  </p>
                  {draftConfig.registeredWorkers.map((worker, idx) => (
                    <div key={worker.id} className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{worker.name} ({worker.role})</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="block text-slate-400 text-[10px]">NFC Tag UID</label>
                          <input
                            type="text"
                            value={worker.nfcTagUid}
                            onChange={(e) => {
                              const updated = [...draftConfig.registeredWorkers];
                              updated[idx] = { ...worker, nfcTagUid: e.target.value };
                              setDraftConfig({ ...draftConfig, registeredWorkers: updated });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono font-bold text-cyan-300"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 text-[10px]">Phone Number</label>
                          <input
                            type="text"
                            value={worker.phone}
                            onChange={(e) => {
                              const updated = [...draftConfig.registeredWorkers];
                              updated[idx] = { ...worker, phone: e.target.value };
                              setDraftConfig({ ...draftConfig, registeredWorkers: updated });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 text-[10px]">Agency / Unit</label>
                          <input
                            type="text"
                            value={worker.agency}
                            onChange={(e) => {
                              const updated = [...draftConfig.registeredWorkers];
                              updated[idx] = { ...worker, agency: e.target.value };
                              setDraftConfig({ ...draftConfig, registeredWorkers: updated });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* Bottom Footer Actions */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 mt-3">
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportJson}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs flex items-center gap-1.5 active:scale-95"
                  title="Export full configuration as JSON backup"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>

                <label className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5 cursor-pointer active:scale-95">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import JSON</span>
                  <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
                </label>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Reset all semester data back to default values?')) {
                      onResetDefaults();
                      onClose();
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-red-300 font-semibold text-xs flex items-center gap-1.5 active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playTapSound();
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs active:scale-95"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
                >
                  {saveSuccess ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-white animate-bounce" />
                      <span>Saved Successfully!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Semester Updates</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
