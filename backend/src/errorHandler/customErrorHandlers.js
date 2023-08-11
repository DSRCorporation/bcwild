/* eslint-disable max-classes-per-file */

const { ValidationError } = require("sequelize");
const {
  NOT_FOUND,
  UNAUTHORIZED,
  BAD_REQUEST,
  ALREADY_EXISTS,
  INTERNAL_SERVER,
  WARNING,
  RANDOM,
} = require("./httpStatusCodes");

class NotFoundError extends Error {
  constructor(message, status = NOT_FOUND, name = "NOT_FOUND") {
    super(message, status, name);
    this.message = message;
    this.status = status;
    this.name = name;
  }
}

class UnauthorizedError extends Error {
  constructor(message, status = UNAUTHORIZED, name = "UNAUTHORIZED") {
    super(message, status, name);
    this.message = message;
    this.status = status;
    this.name = name;
  }
}

class BadRequestError extends Error {
  constructor(message, status = BAD_REQUEST, name = "BAD_REQUEST") {
    super(message, status, name);
    this.message = message;
    this.status = status;
    this.name = name;
  }
}

class AlreadyExistError extends Error {
  constructor(message, status = ALREADY_EXISTS, name = "ALREADY_EXISTS") {
    super(message, status, name);
    this.message = message;
    this.status = status;
    this.name = name;
  }
}

class InternalServerError extends Error {
  constructor(message, status = INTERNAL_SERVER, name = "INTERNAL_SERVER") {
    super(message, status, name);
    this.message = message;
    this.status = status;
    this.name = name;
  }
}

class SequelizeUniqueConstraintError extends ValidationError {
  constructor(
    message,
    status = ALREADY_EXISTS,
    name = "SequelizeUniqueConstraintError",
  ) {
    super(message, status, name);
    this.message = "Duplication error";
    this.status = status;
    this.name = name;
  }
}

class Warning {
  constructor(message, status, name, data) {
    this.message = message;
    this.status = WARNING;
    this.name = "Warning";
    this.data = data;
  }
}

class RandomError {
  constructor(message) {
    this.message = message;
    this.status = RANDOM;
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
