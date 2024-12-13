import { useMutation } from 'react-query';

import client from 'api/axios-config';

export const useGetNotifications = () => {
  return useMutation(() => {
    return client.get('/api/notifications/notification-settings');
  });
};

export const useUpdateNotificationsSetting = () => {
  return useMutation(({ body }) => {
    return client.put(`/api/notifications/update-notification-settings`, body);
  });
};
