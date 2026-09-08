import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { env } from '../config/env.js'
import * as usersRepo from '../repositories/users.repository.js'
import { ApiError } from '../utils/ApiError.js'

function toUserDto(user) {
  return { id: user.id, email: user.email, role: user.role }
}

export async function login({ email, password }) {
  const user = await usersRepo.findUserByEmail(email)
  if (!user) throw ApiError.unauthorized('Invalid email or password.')

  const passwordMatches = await bcrypt.compare(password, user.password_hash)
  if (!passwordMatches) throw ApiError.unauthorized('Invalid email or password.')

  const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  })

  return { token, user: toUserDto(user) }
}

export async function getCurrentUser(userId) {
  const user = await usersRepo.findUserById(userId)
  if (!user) throw ApiError.unauthorized('User no longer exists.')
  return toUserDto(user)
}
