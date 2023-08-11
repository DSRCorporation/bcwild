const Joi = require("joi");
const {
  BadRequestError,
} = require("../../../errorHandler/customErrorHandlers");

const projectAddValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string()
      .trim()
      .required()
      .error(new BadRequestError("Username is required")),
    project_id: Joi.string()
      .trim()
      .required()
      .error(new BadRequestError("Project id is required")),
    study_area: Joi.string()
      .trim()
      .required()
      .error(new BadRequestError("Study area is required")),
    survey_id: Joi.string()
      .required()
      .error(new BadRequestError("Survey id is required")),
    creation_date: Joi.string()
      .trim()
      .required()
      .error(new BadRequestError("Creation date is required")),
  }).unknown();
  return schema.validate(data);
};

const projestRequestStatusValidation = (data) => {
  const schema = Joi.object({
    id: Joi.number().required().error(new BadRequestError("Id is required")),
    project_role: Joi.valid("submitter", "manager")
      .required()
      .error(
        new BadRequestError("Project role is either submitter or manager"),
      ),
    status: Joi.valid("approved", "rejected")
      .required()
      .error(new BadRequestError("Status is either approved or rejected")),
  }).unknown();
  return schema.validate(data);
};
module.exports = {
  projectAddValidation,
  projestRequestStatusValidation,
};
