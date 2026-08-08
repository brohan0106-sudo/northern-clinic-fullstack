const express = require('express');
const { v4: uuid } = require('uuid');
const { readAll, update } = require('../store');
const { requireAuth, requireRole } = require('../middleware/auth');
const { logAudit } = require('../audit');

const router = express.Router();

router.use(requireAuth, requireRole('reception', 'clinician'));

// GET /api/workflow/cases
router.get('/cases', (req, res) => {
  const data = readAll();
  const cases = (data.appointments || []).map(appt => {
    const inv = (data.invoices || []).find(i => i.patientName === appt.patient);
    const claim = (data.claims || []).find(c => c.patient === appt.patient);
    const pay = (data.payments || []).find(p => p.patientName === appt.patient || (inv && p.invoiceId === inv.id));

    let currentStep = 1; // 1: Appointment
    if (appt.status === 'Checked in' || appt.status === 'In Consultation' || appt.status === 'Completed') currentStep = 2; // 2: Treatment
    if (inv) currentStep = 3; // 3: Invoice
    if (claim) currentStep = 4; // 4: Insurance Claim
    if (claim && (claim.status === 'Approved' || claim.status === 'Paid')) currentStep = 5; // 5: Claim Approval
    if (pay) currentStep = 6; // 6: Payment

    return {
      caseId: appt.id,
      patient: appt.patient,
      clinician: appt.clinician,
      time: appt.time,
      currentStep,
      stepName: ['Appointment', 'Treatment', 'Invoice', 'Insurance Claim', 'Claim Approval', 'Payment'][currentStep - 1],
      appointmentStatus: appt.status,
      invoiceId: inv ? inv.id : null,
      claimId: claim ? claim.id : null,
      paymentId: pay ? pay.id : null,
    };
  });

  res.json({ cases });
});

// POST /api/workflow/advance
router.post('/advance', async (req, res) => {
  const { caseId, step, payload } = req.body || {};
  if (!caseId || !step) return res.status(400).json({ error: 'Case ID and step are required.' });

  const result = await update((data) => {
    const appt = data.appointments.find(a => a.id === caseId);
    if (!appt) return { error: 'Appointment case not found.' };

    if (step === 2) {
      // Step 2: Treatment
      appt.status = 'Checked in';
      if (!data.medicalRecords) data.medicalRecords = [];
      data.medicalRecords.unshift({
        id: uuid(),
        patientName: appt.patient,
        doctorName: appt.clinician,
        diagnosis: (payload && payload.diagnosis) || 'General Consultation & Evaluation',
        bp: '120/80 mmHg',
        pulse: 72,
        notes: (payload && payload.notes) || 'Treatment completed in clinic.',
        date: new Date().toISOString().split('T')[0],
      });
      return { step: 2, msg: 'Treatment recorded and status updated to Checked In.' };
    }

    if (step === 3) {
      // Step 3: Invoice
      if (!data.invoices) data.invoices = [];
      const fee = (payload && payload.fee) || 180.00;
      const invId = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;
      data.invoices.unshift({
        id: invId,
        patientName: appt.patient,
        date: new Date().toISOString().split('T')[0],
        items: [{ desc: `${appt.type} - ${appt.clinician}`, fee }],
        subtotal: fee,
        insurerReimbursement: fee * 0.75,
        patientCoPay: fee * 0.25,
        status: 'Issued',
      });
      return { step: 3, invId, msg: `Invoice ${invId} generated for $${fee.toFixed(2)}.` };
    }

    if (step === 4) {
      // Step 4: Insurance Claim
      if (!data.claims) data.claims = [];
      const claimId = `CLM-${Math.floor(10000 + Math.random() * 90000)}`;
      const inv = (data.invoices || []).find(i => i.patientName === appt.patient);
      const amount = inv ? inv.insurerReimbursement : 135.00;
      data.claims.unshift({
        id: claimId,
        patient: appt.patient,
        payer: (payload && payload.payer) || 'Medibank',
        amount,
        status: 'Submitted',
        date: new Date().toISOString().split('T')[0],
        procedureCode: 'GP-01',
      });
      return { step: 4, claimId, msg: `Insurance claim ${claimId} submitted.` };
    }

    if (step === 5) {
      // Step 5: Claim Approval
      const claim = (data.claims || []).find(c => c.patient === appt.patient);
      if (claim) claim.status = 'Paid';
      return { step: 5, msg: 'Insurance claim approved & settled.' };
    }

    if (step === 6) {
      // Step 6: Payment
      if (!data.payments) data.payments = [];
      const inv = (data.invoices || []).find(i => i.patientName === appt.patient);
      const payId = `PAY-${Math.floor(1000 + Math.random() * 9000)}`;
      data.payments.unshift({
        id: payId,
        invoiceId: inv ? inv.id : 'INV-GEN',
        patientName: appt.patient,
        amount: inv ? inv.subtotal : 180.00,
        method: (payload && payload.method) || 'Credit Card (EFTPOS)',
        receiptRef: `REC-${Math.floor(10000 + Math.random() * 90000)}`,
        date: new Date().toISOString().split('T')[0],
      });
      if (inv) inv.status = 'Paid';
      appt.status = 'Completed';
      return { step: 6, payId, msg: 'Full payment received and case finalized.' };
    }

    return { error: 'Invalid workflow step.' };
  });

  if (result.error) return res.status(400).json({ error: result.error });

  await logAudit({
    actor: req.user.name, role: req.user.role, type: 'access',
    action: `Care Workflow advanced to Step ${result.step} for patient case #${caseId}`,
  });

  res.json(result);
});

module.exports = router;
