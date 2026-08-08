const express = require('express');
const { v4: uuid } = require('uuid');
const { update } = require('../store');
const { requireAuth, requireRole } = require('../middleware/auth');
const { logAudit } = require('../audit');
const { validateDischargeSummary } = require('../utils/validate');
const { sanitizeText } = require('../utils/sanitize');

const router = express.Router();

// POST /api/discharge-summaries
router.post('/', requireAuth, requireRole('clinician'), async (req, res) => {
  const { valid, errors } = validateDischargeSummary(req.body || {});
  if (!valid) {
    return res.status(400).json({ error: 'Please complete all required fields before saving.', fields: errors });
  }

  const summary = {
    id: uuid(),
    patientName: sanitizeText(req.body.patientName, { maxLength: 120 }),
    clinician: req.user.name,
    chiefComplaint: sanitizeText(req.body.chiefComplaint, { maxLength: 120 }),
    findings: sanitizeText(req.body.findings, { maxLength: 500 }),
    therapy: sanitizeText(req.body.therapy, { maxLength: 500 }),
    recommendations: sanitizeText(req.body.recommendations, { maxLength: 500 }),
    labResults: sanitizeText(req.body.labResults, { maxLength: 500 }),
    ts: Date.now(),
  };

  await update((d) => { d.dischargeSummaries.push(summary); });
  await logAudit({ actor: req.user.name, role: req.user.role, type: 'access', action: `Saved a discharge summary for ${summary.patientName}` });
  res.status(201).json({ summary });
});

module.exports = router;
