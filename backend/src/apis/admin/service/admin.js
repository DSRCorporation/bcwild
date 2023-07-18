const {
  BadRequestError,
  UnauthorizedError,
} = require("../../../errorHandler/customErrorHandlers");
const { loginValidation } = require("../validation/admin");
const { validPassword } = require("../../../helpers/passwordHash");
const {
  dataExist,
  customFindAll,
} = require("../../../helpers/commonSequelizeQueries");
const User = require("../../user/model/user");
const { signToken } = require("../../../helpers/auth");
const ProjectAccess = require("../../project/model/projectAccess");

const login = async (req) => {
  const { username, password } = req.body;

  // validation
  const { error } = loginValidation(req.body);

  if (error) throw new BadRequestError(error.message);

  let getLoginData = await dataExist(User, { username, role: "admin" });

  if (!getLoginData) throw new UnauthorizedError("You are not admin");

  const validCredentials = await validPassword(
    password,
    getLoginData?.password,
  );

  if (validCredentials) {
    // getting sinup request count
    const signUprequest = await customFindAll(User, { status: "pending" });
    const projectRequest = await customFindAll(ProjectAccess, {
      status: "pending",
    });
    const tokens = signToken({
      id: getLoginData.id,
      email: getLoginData.email,
      username: getLoginData.username,
      role: getLoginData.role,
    });
    getLoginData = getLoginData.dataValues;
    delete getLoginData.password;

    getLoginData.tokens = tokens;
    getLoginData.signUprequests = signUprequest.count;
    getLoginData.projectRequests = projectRequest.count;
    return getLoginData;
  }
  throw new UnauthorizedError("Enter valid credentials");
};

module.exports = {
  login,
};
