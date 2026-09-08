import { Router } from 'express'

import * as checkinController from '../controllers/checkin.controller.js'
import { requireAuth } from '../middleware/auth.js'
import { checkInRateLimit } from '../middleware/rateLimit.js'
import { validateBody } from '../middleware/validate.js'
import { checkInSchema } from '../validators/checkin.validator.js'

export const checkinRouter = Router()

checkinRouter.post(
  '/visitors/check-in',
  checkInRateLimit,
  validateBody(checkInSchema),
  checkinController.postCheckIn,
)

checkinRouter.get('/visitors', requireAuth, checkinController.getVisitors)
checkinRouter.get('/visitors/:id', requireAuth, checkinController.getVisitorById)
