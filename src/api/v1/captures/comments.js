import { useMutation, useQuery } from 'react-query';

import client from 'api/axios-config';

export const useGetCheckComments = (checkId, userId) => {
  return useQuery({
    queryKey: ['comments', checkId],
    queryFn: () => {
      return client.get(`/api/check-comments/${checkId}`);
    },
    enabled: !!checkId && !!userId,
    refetchOnWindowFocus: false,
  });
};

export const useGetAnonymousCheckComments = (checkId, userId) => {
  return useQuery({
    queryKey: ['comments', checkId],
    queryFn: () => {
      return client.get(`/api/guest-comment/${checkId}`);
    },
    enabled: !!checkId && !userId,
    refetchOnWindowFocus: false,
  });
};

export const useAddAnonymousCheckComment = () => {
  return useMutation(({ body }) => {
    return client.post(`/api/guest-comment/`, body);
  });
};

export const useAddUserCheckComment = () => {
  return useMutation(({ body }) => {
    return client.post(`/api/check-comments/`, body);
  });
};

export const useEditCheckComment = () => {
  return useMutation(({ commentId, body }) => {
    return client.put(`/api/check-comments/${commentId}`, body);
  });
};

export const useDeleteCheckComment = () => {
  return useMutation(({ commentId }) => {
    return client.delete(`/api/check-comments/${commentId}`);
  });
};
