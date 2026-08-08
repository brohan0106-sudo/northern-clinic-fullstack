const express = require('express');
const { readAll, update } = require('../store');
const { requireAuth, requireRole } = require('../middleware/auth');
const { logAudit } = require('../audit');

const router = express.Router();

router.use(requireAuth);

// GET /api/billing/claims or /api/billing
router.get('/claims', requireRole('billing', 'admin'), async (req, res) => {
  const data = readAll();
  res.json({ claims: data.claims || [] });
});

// POST /api/billing/claims — Submit claim endpoint on billing router
router.post('/claims', requireRole('billing', 'admin'), async (req, res) => {
  const { patient, payer, amount, procedureCode } = req.body || {};
  if (!patient || !payer || !amount) {
    return res.status(400).json({ error: 'Patient name, payer, and amount are required.' });
  }

  const claimId = `CLM-${Math.floor(10000 + Math.random() * 90000)}`;
  const newClaim = {
    id: claimId,
    patient: patient.trim(),
    payer: payer.trim(),
    amount: Number(amount) || 120.00,
    status: 'Submitted',
    date: new Date().toISOString().split('T')[0],
    procedureCode: procedureCode || 'GP-01',
  };

  await update(data => {
    if (!data.claims) data.claims = [];
    data.claims.unshift(newClaim);
  });

  await logAudit({
    actor: req.user.name, role: req.user.role, type: 'access',
    action: `Submitted new insurance claim #${claimId} for ${patient} ($${Number(amount).toFixed(2)})`,
  });

  res.status(201).json({ claim: newClaim, message: 'Insurance claim submitted successfully.' });
});

router.get('/', requireRole('billing', 'admin'), async (req, res) => {
  const data = readAll();
  res.json({ claims: data.claims || [], invoices: data.invoices || [], payments: data.payments || [] });
});

// POST /api/billing/invoices — Create new itemized invoice
router.post('/invoices', requireRole('billing', 'admin'), async (req, res) => {
  const { patientName, description, subtotal, insurerReimbursement } = req.body || {};
  if (!patientName || !subtotal) {
    return res.status(400).json({ error: 'Patient name and subtotal fee are required.' });
  }

  const invId = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;
  const total = Number(subtotal) || 180.00;
  const insReimb = Number(insurerReimbursement) || (total * 0.75);
  const copay = Math.max(0, total - insReimb);

  const newInvoice = {
    id: invId,
    patientName: patientName.trim(),
    date: new Date().toISOString().split('T')[0],
    items: [{ desc: description || 'Clinical Consultation & Fee', fee: total }],
    subtotal: total,
    insurerReimbursement: insReimb,
    patientCoPay: copay,
    status: 'Issued',
  };

  await update(data => {
    if (!data.invoices) data.invoices = [];
    data.invoices.unshift(newInvoice);
  });

  await logAudit({
    actor: req.user.name, role: req.user.role, type: 'access',
    action: `Generated itemized invoice #${invId} for ${patientName} ($${total.toFixed(2)})`,
  });

  res.status(201).json({ invoice: newInvoice, message: 'Invoice generated successfully.' });
});

// POST /api/billing/payments — Record payment receipt
router.post('/payments', requireRole('billing', 'admin'), async (req, res) => {
  const { invoiceId, patientName, amount, method } = req.body || {};
  if (!patientName || !amount) {
    return res.status(400).json({ error: 'Patient name and payment amount are required.' });
  }

  const payId = `PAY-${Math.floor(1000 + Math.random() * 9000)}`;
  const newPayment = {
    id: payId,
    invoiceId: invoiceId || 'INV-GEN',
    patientName: patientName.trim(),
    amount: Number(amount) || 50.00,
    method: method || 'Credit Card (EFTPOS)',
    receiptRef: `REC-${Math.floor(10000 + Math.random() * 90000)}`,
    date: new Date().toISOString().split('T')[0],
  };

  await update(data => {
    if (!data.payments) data.payments = [];
    data.payments.unshift(newPayment);
    if (invoiceId && data.invoices) {
      const inv = data.invoices.find(i => i.id === invoiceId);
      if (inv) inv.status = 'Paid';
    }
  });

  await logAudit({
    actor: req.user.name, role: req.user.role, type: 'access',
    action: `Recorded payment receipt #${newPayment.receiptRef} for ${patientName} ($${Number(amount).toFixed(2)})`,
  });

  res.status(201).json({ payment: newPayment, message: 'Payment recorded successfully.' });
});

// GET /api/billing/accounts
router.get('/accounts', requireRole('billing', 'admin'), async (req, res) => {
  const data = readAll();
  const claims = data.claims || [];
  const outstanding = claims.filter(c => c.status !== 'Paid').reduce((s, c) => s + c.amount, 0);
  const totalRevenue = claims.filter(c => c.status === 'Paid').reduce((s, c) => s + c.amount, 0);

  res.json({
    outstandingBalance: outstanding,
    totalRevenue,
    claims,
    invoices: data.invoices || [],
    payments: data.payments || [],
  });
});

// GET /api/billing/mine
router.get('/mine', requireRole('patient'), (req, res) => {
  const data = readAll();
  const mine = (data.claims || []).filter(c => c.patient === req.user.name);
  res.json({ claims: mine });
});

module.exports = router;
