/**
 * Minimal HTML-escaping sanitiser for free-text fields (messages, discharge
 * notes, registration details) before they are persisted. This is applied
 * server-side because client-side validation can always be bypassed by
 * calling the API directly — the server is the actual trust boundary.
 */
function stripTags(input) {
  return String(input).replace(/<[^>]*>/g, '');
}

function escapeHtml(input) {
  return String(input).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

/** Use for any free-text field that will later be rendered in the UI. */
function sanitizeText(input, { maxLength = 1000 } = {}) {
  if (typeof input !== 'string') return '';
  const stripped = stripTags(input).trim().slice(0, maxLength);
  return escapeHtml(stripped);
}

module.exports = { stripTags, escapeHtml, sanitizeText };
