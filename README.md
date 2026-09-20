# BhawanSync 🏢⚡

**BhawanSync** is a touch-first web application and kiosk system engineered specifically for tablet touchscreens (especially iPad, iPad Air, and iPad Pro) deployed at hostel receptions, residential halls ("Bhawans"), and dormitory front desks.

It provides real-time hostel timing management, dining mess tracking, laundry timetables, warden contacts, emergency SOS helplines, and **NFC-powered presence tracking for maintenance workers (plumbers, electricians, carpenters, AC technicians, and more)**.

---

## 🌟 Key Features

### 1. 📲 Tablet & iPad Touch-First Experience
- **Optimized for Touch Interaction**: 48px+ touch targets, prevention of accidental zoom gestures (`touch-action: manipulation`, viewport constraints), and responsive glassmorphic cards.
- **Synthesized Audio & Haptic Feedback**: Uses the Web Audio API to produce crisp iPad-like tap clicks, celebratory validation chimes on check-in, warm dual-tones on check-out, and siren alerts on SOS — with zero external audio assets required.
- **1-Tap Fullscreen Kiosk Mode**: Easily lock into full-screen mode on mounted iPads and reception tablets.
- **Adaptive Landscape & Portrait Layouts**: Fits 10.2", 10.9", 11", and 12.9" iPads and standard tablets.
- **PWA Ready**: Can be installed to the iPad Home Screen as a standalone fullscreen app.

### 2. 📳 Worker Entry & Exit Tracking via NFC Technology
- **Live Worker Presence**: Know instantaneously who is inside the Bhawan, when they entered, how long they have been working, and their assigned room or block.
- **Dual NFC Support**:
  - **Native Web NFC API (`NDEFReader`)**: Supports hardware NFC antennas on compatible Android tablets and kiosk hardware.
  - **Interactive Touch Sensor Pad & Digital Badges**: Since iOS Safari restricts Web NFC access to standard websites, BhawanSync features an **on-screen interactive NFC scanner and quick-tap digital badges** for:
    - 🔧 **Plumbers** (e.g., Rajesh Kumar, Dilip Verma)
    - 💡 **Electricians** (e.g., Suresh Sharma, Amit Mukherjee)
    - 🪚 **Carpenters** (e.g., Mohan Lal Mistri)
    - ❄️ **AC & Water Cooler Technicians** (e.g., Vikram Singh)
    - 🐜 **Pest Control Specialists** (e.g., Deepak Rao)
    - 🧱 **Civil & Masonry Workers** (e.g., Santosh Maurya)
  - **Barcode & RFID USB/Bluetooth Scanner Input**: Compatible with physical desktop RFID badge scanners that output keystrokes.
- **Automated Check-In / Check-Out**:
  - Tapping an off-duty badge triggers **Check-In**, allowing assignment of room or wing (e.g., "Wing B - Room 204") and work notes.
  - Tapping an on-duty badge triggers **Check-Out**, calculating exact shift duration (e.g., "42 minutes") and saving the entry into the permanent audit ledger.
- **CSV Shift Ledger Export**: Download maintenance staff shift reports with timestamps, durations, and notes for administration.

### 3. 🍲 Live Mess Timings & Dining Countdown
- **Dynamic Real-Time Status**: Automatically detects whether the dining hall is currently open or closed.
- **Live Countdown Timer & Visual Progress**: Shows remaining time until meal closes or countdown until the next meal service begins.
- **Weekday vs. Weekend Modes**: Seamless toggle between standard and weekend dining hours.
- **Full Daily Menu Display**: Highlights menu items for Breakfast, Lunch, High Tea, and Dinner.

### 4. 🧺 Laundry Timetable & Machine Status Board
- **Day-Wise Allocation**: Automatic detection of the current day of the week, highlighting active wings and floors (e.g., "Today: 2nd & 3rd Floor, Wings A & B").
- **Interactive Washing Machine Board**: Live status for 8 commercial washers with countdown timers, "Start 35-min Cycle", and "Reset / Finish" touch controls.

### 5. 👥 Warden Directory & Smartphone QR Sync
- **Administrative Contacts**: Chief Warden, Assistant Warden (Admin), Assistant Warden (Mess), and 24x7 Caretaker Desk.
- **Direct Touch Actions**: Immediate `tel:` phone call dialing, WhatsApp direct chat, and `mailto:` email links.
- **Mobile QR Code Generator**: Generates an on-screen QR code so students standing in front of the kiosk can scan the warden's number directly into their smartphones.

### 6. 🚨 Emergency Helplines & SOS Hub
- **Prominent 24/7 Helplines**: Bhawan Guard Desk, Campus Health Centre & Ambulance, Campus Security Control Room, Fire Safety, Women's Helpline, and Electrical/Water breakdown services.
- **1-Tap Quick SOS**: Header quick-access button with high-contrast emergency dial cards.
- **Tablet SOS Siren Test**: Web Audio siren tone generator for rapid alert testing.

### 7. ⚙️ Semester Administration Portal ("Updated Once a Semester")
- **PIN-Protected Admin**: Unlock with PIN (default: `1234`).
- **All-in-One Configuration**:
  - Update semester title, dates, and hostel details.
  - Edit warden names, phone numbers, visiting hours, and offices.
  - Adjust mess opening and closing times.
  - Modify laundry floor allocations.
  - Update emergency numbers.
  - Register new workers or update NFC card UIDs.
- **Persistence & Portability**: Automatically saved to `localStorage`, with full JSON Export and Import capabilities.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Development
```bash
npm install
npm run dev
```

### Production Build & Preview
```bash
npm run build
npm run preview
```

The compiled static assets are located in the `dist/` directory and can be hosted on any web server or kiosk display system.
