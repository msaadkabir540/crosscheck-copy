import { useMutation, useQuery } from 'react-query';

import client from 'api/axios-config';

export const useGetCustomDashboards = () => {
  return useQuery({
    queryKey: ['custom-dashboards'],
    queryFn: () => {
      return client.get(`/api/custom-dashboard/`);
    },

    refetchOnWindowFocus: false,
  });
};

export const useGetCustomDashboardsById = (id) => {
  return useQuery({
    queryKey: ['custom-dashboards', id],
    queryFn: () => {
      return client.get(`/api/custom-dashboard/${id}`);
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

export const useCreateDashboard = () => {
  return useMutation(({ body }) => {
    return client.post(`/api/custom-dashboard/`, body);
  });
};

export const useUpdateDashboardName = () => {
  return useMutation(({ id, body }) => {
    return client.put(`/api/custom-dashboard/update-name/${id}`, body);
  });
};

export const useUpdateDashboardLayout = () => {
  return useMutation(({ id, body }) => {
    return client.put(`api/custom-dashboard/update-dashboard-layout/${id}`, body);
  });
};

export const useUpdateDashboardShareWith = () => {
  return useMutation(({ id, body }) => {
    return client.put(`/api/custom-dashboard/add-members/${id}`, body);
  });
};

export const useRemoveDashboardShareWithMember = () => {
  return useMutation(({ id, body }) => {
    return client.delete(`/api/custom-dashboard/remove-member/${id}`, { data: body });
  });
};

export const useDeleteDashboard = () => {
  return useMutation(({ id }) => {
    return client.delete(`api/custom-dashboard/${id}`);
  });
};
