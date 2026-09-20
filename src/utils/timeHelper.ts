import type { MessMeal } from '../types';

export interface CurrentMealStatus {
  activeMeal: MessMeal | null;
  nextMeal: MessMeal | null;
  status: 'OPEN_NOW' | 'NEXT_UP' | 'CLOSED_FOR_DAY';
  timeRemainingSeconds: number;
  timeRemainingFormatted: string;
  progressPercent: number;
}

// Convert "HH:MM" string to minutes from start of day
export function timeStringToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

// Get current day of week name
export function getCurrentDayName(): 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday' {
  const days: ('Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[] = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];
  const now = new Date();
  return days[now.getDay()] as 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
}

// Calculate real-time status of hostel dining mess
export function calculateMessStatus(meals: MessMeal[], now = new Date()): CurrentMealStatus {
  const isWeekend = now.getDay() === 0 || now.getDay() === 6;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentSeconds = now.getSeconds();
  const totalCurrentSeconds = currentMinutes * 60 + currentSeconds;

  // Find if currently inside any meal window
  for (const meal of meals) {
    const startStr = isWeekend && meal.weekendStartTime ? meal.weekendStartTime : meal.startTime;
    const endStr = isWeekend && meal.weekendEndTime ? meal.weekendEndTime : meal.endTime;

    const startSec = timeStringToMinutes(startStr) * 60;
    const endSec = timeStringToMinutes(endStr) * 60;

    if (totalCurrentSeconds >= startSec && totalCurrentSeconds < endSec) {
      const remaining = endSec - totalCurrentSeconds;
      const elapsed = totalCurrentSeconds - startSec;
      const totalDuration = endSec - startSec;
      const progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      const formatted = mins > 60 
        ? `${Math.floor(mins / 60)}h ${mins % 60}m` 
        : `${mins}m ${secs.toString().padStart(2, '0')}s`;

      return {
        activeMeal: meal,
        nextMeal: null,
        status: 'OPEN_NOW',
        timeRemainingSeconds: remaining,
        timeRemainingFormatted: formatted,
        progressPercent: Math.round(progress)
      };
    }
  }

  // Not currently during a meal: find next upcoming meal today
  let upcomingMeal: MessMeal | null = null;
  let minWaitSec = Infinity;

  for (const meal of meals) {
    const startStr = isWeekend && meal.weekendStartTime ? meal.weekendStartTime : meal.startTime;
    const startSec = timeStringToMinutes(startStr) * 60;

    if (startSec > totalCurrentSeconds) {
      const diff = startSec - totalCurrentSeconds;
      if (diff < minWaitSec) {
        minWaitSec = diff;
        upcomingMeal = meal;
      }
    }
  }

  if (upcomingMeal) {
    const mins = Math.floor(minWaitSec / 60);
    const secs = minWaitSec % 60;
    const formatted = mins > 60 
      ? `${Math.floor(mins / 60)}h ${mins % 60}m` 
      : `${mins}m ${secs.toString().padStart(2, '0')}s`;

    return {
      activeMeal: null,
      nextMeal: upcomingMeal,
      status: 'NEXT_UP',
      timeRemainingSeconds: minWaitSec,
      timeRemainingFormatted: formatted,
      progressPercent: 0
    };
  }

  // If no more meals today, next is breakfast tomorrow
  const breakfast = meals.find(m => m.name === 'Breakfast') || meals[0];
  const nextStartSec = timeStringToMinutes(breakfast.startTime) * 60;
  const secondsTillMidnight = (24 * 60 * 60) - totalCurrentSeconds;
  const totalWaitSec = secondsTillMidnight + nextStartSec;
  const mins = Math.floor(totalWaitSec / 60);

  return {
    activeMeal: null,
    nextMeal: breakfast,
    status: 'CLOSED_FOR_DAY',
    timeRemainingSeconds: totalWaitSec,
    timeRemainingFormatted: `${Math.floor(mins / 60)}h ${mins % 60}m`,
    progressPercent: 0
  };
}

// Format ISO date to readable string "10:45 AM"
export function formatTimeOnly(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch {
    return '--:--';
  }
}

// Format ISO date to full readable format
export function formatFullDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return 'N/A';
  }
}

// Calculate elapsed time from entry until now
export function getElapsedTimeString(entryIso: string): string {
  try {
    const start = new Date(entryIso).getTime();
    const now = Date.now();
    const diffMins = Math.max(0, Math.floor((now - start) / 60000));
    if (diffMins < 1) return 'Just entered';
    if (diffMins < 60) return `${diffMins} min ago`;
    const hours = Math.floor(diffMins / 60);
    const remMins = diffMins % 60;
    return `${hours}h ${remMins}m ago`;
  } catch {
    return '0m';
  }
}
