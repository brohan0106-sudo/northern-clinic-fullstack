const express = require('express');
const { v4: uuid } = require('uuid');
const { readAll, update } = require('../store');
const { requireAuth, requireRole } = require('../middleware/auth');
const { logAudit } = require('../audit');
const { sanitizeText } = require('../utils/sanitize');

const router = express.Router();

function canAccessThread(user, thread) {
  if (user.role === 'clinician') return true; // clinicians can open any patient's thread
  if (user.role === 'patient') return thread === user.name; // patients: own thread only
  return false;
}

// GET /api/messages/:thread
router.get('/:thread', requireAuth, requireRole('clinician', 'patient'), async (req, res) => {
  const thread = decodeURIComponent(req.params.thread);
  if (!canAccessThread(req.user, thread)) {
    await logAudit({ actor: req.user.name, role: req.user.role, type: 'deny', action: `Attempted to open message thread "${thread}" belonging to another patient` });
    return res.status(403).json({ error: 'You can only view your own message thread.' });
  }
  const data = readAll();
  const msgs = data.messages.filter(m => m.thread === thread).sort((a, b) => a.ts - b.ts);
  res.json({ thread, messages: msgs });
});

// POST /api/messages  { thread, to, text }
router.post('/', requireAuth, requireRole('clinician', 'patient'), async (req, res) => {
  const thread = String(req.body?.thread || '').trim();
  const to = String(req.body?.to || '').trim();
  const text = sanitizeText(req.body?.text, { maxLength: 1000 });

  if (!thread || !text) return res.status(400).json({ error: 'Write a message before sending.' });
  if (!canAccessThread(req.user, thread)) {
    await logAudit({ actor: req.user.name, role: req.user.role, type: 'deny', action: `Attempted to send into message thread "${thread}" belonging to another patient` });
    return res.status(403).json({ error: 'You can only message within your own thread.' });
  }

  const msg = { id: uuid(), thread, from: req.user.name, to, text, ts: Date.now() };
  await update((d) => { d.messages.push(msg); });
  await logAudit({ actor: req.user.name, role: req.user.role, type: 'access', action: `Sent a secure message to ${to || 'care team'}` });
  res.status(201).json({ message: msg });
});

module.exports = router;
