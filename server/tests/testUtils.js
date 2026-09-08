import bcrypt from 'bcryptjs'

import { db } from '../src/config/db.js'

export const TEST_ADMIN = { email: 'test-admin@pnc-pss.local', password: 'TestPass123!' }

/** Wipes all app tables (child tables first, FK order) between test runs. */
export async function resetDb() {
  await db('visitor_term_acceptances').del()
  await db('visitors').del()
  await db('users').del()
}

export async function seedTestAdmin() {
  const passwordHash = await bcrypt.hash(TEST_ADMIN.password, 4) // low cost factor — tests only
  await db('users').insert({ email: TEST_ADMIN.email, password_hash: passwordHash, role: 'admin' })
}

export const VALID_CHECKIN_PAYLOAD = {
  fullName: 'Sokha Chan',
  contactInfo: '+855 12 345 678',
  email: 'sokha@example.com',
  comingFrom: 'company',
  organizationName: 'Acme Co',
  accompanyingVisitors: 2,
  accompanyingPositions: 'Media Assistant',
  personToMeet: 'Mr. Sim - Education manager',
  purpose: 'meeting',
  acceptedTerms: {
    registration_access: true,
    child_youth_safeguarding: true,
    media_consent: true,
    health_safety_environment: true,
    compliance_property: true,
    acknowledgment_signature: true,
  },
}
