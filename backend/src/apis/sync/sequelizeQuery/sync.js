const customCreate = async (model, data, transaction, where) => {
  const dataExists = await model.findOne({ where });
  if (dataExists) {
    return false;
  }
  return await model.create(data, transaction);
};

const customUpdate = async (model, where, data) =>
  await model.update(data, { where });

const customDelete = async (model, where) => await model.destroy({ where });

module.exports = {
  customCreate,
  customUpdate,
  customDelete,
};
