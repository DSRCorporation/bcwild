import axios from 'axios';
import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from '../global';
import EncryptedStorage from 'react-native-encrypted-storage';
import { refreshtoken_url } from './path';


class AxiosUtility {
  constructor() {
    this.instance = axios.create();
    this.instance.interceptors.request.use(this.logRequest);
    this.instance.interceptors.response.use(this.logResponse);
  }

  logRequest(request) {
    console.log(`Request:${request.headers} ${request.method} ${request.url}`, request.data);
    return request;
  }

  logResponse(response) {
    console.log(`Response: ${response.status} ${response.config.url}`, response.data);
    return response;
  }



  async get(url, config) {
    const response = await this.instance.get(url, config);
    return response.data;
  }



  async post(url, data, config) {
    const response = await this.instance.post(url, data, config);
    return response.data;
  }


  getInstanceWithoutToken() {
    this.instance = axios.create();
    this.instance.interceptors.request.use(this.logRequest);
    this.instance.interceptors.response.use(this.logResponse);
    return this.instance;
  }
}

export const generateNewAccessToken = async () => {
  let refreshTokenVariable = getRefreshToken();

  const data = {
    refreshToken: refreshTokenVariable
  };

  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const response = await axios.post(refreshtoken_url, data, config);
    const accessToken = response.data.data.accessToken;
    const refreshToken = response.data.data.refreshToken;
    console.log(`Access token: ${accessToken}`);
    setAccessToken(accessToken);
    EncryptedStorage.setItem("accessToken", accessToken);
    console.log(`Refresh token: ${refreshToken}`);
    setRefreshToken(refreshToken);
    EncryptedStorage.setItem("refreshToken", refreshToken);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
};


export default new AxiosUtility();
