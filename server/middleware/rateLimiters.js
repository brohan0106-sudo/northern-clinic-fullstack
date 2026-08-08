const rateLimit = require('express-rate-limit');

/** Slows down credential-guessing against /api/auth/login by source IP,
 * independent of the per-account lockout applied in routes/auth.js. */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many sign-in attempts from this network. Try again in a few minutes.' },
});

const mfaLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many verification attempts. Request a new code by signing in again.' },
});

module.exports = { loginLimiter, mfaLimiter };
