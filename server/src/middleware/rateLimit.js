import rateLimit from 'express-rate-limit'

const jsonHandler = (req, res) => {
  res.status(429).json({ message: 'Too many requests. Please try again shortly.' })
}

/** Public kiosk endpoint — generous, but caps abuse from a single source. */
export const checkInRateLimit = rateLimit({
  windowMs: 60_000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonHandler,
})

/** Login is a common brute-force target — tighter window. */
export const loginRateLimit = rateLimit({
  windowMs: 15 * 60_000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonHandler,
})
