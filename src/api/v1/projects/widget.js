import { useMutation, useQuery } from 'react-query';

import client from 'api/axios-config';

import { getUserData } from 'utils/user-data';
const activePlan = getUserData()?.activePlan;

export function useGetWidgetConfig(id) {
  return useQuery({
    queryKey: ['getWidgetConfig', id],
    queryFn: () => {
      return activePlan !== 'Free' ? client.get(`/api/embed-widget/get-widget-configurations/${id}`) : ``;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
}

export function useAddWidgetConfig() {
  return useMutation((body) => {
    return activePlan !== 'Free' ? client.post(`/api/embed-widget/store-widget-configurations`, body) : ``;
  });
}

export function useEditWidgetConfig() {
  return useMutation(({ id, body }) => {
    return activePlan !== 'Free' ? client.put(`/api/embed-widget/update-widget-configurations/${id}`, body) : ``;
  });
}
