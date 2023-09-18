const { Animal } = require("../../../model/Animal");

const syncAnimals = async (data, { transaction }) => {
  const animal = data.data;
  if (animal.name == null) return;
  const [storedAnimal] = await Animal.findOrCreate({
    where: { stringId: animal.id },
    defaults: { name: animal.name },
    transaction,
  });
  storedAnimal.name = animal.name;
  await storedAnimal.save({ transaction });
};

module.exports = {
  syncAnimals,
};
