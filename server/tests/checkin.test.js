import request from 'supertest'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'

import { app } from '../src/app.js'
import { db } from '../src/config/db.js'
import { resetDb, seedTestAdmin, TEST_ADMIN, VALID_CHECKIN_PAYLOAD } from './testUtils.js'

async function getAuthToken() {
  const res = await request(app).post('/api/auth/login').send(TEST_ADMIN)
  return res.body.token
}

describe('POST /api/visitors/check-in', () => {
  beforeEach(async () => {
    await resetDb()
    await seedTestAdmin()
  })

  it('accepts a fully valid payload and returns the exact CheckInResponse shape', async () => {
    const res = await request(app).post('/api/visitors/check-in').send(VALID_CHECKIN_PAYLOAD)

    expect(res.status).toBe(201)
    expect(res.body).toEqual({
      visitorId: expect.any(String),
      fullName: 'Sokha Chan',
      checkedInAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
      badgeCode: expect.stringMatching(/^[A-Z0-9]{6}$/),
    })
  })

  it('rejects a missing required field', async () => {
    const res = await request(app)
      .post('/api/visitors/check-in')
      .send({ ...VALID_CHECKIN_PAYLOAD, fullName: '' })

    expect(res.status).toBe(400)
    expect(res.body.message).toBeTruthy()
  })

  it('rejects an invalid comingFrom enum value', async () => {
    const res = await request(app)
      .post('/api/visitors/check-in')
      .send({ ...VALID_CHECKIN_PAYLOAD, comingFrom: 'bogus' })

    expect(res.status).toBe(400)
  })

  it('rejects an invalid purpose enum value', async () => {
    const res = await request(app)
      .post('/api/visitors/check-in')
      .send({ ...VALID_CHECKIN_PAYLOAD, purpose: 'bogus' })

    expect(res.status).toBe(400)
  })

  it('rejects when any of the six required terms is missing or false — cannot be bypassed', async () => {
    const res = await request(app)
      .post('/api/visitors/check-in')
      .send({
        ...VALID_CHECKIN_PAYLOAD,
        acceptedTerms: { ...VALID_CHECKIN_PAYLOAD.acceptedTerms, acknowledgment_signature: false },
      })

    expect(res.status).toBe(400)
  })

  it('rejects when acceptedTerms is missing entirely', async () => {
    const { acceptedTerms, ...withoutTerms } = VALID_CHECKIN_PAYLOAD
    const res = await request(app).post('/api/visitors/check-in').send(withoutTerms)

    expect(res.status).toBe(400)
  })

  it('persists all six term acceptances, retrievable via GET /api/visitors/:id', async () => {
    const submitRes = await request(app).post('/api/visitors/check-in').send(VALID_CHECKIN_PAYLOAD)
    const token = await getAuthToken()

    const getRes = await request(app)
      .get(`/api/visitors/${submitRes.body.visitorId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(getRes.status).toBe(200)
    expect(getRes.body.termAcceptances).toHaveLength(6)
  })
})

describe('GET /api/visitors', () => {
  beforeEach(async () => {
    await resetDb()
    await seedTestAdmin()
  })

  it('rejects without a bearer token', async () => {
    const res = await request(app).get('/api/visitors')
    expect(res.status).toBe(401)
  })

  it('rejects with an invalid token', async () => {
    const res = await request(app).get('/api/visitors').set('Authorization', 'Bearer not-a-real-token')
    expect(res.status).toBe(401)
  })

  it('lists submitted visitors when authenticated', async () => {
    await request(app).post('/api/visitors/check-in').send(VALID_CHECKIN_PAYLOAD)
    const token = await getAuthToken()

    const res = await request(app).get('/api/visitors').set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.pagination.total).toBe(1)
    expect(res.body.data[0].fullName).toBe('Sokha Chan')
  })
})

afterAll(async () => {
  await db.destroy()
})
