import { useState, useEffect } from 'react';
import type { FC } from 'react';
import type { MessMeal } from '../types';
import { 
  Coffee, 
  UtensilsCrossed, 
  CupSoda, 
  MoonStar, 
  Clock, 
  Sparkles, 
  Calendar, 
  AlertCircle, 
  Info 
} from 'lucide-react';
import { calculateMessStatus } from '../utils/timeHelper';
import type { CurrentMealStatus } from '../utils/timeHelper';
import { playTapSound, triggerHaptic } from '../utils/feedback';

interface MessViewProps {
  meals: MessMeal[];
}

export const MessView: FC<MessViewProps> = ({ meals }) => {
  const [mealStatus, setMealStatus] = useState<CurrentMealStatus>(() => calculateMessStatus(meals));
  const [isWeekendView, setIsWeekendView] = useState<boolean>(() => {
    const day = new Date().getDay();
    return day === 0 || day === 6;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMealStatus(calculateMessStatus(meals));
    }, 1000);
    return () => clearInterval(interval);
  }, [meals]);

  const getMealIcon = (iconName: string) => {
    switch (iconName) {
      case 'Coffee': return Coffee;
      case 'UtensilsCrossed': return UtensilsCrossed;
      case 'CupSoda': return CupSoda;
      case 'MoonStar': return MoonStar;
      default: return UtensilsCrossed;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fadeIn">
      
      {/* Live Status Hero Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-slate-950">
        
        {/* Glow */}
        <div className={`absolute -right-16 -top-16 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none ${
          mealStatus.status === 'OPEN_NOW' ? 'bg-emerald-500' : 'bg-cyan-500'
        }`} />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                mealStatus.status === 'OPEN_NOW'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                  : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  mealStatus.status === 'OPEN_NOW' ? 'bg-emerald-400 animate-ping' : 'bg-cyan-400'
                }`} />
                {mealStatus.status === 'OPEN_NOW' ? 'Dining Hall Currently Active' : 'Dining Hall Inactive / Next Service'}
              </span>

              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                {isWeekendView ? 'Weekend Timing' : 'Weekday Timing'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {mealStatus.status === 'OPEN_NOW' ? (
                <>
                  Serving Now: <span className="text-emerald-400">{mealStatus.activeMeal?.name}</span>
                </>
              ) : (
                <>
                  Next Meal: <span className="text-cyan-400">{mealStatus.nextMeal?.name || 'Breakfast'}</span>
                </>
              )}
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              {mealStatus.status === 'OPEN_NOW'
                ? mealStatus.activeMeal?.description
                : `The mess is currently closed between dining hours. Next meal is ${mealStatus.nextMeal?.name}.`}
            </p>
          </div>

          {/* Countdown & Progress Meter */}
          <div className="w-full lg:w-72 p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-xl text-center space-y-3 shrink-0">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>{mealStatus.status === 'OPEN_NOW' ? 'Time Until Meal Closes' : 'Opens In'}</span>
            </div>

            <div className="font-mono text-3xl font-black text-white tracking-wider">
              {mealStatus.timeRemainingFormatted}
            </div>

            {mealStatus.status === 'OPEN_NOW' && (
              <div className="space-y-1">
                <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${mealStatus.progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>{mealStatus.activeMeal?.startTime}</span>
                  <span>{mealStatus.progressPercent}% elapsed</span>
                  <span>{mealStatus.activeMeal?.endTime}</span>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Weekday vs Weekend Filter Bar */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <UtensilsCrossed className="w-5 h-5 text-cyan-400" />
          <span>Complete Daily Meal Timetable</span>
        </h3>

        <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => {
              playTapSound();
              triggerHaptic('light');
              setIsWeekendView(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              !isWeekendView
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Monday – Friday
          </button>
          <button
            onClick={() => {
              playTapSound();
              triggerHaptic('light');
              setIsWeekendView(true);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isWeekendView
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Saturday & Sunday
          </button>
        </div>
      </div>

      {/* 4 Meals Grid (Breakfast, Lunch, Snacks, Dinner) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {meals.map((meal) => {
          const Icon = getMealIcon(meal.icon);
          const isCurrentActive = mealStatus.activeMeal?.id === meal.id;
          const isNextActive = mealStatus.nextMeal?.id === meal.id;

          const startTime = isWeekendView && meal.weekendStartTime ? meal.weekendStartTime : meal.startTime;
          const endTime = isWeekendView && meal.weekendEndTime ? meal.weekendEndTime : meal.endTime;

          return (
            <div
              key={meal.id}
              className={`glass-panel rounded-3xl p-6 border transition-all duration-300 relative overflow-hidden ${
                isCurrentActive
                  ? 'ring-2 ring-emerald-500/80 border-emerald-500/40 bg-slate-900/95 shadow-xl shadow-emerald-500/10'
                  : isNextActive
                  ? 'border-cyan-500/40 bg-slate-900/85'
                  : 'border-white/5 bg-slate-900/60'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl ${
                    isCurrentActive
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                      : 'bg-slate-800 text-cyan-400 border border-slate-700'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      {meal.name}
                      {isCurrentActive && (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                          ACTIVE NOW
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {isWeekendView ? 'Weekend Window' : 'Regular Weekday Window'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-base font-bold text-slate-100 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 inline-block">
                    {startTime} – {endTime}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                {meal.description}
              </p>

              {/* Today's Menu Items */}
              {meal.todayMenu && meal.todayMenu.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2 mb-4">
                  <div className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>Today's Highlights Menu</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {meal.todayMenu.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-200 font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Rules / Advisory */}
              {meal.rules && (
                <div className="flex items-start gap-2 text-[11px] text-slate-400 italic">
                  <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <span>{meal.rules}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Dining Hall Notices & Feedback */}
      <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            Mess menu updates and special diets can be coordinated with the Student Mess Committee. 
            All timings are set for this semester.
          </span>
        </div>
        <span className="font-mono text-cyan-300 shrink-0">Mess Office: Ext. 202</span>
      </div>

    </div>
  );
};
