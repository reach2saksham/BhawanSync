import type { FC } from 'react';
import { 
  LayoutDashboard, 
  Nfc, 
  UtensilsCrossed, 
  Shirt, 
  Users, 
  ShieldAlert 
} from 'lucide-react';
import { playTapSound, triggerHaptic } from '../utils/feedback';

export type NavTab = 'dashboard' | 'nfc' | 'mess' | 'laundry' | 'warden' | 'emergency';

interface NavigationProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  activeWorkersCount: number;
}

export const Navigation: FC<NavigationProps> = ({
  activeTab,
  onChangeTab,
  activeWorkersCount,
}) => {
  const tabs: { id: NavTab; label: string; icon: FC<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'nfc', label: 'NFC Staff Tap', icon: Nfc, badge: activeWorkersCount },
    { id: 'mess', label: 'Mess Timing', icon: UtensilsCrossed },
    { id: 'laundry', label: 'Laundry', icon: Shirt },
    { id: 'warden', label: 'Warden Contacts', icon: Users },
    { id: 'emergency', label: 'Emergency Hub', icon: ShieldAlert },
  ];

  const handleSelect = (tabId: NavTab) => {
    playTapSound();
    triggerHaptic('light');
    onChangeTab(tabId);
  };

  return (
    <nav className="glass-panel sticky bottom-0 z-30 px-3 py-2 border-t border-white/10 shadow-2xl backdrop-blur-xl">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-1 sm:gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleSelect(tab.id)}
              className={`relative flex-1 flex flex-col items-center justify-center py-2 px-1 sm:px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-500/10 font-bold scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent font-medium'
              } active:scale-95`}
              style={{ minHeight: '58px' }}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform ${
                    isActive ? 'scale-110 text-cyan-400' : 'text-slate-400'
                  }`}
                />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-emerald-500 text-slate-950 font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] sm:text-xs mt-1 truncate max-w-full tracking-tight ${
                isActive ? 'text-cyan-200 font-semibold' : 'text-slate-400'
              }`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="w-6 h-0.5 rounded-full bg-cyan-400 mt-0.5 shadow-sm shadow-cyan-400/80" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
