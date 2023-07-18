const services = require("../service/project");

const addProject = async (req) => await services.addProject(req);

const projectList = async (req) => await services.projectList(req);

const projectRequest = async (req) => await services.projectRequest(req);

const projectRequestList = async (req) =>
  await services.projectRequestList(req);

const projectRequestStatusHandler = async (req) =>
  await services.projectRequestStatusHandler(req);

module.exports = {
  addProject,
  projectList,
  projectRequest,
  projectRequestList,
  projectRequestStatusHandler,
};
