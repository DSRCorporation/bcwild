import {getName} from '../../shared/utils/getName';

const getInitials = async () => {
  const {firstName, lastName} = await getName();
  if (!firstName || !lastName) {
    return 'XX';
  }
  return `${firstName[0]}${lastName[0]}`;
};

export const createAutofill = async () => {
  const initials = await getInitials();
  const now = new Date();
  const timestamp = now.getTime();
  const hour = now.getHours().toString().padStart(2, '0');
  const min = now.getMinutes().toString().padStart(2, '0');
  const transectNumber = `${hour}${min}`;
  return {
    timestamp,
    initials,
    transectNumber,
  };
};
