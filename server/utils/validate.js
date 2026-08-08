function isNonEmptyString(v, { min = 1, max = 1000 } = {}) {
  return typeof v === 'string' && v.trim().length >= min && v.trim().length <= max;
}

function isValidUsername(v) {
  return typeof v === 'string' && /^[a-z0-9.]{3,40}$/i.test(v.trim());
}

/** Required-field check used for the discharge summary — mirrors, and is
 * authoritative over, the client-side check in public/app.js. */
function validateDischargeSummary(body) {
  const errors = {};
  if (!isNonEmptyString(body.patientName, { min: 1, max: 120 })) errors.patientName = 'Select a patient.';
  if (!isNonEmptyString(body.chiefComplaint, { min: 3, max: 120 })) errors.chiefComplaint = 'Chief complaint is required.';
  if (!isNonEmptyString(body.findings, { min: 5, max: 500 })) errors.findings = 'Findings and diagnosis are required.';
  if (!isNonEmptyString(body.therapy, { min: 5, max: 500 })) errors.therapy = 'Therapy administered is required.';
  if (!isNonEmptyString(body.recommendations, { min: 5, max: 500 })) errors.recommendations = 'Discharge recommendations are required.';
  if (!isNonEmptyString(body.labResults, { min: 3, max: 500 })) errors.labResults = 'Lab results are required.';
  return { valid: Object.keys(errors).length === 0, errors };
}

function validateBooking(body) {
  const errors = {};
  if (!isNonEmptyString(body.clinician, { min: 2, max: 60 })) errors.clinician = 'Choose a clinician.';
  if (!isNonEmptyString(body.time, { min: 3, max: 20 })) errors.time = 'Choose a time slot.';
  if (!isNonEmptyString(body.reason, { min: 2, max: 120 })) errors.reason = 'Add a short reason for the visit.';
  return { valid: Object.keys(errors).length === 0, errors };
}

function validateRegistration(body) {
  const errors = {};
  if (!isNonEmptyString(body.name, { min: 2, max: 120 })) errors.name = 'Full name is required.';
  if (!isNonEmptyString(body.dob, { min: 4, max: 40 })) errors.dob = 'Date of birth is required.';
  if (body.phone && !/^[0-9+()\s-]{6,20}$/.test(body.phone)) errors.phone = 'Enter a valid phone number.';
  return { valid: Object.keys(errors).length === 0, errors };
}

module.exports = {
  isNonEmptyString, isValidUsername,
  validateDischargeSummary, validateBooking, validateRegistration,
};
