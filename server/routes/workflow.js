const express = require('express');
const { v4: uuid } = require('uuid');
const { readAll } = require('../store');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

// GET /api/workflow/cases — Automatic real-time status calculated from real system actions
router.get('/cases', (req, res) => {
  const data = readAll();
  const cases = (data.appointments || []).map(appt => {
    const inv = (data.invoices || []).find(i => (i.patientName || '').toLowerCase() === (appt.patient || '').toLowerCase());
    const claim = (data.claims || []).find(c => (c.patient || '').toLowerCase() === (appt.patient || '').toLowerCase());
    const pay = (data.payments || []).find(p => (p.patientName || '').toLowerCase() === (appt.patient || '').toLowerCase() || (inv && p.invoiceId === inv.id));
    const dx = (data.dischargeSummaries || []).find(d => (d.patientName || '').toLowerCase() === (appt.patient || '').toLowerCase());

    let currentStep = 1; // 1: Appointment Booked
    let stepDescription = 'Appointment Booked — Awaiting Arrival at Front Desk';

    if (appt.status === 'Checked in' || appt.status === 'In Consultation') {
      currentStep = 2; // 2: Arrived & Checked In by Reception
      stepDescription = 'Checked In by Reception — Waiting in Doctor Consultation Queue';
    }

    if (dx || inv) {
      currentStep = 3; // 3: Treatment & Discharge Invoice Issued
      stepDescription = `Discharge Summary Signed — Invoice ${inv ? inv.id : ''} Issued ($${inv ? inv.subtotal.toFixed(2) : '180.00'})`;
    }

    if (claim) {
      currentStep = 4; // 4: Insurance Claim Filed by Patient
      stepDescription = `Health Fund Claim ${claim.id} Filed — Pending Policy Verification`;
    }

    if (claim && (claim.status === 'Approved' || claim.status === 'Paid')) {
      currentStep = 5; // 5: Claim Verified by Reception & Approved by Billing
      stepDescription = `Insurance Coverage Verified & Claim ${claim.id} Approved`;
    }

    if (pay || (inv && inv.status === 'Paid')) {
      currentStep = 6; // 6: Payment Settled & Case Closed
      stepDescription = 'Patient Copay & Total Bill Settled — Case Completed';
    }

    return {
      caseId: appt.id,
      patient: appt.patient,
      clinician: appt.clinician,
      time: appt.time,
      currentStep,
      stepName: ['1. Appointment', '2. Arrival Check-In', '3. Discharge & Invoice', '4. Claim Filed', '5. Claim Approval', '6. Payment Settled'][currentStep - 1],
      stepDescription,
      appointmentStatus: appt.status,
      invoiceId: inv ? inv.id : null,
      claimId: claim ? claim.id : null,
      paymentId: pay ? pay.id : null,
    };
  });

  res.json({ cases });
});

module.exports = router;
