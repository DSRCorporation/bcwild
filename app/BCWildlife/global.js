let accessToken = '';
let refreshToken = '';
let usernameG = '';
let telemetryStr = '';
let triangulationResults = {
  easting: undefined,
  northing: undefined,
  eastingError: undefined,
  northingError: undefined,
  errorArea: undefined,
};

export const setTelemetryStr = str => {
  telemetryStr = str;
};

export const getTelemetryStr = () => {
  return telemetryStr;
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
