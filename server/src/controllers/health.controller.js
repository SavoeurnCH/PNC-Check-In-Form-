import { db } from '../config/db.js'

export async function getHealth(req, res) {
  try {
    await db.raw('SELECT 1')
    res.json({ status: 'ok', db: 'connected' })
  } catch {
    res.status(503).json({ status: 'error', db: 'unreachable' })
  }
}
