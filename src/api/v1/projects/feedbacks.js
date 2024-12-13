import { useMutation, useQuery } from 'react-query';

import client from 'api/axios-config';

export function useGetFeedBacks({ projectId, search, sortFilters }) {
  return useQuery({
    queryKey: ['getFeedbacks', projectId, search, sortFilters],
    queryFn: () => {
      return client.get(`/api/feedbacks/get-feedbacks/${projectId}`, {
        params: { search, ...sortFilters },
      });
    },
    enabled: !!projectId,
    refetchOnWindowFocus: false,
  });
}

export function useDeleteFeedBacks() {
  return useMutation((body) => {
    return client.delete(`/api/feedbacks/delete-feedbacks`, {
      data: body,
    });
  });
}

export function useReportBugFromFeedBack() {
  return useMutation(({ id, body }) => {
    return client.post(`/api/feedbacks/report-bug-from-feedback/${id}`, body);
  });
}
