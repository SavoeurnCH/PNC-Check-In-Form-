import { z } from 'zod'

import { COMING_FROM_VALUES, PURPOSE_VALUES, TERM_KEYS } from '../constants/checkin.constants.js'

// Same loose phone check as the frontend's src/utils/validators.js isValidContact.
const contactPattern = /^[+\d][\d\s-]{5,}$/

/**
 * All six terms must be present and `true`. This is the one rule that
 * matters most — it's a legal/safeguarding acknowledgment, and a client
 * that skips the UI must not be able to skip this.
 */
const acceptedTermsSchema = z
  .object(Object.fromEntries(TERM_KEYS.map((key) => [key, z.literal(true)])))
  .strict()

export const checkInSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required.'),
  contactInfo: z
    .string()
    .trim()
    .regex(contactPattern, 'Please provide a valid contact number.'),
  email: z.string().trim().email('Please provide a valid email.').optional().or(z.literal('')),
  comingFrom: z.enum(COMING_FROM_VALUES, { message: 'Invalid "coming from" value.' }),
  organizationName: z.string().trim().optional(),
  accompanyingVisitors: z.coerce.number().int().min(0).nullable().optional(),
  accompanyingPositions: z.string().trim().optional(),
  personToMeet: z.string().trim().min(1, 'Person or department to meet is required.'),
  purpose: z.enum(PURPOSE_VALUES, { message: 'Invalid purpose value.' }),
  acceptedTerms: acceptedTermsSchema,
})
