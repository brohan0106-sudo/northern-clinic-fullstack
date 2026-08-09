# Northern Medical Clinic System — Live Demonstration & Feature Walkthrough Playbook

**Document Path**: `specs/live_demonstration_guide.md`  
**Purpose**: Comprehensive step-by-step presentation guide for demonstrating the modernized Northern Medical Clinic platform, Role-Based Access Controls (RBAC), live Security Audit Logging, and technical features upgraded from legacy systems.

---

## 1. Executive Summary & Legacy System Upgrades

### Legacy System Shortcomings vs. Modernized Architecture

| Legacy Clinic System | Modernized Northern Medical Clinic System |
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

### 🎭 SCENE 2: Receptionist Workflow — Patient Intake & Insurance Verification

**Objective**: Demonstrate patient intake, duplicate prevention, Patient Portal account auto-provisioning, and front-desk check-in.

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
   - Patient file is saved to MongoDB Atlas.
   - **Patient Portal User Account Auto-Provisioned**: System displays toast notification:  
     *"Patient file created! Patient Portal login: Username 'jessica.williams', Password 'Clinic#2026'"*.
   - Patient does **not** need to sign up again.
   - Page automatically redirects to **Patient Roster & Search** (`#/patients`).

#### Step 2.2: Perform Arrival Check-In
1. Navigate to **Dashboard & Check-In Roster** (`#/dashboard`).
2. Locate scheduled patient in today's roster. Click **Check In**.
3. **What happens**: Patient status updates live to `Checked in` for attending clinicians.

#### Step 2.3: Verify Patient Health Fund Coverage
1. Navigate to **Insurance Verification** (`#/insurance`).
2. Locate pending insurance policy (e.g. `T. Nguyen — Bupa`).
3. Click **Verify & Resolve**.
4. **What happens**: Policy status changes from `Pending` to `Verified` with verification notes logged to audit.

---

### 🎭 SCENE 3: Clinician Workflow — PHI Unmasking, Clinical Notes & 5-Field Discharge

**Objective**: Demonstrate clinical vitals recording, e-Prescriptions, password re-authentication for unmasking MRNs, and discharge summaries.

#### Step 3.1: Password Re-Authentication for Unmasking PHI
1. Log in as Doctor `dr.osei` (Password: `Clinic#2026`, MFA Code: `123456`).
2. Navigate to **Patient Roster** (`#/patients`).
3. Point out that all MRNs are masked by default (`••••482`).
4. Click **Show** next to `M. Alvarez`.
5. Enter password `Clinic#2026` and click **Confirm Password**.
6. **What happens**: Unmasks patient MRN `#4482` and generates a `PHI viewed` security audit log entry.

#### Step 3.2: Record Vitals & Clinical Progress Notes
1. Navigate to **Medical Records** (`#/medical-records`).
2. Fill out **Record Vitals & Progress Note** form:
   - **Patient Name**: `Jessica Williams`
   - **ICD Diagnosis**: `Acute Bronchitis (ICD J20)`
   - **Blood Pressure**: `124/82 mmHg`
   - **Pulse**: `76 bpm`
   - **Clinical Progress Note**: `Patient presenting with productive cough. Lungs clear on auscultation.`
3. Click **Save Clinical Record**.

#### Step 3.3: Issue 5-Field Discharge Summary
1. Navigate to **Discharge Summary** (`#/discharge`).
2. Click quick preset button **Acute Bronchitis**.
3. **What to point out**: All 5 mandatory clinical fields auto-populate (Chief Complaint, Findings, Therapy, Recommendations, Lab Results).
4. Click **Save & Sign Off**.

---

### 4. SCENE 4: Billing Specialist Workflow — Claims, Invoices & Payments

**Objective**: Demonstrate financial operations, claims pipeline export, invoice generation, and payment receipts.

1. Log in as Billing Specialist `k.patel` (Password: `Clinic#2026`, MFA Code: `123456`).
2. Navigate to **Claims & Insurance** (`#/claims`).
3. Click **Export Claims Spreadsheet** to download `claims_export.xlsx`.
4. Click **Submit Insurance Claim**, enter Patient `Jessica Williams`, Payer `Medibank`, Amount `$195.00`, and click **Submit Claim**.
5. Navigate to **Invoice Generation** (`#/billing`). Generate an invoice specifying Subtotal `$195.00` and Insurer Share `$146.25`.
6. Navigate to **Payment Tracking** (`#/payments`). Record EFTPOS payment receipt for `$48.75`.

---

### 🎭 SCENE 5: System Administrator Workflow & RBAC Isolation

**Objective**: Demonstrate administrative controls, user account lockouts, and strict operational role boundaries.

1. Log in as System Admin `admin.user` (Password: `Clinic#2026`, MFA Code: `123456`).
2. Navigate to **Users & Roles (RBAC)** (`#/users`).
3. Show account lockout controls (System automatically locks accounts after 5 failed login attempts for 15 minutes; Admin can manually toggle lock/unlock).
4. Navigate to **Consultants Directory** (`#/consultants`). Show that **only** System Admin has access to register new specialist consultants (`Register New Consultant`).
