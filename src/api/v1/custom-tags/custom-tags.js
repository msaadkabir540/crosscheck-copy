import { useMutation, useQuery } from 'react-query';

import client from 'api/axios-config';

export const useGetTags = ({ id }) => {
  return useQuery({
    queryKey: ['tags', id],
    queryFn: () => {
      return client.get(`api/tags/project-tags/${id}`);
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

export function useCreateTag() {
  return useMutation((body) => {
    return client.post('/api/tags/add-tag', body);
  });
}

export function useRenameTag() {
  return useMutation(({ id, body }) => {
    return client.put(`/api/tags/rename-tag/${id}`, body);
  });
}

export function useDeleteTag() {
  return useMutation((id) => {
    return client.delete(`/api/tags/delete-tag/${id}`);
  });
}
