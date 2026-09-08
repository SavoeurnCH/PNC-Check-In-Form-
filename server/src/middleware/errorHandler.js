import { ZodError } from 'zod'

import { isProduction } from '../config/env.js'
import { ApiError } from '../utils/ApiError.js'
import { logger } from '../utils/logger.js'

/** 404 handler for unmatched routes — must be mounted after all real routes. */
export function notFoundHandler(req, res) {
  res.status(404).json({ message: `No route for ${req.method} ${req.originalUrl}` })
}

/**
 * Central error handler. Every thrown/rejected error in a route lands here
 * (Express 5 forwards async errors automatically). Always responds with a
 * top-level `message` — the frontend's Axios interceptor reads exactly that.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message, ...(err.errors && { errors: err.errors }) })
  }

  if (err instanceof ZodError) {
    const errors = Object.fromEntries(
      err.issues.map((issue) => [issue.path.join('.') || '(root)', issue.message]),
    )
    return res.status(400).json({ message: 'Validation failed', errors })
  }

  // MySQL duplicate-key error (e.g. badge code collision, duplicate email).
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ message: 'A record with these details already exists.' })
  }

  logger.error({ err }, 'Unhandled error')
  res.status(500).json({ message: isProduction ? 'Something went wrong.' : err.message })
}
