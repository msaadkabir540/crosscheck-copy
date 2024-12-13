import { useQuery, useMutation } from 'react-query';

import client from 'api/axios-config';

export const useGetTimeTrackingHistoryById = (id) => {
  return useQuery({
    queryKey: ['time', id],
    queryFn: () => {
      return client.get(`/api/test-runs/timer-history/${id}`);
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

export const useDeleteTimeEntry = () => {
  return useMutation(({ id, body }) => {
    return client.delete(`/api/test-runs/delete-tracked-time/${id}`, { data: body });
  });
};

export const useAddManualEntry = () => {
  return useMutation(({ id, body }) => {
    return client.post(`api/test-runs/manual-track/${id}`, body);
  });
};

export const useEditTrackedTime = () => {
  return useMutation(({ id, body }) => {
    return client.put(`/api/test-runs/edit-tracked-time/${id}`, body);
  });
};

export const useStartTime = () => {
  return useMutation(({ id, body }) => {
    return client.post(`api/test-runs/start-timer/${id}`, body);
  });
};

export const useStopTime = () => {
  return useMutation(({ id, body }) => {
    return client.post(`api/test-runs/stop-timer/${id}`, body);
  });
};
