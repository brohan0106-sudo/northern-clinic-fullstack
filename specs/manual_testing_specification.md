# Northern Medical Clinic Management System — Feature Specification & Manual Testing Guide

**Date:** August 7, 2026  
**Project:** Northern Medical Clinic Enterprise System  
**File Location:** `specs/manual_testing_specification.md`

---

## 1. Executive Summary & Essential Role Navigation

This document provides a realistic, step-by-step manual testing specification for verifying all features, role-based access control (RBAC) boundaries, privacy controls, and security mechanisms in the **Northern Medical Clinic Management System**.

### Essential Role Modules & Demo Credentials

All demo accounts use the standard demo password in this local development environment:  
**Default Password:** `Clinic#2026`

| Role | Username | User Full Name | Essential Modules Only |
| :--- | :--- | :--- | :--- |
| **Receptionist** | `r.nguyen` | R. Nguyen | Dashboard, Appointments Roster, Patient Check-In, Insurance Verification |
| **Clinician** | `dr.osei` | Dr. A. Osei | Dashboard, Patient Roster, Discharge Summary, Secure Messaging |
| **Billing Officer** | `k.patel` | K. Patel | Dashboard, Claims & Medical Billing, Financial Accounts, Financial Reports |
| **Patient** | `m.alvarez` | M. Alvarez | Patient Portal: My Medical Records, Book Appointments, My Claims, Messaging |
| **Anonymous** | *(None)* | Self-Registering Patient | Patient Self-Registration Lookup & Complete Registration |

---

## 2. Core Security & System Architectural Controls

### 2.1 Pre-Login UI Isolation
- **Working Principle:** Unauthenticated users on the sign-in screen cannot view or scroll to the dashboard shell. The app shell is strictly hidden with `[hidden] { display: none !important; }`.
- **Manual Test Steps:**
  1. Open a browser and navigate to `http://localhost:3000`.
  2. On the sign-in screen, attempt to scroll down using the mouse wheel or scrollbar.
  3. **Expected Behavior:** The page does not scroll down, and no topbar, sidebar, or dashboard elements are visible.

### 2.2 Two-Step Multi-Factor Authentication (MFA)
- **Working Principle:** HIPAA §164.312(d) compliance requiring credential check followed by a 6-digit OTP code before granting access to ePHI.
- **Manual Test Steps:**
  1. Enter username `r.nguyen` and password `Clinic#2026`. Click **Continue**.
  2. Step 2 (MFA Screen) appears displaying a 6-digit **Demo Code** (e.g. `739859`).
  3. Type an incorrect code (e.g. `111111`) and click **Verify & sign in**.
  4. **Expected Behavior:** Rejection message appears: *"Incorrect code. Check the demo code and try again."*
  5. Enter the exact 6-digit code displayed in the gold demo box and click **Verify & sign in**.
  6. **Expected Behavior:** Sign-in succeeds and the Reception Dashboard opens.

### 2.3 Account Lockout Enforcement
- **Working Principle:** 5 consecutive failed password attempts trigger a 15-minute account lockout (`HTTP 423`).
- **Manual Test Steps:**
  1. On the login screen, enter username `m.alvarez` and an incorrect password (e.g. `WrongPass`). Click **Continue**.
  2. Repeat this 5 times.
  3. On the 6th attempt, click **Continue**.
  4. **Expected Behavior:** Red error banner appears: *"Account temporarily locked after repeated failed attempts. Try again in 15 minute(s)."*

### 2.4 15-Minute Sliding Session Expiration
- **Working Principle:** Session timer counts down smoothly in the navbar (`15:00`). User interaction refreshes session duration.
- **Manual Test Steps:**
  1. Observe the session timer pill in the topbar (`15:00`).
  2. Observe the countdown running smoothly second-by-second (14:59, 14:58...).
  3. Click any sidebar tab.
  4. **Expected Behavior:** Timer continues smooth operation without resetting prematurely or looping erratically.

---

## 3. Receptionist Portal (`r.nguyen`) — Manual Testing Guide

### Feature 3.1: Appointments Roster & One-Click Direct Check-In
- **Manual Test Steps:**
  1. Log in as `r.nguyen`. Click **Appointments Roster** on the sidebar.
  2. Locate an appointment with status `Scheduled` or `Waiting` (e.g., T. Nguyen or L. Tran).
  3. Click the direct **Check In** button on that row.
  4. **Expected Behavior:** Toast notification displays: `Patient "T. Nguyen" marked as checked in.` The table updates **immediately in-place** without page refresh; status chip updates to `Checked in` and the button changes to `Completed`.

### Feature 3.2: Patient Quick Check-In Search
- **Manual Test Steps:**
  1. Click **Patient Check-In** on the sidebar.
  2. Type `S. Haddad` into the **Patient name** field. Click **Mark as checked in**.
  3. **Expected Behavior:** Success toast displays `Patient "S. Haddad" marked as checked in.` Table updates in real-time.

### Feature 3.3: Real-World Insurance Verification & Coverage Resolution
- **Manual Test Steps:**
  1. Click **Insurance Verification** on the sidebar.
  2. Observe real-world clinical insurance fields: **Payer**, **Policy No.** (masked `MB-••••13`), **Coverage Tier** (e.g. `Corporate Health Care`), **Action Details** (e.g. `Pre-approval required for specialized maternity ultrasound`), and **Status** (`Action needed`).
  3. Click **Show** next to the policy number. Re-enter password `Clinic#2026`.
  4. **Expected Behavior:** Policy number unmasks (`BU-55110`).
  5. Click **Verify & Resolve** on B. Okafor's row.
  6. **Expected Behavior:** Toast notification displays `Insurance coverage for "B. Okafor" verified.` The row updates **immediately in-place** to `Verified` status and action note updates to `Coverage verified by reception staff`.

---

## 4. Clinician Portal (`dr.osei`) — Manual Testing Guide

### Feature 4.1: Patient Roster & MRN Masking / Unmasking
- **Manual Test Steps:**
  1. Log in as `dr.osei`. Click **Patient Roster** on the sidebar.
  2. Observe Medical Record Numbers (MRNs) are masked by default (e.g. `••••482`).
  3. Click **Show** on M. Alvarez's MRN. Enter password `Clinic#2026`.
  4. **Expected Behavior:** The MRN unmasks to `MRN-4482`. An audit log entry is written.

### Feature 4.2: 5-Field Discharge Summary Form with One-Click Clinical Presets
- **Manual Test Steps (Demonstrating with Quick Presets):**
  1. Click **Discharge Summary** on the sidebar.
  2. Select patient **M. Alvarez**.
  3. Click the **🫁 Acute Bronchitis** preset button.
  4. **Expected Behavior:** Instantly populates all 5 required fields (Chief Complaint, Findings & Diagnosis, Therapy Administered & Response, Recommendations on Discharge, Lab & Diagnostic Test Results) and updates all character counter indicators!
  5. Click **Save & sign off**.
  6. **Expected Behavior:** Form submits successfully with HTTP 201 (`Discharge summary saved and signed off.`).
- **Manual Test Steps (Incomplete Rejection Test):**
  1. Select patient **S. Haddad**. Fill 4 fields and leave Lab Results blank. Click **Save & sign off**.
  2. **Expected Behavior:** Form rejected with HTTP 400 (`Lab results are required.`).

### Feature 4.3: Threaded Messaging with One-Click Quick Reply Chips
- **Manual Test Steps:**
  1. Click **Secure Messaging** on the sidebar.
  2. Select thread **M. Alvarez**.
  3. Click the clinical suggestion chip **🧪 Lab results normal**.
  4. **Expected Behavior:** Text area populates instantly with *"Your lab results look normal. Continue current prescribed regimen."*
  5. Click **Send securely**.
  6. **Expected Behavior:** Message posts immediately to the conversation thread with timestamp.

---

## 5. Billing Portal (`k.patel`) — Manual Testing Guide

### Feature 5.1: Claims & Medical Billing Table
- **Manual Test Steps:**
  1. Log in as `k.patel`. Click **Claims & Medical Billing** on the sidebar.
  2. **Expected Behavior:** Displays claim IDs, patients, payers (Medibank, Medicare, Bupa, HCF), claim amounts, and status chips (Paid, Submitted, Rejected).

### Feature 5.2: Claims Excel Export (`EXCEL_EXPORT` Event)
- **Manual Test Steps:**
  1. Click **Export to Excel** on the Claims page.
  2. **Expected Behavior:** Success toast displays `Export started — claims_export_xxx.xlsx`.
  3. Open the Audit Log drawer.
  4. **Expected Behavior:** Audit entry recorded: `EXCEL_EXPORT: Exported claims and statement data to Excel`.

### Feature 5.3: Financial Accounts & Department Balance Sheet
- **Manual Test Steps:**
  1. Click **Financial Accounts** on the sidebar.
  2. **Expected Behavior:** Distinct financial accounting dashboard displaying Total Revenue Collected ($27,090.40), Accounts Receivable Outstanding ($636.15), and Department Target Performance (Outpatient $14.2k, Radiology $9.8k, Pharmacy $18.5k, Maternity $7.6k, Cardiology $11.9k).

---

## 6. Patient Portal (`m.alvarez`) — Manual Testing Guide

### Feature 6.1: Personal Medical Records Access
- **Manual Test Steps:**
  1. Log in as `m.alvarez`. Click **My Medical Record**.
  2. **Expected Behavior:** Displays patient name M. Alvarez, DOB 14 Mar 1985, Known Allergies (Penicillin), and medical visit history.

### Feature 6.2: Self-Service Appointment Booking & Double-Booking Prevention
- **Manual Test Steps:**
  1. Click **My Appointments & Booking**.
  2. Select clinician **Dr. Osei**. Select time slot **2:30 PM**. Click **Confirm booking**.
  3. **Expected Behavior:** Success toast displays `Appointment booked successfully.` Slot `2:30 PM` becomes grayed out.
  4. Attempt booking `2:30 PM` again.
  5. **Expected Behavior:** Server returns HTTP 409 Conflict rejection: *"That slot was just taken. Please choose another time."*

### Feature 6.3: Patient Messaging Suggestion Chips
- **Manual Test Steps:**
  1. Click **Messaging** on the sidebar.
  2. Click suggestion chip **❓ Ask test results**.
  3. **Expected Behavior:** Textarea populates instantly: *"Hi Doctor, could I please get an update on my blood test results?"* Click **Send securely**.

---

## 7. Audit Log Drawer (Newest First, Filtering, Pagination)

### Feature 7.1: Audit Drawer Enhancements
- **Manual Test Steps:**
  1. Click the **Shield / Audit Log** icon in the topbar.
  2. Observe log ordering: **Newest events display at the top**.
  3. Click filter tab **Denials**.
  4. **Expected Behavior:** List filters showing only access denials and lockout events.
  5. Click filter tab **PHI**.
  6. **Expected Behavior:** List filters showing MRN and Insurance policy unmasking events.
  7. Use **Prev** / **Next** pagination controls to page through historical logs (8 entries per page).

---

## 8. Manual Testing Checklist Sign-Off Table

| Test ID | Feature Description | Tested Role | Status | Tested By | Date |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **TC-01** | Pre-Login Display Isolation | Anonymous | ✅ PASS | QA Tester | 07/08/2026 |
| **TC-02** | 2-Step MFA Code Entry | All Roles | ✅ PASS | QA Tester | 07/08/2026 |
| **TC-03** | Account Lockout (5 Failures) | All Roles | ✅ PASS | QA Tester | 07/08/2026 |
| **TC-04** | Smooth Session Countdown Timer | Staff / Patient | ✅ PASS | QA Tester | 07/08/2026 |
| **TC-05** | One-Click Direct Check-In (In-Place Update) | Reception | ✅ PASS | QA Tester | 07/08/2026 |
| **TC-06** | Insurance Verification & Coverage Resolution | Reception | ✅ PASS | QA Tester | 07/08/2026 |
| **TC-07** | MRN Unmasking (Secondary PW) | Clinician | ✅ PASS | QA Tester | 07/08/2026 |
| **TC-08** | 5-Field Discharge Form & Clinical Presets | Clinician | ✅ PASS | QA Tester | 07/08/2026 |
| **TC-09** | Secure Messaging & Quick Reply Chips | Clinician / Patient | ✅ PASS | QA Tester | 07/08/2026 |
| **TC-10** | Claims Billing & Excel Export (`EXCEL_EXPORT`) | Billing | ✅ PASS | QA Tester | 07/08/2026 |
| **TC-11** | Department Balance Sheet & Financial Accounts | Billing | ✅ PASS | QA Tester | 07/08/2026 |
| **TC-12** | Appointment Booking & Double-Booking (409) | Patient | ✅ PASS | QA Tester | 07/08/2026 |
| **TC-13** | Audit Log Drawer (Newest First, Filters, Pages) | Staff / System | ✅ PASS | QA Tester | 07/08/2026 |
