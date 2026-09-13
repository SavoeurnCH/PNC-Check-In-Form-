/**
 * @file JSDoc type definitions for the visitor check-in domain.
 * Kept as plain JS (not TS) to match the project's stack, but gives editors
 * type hints and documents the payload shape the backend API should expect.
 */

/**
 * @typedef {Object} CheckInPayload
 * @property {string} fullName
 * @property {string} contactInfo
 * @property {string} [email]
 * @property {string} comingFrom - one of COMING_FROM_OPTIONS values
 * @property {string} [organizationName]
 * @property {number|null} accompanyingVisitors
 * @property {string} [accompanyingPositions]
 * @property {string} personToMeet
 * @property {string} purpose - one of PURPOSE_OPTIONS values
 * @property {Record<string, boolean>} acceptedTerms - keyed by TERMS_CARDS[].key
 */

/**
 * @typedef {Object} CheckInResponse
 * @property {string} visitorId
 * @property {string} fullName
 * @property {string} checkedInAt - ISO timestamp
 * @property {string} [badgeCode]
 */

export {}
