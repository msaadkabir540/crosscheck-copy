import { useMutation } from 'react-query';

import client from 'api/axios-config';

export function useUpdateFCMToken() {
  return useMutation((body) => {
    return client.put('/api/users/update-fcm-token', body);
  });
}
