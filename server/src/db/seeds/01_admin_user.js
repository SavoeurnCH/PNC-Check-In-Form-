import bcrypt from 'bcryptjs'

const SEED_EMAIL = 'admin@pnc-pss.local'
const SEED_PASSWORD = 'ChangeMe123!' // dev-only credential, see server README

/** @param {import('knex').Knex} knex */
export async function seed(knex) {
  const existing = await knex('users').where({ email: SEED_EMAIL }).first()
  if (existing) return

  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10)
  await knex('users').insert({
    email: SEED_EMAIL,
    password_hash: passwordHash,
    role: 'admin',
  })
}
