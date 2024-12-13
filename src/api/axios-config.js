import axios from 'axios';
import _ from 'lodash';

import isBrowser from 'utils/is-browser';
import { getToken, getLastWorkspace } from 'utils/token';

import { envObject } from '../constants/environmental';

const { API_URL } = envObject;

const client = axios.create({
  baseURL: API_URL || 'http://localhost:8080',
});

export const setAuthHeader = (token) => {
  if (token) {
    client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    client.defaults.headers.common['last-accessed-workspace'] = getLastWorkspace()?.lastAccessedWorkspace || '';
  }
};

if (isBrowser()) {
  setAuthHeader(getToken());
}

const onSuccess = function (response) {
  const isLoginRequest =
    response.config.url.endsWith('/login') ||
    response.config.url.endsWith('/accept-invite') ||
    response.config.url.endsWith('/activate-account') ||
    response.config.url.endsWith('/google-login') ||
    response.config.url.endsWith('/onboarding');

  return isLoginRequest ? response : response.data;
};

const onError = function (error) {
  console.error('Request Failed:', error.config);

  if (error.response) {
    console.error('Status:', error.response.status);
    console.error('Data:', error.response.data);
    console.error('Headers:', error.response.headers);
  } else {
    console.error('Error Message:', error.message);
  }

  return Promise.reject({
    msg: !error?.response
      ? 'Network Issue!'
      : error?.response?.data?.msg || _.values(error?.response?.data?.error)[0] || error?.response?.data?.message,
    validations: error?.response?.data?.error ? error?.response?.data?.error : null,
    status: error?.response?.status || 'not status',
  });
};

client.interceptors.request.use((config) => {
  const token = getToken();

  if (
    !config?.headers?.common?.Authorization ||
    config?.headers?.common?.Authorization?.search('null') !== -1 ||
    token
  ) {
    config.headers['Authorization'] = token;
  }

  return config;
});

client.interceptors.response.use(onSuccess, onError);
export default client;
