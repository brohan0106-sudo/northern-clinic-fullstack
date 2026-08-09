# Northern Medical Clinic System — System Features & Use Cases Verification Report

**Report Date**: August 9, 2026  
**System Architecture**: Full-Stack Express.js Node.js Application + MongoDB Atlas (`mongodb+srv://brohan0106_db_user:...@northernclinic01.hb21qmr.mongodb.net/northern_clinic`) + Vercel Serverless Functions  
**Security Standard**: Role-Based Access Control (RBAC), Multi-Factor Authentication (MFA), Stateless JWT Sessions, Immutable Security Audit Logging  

---

## 1. Executive Summary

The Northern Medical Clinic Enterprise System is a production-grade clinic management platform engineered to handle full clinical, front-desk, financial, and patient care lifecycles. All 16 database collections are fully integrated with **MongoDB Atlas** and mirrored in local persistence stores with zero data loss.

---

## 2. Complete Role-Based Use Case & Feature Matrix

### 2.1 Receptionist Role (`r.nguyen`)
- **Consolidated Dashboard & Check-In Roster**:
  - Merges daily schedule, live patient arrival counter, and 1-click check-in roster onto a single streamlined view.
  - Calendar view removed per operational workflow specification.
  - **Live Check-In Action**: Clicking `Check In` updates the patient's status to `Checked in` live across all devices for attending doctors.
- **Patient Registration**:
  - Full demographic intake with automated duplicate lookup (`/api/register/lookup`) by Full Name and Date of Birth.
  - Generates unique patient Medical Record Numbers (MRN).
- **Insurance Verification**:
  - View patient health fund policies with masked policy numbers.
  - Update policy verification status (`Pending` ➔ `Verified`) with instant action notes (`Coverage verified by reception staff`).
- **6-Step Care Workflow Stepper**:
  - Direct access to execute patient care stages from Appointment through Payment settlement.
- **Consultants Directory**:
  - Access consultant schedules, specializations, and working hours.
- **Secure Messaging**:
  - Direct communication channel with attending clinical staff.

---

### 2.2 Doctor / Clinician Role (`dr.osei`, `dr.ibrahim`, `dr.nasser`)
- **Patient Roster & History Tracking**:
  - Access patient files with default MRN masking.
  - **PHI Unmasking with Re-Authentication**: Unmasking sensitive patient MRNs requires secondary password verification and logs a `PHI viewed` security audit event.
- **Medical Records & Vitals**:
  - View and record clinical progress notes, ICD diagnoses, blood pressure (BP), and pulse vitals.
- **e-Prescription (Rx) Issuance**:
  - Issue digital prescriptions specifying medication name, dosage, duration, and refill counts (`/api/medical-records/prescriptions`).
- **5-Field Discharge Summaries**:
  - Mandatory 5-field completion enforced server-side:
    1. Chief complaint
    2. Findings & diagnosis
    3. Therapy administered & response
    4. Recommendations on discharge
    5. Lab & Diagnostic Test Results
  - Includes quick auto-fill presets for Acute Bronchitis, Chest Pain, and Hypertension.
- **Security Audit Logs Drawer & Live Stream**:
  - Access live security feed displaying authentication events, PHI views, and access denials.
  - Auto-polls every 4 seconds for live multi-device streaming.
- **6-Step Care Workflow Stepper**:
  - Advance patient cases through treatment, clinical note entry, and invoice initiation.

---

### 2.3 Billing Specialist Role (`k.patel`)
- **Insurance Claims Pipeline**:
  - Submit new itemized insurance claims (`POST /api/claims` / `POST /api/billing/claims`) with procedure codes and health fund selection.
  - Export claims pipeline data directly to Excel spreadsheets (`claims_export.xlsx`).
- **Invoice Generation**:
  - Generate itemized consultation and procedure invoices (`POST /api/billing/invoices`) with subtotal calculations, health fund share, and patient co-pay breakdowns.
- **Payment Tracking & Receipt Settlement**:
  - Record payment receipts (`POST /api/billing/payments`) via EFTPOS, Cash, Medicare Direct EFT, or Health Fund Settlement.
  - Auto-settles matching invoice status to `Paid`.
- **Financial Analytics & Reports**:
  - Generate Monthly Revenue Summaries, Claims Ageing Reports, and Payer Performance summaries.

---

### 2.4 System Administrator Role (`admin.user`)
- **Users & Role-Based Access Control (RBAC)**:
  - Create staff user accounts and manage permissions.
  - **Automated Account Lockout**: System automatically locks user accounts after 5 failed login attempts (`ACCOUNT_LOCK_THRESHOLD = 5`) for 15 minutes. Admin can manually lock/unlock accounts.
- **Department Administration**:
  - Register medical departments, assign department heads, floors, and extension numbers.
- **Consultant Registration**:
  - Register new specialist doctors, assign consultation fees, and set working days.
- **System Settings**:
  - Configure clinic operational settings, session inactivity timeouts, and enforce MFA policy.
- **Strict RBAC Enforcement**:
  - Admin access to Audit Logs and Discharge Summaries is strictly restricted per security policy guidelines.

---

### 2.5 Patient Portal Role (`m.alvarez`, `t.nguyen`, `s.haddad`)
- **Self-Service Appointment Booking**:
  - Book visits with specialists (`POST /api/my/appointments`).
  - **Double-Booking Prevention**: Server-side validation prevents scheduling conflicts on taken clinician time slots.
- **My Medical History**:
  - Access personal clinical records, known allergies, and demographic details.
- **My Billing & Claims**:
  - Track personal claims status and outstanding co-pay balances.
- **Direct Messaging**:
  - Secure communication channel with care team.

---

## 3. 6-Step Clinical Lifecycle Stepper

The system implements the complete 6-step medical clinic lifecycle:

| Step | Stage Name | Action Executed by System |
| :--- | :--- | :--- |
| **Step 1** | **Appointment** | Patient booking recorded in roster. |
| **Step 2** | **Treatment** | Patient arrival checked in; clinical notes & vitals attached to medical record. |
| **Step 3** | **Invoice** | Itemized invoice generated with subtotal, insurer reimbursement, and co-pay. |
| **Step 4** | **Insurance Claim** | Health fund claim submitted to insurer (e.g. Medibank, Medicare, Bupa). |
| **Step 5** | **Claim Approval** | Insurer claim verified and marked as `Paid`. |
| **Step 6** | **Payment** | Patient co-pay settled; invoice status set to `Paid`; case marked `Completed`. |

---

## 4. Database & Synchronization Audit

- **MongoDB Atlas Synchronization**:
  - All 16 collections (`users`, `patients`, `doctors`, `departments`, `appointments`, `medicalRecords`, `prescriptions`, `insuranceCompanies`, `insurancePolicies`, `claims`, `invoices`, `payments`, `billingStatements`, `messages`, `auditLogs`, `dischargeSummaries`) are connected to MongoDB Atlas.
- **Multi-Device Synchronization**:
  - Updates performed on Device A (e.g. Reception check-in, Insurance verification, Claim submission) are written to MongoDB Atlas and polled by Device B within 4 seconds.

---

## 5. Security & Mobile Responsiveness Verification

- **Stateless MFA (2FA)**:
  - MFA challenge tokens (`tempToken`) are cryptographically signed JWTs, ensuring 100% serverless compatibility across Vercel lambda instances.
- **Mobile Responsiveness**:
  - Fully responsive layouts (`public/styles.css`) for smartphones, tablets, and desktops.
  - Horizontal scrolling tables, collapsible sidebar navigation, and full-screen Audit Drawer for mobile touch screens.
