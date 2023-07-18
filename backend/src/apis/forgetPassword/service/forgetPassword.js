const crypto = require("crypto");
const {
  dataExist,
  customUpdate,
} = require("../../../helpers/commonSequelizeQueries");
const User = require("../../user/model/user");
const { sequelize } = require("../../../config/database");
const { resetMail } = require("../../../helpers/send-email");
const {
  BadRequestError,
  NotFoundError,
} = require("../../../errorHandler/customErrorHandlers");
const { customErrors } = require("../../../errorHandler/error");
const { generateHash } = require("../../../helpers/passwordHash");
const { resetPasswordValidation } = require("../validation/forgetPassword");

const forgetPassword = async (req) => {
  let transaction;
  try {
    const { email } = req.body;

    if (!email) {
      throw new BadRequestError("Email is missing");
    }

    // checking registered user
    const userData = await dataExist(User, { email });
    if (!userData) throw new NotFoundError("User is not found");

    const password = crypto.randomBytes(4).toString("hex");

    const hashPassword = await generateHash(password);
    // Initiate transaction
    transaction = await sequelize.transaction();
    const updateUser = await customUpdate(
      User,
      { email },
      { password: hashPassword },
      transaction,
    );
    const { first_name, last_name } = updateUser;
    await resetMail(email, `${first_name} ${last_name}`, password);
    await transaction.commit();
    return updateUser;
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    customErrors(error.name, error.message);
  }
};

const resetPassword = async (req) => {
  let transaction;
  try {
    const { new_password, confirm_password } = req.body;

    // validation
    const { error } = resetPasswordValidation(req.body);

    if (error) throw new BadRequestError(error.message);

    const { id } = req.decoded;

    const hashPassword = await generateHash(new_password);
    // Initiate transaction
    transaction = await sequelize.transaction();
    const data = await customUpdate(User, { id }, { password: hashPassword });
    await transaction.commit();
    return data;
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    customErrors(error.name, error.message);
  }
};

module.exports = {
  forgetPassword,
  resetPassword,
};
