import jwt from 'jsonwebtoken'

import { env } from '../config/env.js'
import { ApiError } from '../utils/ApiError.js'

/** Verifies the `Authorization: Bearer <token>` header and attaches `req.user`. */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const [scheme, token] = header.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return next(ApiError.unauthorized('Missing or malformed Authorization header.'))
  }

  try {
    req.user = jwt.verify(token, env.jwt.secret)
    next()
  } catch {
    next(ApiError.unauthorized('Invalid or expired token.'))
  }
}
