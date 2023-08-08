const Joi = require("joi");
const {
  BadRequestError,
} = require("../../../errorHandler/customErrorHandlers");

const registrationValidation = (data) => {
  const schema = Joi.object({
    first_name: Joi.string()
      .required()
      .error(new BadRequestError("First name is required")),
    last_name: Joi.string()
      .required()
      .error(new BadRequestError("Last name is required")),
    email: Joi.string()
      .trim()
      .email()
      .required()
      .error(
        new BadRequestError("Email is required and should be in valid format"),
      ),
    username: Joi.string()
      .required()
      .min(5)
      .error(new BadRequestError("Username is required")),
    contact_number: Joi.string()
      .required()
      .error(new BadRequestError("Contact number is required")),
    password: Joi.string()
      .trim()
      .required()
      .min(8)
      .error(new BadRequestError("Password length should be minimum 8")),
    confirm_password: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .error(
        new BadRequestError("Confirm password doesn't match with password"),
      ),
  }).unknown();
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string()
      .required()
      .error(new BadRequestError("Username is required")),
    password: Joi.string()
      .required()
      .error(new BadRequestError("Password is required")),
  }).unknown();
  return schema.validate(data);
};

module.exports = {
  registrationValidation,
  loginValidation,
};
