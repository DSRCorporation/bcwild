const Joi = require("joi");
const {
  BadRequestError,
} = require("../../../errorHandler/customErrorHandlers");

const resetPasswordValidation = (data) => {
  const schema = Joi.object({
    new_password: Joi.string()
      .trim()
      .required()
      .min(8)
      .error(new BadRequestError("Password length should be minimum 8")),
    confirm_password: Joi.any()
      .equal(Joi.ref("new_password"))
      .required()
      .error(
        new BadRequestError("Confirm password doesn't match with password"),
      ),
  }).unknown();
  return schema.validate(data);
};

module.exports = {
  resetPasswordValidation,
};
