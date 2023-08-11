import {getAccessToken} from '../global';
import axiosUtility, {generateNewAccessToken} from './AxiosUtility';

const authHeader = () => {
  let token = getAccessToken();
  let AuthStr = `Bearer ${token}`;
  return {Authorization: AuthStr};
};

// TODO can/should error code be checked instead/in addition?
const isTokenExpiredError = error => {
  if (!(error.response && error.response.data)) {
    return false;
  }
  const errorMessage = error.response.data.message;
  return errorMessage.indexOf('token') > -1;
};

const requestWithAuth = async asyncAction => {
  try {
    return await asyncAction();
  } catch (error) {
    if (isTokenExpiredError(error)) {
      console.log('token expired');
      try {
        await generateNewAccessToken();
      } catch (err) {
        console.error('Error generating new access token', err);
        throw err;
      }
      return await requestWithAuth(asyncAction);
    } else {
      throw error;
    }
  }
};

const addAuthHeader = options => {
  const optionObj = options == null ? {} : options;
  const header = authHeader();
  const oldHeaders = optionObj.headers;
  const newHeaders = oldHeaders == null ? header : {...oldHeaders, header};
  return {...optionObj, headers: newHeaders};
};

export const postWithAuth = async (url, data, options) => {
  const post = async () => {
    const newOptions = addAuthHeader(options);
    return axiosUtility.post(url, data, newOptions);
  };
  return requestWithAuth(post);
};

export const getWithAuth = async (url, options) => {
  const get = async () => {
    const newOptions = addAuthHeader(options);
    return axiosUtility.get(url, newOptions);
  };
  return requestWithAuth(get);
};
