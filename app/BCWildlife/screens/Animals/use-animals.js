import {useCallback, useEffect, useState} from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import {getUsernameG} from '../../global';
import {getWithAuth} from '../../network/auth';
import {listanimals_url} from '../../network/path';
import {RecordType} from '../../utility/RecordType';

const ENCRYPTED_STORAGE_KEY = 'animals';

const getStoredAnimals = async () => {
  const storage = await EncryptedStorage.getItem(ENCRYPTED_STORAGE_KEY);
  if (storage == null) {
    return {fetched: [], local: []};
  }
  return JSON.parse(storage);
};

const setStoredAnimals = async newStorage => {
  const stringified = JSON.stringify(newStorage);
  await EncryptedStorage.setItem(ENCRYPTED_STORAGE_KEY, stringified);
};

const tagAsFetched = animal => ({...animal, tag: 'fetched'});
const tagAsLocal = animal => ({...animal, tag: 'local'});

const updateFetchedAnimals = async fetchPromise => {
  const [currentStorage, fetched] = await Promise.all([
    getStoredAnimals(),
    fetchPromise,
  ]);
  const fetchedIds = new Set(fetched.map(({id}) => id));
  const isNotNewlyFetchedId = ({id}) => !fetchedIds.has(id);
  const oldLocal = currentStorage.local;
  const newLocal = oldLocal
    .filter(isNotNewlyFetchedId)
  // In theory, the second filtering shouldn't be needed
  // But this way a malformed list may correct itself
    .filter(({tag}) => tag === 'local');
  const newStorage = {
    local: newLocal,
    fetched: fetched.map(tagAsFetched),
  };
  await setStoredAnimals(newStorage);
};

// updater: local => new local
const updateLocalAnimals = async updater => {
  const currentStorage = await getStoredAnimals();
  const currentLocal = currentStorage.local;
  const newLocal = updater(currentLocal).map(tagAsLocal);
  const newStorage = {...currentStorage, local: newLocal};
  await setStoredAnimals(newStorage);
};

const addLocalAnimal = async animal =>
  updateLocalAnimals(local => {
    const newLocal = local.filter(
      storedAnimal => storedAnimal.id !== animal.id,
    );
    newLocal.push({...animal, timestamp: Date.now()});
    return newLocal;
  });

const deleteLocal = async animalId =>
  updateLocalAnimals(local => local.filter(({id}) => id !== animalId));

const pull = async () => {
  await updateFetchedAnimals(
    getWithAuth(listanimals_url).then(({data}) => data.animals),
  );
};

const listStoredAnimals = async () => {
  const {fetched, local} = await getStoredAnimals();
  const localIds = new Set(local.map(({id}) => id));
  const isNotLocal = ({id}) => !localIds.has(id);
  const animals = [...local, ...fetched.filter(isNotLocal)];
  return animals;
};

export const localAnimalToRecord = animal => {
  const {id, name, timestamp} = animal;
  const timeNowEpoch = Math.round((timestamp || 0) / 1000);
  const strvalue = JSON.stringify({id, name});
  const username = getUsernameG();
  const recordIdentifier = `${RecordType.Animal}_${username}_${timeNowEpoch}`;
  return [recordIdentifier, strvalue];
};

export const useAnimals = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [animals, setAnimals] = useState([]);
  const [lastChange, setLastChange] = useState(0);

  useEffect(() => {
    const updateAnimalList = async () => {
      try {
        const uptodateAnimals = await listStoredAnimals();
        setAnimals(uptodateAnimals);
      } finally {
        setLoading(false);
      }
    };
    updateAnimalList().catch(error => {
      console.error('Could not update animal list', error);
    });
  }, [lastChange]);

  const getAnimalById = useCallback(
    id => {
      return animals.find(animal => animal.id === id);
    },
    [animals],
  );

  const pullAnimals = useCallback(async () => {
    setLoading(true);
    await pull();
    setLastChange(Date.now());
  }, []);

  const saveAnimalLocally = useCallback(async animal => {
    await addLocalAnimal(animal);
    setLastChange(Date.now());
  }, []);

  const deleteLocalAnimalById = useCallback(async animalId => {
    await deleteLocal(animalId);
    setLastChange(Date.now());
  }, []);

  return {
    animals,
    loading,
    getAnimalById,
    saveAnimalLocally,
    deleteLocalAnimalById,
    pullAnimals,
  };
};
