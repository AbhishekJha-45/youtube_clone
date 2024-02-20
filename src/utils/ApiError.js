class ApiError extends Error {
  constructor(
    status,
    message = "Something went wrong",
    errors = [],
    stack = "",
    statusCode
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;
    if (condition) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
