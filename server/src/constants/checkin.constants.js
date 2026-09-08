/**
 * Enum values mirrored from the frontend's
 * src/constants/checkin.constants.js (COMING_FROM_OPTIONS, PURPOSE_OPTIONS,
 * TERMS_CARDS `value`/`key` fields). Keep these two files in sync — if one
 * changes, the other must change with it, or check-ins will start failing
 * validation for no visible reason.
 */

export const COMING_FROM_VALUES = [
  'ngo',
  'company',
  'individual',
  'school_university',
  'other',
]

export const PURPOSE_VALUES = [
  'meeting',
  'campus_tour',
  'partnership_discussion',
  'training_workshop',
  'delivery',
  'maintenance_support',
  'other',
]

export const TERM_KEYS = [
  'registration_access',
  'child_youth_safeguarding',
  'media_consent',
  'health_safety_environment',
  'compliance_property',
  'acknowledgment_signature',
]
