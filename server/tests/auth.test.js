import request from 'supertest'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'

import { app } from '../src/app.js'
import { db } from '../src/config/db.js'
import { resetDb, seedTestAdmin, TEST_ADMIN } from './testUtils.js'

describe('auth', () => {
  beforeEach(async () => {
    await resetDb()
    await seedTestAdmin()
  })

  afterAll(async () => {
    await db.destroy()
  })

  it('logs in with valid credentials and issues a token', async () => {
    const res = await request(app).post('/api/auth/login').send(TEST_ADMIN)

    expect(res.status).toBe(200)
    expect(res.body.token).toEqual(expect.any(String))
    expect(res.body.user).toMatchObject({ email: TEST_ADMIN.email, role: 'admin' })
  })

  it('rejects an unknown email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@pnc-pss.local', password: TEST_ADMIN.password })

    expect(res.status).toBe(401)
  })

  it('rejects a wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({ ...TEST_ADMIN, password: 'wrong' })
    expect(res.status).toBe(401)
  })

  it('GET /api/auth/me returns the current user for a valid token', async () => {
    const loginRes = await request(app).post('/api/auth/login').send(TEST_ADMIN)

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${loginRes.body.token}`)

    expect(res.status).toBe(200)
    expect(res.body.email).toBe(TEST_ADMIN.email)
  })

  it('GET /api/auth/me rejects without a token', async () => {
    const res = await request(app).get('/api/auth/me')
    expect(res.status).toBe(401)
  })
})
