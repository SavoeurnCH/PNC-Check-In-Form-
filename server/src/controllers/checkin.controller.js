import * as checkinService from '../services/checkin.service.js'

export async function postCheckIn(req, res) {
  const result = await checkinService.submitCheckIn(req.body)
  res.status(201).json(result)
}

export async function getVisitors(req, res) {
  const result = await checkinService.listVisitors(req.query)
  res.json(result)
}

export async function getVisitorById(req, res) {
  const result = await checkinService.getVisitor(req.params.id)
  res.json(result)
}
