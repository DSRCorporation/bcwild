function createAfterSyncHook(
  model,
  datasheetTypes,
  typeName,
  primaryKey,
  valuesTransform,
) {
  return async () => {
    await model.sync({ force: true, hooks: false });
    const definition = datasheetTypes.types.find(
      ({ name }) => name === typeName,
    );
    if (definition == null) {
      throw new Error(`Enum type '${typeName}' not found`);
    }
    const { values } = definition;
    const transformedValues = valuesTransform
      ? valuesTransform(values)
      : values;
    await model.bulkCreate(transformedValues, {
      updateOnDuplicate: [primaryKey],
    });
  };
}

function addAutoPopulateHook(model, datasheetTypes, typeName, options) {
  const primaryKey = (options && options.primaryKey) || "id";
  const valuesTransform = options && options.valuesTransform;
  model.addHook(
    "afterSync",
    createAfterSyncHook(
      model,
      datasheetTypes,
      typeName,
      primaryKey,
      valuesTransform,
    ),
  );
}

module.exports = {
  addAutoPopulateHook,
};
