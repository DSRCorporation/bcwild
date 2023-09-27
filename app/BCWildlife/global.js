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

// isNew flag is used by the telemetry form on creation in order to keep or clear the data.
// If the flag is true, the data comes from the triangulation screen, so it is fresh and must be used.  When the telemetry form sees it, it clears the flag.
// If the flag is false, the data must originate from a previous edit, so it is cleared.
export const setTriangulationResults = (
  easting,
  northing,
  eastingError,
  northingError,
  errorArea,
  isNew,
) => {
  triangulationResults = {
    easting: easting,
    northing: northing,
    eastingError: eastingError,
    northingError: northingError,
    errorArea: errorArea,
    isNew: isNew,
  };
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
