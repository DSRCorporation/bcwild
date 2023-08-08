import {useCallback, useEffect, useState} from 'react';

const fakeAnimals = [
  {id: '1', name: 'Animal1'},
  {id: '2', name: 'Animal2'},
];

const fakeFetchDuration = 500;

export const useAnimals = () => {
  const [loading, setLoading] = useState(false);
  const [animals, setAnimals] = useState([]);

  const fetchFakeAnimals = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setAnimals(fakeAnimals);
      setLoading(false);
    }, fakeFetchDuration);
  }, []);

  const getAnimalById = useCallback(
    id => {
      return animals.find(animal => animal.id === id);
    },
    [animals],
  );

  useEffect(() => {
    fetchFakeAnimals();
  }, [fetchFakeAnimals]);
  return {animals, loading, getAnimalById};
};
