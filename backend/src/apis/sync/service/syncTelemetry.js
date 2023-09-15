const { customCreate } = require("../sequelizeQuery/sync");
const Telemetry = require("../models/telemetry");

const syncTelemetry = async (data, { transaction }) => {
  const dto = data.data;
  let { triangulation } = dto;
  if (triangulation === "") {
    triangulation = [];
  }
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const fixedDto = { ...dto, triangulation };
  await customCreate(
    Telemetry,
    fixedDto,
    { transaction },
    { record_identifier: data.record_identifier },
  );
};

module.exports = {
  syncTelemetry,
};
