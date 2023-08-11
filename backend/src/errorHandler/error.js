const {
  UnauthorizedError,
  InternalServerError,
  NotFoundError,
  BadRequestError,
  AlreadyExistError,
  SequelizeUniqueConstraintError,
  Warning,
  RandomError,
} = require("./customErrorHandlers");

const customErrors = (name, message, data) => {
  switch (name) {
    case "UNAUTHORIZED":
      throw new UnauthorizedError(message);
    case "BAD_REQUEST":
      throw new BadRequestError(message);
    case "ALREADY_EXISTS":
      throw new AlreadyExistError(message);
    case "NOT_FOUND":
      throw new NotFoundError(message);
    case "SequelizeUniqueConstraintError":
      throw new SequelizeUniqueConstraintError(message);
    case "Warning":
      throw new Warning(message, 1, "0", data);
    case "RandomError":
      throw new RandomError(message);
    default:
      throw new InternalServerError(message);
  }
};

module.exports = { customErrors };
