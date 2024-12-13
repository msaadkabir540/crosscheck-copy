import { useMutation, useQuery } from 'react-query';

import client from 'api/axios-config';

export function useFeaturePerMileStone(id) {
  return useQuery({
    queryKey: ['featurePerProject', id],
    queryFn: async () => {
      return client.get(`/api/features/get-all-features/${id}`);
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
}

export function useAddFeature() {
  return useMutation((body) => {
    return client.post(`/api/features/add-feature`, body);
  });
}

export function useEditFeature() {
  return useMutation(({ id, body }) => {
    return client.put(`/api/features/edit-feature/${id}`, body);
  });
}

export function useDeleteFeature() {
  return useMutation(({ id, body }) => {
    return client.delete(`/api/features/delete-feature/${id}`, body);
  });
}

export function useUpdateOrderFeature() {
  return useMutation(({ id, body }) => {
    return client.put(`/api/features/update-feature-order/${id}`, body);
  });
}

export function useMovetoFeature() {
  return useMutation(({ id, body }) => {
    return client.put(`/api/features/move-feature/${id}`, body);
  });
}
