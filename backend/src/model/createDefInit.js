// Populate a standard definition table from a JSON file.

function createDefInit(model, datasheetTypes, typeName) {
  return async (transaction) => {
    await model.bulkCreate(
      datasheetTypes.types.find(({ name }) => name === typeName).values,
      { transaction, updateOnDuplicate: ["id"] },
    );
  };
}

module.exports = {
  createDefInit,
};
