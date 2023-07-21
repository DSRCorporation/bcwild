const { NotFoundError } = require("../errorHandler/customErrorHandlers");

const dataExist = async (model, where, include, attributes) => {
  const item = await model.findOne({ where, inlude: include, attributes });
  return item;
};

const customInsert = async (model, data, transaction) =>
  model.create(data, transaction);

const customFindAll = async (
  model,
  where,
  include,
  page,
  // eslint-disable-next-line camelcase
  page_size,
  attributes,
) => {
  // eslint-disable-next-line no-param-reassign, camelcase
  page = page ? (page - 1) * page_size : null;
  // eslint-disable-next-line no-param-reassign, camelcase
  page_size = page_size || null;

  const item = await model.findAndCountAll({
    where,
    attributes,
    include,
    offset: page,
    // eslint-disable-next-line camelcase
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
  return model.findOne({ where });
};

const customDelete = async (model, where, transaction) => {
  const updatedItem = await model.findOne({ where });

  if (!updatedItem) throw new NotFoundError("Record not found");
  // Found an item, update it
  await model.destroy({ where, transaction });

  return updatedItem;
};

const setMandatoryProperty = (mainModel, propertyModel, foreignKeyName) => {
  const options = foreignKeyName
    ? {
        allowNull: false,
      }
    : {
        name: foreignKeyName,
        allowNull: false,
      };
  propertyModel.hasMany(mainModel, options);
  mainModel.belongsTo(propertyModel, options);
};

module.exports = {
  dataExist,
  customInsert,
  customFindAll,
  customUpdate,
  customDelete,
  setMandatoryProperty,
};
