const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');

const { update, readAll } = require('../store');
const { logAudit } = require('../audit');
const { JWT_SECRET, SESSION_TIMEOUT_MINUTES, MFA_CODE_TTL_MINUTES, IS_PROD } = require('../config');
const { loginLimiter, mfaLimiter } = require('../middleware/rateLimiters');
const { requireAuth, COOKIE_NAME } = require('../middleware/auth');
const { isValidUsername } = require('../utils/validate');

const router = express.Router();

const ACCOUNT_LOCK_THRESHOLD = 5;
const ACCOUNT_LOCK_MINUTES = 15;

function publicUser(u) {
  return { username: u.username, name: u.name, role: u.role, initials: u.initials };
}

function cookieOptions(maxAgeMs) {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: IS_PROD, // requires HTTPS in production; local http demo needs this off
    maxAge: maxAgeMs,
  };
}

// POST /api/auth/login  { username, password } -> { tempToken, expiresInSeconds, demoCode }
router.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body || {};
  if (!isValidUsername(username) || typeof password !== 'string' || !password) {
    return res.status(400).json({ error: 'Enter a username and password.' });
  }

  const data = readAll();
  const user = data.users.find(u => u.username === username.trim().toLowerCase());

  // Deliberately identical error for "no such user" and "wrong password" —
  // distinguishing them lets an attacker enumerate valid usernames.
  const genericFail = () => res.status(401).json({ error: 'Incorrect username or password.' });

  if (!user) {
    await logAudit({ actor: username, role: 'unknown', type: 'deny', action: `Login failed — unknown username "${username}"` });
    return genericFail();
  }

  if (user.lockedUntil && Date.now() < user.lockedUntil) {
    const mins = Math.ceil((user.lockedUntil - Date.now()) / 60000);
    await logAudit({ actor: user.name, role: user.role, type: 'deny', action: `Login blocked — account locked for ${mins} more minute(s) after repeated failures` });
    return res.status(423).json({ error: `Account temporarily locked after repeated failed attempts. Try again in ${mins} minute(s).` });
  }

  const passwordOk = bcrypt.compareSync(password, user.passwordHash);
  if (!passwordOk) {
    await update((d) => {
      const u = d.users.find(x => x.id === user.id);
      u.failedLogins = (u.failedLogins || 0) + 1;
      if (u.failedLogins >= ACCOUNT_LOCK_THRESHOLD) {
        u.lockedUntil = Date.now() + ACCOUNT_LOCK_MINUTES * 60000;
      }
    });
    await logAudit({ actor: user.name, role: user.role, type: 'deny', action: `Login failed — incorrect password (attempt ${user.failedLogins + 1})` });
    return genericFail();
  }

  await update((d) => {
    const u = d.users.find(x => x.id === user.id);
    u.failedLogins = 0;
    u.lockedUntil = null;
  });

  // Issue an MFA challenge. In production the code would go out via SMS/email/
  // authenticator app; there is no real delivery channel in this demo, so it
  // is returned in the response and clearly labelled as such.
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const tempToken = uuid();
  const expiresAt = Date.now() + MFA_CODE_TTL_MINUTES * 60000;

  await update((d) => {
    d.mfaChallenges[tempToken] = {
      username: user.username, codeHash: bcrypt.hashSync(code, 8), expiresAt, attempts: 0,
    };
  });

  await logAudit({ actor: user.name, role: user.role, type: 'auth', action: 'Credential check passed — MFA challenge issued' });

  res.json({
    tempToken,
    expiresInSeconds: MFA_CODE_TTL_MINUTES * 60,
    userLabel: user.name,
    demoCode: code, // DEMO ONLY: a real deployment must never return the OTP in the response body.
  });
});

// POST /api/auth/verify-mfa  { tempToken, code } -> sets session cookie, returns user
router.post('/verify-mfa', mfaLimiter, async (req, res) => {
  const { tempToken, code } = req.body || {};
  if (typeof tempToken !== 'string' || typeof code !== 'string') {
    return res.status(400).json({ error: 'Missing verification code.' });
  }

  const data = readAll();
  const challenge = data.mfaChallenges[tempToken];
  if (!challenge) return res.status(400).json({ error: 'This sign-in attempt has expired. Please start again.' });

  if (Date.now() > challenge.expiresAt) {
    await update((d) => { delete d.mfaChallenges[tempToken]; });
    return res.status(400).json({ error: 'That code has expired. Please sign in again.' });
  }

  if (challenge.attempts >= 5) {
    await update((d) => { delete d.mfaChallenges[tempToken]; });
    await logAudit({ actor: challenge.username, role: 'unknown', type: 'deny', action: 'MFA challenge abandoned after too many incorrect attempts' });
    return res.status(429).json({ error: 'Too many incorrect codes. Please sign in again.' });
  }

  const ok = bcrypt.compareSync(code, challenge.codeHash);
  if (!ok) {
    await update((d) => { d.mfaChallenges[tempToken].attempts += 1; });
    await logAudit({ actor: challenge.username, role: 'unknown', type: 'deny', action: `MFA code incorrect (attempt ${challenge.attempts + 1})` });
    return res.status(401).json({ error: 'Incorrect code. Check the demo code and try again.' });
  }

  const user = data.users.find(u => u.username === challenge.username);
  await update((d) => { delete d.mfaChallenges[tempToken]; });

  const sessionMs = SESSION_TIMEOUT_MINUTES * 60000;
  const token = jwt.sign(
    { sub: user.id, username: user.username, name: user.name, role: user.role, initials: user.initials },
    JWT_SECRET,
    { expiresIn: `${SESSION_TIMEOUT_MINUTES}m` }
  );

  res.cookie(COOKIE_NAME, token, cookieOptions(sessionMs));
  await logAudit({ actor: user.name, role: user.role, type: 'auth', action: 'MFA verified — session started' });

  res.json({ user: publicUser(user), sessionTimeoutMinutes: SESSION_TIMEOUT_MINUTES });
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  const token = req.cookies[COOKIE_NAME];
  res.clearCookie(COOKIE_NAME, cookieOptions(0));
  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      await logAudit({ actor: payload.name, role: payload.role, type: 'auth', action: 'Signed out' });
    } catch { /* token already invalid — nothing to log against */ }
  }
  res.json({ ok: true });
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: { username: req.user.username, name: req.user.name, role: req.user.role, initials: req.user.initials } });
});

module.exports = router;
