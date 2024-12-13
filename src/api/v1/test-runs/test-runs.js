import { useQuery, useMutation } from 'react-query';

import client from 'api/axios-config';

export const useGetTestRunsByFilter = () => {
  return useMutation((filters) => {
    return client.post('/api/test-runs/get-all-test-runs', filters, {
      params: {
        search: filters.search || '',
        page: filters.page || 0,
        perPage: filters.perPage,
      },
    });
  });
};

export const useDeleteTestRun = () => {
  return useMutation(({ body }) => {
    return client.delete(`/api/test-runs/delete-test-run`, {
      data: body,
    });
  });
};

export const useGetTestRunById = ({ id, tested, search }) => {
  const params = tested !== 'all' ? { tested, search } : { search };

  return useQuery({
    queryKey: ['testRun', id, tested, search],
    queryFn: () => {
      return client.get(`/api/test-runs/get-test-run/${id}`, { params });
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
    cacheTime: 0,
  });
};

export const useGetTestRunBugsById = ({ id }) => {
  return useQuery({
    queryKey: ['testRunBug', id],
    queryFn: () => {
      return client.get(`/api/test-runs/bugs-of-a-run/${id}`);
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
    cacheTime: 0,
  });
};

export const useGetTestSummaryById = ({ id }) => {
  return useQuery({
    queryKey: ['testRun', id],
    queryFn: () => {
      return client.get(`api/test-runs/summary-report/${id}`);
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
    cacheTime: 0,
  });
};

export const useCreateTestRun = () => {
  return useMutation((body) => {
    return client.post('/api/test-runs/add-test-run', body);
  });
};

export const useCreateBugsRun = () => {
  return useMutation((body) => {
    return client.post('/api/test-runs/add-bug-run', body);
  });
};

export const useUpdateTestRun = () => {
  return useMutation(({ id, body }) => {
    return client.put(`/api/test-runs/edit-test-run/${id}`, body);
  });
};

export const useUpdateBugsRun = () => {
  return useMutation(({ id, body }) => {
    return client.put(`api/test-runs/bug-test-run/${id}`, body);
  });
};

export const useChangePriorityTestRun = () => {
  return useMutation(({ id, body }) => {
    return client.put(`/api/test-runs/change-priority/${id}`, body);
  });
};

export const useUpdateTestCaseOfRun = () => {
  return useMutation(({ id, body }) => {
    return client.put(`/api/test-runs/update-test-case-of-run/${id}`, body);
  });
};

export const useUpdateBugOfRun = () => {
  return useMutation(({ id, body }) => {
    return client.put(`/api/test-runs/update-bug-of-run/${id}`, body);
  });
};

export const useCloseTestRuns = () => {
  return useMutation((id) => {
    return client.put(`/api/test-runs/close-test-run/${id}`);
  });
};

export const useAddMoreTestCases = () => {
  return useMutation(({ id, body }) => {
    return client.put(`/api/test-runs/add-more-testcases-or-bugs/${id}`, body);
  });
};

export const useDeleteTestCasesFromRun = () => {
  return useMutation(({ id, body }) => {
    return client.delete(`/api/test-runs/remove-test-cases-from-run/${id}`, { data: body });
  });
};

export const useDeleteBugsFromRun = () => {
  return useMutation(({ id, body }) => {
    return client.delete(`/api/test-runs/remove-bugs-from-run/${id}`, { data: body });
  });
};

export const useExportTestRuns = () => {
  return useMutation((filters) => {
    return client.post('/api/test-runs/get-all-test-runs', filters, {
      params: {
        search: filters.search || '',
        page: filters.page || 0,
        perPage: filters.perPage,
        isExporting: true,
      },
    });
  });
};
