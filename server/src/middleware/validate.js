/** Parses `req.body` against a zod schema, replacing it with the parsed (typed, defaulted) result. */
export function validateBody(schema) {
  return (req, res, next) => {
    req.body = schema.parse(req.body)
    next()
  }
}
