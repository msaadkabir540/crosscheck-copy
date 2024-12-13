import { useMutation, useQuery } from 'react-query';

import client from 'api/axios-config';

export function useMilestonePerProject(id) {
  return useQuery({
    queryKey: ['milestonePerProject', id],
    queryFn: async () => {
      return client.get(`/api/milestones/get-all-milestones/${id}`);
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
}

export function useAddMilestone() {
  return useMutation((body) => {
    return client.post(`/api/milestones/add-milestone`, body);
  });
}

export function useEditMilestone() {
  return useMutation(({ id, body }) => {
    return client.put(`/api/milestones/edit-milestone/${id}`, body);
  });
}

export function useDeleteMilestone() {
  return useMutation(({ id, body }) => {
    return client.delete(`/api/milestones/delete-milestone/${id}`, body);
  });
}

export function useUpdateOrderMilestone() {
  return useMutation(({ id, body }) => {
    return client.put(`/api/milestones/update-milestone-order/${id}`, body);
  });
}
