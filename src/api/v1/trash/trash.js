import { useMutation } from 'react-query';

import client from 'api/axios-config';

import { getUserData } from 'utils/user-data';

const activePlan = getUserData()?.activePlan;

export const useGetAllTrash = () => {
  return useMutation((body) => {
    return activePlan !== 'Free' ? client.post('/api/trash/get-all-trash', body) : ``;
  });
};

export const useDeleteTrashSingle = () => {
  return useMutation(({ id, body }) => {
    return client.delete(`/api/trash/remove-one-from-trash/${id}`, {
      data: body,
    });
  });
};

export const useDeleteTrashAll = () => {
  return useMutation(() => {
    return client.delete(`/api/trash/clear-all-trash`);
  });
};

export const useRestoreTrashSingle = () => {
  return useMutation(({ id, body }) => {
    return client.put(`/api/trash/restore-one-from-trash/${id}`, body);
  });
};

export const useRestoreTrashAll = () => {
  return useMutation(() => {
    return client.put(`/api/trash/restore-all-trash`);
  });
};
