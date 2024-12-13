import { useMutation, useQuery } from 'react-query';

import client from 'api/axios-config';

export const useCreateWidget = () => {
  return useMutation(({ id, body }) => {
    return client.post(`/api/custom-dashboard/create-widget/${id}`, body);
  });
};

export const useUpdateWidget = () => {
  return useMutation(({ id, widgetId, body }) => {
    return client.put(`/api/custom-dashboard/${id}/widget/${widgetId}`, body);
  });
};

export const useDeleteWidget = () => {
  return useMutation(({ id, widgetId }) => {
    return client.delete(`/api/custom-dashboard/${id}/widget/${widgetId}`);
  });
};

export const useGetWidgetDetailsById = (id, widgetId) => {
  return useQuery({
    queryKey: ['widget-details', id, widgetId],
    queryFn: () => {
      return client.get(`/api/custom-dashboard/${id}/widget/${widgetId}`);
    },
    enabled: !!id && !!widgetId,
    refetchOnWindowFocus: false,
  });
};

export const useGetWidgetDetailsByDataId = () => {
  return useMutation(({ id, widgetId, body }) => {
    return client.post(`/api/custom-dashboard/${id}/get-widget-with-data/${widgetId}`, body);
  });
};
