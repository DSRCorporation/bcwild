const Project = require("../model/project");
const ProjectAccess = require("../model/projectAccess");
const { sequelize } = require("../../../config/database");
const { customErrors } = require("../../../errorHandler/error");
const {
  customInsert,
  customFindAll,
  customUpdate,
  dataExist,
} = require("../../../helpers/commonSequelizeQueries");
const {
  projectAddValidation,
  projestRequestStatusValidation,
} = require("../validation/project");
const {
  BadRequestError,
  UnauthorizedError,
  AlreadyExistError,
} = require("../../../errorHandler/customErrorHandlers");

const addProject = async (req) => {
  let transaction;
  try {
    const { username, project_id, study_area, survey_id, creation_date } =
      req.body;

    // validation
    const { error } = projectAddValidation(req.body);
    if (error) throw new BadRequestError(error.message);

    // checking project existence
    const checkProject = await dataExist(Project, { project_id });
    if (checkProject)
      throw new AlreadyExistError("Project id is already exists");

    transaction = await sequelize.transaction();
    const projectData = await customInsert(Project, req.body, { transaction });
    await transaction.commit();
    return projectData;
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    customErrors(error.name, error.message);
  }
};

const projectList = async (req) => {
  const { page, page_size } = req.query;

  const projectData = await customFindAll(Project, {}, null, page, page_size);
  return projectData;
};

const projectRequest = async (req) => {
  let transaction;
  try {
    const { project_id, project_role } = req.body;
    const { username } = req.decoded;
    // validation
    if (!project_id || !project_role)
      throw new BadRequestError("Enter required details");

    // checking project request existence
    const checkProjectRequest = await dataExist(ProjectAccess, {
      project_id,
      username,
    });

    if (checkProjectRequest)
      throw new AlreadyExistError(
        `Your project access request is already ${checkProjectRequest.status}`,
      );

    transaction = await sequelize.transaction();
    const projectData = await customInsert(
      ProjectAccess,
      { project_id, username, project_role },
      { transaction },
    );
    await transaction.commit();
    return projectData;
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    customErrors(error.name, error.message);
  }
};

// for admin
const projectRequestList = async (req) => {
  const { page, page_size } = req.query;
  if (req.decoded.role != "admin")
    throw new UnauthorizedError("Not Authorized to access this resource!");
  const projectData = await customFindAll(
    ProjectAccess,
    { status: "pending" },
    null,
    page,
    page_size,
  );
  return projectData;
};

// for admin
const projectRequestStatusHandler = async (req) => {
  let transaction;
  try {
    const { id, project_role, status } = req.body;

    if (req.decoded.role != "admin")
      throw new UnauthorizedError("Not Authorized to access this resource!");

    // validation
    const { error } = projestRequestStatusValidation(req.body);
    if (error) throw new BadRequestError(error.message);

    // checking project request existence
    transaction = await sequelize.transaction();
    const projectData = await customUpdate(
      ProjectAccess,
      { id },
      { status, project_role },
      transaction,
    );
    await transaction.commit();
    return projectData;
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    customErrors(error.name, error.message);
  }
};

module.exports = {
  addProject,
  projectList,
  projectRequest,
  projectRequestList,
  projectRequestStatusHandler,
};
