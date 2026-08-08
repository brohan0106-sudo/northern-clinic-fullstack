const jwt = require('jsonwebtoken');
const { JWT_SECRET, SESSION_TIMEOUT_MINUTES, IS_PROD } = require('../config');
const { logAudit } = require('../audit');

const COOKIE_NAME = 'clinic_session';

function cookieOptions(maxAgeMs) {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: IS_PROD,
    maxAge: maxAgeMs,
  };
}

function requireAuth(req, res, next) {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.status(401).json({ error: 'Not signed in.' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { sub, username, name, role, initials, exp, iat }

    // Sliding session renewal: refresh cookie on activity
    const sessionMs = (SESSION_TIMEOUT_MINUTES || 15) * 60000;
    const freshToken = jwt.sign(
      { sub: payload.sub, username: payload.username, name: payload.name, role: payload.role, initials: payload.initials },
      JWT_SECRET,
      { expiresIn: `${SESSION_TIMEOUT_MINUTES || 15}m` }
    );
    res.cookie(COOKIE_NAME, freshToken, cookieOptions(sessionMs));
    res.setHeader('X-Session-Remaining', (SESSION_TIMEOUT_MINUTES || 15) * 60);

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' });
  }
}

/**
 * Enforces role-based access control at the API layer — this is the real
 * enforcement point. The UI also hides modules a role can't use, but that's
 * only a convenience: every request that reaches here is re-checked
 * server-side, and a denial is written to the audit log regardless of what
 * the client showed.
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Not signed in.' });
    if (!roles.includes(req.user.role)) {
      logAudit({
        actor: req.user.name, role: req.user.role, type: 'deny',
        action: `Access denied — ${req.user.role} role attempted a ${roles.join('/')} -only endpoint (${req.method} ${req.originalUrl})`,
      });
      return res.status(403).json({ error: `Your ${req.user.role} account does not have permission to do this.` });
    }
    return next();
  };
}

module.exports = { requireAuth, requireRole, COOKIE_NAME };
