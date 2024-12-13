import { useQuery, useMutation } from 'react-query';

import client from 'api/axios-config';

export const getAllCaptures = async (filters) => {
  const result = await client.post('/api/checks/get-all-checks', filters);

  return result;
};

export const useGetCaptureById = ({ id, onSuccess, onError }) => {
  return useQuery({
    queryKey: ['getCaptureById', id],
    queryFn: () => {
      return client.get(`/api/checks/get-check/${id}`);
    },
    enabled: !!id,
    retry: {
      maxAttempts: 1,
    },
    refetchOnWindowFocus: false,
    onSuccess: onSuccess,
    onError,
  });
};

export const usePublicCaptureById = ({ id, onSuccess, onError }) => {
  return useQuery({
    queryKey: ['getPublicCaptureById', id],
    queryFn: () => {
      return client.get(`/api/checks/get-check/public/${id}`);
    },
    enabled: !!id,
    retry: {
      maxAttempts: 1,
    },
    refetchOnWindowFocus: false,
    onSuccess: onSuccess,
    onError,
  });
};

export const deleteCaptureById = (id) => {
  return client.delete(`/api/checks/delete-check/${id}`);
};

export const useGetAllCaptures = () => {
  return useMutation(getAllCaptures);
};

export const useDeleteCaptureById = () => {
  return useMutation(deleteCaptureById);
};
