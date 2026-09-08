import { db } from '../config/db.js'

export async function findUserByEmail(email) {
  return db('users').where({ email }).first()
}

export async function findUserById(id) {
  return db('users').where({ id }).first()
}
