import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import pinoHttp from 'pino-http'

import { env } from './config/env.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { authRouter } from './routes/auth.routes.js'
import { checkinRouter } from './routes/checkin.routes.js'
import { healthRouter } from './routes/health.routes.js'
import { logger } from './utils/logger.js'

export const app = express()

// Only trust the immediate hop's X-Forwarded-* headers, and only in
// production where nginx (see ../deploy/nginx.conf) is the sole entry
// point in front of this process — trusting them in dev/test would let
// any client spoof its own IP. Required for express-rate-limit to key on
// the visitor's real IP instead of nginx's; without this it either
// rate-limits everyone as one client or throws on the untrusted header.
if (env.nodeEnv === 'production') {
  app.set('trust proxy', 1)
}

app.use(helmet())
app.use(
  cors({
    origin: env.corsOrigins,
    credentials: true,
  }),
)
app.use(express.json())
app.use(pinoHttp({ logger }))

// Load-balancer/uptime checks conventionally hit /health directly, not /api/health.
app.use(healthRouter)

app.use('/api', checkinRouter)
app.use('/api', authRouter)

app.use(notFoundHandler)
app.use(errorHandler)
