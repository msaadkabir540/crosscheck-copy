import { useMutation, useQuery } from 'react-query';

import client from 'api/axios-config';

export const useGetTestCasesByFilter = () => {
  return useMutation((filters) => {
    return client.post('/api/test-cases/get-all-test-cases', filters, {
      params: {
        search: filters.search || '',
        page: filters.page || 0,
        perPage: filters.perPage,
      },
    });
  });
};

export const useGetTestCaseById = (id) => {
  return useQuery({
    queryKey: ['testCase', id],
    queryFn: () => {
      return client.get(`/api/test-cases/get-test-case/${id}`);
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

export const useCreateTestCase = () => {
  return useMutation((body) => {
    return client.post('/api/test-cases/add-test-case', body);
  });
};

export const useUpdateTestCase = () => {
  return useMutation(({ id, body }) => {
    return client.put(`/api/test-cases/edit-test-case/${id}`, body);
  });
};

export const useUpdateStatusTestCase = () => {
  return useMutation(({ id, body }) => {
    return client.put(`/api/test-cases/update-test-case-status/${id}`, body);
  });
};

export const useDeleteTestCase = () => {
  return useMutation(({ body }) => {
    return client.delete(`/api/test-cases/delete-test-cases`, {
      data: body,
    });
  });
};

export const useUpdateOrderTestCase = () => {
  return useMutation(({ id, body }) => {
    return client.put(`/api/test-cases/re-order-test-cases/${id}`, body);
  });
};

export const useBulkEditTestCase = () => {
  return useMutation(({ body }) => {
    return client.put(`/api/test-cases/bulk-edit-test-cases`, body);
  });
};

export const useExportTestCases = () => {
  return useMutation((filters) => {
    return client.post('/api/test-cases/get-all-test-cases', filters, {
      params: {
        search: filters.search || '',
        page: filters.page || 0,
        perPage: filters.perPage,
        isExporting: true,
      },
    });
  });
};

export const useImportTestCase = () => {
  return useMutation(({ body, id }) => {
    return client.post(`/api/test-cases/import-all-test-cases/${id}`, body);
  });
};
