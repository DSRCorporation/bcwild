const { ValidationError } = require("sequelize");
const httpStatusCodes = require("./httpStatusCodes");

class NotFoundError extends Error {
  constructor(message, status = httpStatusCodes.NOT_FOUND, name = "NOT_FOUND") {
    super(message, status, name),
      (this.message = message),
      (this.status = status),
      (this.name = name);
  }
}

class UnauthorizedError extends Error {
  constructor(
    message,
    status = httpStatusCodes.UNAUTHORIZED,
    name = "UNAUTHORIZED",
  ) {
    super(message, status, name);
    (this.message = message), (this.status = status), (this.name = name);
  }
}

class BadRequestError extends Error {
  constructor(
    message,
    status = httpStatusCodes.BAD_REQUEST,
    name = "BAD_REQUEST",
  ) {
    super(message, status, name);
    (this.message = message), (this.status = status), (this.name = name);
  }
}

class AlreadyExistError extends Error {
  constructor(
    message,
    status = httpStatusCodes.ALREADY_EXISTS,
    name = "ALREADY_EXISTS",
  ) {
    super(message, status, name);
    (this.message = message), (this.status = status), (this.name = name);
  }
}

class InternalServerError extends Error {
  constructor(
    message,
    status = httpStatusCodes.INTERNAL_SERVER,
    name = "INTERNAL_SERVER",
  ) {
    super(message, status, name);
    (this.message = message), (this.status = status), (this.name = name);
  }
}

class SequelizeUniqueConstraintError extends ValidationError {
  constructor(
    message,
    status = httpStatusCodes.ALREADY_EXISTS,
    name = "SequelizeUniqueConstraintError",
  ) {
    super(message, status, name);
    (this.message = "Duplication error"),
      (this.status = status),
      (this.name = name);
  }
}

class Warning {
  constructor(message, status, name, data) {
    (this.message = message),
      (this.status = httpStatusCodes.WARNING),
      (this.name = "Warning"),
      (this.data = data);
  }
}

class RandomError {
  constructor(message) {
    this.message = message;
    this.status = httpStatusCodes.RANDOM;
    this.name = "RandomError";
  }
}

module.exports = {
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
  AlreadyExistError,
  InternalServerError,
  SequelizeUniqueConstraintError,
  Warning,
  RandomError,
};
