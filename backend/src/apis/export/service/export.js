const converter = require("json-2-csv");
const fs = require("fs");
const Telemetry = require("../../sync/models/telemetry");
const CameraTrapData = require("../../sync/models/camera");
const {
  customFindAll,
  customInsert,
} = require("../../../helpers/commonSequelizeQueries");
const { dataExportMail } = require("../../../helpers/send-email");
const ExportLog = require("../model/export_log");
const { sequelize } = require("../../../config/database");
const { customErrors } = require("../../../errorHandler/error");

// eslint-disable-next-line consistent-return
const exportData = async (req) => {
  let transaction;
  try {
    // eslint-disable-next-line camelcase
    const { email, project_id } = req.body;

    const { username } = req.decoded;

    // eslint-disable-next-line camelcase
    const telemetryData = customFindAll(Telemetry, { project_id });

    // eslint-disable-next-line camelcase
    const cameraTrapData = customFindAll(CameraTrapData, { project_id });
    const [telemetry, cameraTrap] = await Promise.all([
      telemetryData,
      cameraTrapData,
    ]);

    const jsonData = { telemetry: telemetry.rows, cameraTrap: cameraTrap.rows };

    const fields = ["telemetry.rows.triangulation"];
    const csv = await converter.json2csv(jsonData, {
      fields,
      unwindArrays: true,
    });

    fs.writeFileSync("dataExport.csv", csv, "utf-8");
    const file = fs.readFileSync("dataExport.csv");

    const sendMail = await dataExportMail(email, username, file);
    const exportLogData = {
      username,
      export_email: email,
      // eslint-disable-next-line camelcase
      project_id,
    };

    transaction = await sequelize.transaction();
    await customInsert(ExportLog, exportLogData, { transaction });
    fs.unlinkSync("dataExport.csv");
    await transaction.commit();

    return sendMail;
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    customErrors(error.name, error.message);
  }
};

module.exports = {
  exportData,
};
