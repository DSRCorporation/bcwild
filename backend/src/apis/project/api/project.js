const services = require("../service/project");

const addProject = async (req) => services.addProject(req);

const projectList = async (req) => services.projectList(req);

const projectRequest = async (req) => services.projectRequest(req);

const projectRequestList = async (req) => services.projectRequestList(req);

const projectRequestStatusHandler = async (req) =>
  services.projectRequestStatusHandler(req);

module.exports = {
  addProject,
  projectList,
  projectRequest,
  projectRequestList,
  projectRequestStatusHandler,
};
