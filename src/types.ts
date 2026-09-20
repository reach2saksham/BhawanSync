export type WorkerRole = 
  | 'Plumber'
  | 'Electrician'
  | 'Carpenter'
  | 'AC / Cooler Tech'
  | 'Pest Control'
  | 'Civil & Mason'
  | 'Lift Maintenance'
  | 'General Maintenance';

export interface WorkerProfile {
  id: string;
  nfcTagUid: string;
  name: string;
  role: WorkerRole;
  phone: string;
  agency: string;
  avatarUrl?: string;
  isRegistered: boolean;
}

export interface WorkerLogEntry {
  id: string;
  workerId: string;
  workerName: string;
  role: WorkerRole;
  nfcTagUid: string;
  entryTime: string; // ISO string
  exitTime: string | null; // ISO string
  durationMinutes: number | null;
  assignedLocation: string;
  notes: string;
  status: 'inside' | 'completed';
}

export interface WardenContact {
  id: string;
  role: string;
  name: string;
  title: string;
  phone: string;
  altPhone?: string;
  email: string;
  officeLocation: string;
  visitingHours: string;
  avatarUrl?: string;
}

export interface MessMeal {
  id: string;
  name: 'Breakfast' | 'Lunch' | 'High Tea' | 'Dinner';
  icon: string;
  startTime: string; // "07:30" (24h format)
  endTime: string;   // "09:30"
  weekendStartTime?: string;
  weekendEndTime?: string;
  description: string;
  todayMenu?: string[];
  rules?: string;
}

export interface LaundrySlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  assignedWings: string;
  assignedFloors: string;
  timing: string;
  guidelines: string;
}

export interface LaundryMachine {
  id: number;
  label: string;
  status: 'available' | 'running' | 'maintenance';
  remainingMinutes: number;
  currentWing?: string;
  startedAt?: string;
}

export interface EmergencyContact {
  id: string;
  title: string;
  subtitle: string;
  number: string;
  priority: 'high' | 'critical' | 'standard';
  category: 'police' | 'medical' | 'fire' | 'hostel' | 'helpline' | 'utility';
  location: string;
  availableHours: string;
}

export interface SemesterConfig {
  semesterName: string;
  academicYear: string;
  effectiveDateRange: string;
  bhawanName: string;
  institutionName: string;
  lastUpdated: string;
  updatedBy: string;
  adminPin: string;
  wardens: WardenContact[];
  messSchedule: MessMeal[];
  laundrySchedule: LaundrySlot[];
  emergencyContacts: EmergencyContact[];
  registeredWorkers: WorkerProfile[];
}
