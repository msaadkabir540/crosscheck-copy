import { useMutation, useQuery } from 'react-query';

import client from 'api/axios-config';

export const getBillingDetails = () => {
  return client.get('/api/stripe/billing-section');
};

export const useGetBillingDetails = () => {
  return useQuery({
    queryKey: 'getBillingDetails',
    queryFn: () => {
      return client.get('/api/stripe/billing-section');
    },
    refetchOnWindowFocus: false,
  });
};

export const useUpdateSubscription = () => {
  return useMutation((body) => {
    return client.post('/api/stripe/update-subscription', body);
  });
};

export const useCancelSubscription = () => {
  return useMutation(() => {
    return client.put('/api/stripe/cancel-subscription');
  });
};

export const useBuyReleaseSeats = () => {
  return useMutation((body) => {
    return client.put('/api/stripe/buy-or-release-seats', body);
  });
};
