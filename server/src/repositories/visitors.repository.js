import { db } from '../config/db.js'

export async function insertVisitor(visitorRow) {
  await db('visitors').insert(visitorRow)
}

export async function insertTermAcceptances(rows) {
  await db('visitor_term_acceptances').insert(rows)
}

export async function badgeCodeExists(badgeCode) {
  const row = await db('visitors').where({ badge_code: badgeCode }).first('id')
  return Boolean(row)
}

export async function findVisitorById(id) {
  return db('visitors').where({ id }).first()
}

export async function findTermAcceptancesByVisitorId(visitorId) {
  return db('visitor_term_acceptances').where({ visitor_id: visitorId }).select('term_key', 'accepted_at')
}

/**
 * @param {{ page: number, pageSize: number, purpose?: string, comingFrom?: string, from?: string, to?: string }} opts
 */
export async function listVisitors({ page, pageSize, purpose, comingFrom, from, to }) {
  const query = db('visitors').orderBy('checked_in_at', 'desc')

  if (purpose) query.where('purpose', purpose)
  if (comingFrom) query.where('coming_from', comingFrom)
  if (from) query.where('checked_in_at', '>=', from)
  if (to) query.where('checked_in_at', '<=', to)

  const countQuery = query.clone().clearSelect().clearOrder().count({ count: '*' }).first()
  const rowsQuery = query
    .clone()
    .limit(pageSize)
    .offset((page - 1) * pageSize)

  const [{ count }, rows] = await Promise.all([countQuery, rowsQuery])

  return { rows, total: Number(count) }
}
