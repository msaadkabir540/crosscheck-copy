import { useMutation } from 'react-query';

import client from 'api/axios-config';

export const useCreateApiToken = () => {
  return useMutation((body) => {
    return client.post('/api/automate/generate-access-key', body);
  });
};

export const useGetUserApiTokens = () => {
  return useMutation(() => {
    return client.get('/api/automate/my-keys');
  });
};
