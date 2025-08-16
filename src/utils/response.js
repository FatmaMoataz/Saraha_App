export const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next)
    } catch (error) {
      return next(error)
    }
  }
}

export const successResponse = ({ res, message = "Done", status = 200, data = {} } = {}) => {
  return res.status(status).json({ message, data })
}

export const globalErrorHandling = (error, req, res, next) => {
  return res.status(error.cause || 400).json({
    message: error.err_message || error.message || "Unexpected error",
    error,
    stack: process.env.MOOD === "DEV" ? error.stack : undefined
  })
}
