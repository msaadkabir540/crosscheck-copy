// NOTE: import isBrowser from "@/utils/isBrowser";
import { jwtDecode } from 'jwt-decode';

import { envObject } from '../constants/environmental';

export function setToken(token) {
  localStorage.setItem('accessToken', token);
}

export function getToken() {
  return localStorage.getItem('accessToken');
}

export const getLastWorkspace = () => {
  return JSON.parse(localStorage?.getItem('user'));
};

export function removeToken() {
  localStorage.clear();
  // NOTE: localStorage.removeItem('accessToken');
}

export const verifyToken = (token) => {
  const { exp } = jwtDecode(token);

  if (new Date(exp * 1000) >= new Date()) {
    return true;
  } else {
    return false;
  }
};

const chrome = window.chrome || {};

export const sendTokenToChromeExtension = (token) => {
  if (envObject.EXTENSION_ID) {
    if (!window.chrome || !chrome.runtime || !chrome.runtime.sendMessage) {
      console.error('Chrome extension API is not available.');

      return;
    }

    chrome.runtime.sendMessage(envObject.EXTENSION_ID, { token }, (response) => {
      if (!response.success) {
        return response;
      }
    });
  }
};
