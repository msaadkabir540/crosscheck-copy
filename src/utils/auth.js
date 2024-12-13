import client from 'api/axios-config';

export const setAuthHeaders = (authToken, lastAccessedWorkspace, WS) => {
  client.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
  client.defaults.headers.common['last-accessed-workspace'] = WS ? WS : lastAccessedWorkspace;
};
