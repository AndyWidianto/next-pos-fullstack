
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype); // Restore prototype chain

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// 400 Bad Request
export class BadRequestError extends AppError {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}

// 401 Unauthorized
export class UnAuthorizationError extends AppError {
  constructor(message = "Unauthorized Access") {
    super(message, 401);
  }
}

// 403 Forbidden
export class ForbiddenError extends AppError {
  constructor(message = "Access Forbidden") {
    super(message, 403);
  }
}

// 404 Not Found
export class NotFoundError extends AppError {
  constructor(message = "Resource Not Found") {
    super(message, 404);
  }
}