const customCreate = async (model, data, transaction, where) => {
  const dataExists = await model.findOne({ where });
  if (dataExists) {
    return false;
  }
  return model.create(data, transaction);
};

const customUpdate = async (model, where, data) =>
  model.update(data, { where });

const customDelete = async (model, where) => model.destroy({ where });

module.exports = {
  customCreate,
  customUpdate,
  customDelete,
};
