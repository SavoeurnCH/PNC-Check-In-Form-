/** Thrown anywhere in a controller/service to produce a specific HTTP error response. */
export class ApiError extends Error {
  constructor(statusCode, message, errors) {
    super(message)
    this.statusCode = statusCode
    this.errors = errors
  }

  static badRequest(message, errors) {
    return new ApiError(400, message, errors)
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message)
  }

  static notFound(message = 'Not found') {
    return new ApiError(404, message)
  }

  static conflict(message) {
    return new ApiError(409, message)
  }
}
