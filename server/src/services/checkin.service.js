import crypto from 'node:crypto'

import { TERM_KEYS } from '../constants/checkin.constants.js'
import * as visitorsRepo from '../repositories/visitors.repository.js'
import { generateBadgeCode } from '../utils/badgeCode.js'
import { ApiError } from '../utils/ApiError.js'

async function generateUniqueBadgeCode() {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateBadgeCode()
    // eslint-disable-next-line no-await-in-loop
    if (!(await visitorsRepo.badgeCodeExists(code))) return code
  }
  throw new Error('Could not generate a unique badge code after several attempts.')
}

/**
 * @param {import('../validators/checkin.validator.js').checkInSchema['_output']} payload
 * @returns {Promise<{visitorId: string, fullName: string, checkedInAt: string, badgeCode: string}>}
 */
export async function submitCheckIn(payload) {
  const id = crypto.randomUUID()
  const checkedInAt = new Date()
  const badgeCode = await generateUniqueBadgeCode()

  await visitorsRepo.insertVisitor({
    id,
    full_name: payload.fullName,
    contact_info: payload.contactInfo,
    email: payload.email || null,
    coming_from: payload.comingFrom,
    organization_name: payload.organizationName || null,
    accompanying_visitors: payload.accompanyingVisitors ?? null,
    accompanying_positions: payload.accompanyingPositions || null,
    person_to_meet: payload.personToMeet,
    purpose: payload.purpose,
    badge_code: badgeCode,
    checked_in_at: checkedInAt,
  })

  await visitorsRepo.insertTermAcceptances(
    TERM_KEYS.map((term_key) => ({ visitor_id: id, term_key, accepted_at: checkedInAt })),
  )

  return {
    visitorId: id,
    fullName: payload.fullName,
    checkedInAt: checkedInAt.toISOString(),
    badgeCode,
  }
}

export async function getVisitor(id) {
  const visitor = await visitorsRepo.findVisitorById(id)
  if (!visitor) throw ApiError.notFound('Visitor not found.')

  const termAcceptances = await visitorsRepo.findTermAcceptancesByVisitorId(id)
  return { ...toVisitorDto(visitor), termAcceptances }
}

export async function listVisitors({ page = 1, pageSize = 20, purpose, comingFrom, from, to }) {
  const { rows, total } = await visitorsRepo.listVisitors({
    page: Number(page),
    pageSize: Number(pageSize),
    purpose,
    comingFrom,
    from,
    to,
  })

  return {
    data: rows.map(toVisitorDto),
    pagination: { page: Number(page), pageSize: Number(pageSize), total },
  }
}

function toVisitorDto(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    contactInfo: row.contact_info,
    email: row.email,
    comingFrom: row.coming_from,
    organizationName: row.organization_name,
    accompanyingVisitors: row.accompanying_visitors,
    accompanyingPositions: row.accompanying_positions,
    personToMeet: row.person_to_meet,
    purpose: row.purpose,
    badgeCode: row.badge_code,
    checkedInAt: new Date(row.checked_in_at).toISOString(),
  }
}
