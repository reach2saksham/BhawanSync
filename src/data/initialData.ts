import type { SemesterConfig, WorkerLogEntry, LaundryMachine } from '../types';

export const INITIAL_SEMESTER_CONFIG: SemesterConfig = {
  semesterName: 'Spring Semester 2026-2027',
  academicYear: '2026-2027',
  effectiveDateRange: 'Jan 05, 2026 – May 25, 2026',
  bhawanName: 'Ravindra Bhawan',
  institutionName: 'Campus Residence Hall & Hostels Council',
  lastUpdated: '2026-01-05T09:00:00.000Z',
  updatedBy: 'Warden Office (Approved by Council)',
  adminPin: '1234',

  wardens: [
    {
      id: 'warden-1',
      role: 'Chief Warden',
      name: 'Prof. S. K. Ramanujan',
      title: 'Professor, Dept. of Computer Science & Engineering',
      phone: '+91 98765 43210',
      altPhone: '+91 94120 00101',
      email: 'chiefwarden.ravindra@campus.edu',
      officeLocation: 'Admin Block, Ground Floor, Room 101',
      visitingHours: 'Monday – Friday: 5:00 PM – 7:00 PM',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'warden-2',
      role: 'Assistant Warden (Admin & Maintenance)',
      name: 'Dr. Anita Deshmukh',
      title: 'Associate Professor, Dept. of Electrical Engineering',
      phone: '+91 98765 43211',
      email: 'asstwarden.admin@campus.edu',
      officeLocation: 'Block B, Ground Floor, Room 104',
      visitingHours: 'Tuesday & Thursday: 4:00 PM – 6:00 PM',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'warden-3',
      role: 'Assistant Warden (Mess & Dining)',
      name: 'Dr. K. Venkataraman',
      title: 'Assistant Professor, Dept. of Mechanical Sciences',
      phone: '+91 98765 43212',
      email: 'asstwarden.mess@campus.edu',
      officeLocation: 'Dining Hall Complex, 1st Floor Office',
      visitingHours: 'Daily: 1:00 PM – 2:00 PM & 8:00 PM – 9:00 PM',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'warden-4',
      role: 'Bhawan Caretaker (24/7 Operations)',
      name: 'Mr. Jagdish Prasad',
      title: 'Head Caretaker & Logistics Supervisor',
      phone: '+91 98765 43219',
      altPhone: 'Intercom Ext: 204',
      email: 'caretaker.ravindra@campus.edu',
      officeLocation: 'Main Entrance Reception Counter, Ground Floor',
      visitingHours: 'Available 24x7 (Desk Duty & Night Patrol)',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    }
  ],

  messSchedule: [
    {
      id: 'meal-breakfast',
      name: 'Breakfast',
      icon: 'Coffee',
      startTime: '07:30',
      endTime: '09:45',
      weekendStartTime: '08:00',
      weekendEndTime: '10:15',
      description: 'South Indian & North Indian daily rotating menu with milk, tea, coffee & fresh eggs/sprouts.',
      todayMenu: ['Idli & Sambar', 'Masala Vada with Coconut Chutney', 'Poha with Peanuts', 'Boiled Eggs / Sprouts', 'Tea / Coffee / Warm Milk'],
      rules: 'Entry allowed only in proper attire. Please scan student biometric/ID card at the counter.'
    },
    {
      id: 'meal-lunch',
      name: 'Lunch',
      icon: 'UtensilsCrossed',
      startTime: '12:00',
      endTime: '14:15',
      weekendStartTime: '12:15',
      weekendEndTime: '14:30',
      description: 'Full 4-course hot meal with seasonal vegetables, dal, rice varieties, fresh rotis, curd and salad.',
      todayMenu: ['Paneer Butter Masala', 'Dal Tadka', 'Jeera Rice & Steamed Rice', 'Tawa Butter Roti', 'Boondi Raita', 'Fresh Green Salad & Pickle'],
      rules: 'Do not waste food. Second servings available at counter 2.'
    },
    {
      id: 'meal-snacks',
      name: 'High Tea',
      icon: 'CupSoda',
      startTime: '17:00',
      endTime: '18:30',
      weekendStartTime: '17:15',
      weekendEndTime: '18:45',
      description: 'Evening refresher with hot snack, ginger tea, lemon tea and biscuits.',
      todayMenu: ['Crispy Veg Samosa with Mint Chutney', 'Sweet Biscuits', 'Special Masala Chai', 'Lemon Tea'],
      rules: 'Snacks cannot be taken into residential rooms.'
    },
    {
      id: 'meal-dinner',
      name: 'Dinner',
      icon: 'MoonStar',
      startTime: '19:45',
      endTime: '21:45',
      weekendStartTime: '20:00',
      weekendEndTime: '22:00',
      description: 'Wholesome dinner with special non-veg and vegetarian alternates, desserts on select nights.',
      todayMenu: ['Kadai Chicken / Kadai Paneer Special', 'Rajma Masala', 'Fragrant Biryani Rice', 'Phulkas / Chapati', 'Gulab Jamun Dessert', 'Roasted Papad'],
      rules: 'Mess closes promptly at 21:45 PM on weekdays. Packaged dinner requires prior warden coupon.'
    }
  ],

  laundrySchedule: [
    {
      id: 'slot-mon',
      day: 'Monday',
      assignedWings: 'Wing A & Wing B',
      assignedFloors: 'Ground Floor & 1st Floor',
      timing: '06:00 AM – 10:30 PM',
      guidelines: 'Maximum 2 loads per student room. Heavy bedspreads permitted in Machine 7 & 8.'
    },
    {
      id: 'slot-tue',
      day: 'Tuesday',
      assignedWings: 'Wing A & Wing B',
      assignedFloors: '2nd Floor & 3rd Floor',
      timing: '06:00 AM – 10:30 PM',
      guidelines: 'Token required from Caretaker desk during peak evening hours (5 PM – 8 PM).'
    },
    {
      id: 'slot-wed',
      day: 'Wednesday',
      assignedWings: 'Wing A & Wing B',
      assignedFloors: '4th Floor & 5th Floor',
      timing: '06:00 AM – 10:30 PM',
      guidelines: 'Eco-wash mode default. Collect dry clothes within 30 minutes of cycle completion.'
    },
    {
      id: 'slot-thu',
      day: 'Thursday',
      assignedWings: 'Wing C & Wing D',
      assignedFloors: 'Ground Floor & 1st Floor',
      timing: '06:00 AM – 10:30 PM',
      guidelines: 'Use liquid detergent only. Pods must be placed directly into drum.'
    },
    {
      id: 'slot-fri',
      day: 'Friday',
      assignedWings: 'Wing C & Wing D',
      assignedFloors: '2nd Floor & 3rd Floor',
      timing: '06:00 AM – 10:30 PM',
      guidelines: 'Ironing station available on 2nd Floor common room until 9:00 PM.'
    },
    {
      id: 'slot-sat',
      day: 'Saturday',
      assignedWings: 'Wing C & Wing D',
      assignedFloors: '4th Floor & 5th Floor',
      timing: '06:00 AM – 11:00 PM',
      guidelines: 'Weekend extended hours. Please maintain queue register on the door.'
    },
    {
      id: 'slot-sun',
      day: 'Sunday',
      assignedWings: 'All Wings (A, B, C, D)',
      assignedFloors: 'Open Slot: Curtains, Blankets, Bed Linens & Sports Kits',
      timing: '07:00 AM – 10:00 PM',
      guidelines: 'Express 30-min cycles only. Clean lint traps after washing blankets.'
    }
  ],

  emergencyContacts: [
    {
      id: 'em-1',
      title: 'Bhawan Guard Desk (24x7)',
      subtitle: 'Main Gate & Security Reception Desk',
      number: '+91 94120 00100',
      priority: 'high',
      category: 'hostel',
      location: 'Ravindra Bhawan Main Entrance Gate',
      availableHours: '24 Hours / 7 Days'
    },
    {
      id: 'em-2',
      title: 'Campus Health Centre & Ambulance',
      subtitle: 'Immediate Medical Response & Paramedic Unit',
      number: '+91 94120 99999',
      priority: 'critical',
      category: 'medical',
      location: 'Central Campus Health Facility (Opp. Library)',
      availableHours: '24 Hours Emergency Doctor on Call'
    },
    {
      id: 'em-3',
      title: 'Central Campus Security Control Room',
      subtitle: 'Chief Security Officer & Quick Reaction Team (QRT)',
      number: '+91 94120 11223',
      priority: 'critical',
      category: 'police',
      location: 'Gate No. 1 Administrative Complex',
      availableHours: '24 Hours Dedicated Line'
    },
    {
      id: 'em-4',
      title: 'Fire Safety & Disaster Station',
      subtitle: 'Campus Fire Hydrant & Evacuation Team',
      number: '101 / +91 94120 10101',
      priority: 'critical',
      category: 'fire',
      location: 'Safety Command Post, North Ring Road',
      availableHours: 'Immediate 2-Minute Response'
    },
    {
      id: 'em-5',
      title: "Women's Safety & Anti-Harassment Cell",
      subtitle: 'Confidential 24/7 Helpline & Student Counselor',
      number: '1091 / +91 94120 55555',
      priority: 'high',
      category: 'helpline',
      location: 'Student Affairs Centre, Room 204',
      availableHours: '24/7 Confidential Assistance'
    },
    {
      id: 'em-6',
      title: 'Electrical Substation Emergency Breakdown',
      subtitle: 'Campus Power Grid & Bhawan Generator Backup',
      number: '+91 94120 33445',
      priority: 'standard',
      category: 'utility',
      location: 'Substation-3 (Behind Ravindra Bhawan)',
      availableHours: '24x7 Electrical Engineers on Duty'
    },
    {
      id: 'em-7',
      title: 'Water Supply & Main Pipeline Helpline',
      subtitle: 'Overhead Tank & RO Drinking Water Plant',
      number: '+91 94120 66778',
      priority: 'standard',
      category: 'utility',
      location: 'Civil Engineering Maintenance Yard',
      availableHours: '6:00 AM – 11:00 PM'
    }
  ],

  registeredWorkers: [
    {
      id: 'w-plumb-1',
      nfcTagUid: '04:A2:8B:1A:5D:80',
      name: 'Rajesh Kumar',
      role: 'Plumber',
      phone: '+91 98234 11001',
      agency: 'Campus Estate Sanitation Services',
      avatarUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=120&auto=format&fit=crop&q=80',
      isRegistered: true
    },
    {
      id: 'w-plumb-2',
      nfcTagUid: '04:B3:9C:2B:6E:81',
      name: 'Dilip Verma',
      role: 'Plumber',
      phone: '+91 98234 11002',
      agency: 'Campus Estate Sanitation Services',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
      isRegistered: true
    },
    {
      id: 'w-elec-1',
      nfcTagUid: '04:C4:0D:3C:7F:82',
      name: 'Suresh Sharma',
      role: 'Electrician',
      phone: '+91 98234 22001',
      agency: 'Institute Power & Lighting Wing',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      isRegistered: true
    },
    {
      id: 'w-elec-2',
      nfcTagUid: '04:D5:1E:4D:8A:83',
      name: 'Amit Mukherjee',
      role: 'Electrician',
      phone: '+91 98234 22002',
      agency: 'Institute Power & Lighting Wing',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
      isRegistered: true
    },
    {
      id: 'w-carp-1',
      nfcTagUid: '04:E6:2F:5E:9B:84',
      name: 'Mohan Lal Mistri',
      role: 'Carpenter',
      phone: '+91 98234 33001',
      agency: 'Bhawan Furniture & Joinery Unit',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
      isRegistered: true
    },
    {
      id: 'w-hvac-1',
      nfcTagUid: '04:F7:3A:6F:AC:85',
      name: 'Vikram Singh',
      role: 'AC / Cooler Tech',
      phone: '+91 98234 44001',
      agency: 'CoolTech HVAC Systems Ltd.',
      avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
      isRegistered: true
    },
    {
      id: 'w-pest-1',
      nfcTagUid: '04:08:4B:70:BD:86',
      name: 'Deepak Rao',
      role: 'Pest Control',
      phone: '+91 98234 55001',
      agency: 'Campus Health Hygiene Team',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&auto=format&fit=crop&q=80',
      isRegistered: true
    },
    {
      id: 'w-civil-1',
      nfcTagUid: '04:19:5C:81:CE:87',
      name: 'Santosh Maurya',
      role: 'Civil & Mason',
      phone: '+91 98234 66001',
      agency: 'Campus Infrastructure Works',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
      isRegistered: true
    }
  ]
};

// Initial realistic worker logs showing 2 staff currently inside, and earlier completed visits today!
export const INITIAL_WORKER_LOGS: WorkerLogEntry[] = [
  {
    id: 'log-101',
    workerId: 'w-plumb-1',
    workerName: 'Rajesh Kumar',
    role: 'Plumber',
    nfcTagUid: '04:A2:8B:1A:5D:80',
    entryTime: new Date(Date.now() - 42 * 60 * 1000).toISOString(), // 42 minutes ago
    exitTime: null,
    durationMinutes: null,
    assignedLocation: 'Wing B, 2nd Floor (Washroom 204)',
    notes: 'Fixing flush valve leak and replacing main pipe gasket.',
    status: 'inside'
  },
  {
    id: 'log-102',
    workerId: 'w-elec-1',
    workerName: 'Suresh Sharma',
    role: 'Electrician',
    nfcTagUid: '04:C4:0D:3C:7F:82',
    entryTime: new Date(Date.now() - 19 * 60 * 1000).toISOString(), // 19 minutes ago
    exitTime: null,
    durationMinutes: null,
    assignedLocation: 'Wing A, Common Study Hall',
    notes: 'Replacing LED tube batten and repairing ceiling fan regulator.',
    status: 'inside'
  },
  {
    id: 'log-103',
    workerId: 'w-carp-1',
    workerName: 'Mohan Lal Mistri',
    role: 'Carpenter',
    nfcTagUid: '04:E6:2F:5E:9B:84',
    entryTime: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    exitTime: new Date(Date.now() - 115 * 60 * 1000).toISOString(),
    durationMinutes: 65,
    assignedLocation: 'Room 312 & 318 (Wing C)',
    notes: 'Fixed study table drawer slide and aligned door latch.',
    status: 'completed'
  },
  {
    id: 'log-104',
    workerId: 'w-hvac-1',
    workerName: 'Vikram Singh',
    role: 'AC / Cooler Tech',
    nfcTagUid: '04:F7:3A:6F:AC:85',
    entryTime: new Date(Date.now() - 310 * 60 * 1000).toISOString(),
    exitTime: new Date(Date.now() - 225 * 60 * 1000).toISOString(),
    durationMinutes: 85,
    assignedLocation: 'Ground Floor Dining Water Cooler',
    notes: 'Cleaned compressor coils and replaced cooling thermostat filter.',
    status: 'completed'
  }
];

// Initial washing machine bank
export const INITIAL_LAUNDRY_MACHINES: LaundryMachine[] = [
  { id: 1, label: 'Machine 1 (Front Load 8kg)', status: 'running', remainingMinutes: 18, currentWing: 'Wing A - 104' },
  { id: 2, label: 'Machine 2 (Front Load 8kg)', status: 'available', remainingMinutes: 0 },
  { id: 3, label: 'Machine 3 (Front Load 8kg)', status: 'running', remainingMinutes: 34, currentWing: 'Wing B - 118' },
  { id: 4, label: 'Machine 4 (Front Load 8kg)', status: 'available', remainingMinutes: 0 },
  { id: 5, label: 'Machine 5 (Top Load 10kg)', status: 'available', remainingMinutes: 0 },
  { id: 6, label: 'Machine 6 (Top Load 10kg)', status: 'running', remainingMinutes: 9, currentWing: 'Wing A - 112' },
  { id: 7, label: 'Machine 7 (Heavy Bedding 14kg)', status: 'available', remainingMinutes: 0 },
  { id: 8, label: 'Machine 8 (Heavy Bedding 14kg)', status: 'maintenance', remainingMinutes: 0 }
];
