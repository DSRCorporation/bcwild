import RecordsRepo from './utility/RecordsRepo';

let accessToken = '';
let refreshToken = '';
let usernameG = '';
let triangulationResults = {
  easting: undefined,
  northing: undefined,
  eastingError: undefined,
  northingError: undefined,
  errorArea: undefined,
};

export const setTelemetryStr = async str => {
  if (str && str.length > 0) {
    await RecordsRepo.saveTriangulationState(str);
  } else {
    await RecordsRepo.clearTriangulationState();
  }
};

export const getTelemetryStr = async () => {
  return await RecordsRepo.getTriangulationState();
};

export const setTriangulationResults = (
  easting,
  northing,
  eastingError,
  northingError,
  errorArea,
) => {
  triangulationResults = {
    easting: easting,
    northing: northing,
    eastingError: eastingError,
    northingError: northingError,
    errorArea: errorArea,
  };
};

export const clearTriangulationResults = () => {
  setTriangulationResults(
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  );
};

export const getTriangulationResults = () => {
  return triangulationResults;
};

export const setUsernameG = name => {
  usernameG = name;
};

export const getUsernameG = () => {
  return usernameG;
};

export const setAccessToken = token => {
  accessToken = token;
};

export const setRefreshToken = token => {
  refreshToken = token;
};

export const getRefreshToken = () => {
  return refreshToken;
};

export const getAccessToken = () => {
  return accessToken;
};
