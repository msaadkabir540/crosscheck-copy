import { useMutation } from 'react-query';

import client from 'api/axios-config';

import { getUserData } from 'utils/user-data';

const activePlan = getUserData()?.activePlan;

export function useGetActivities() {
  return useMutation((filters) => {
    return activePlan !== 'Free'
      ? client.post('/api/activities/get-all-activities', filters, {
          params: {
            page: filters?.page || 0,
            perPage: filters?.perPage || 25,
          },
        })
      : ``;
  });
}
