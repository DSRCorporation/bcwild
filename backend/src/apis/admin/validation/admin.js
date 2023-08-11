const Joi = require("joi");
const {
  BadRequestError,
} = require("../../../errorHandler/customErrorHandlers");

const loginValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string()
      .required()
      .min(5)
      .error(new BadRequestError("Username is required")),
    password: Joi.string()
      .required()
      .error(new BadRequestError("Password is required")),
  }).unknown();
  return schema.validate(data);
};

const signupRequestValidation = (data) => {
  const schema = Joi.object({
    id: Joi.number().required().error(new BadRequestError("id is required")),
    status: Joi.valid("approved", "rejected")
      .required()
      .error(new BadRequestError("status is either approved or rejected")),
  }).unknown();
  return schema.validate(data);
};

module.exports = {
  loginValidation,
  signupRequestValidation,
};
