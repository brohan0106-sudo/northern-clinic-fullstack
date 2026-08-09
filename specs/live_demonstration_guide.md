# Northern Medical Clinic System — Live Demonstration & Presentation Playbook

**Document Path**: `specs/live_demonstration_guide.md`  
**Purpose**: Comprehensive step-by-step presentation script for demonstrating the modernized Northern Medical Clinic platform, Role-Based Access Controls (RBAC), live Security Audit Logging, and real-time clinical workflows.

---

## 1. Executive Overview & Legacy System Upgrades

### Legacy System Shortcomings vs. Modernized Architecture

| Legacy Clinic Software | Modernized Northern Medical Clinic Enterprise System |
| :--- | :--- |
| **Monolithic File System / Single PC** | **Cloud-Native REST API + MongoDB Atlas Synchronization** |
| **Static Hardcoded Access** | **Role-Based Access Control (RBAC)** across 5 distinct user roles |
| **No Authentication Audit** | **Stateless 2FA/MFA (JWT)** + **Immutable Security Audit Log** |
| **Manual Paper Patient Intake** | **Automated Intake** with instant duplicate detection & Patient Portal auto-provisioning |
| **Unprotected Medical Records** | **Default MRN Masking** with compulsory password re-authentication for PHI unmasking |
| **Desktop-Only View** | **Fully Mobile-Responsive UI** for tablets, touchscreens, and smartphones |

---

## 2. Complete Step-by-Step Live Demonstration Script

### 🎭 SCENE 1: Security Audit Logging & Triggering Security Denials (`DENY`)

**Objective**: Demonstrate how real-time security events, access denials, and PHI views are recorded and auto-streamed to staff devices.

#### Step 1.1: Trigger a Failed Password Denial Log
1. Go to the Sign-In page (`https://northern-clinic-fullstack.vercel.app`).
2. Enter Username: `dr.osei` and Password: `WrongPassword123`. Click **Continue**.
3. **What happens**: System rejects credential check and logs a security denial (`Login failed — incorrect password`).

#### Step 1.2: Trigger a Double-Booking Conflict Denial Log
1. Log in as Patient `m.alvarez` (Password: `Clinic#2026`, MFA Code: `123456`).
2. Navigate to **My Appointments** (`#/myappointments`).
3. Select **Dr. A. Osei** and Time Slot **9:00 AM** (which is already booked). Click **Confirm Appointment Booking**.
4. **What happens**: System rejects double-booking with error *"That slot is already booked"* and logs an audit denial (`Booking rejected — Dr. A. Osei / 9:00 AM already taken`).

#### Step 1.3: Trigger a PHI Unmasking Re-Authentication Failure Denial Log
1. Log in as Doctor `dr.osei` (Password: `Clinic#2026`, MFA Code: `123456`).
2. Navigate to **Patient Roster** (`#/patients`).
3. Click **Show** next to a masked MRN (`••••482`).
4. Enter password `WrongPass` in the re-authentication popup and click **Confirm Password**.
5. **What happens**: System denies unmasking and logs audit denial (`Re-authentication failed while attempting to reveal MRN`).

#### Step 1.4: View the Live Security Audit Logs Feed
1. Log in as any Hospital Staff user (Admin `admin.user`, Reception `r.nguyen`, Clinician `dr.osei`, or Billing `k.patel`).
2. Click the **Security Audit Shield Icon** (`#btnAudit`) in the top navigation bar, or navigate to **Security Audit Logs** (`#/audit-logs`).
3. **What to point out to audience**:
   - The newest events appear immediately at the top of the feed.
   - Red chips mark **`deny`** events (Failed passwords, double-bookings, invalid unmask attempts).
   - Teal/Green chips mark **`auth`** and **`access`** events (MFA logins, PHI unmasking, patient intake).
   - Auto-updates every **4 seconds** across multiple open browser windows.

---

### 🎭 SCENE 2: Receptionist Workflow — Patient Intake & Arrival Check-In

**Objective**: Demonstrate patient intake, duplicate prevention, Patient Portal account auto-provisioning, and queue transition upon check-in.

#### Step 2.1: Register a New Patient
1. Log in as Receptionist `r.nguyen` (Password: `Clinic#2026`, MFA Code: `123456`).
2. Click **Register Patient** (`#/add-patient`) in the sidebar.
3. Fill out patient demographics:
   - **Full Name**: `Jessica Williams`
   - **Date of Birth**: `14 Nov 1996`
   - **Contact Number**: `0412 999 888`
   - **Known Allergies**: `Penicillin`
   - **Emergency Contact**: `Mark Williams (0412 888 777)`
4. Click **Register Patient**.
5. **What to point out**:
   - Patient file is saved to memory and MongoDB Atlas.
   - **Patient Portal User Account Auto-Provisioned**: System displays toast notification:  
     *"Patient file created! Patient Portal login: Username 'jessica.williams', Password 'Clinic#2026'"*.
   - Page automatically redirects to **Patient Roster & Search** (`#/patients`).

#### Step 2.2: Perform Arrival Check-In & Queue Transfer
1. Navigate to **Dashboard & Check-In Roster** (`#/dashboard`).
2. Locate scheduled patient in today's pending waiting roster. Click **Check In**.
3. **What to point out**:
   - Patient status changes to `Checked in`.
   - Patient automatically **disappears from Receptionist's waiting list** and moves into the **Doctor's Consultation Queue**.

#### Step 2.3: Verify Patient Health Fund Coverage
1. Navigate to **Insurance Verification** (`#/insurance`).
2. Locate pending insurance policy (e.g. `T. Nguyen — Bupa`). Click **Verify & Resolve**.
3. Policy status updates to `Verified` with action notes logged to audit.

---

### 🎭 SCENE 3: Clinician Workflow — Consultation Queue, Auto-Fill Discharge & Messaging

**Objective**: Demonstrate Doctor Consultation Queue, auto-filling patient name in discharge summary, and private doctor-patient messaging.

#### Step 3.1: Doctor Consultation Queue & Auto-Fill Discharge Summary
1. Log in as Doctor `dr.osei` (Password: `Clinic#2026`, MFA Code: `123456`).
2. On **Doctor Dashboard** (`#/dashboard`), locate **Checked-In Patients Queue**.
3. Click **Start Consultation / Discharge** for patient `M. Alvarez`.
4. **What to point out**:
   - System navigates to **Discharge Summary** (`#/discharge?patient=M.%20Alvarez`).
   - The **patient's name (`M. Alvarez`) is automatically pre-selected and auto-filled** in the `#dxPatient` dropdown.
5. Click quick preset button **Acute Bronchitis** (auto-populates all 5 mandatory fields). Click **Save & Sign Off**.
6. **What to point out**: Signing off the discharge summary **automatically generates an itemized Care Invoice** (`INV-2026-...`) for the patient.

#### Step 3.2: Secure Doctor-Patient Messaging
1. Navigate to **Secure Messaging** (`#/messages`).
2. Open patient message thread `M. Alvarez`.
3. Send follow-up advice: *"Your troponin lab results are clear. Continue prescribed therapy."*
4. Log in as Patient `m.alvarez` $\rightarrow$ navigate to **Messaging** (`#/mymessages`) to view doctor's message in private thread.

---

### 🎭 SCENE 4: Patient Portal & Billing — Claims, Invoices & Payment Options

**Objective**: Demonstrate patient billing options, MRN dropdown selection, and settlement.

#### Step 4.1: Patient Invoice Options
1. Log in as Patient `m.alvarez`. Navigate to **My Claims & Billing** (`#/mybilling`).
2. Show active itemized invoice displaying Total Fee `$180.00`, Health Fund Share `$135.00`, and Copay `$45.00`.
3. Demonstrate 2 Action Buttons:
   - **File Insurance Claim**: Submits claim to Medibank/Medicare.
   - **Pay Copay ($45.00)**: Direct card payment for remaining balance.

#### Step 4.2: Billing Specialist Operations
1. Log in as Billing Specialist `k.patel` (Password: `Clinic#2026`, MFA Code: `123456`).
2. Navigate to **Claims & Insurance** (`#/claims`). Click **Export to Excel** (`claims_export.xlsx`).
3. Click **Submit New Insurance Claim** $\rightarrow$ select patient using **Patient Name + MRN Dropdown** (`M. Alvarez (MRN: #4482)`). Click **Submit Claim**.
4. Navigate to **Payment Tracking** (`#/payments`) $\rightarrow$ record EFTPOS payment receipt using MRN dropdown selector.

---

### 🎭 SCENE 5: Care Stepper & System Administration

**Objective**: Demonstrate live 6-step care stepper calculation and admin account controls.

1. Navigate to **Care Workflow Stepper** (`#/workflow`). Point out that the 6-step status (`1. Appointment` $\rightarrow$ `2. Arrival Check-In` $\rightarrow$ `3. Discharge & Invoice` $\rightarrow$ `4. Claim Filed` $\rightarrow$ `5. Claim Approval` $\rightarrow$ `6. Payment Settled`) calculates automatically from real system operations.
2. Log in as Admin `admin.user`. Show user lockout management (`#/users`) and consultant registration (`#/consultants`).
