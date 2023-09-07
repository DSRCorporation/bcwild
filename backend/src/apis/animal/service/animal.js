const { Animal } = require("../../../model/Animal");

const animalToDto = (animal) => ({
  id: animal.stringId,
  name: animal.name,
});

const listAnimals = async () => {
  console.debug('list animals')
  const animals = await Animal.findAll();
  const dtos = animals.map(animalToDto);
  dtos.sort((a, b) => a.name.localeCompare(b.name));
  return { animals: dtos };
};

module.exports = {
  listAnimals,
};
