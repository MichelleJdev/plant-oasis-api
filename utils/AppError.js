class AppError extends Error {
  constructor(statusCode = 500, message = "Something went wrong") {
    super(message);
    this.statusCode = statusCode;
  }

  static unauthenticated() {
    throw new AppError();
  }
}

module.exports = AppError;
