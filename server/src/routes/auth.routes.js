import { Router } from 'express'

import * as authController from '../controllers/auth.controller.js'
import { requireAuth } from '../middleware/auth.js'
import { loginRateLimit } from '../middleware/rateLimit.js'
import { validateBody } from '../middleware/validate.js'
import { loginSchema } from '../validators/auth.validator.js'

export const authRouter = Router()

authRouter.post('/auth/login', loginRateLimit, validateBody(loginSchema), authController.postLogin)
authRouter.post('/auth/logout', requireAuth, authController.postLogout)
authRouter.get('/auth/me', requireAuth, authController.getMe)
