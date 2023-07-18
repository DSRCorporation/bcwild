const { NotFoundError } = require("../errorHandler/customErrorHandlers");

const dataExist = async (model, where, include, attributes) => {
  const item = await model.findOne({ where, inlude: include, attributes });
  return item;
};

const customInsert = async (model, data, transaction) =>
  await model.create(data, transaction);

const customFindAll = async (
  model,
  where,
  include,
  page,
  page_size,
  attributes,
) => {
  page = page ? (page - 1) * page_size : null;
  page_size = page_size || null;

  const item = await model.findAndCountAll({
    where,
    attributes,
    include,
    offset: page,
    limit: page_size,
  });
  if (!item) throw new NotFoundError("Record not found");
  return item;
};

const customUpdate = async (model, where, updateItem, transaction) => {
  const updatedItem = await model.findOne({ where });
  if (!updatedItem) throw new NotFoundError("Record not found");
  // Found an item, update it
  await model.update(updateItem, { where }, transaction);
  return await model.findOne({ where });
};

const customDelete = async (model, where, transaction) => {
  const updatedItem = await model.findOne({ where });

  if (!updatedItem) throw new NotFoundError("Record not found");
  // Found an item, update it
  await model.destroy({ where, transaction });

  return updatedItem;
};

module.exports = {
  dataExist,
  customInsert,
  customFindAll,
  customUpdate,
  customDelete,
};
