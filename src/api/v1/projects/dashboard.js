import { useMutation, useQuery } from 'react-query';

import client from 'api/axios-config';

export const useTestCasesSummaryMilleStoneWise = ({ id, filters }) => {
  return useQuery({
    queryKey: ['testCasesSummaryMilleStoneWise', id, filters?.testedEnvironment, filters?.testedVersion],
    queryFn: () => {
      return client.get(`/api/widgets/milestone-test-cases-summary/${id}`, { params: filters });
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

export function useProfileTestCasesSummaryMilleStoneWise(id) {
  return useQuery({
    queryKey: ['profileTestCasesSummaryMilleStoneWise', id],
    queryFn: () => {
      return client.get(`/api/widgets/feature-test-cases-summary/${id}`);
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
}

export function useBugsReported({ id, filters }) {
  return useQuery({
    queryKey: ['bugsReported', id, filters?.startDate, filters?.endDate],
    queryFn: () => {
      return client.get(`/api/widgets/bugs-reported-widget/${id}`, { params: filters });
    },
    enabled: !!id && !!filters?.startDate && !!filters?.endDate,
    refetchOnWindowFocus: false,
  });
}

export function useAddShareableLink() {
  return useMutation((body) => {
    return client.post(`/api/shared/store-shareable-link`, body);
  });
}

export function useEditShareableLink() {
  return useMutation((body) => {
    return client.put(`/api/shared/update-shareable-link`, body);
  });
}

export function useShareableWidget() {
  return useMutation((body) => {
    return client.post(`/api/shared/bugs-widget`, body);
  });
}

export const useGetBugsStatus = () => {
  return useMutation(({ id, filters }) => {
    return client.post(`/api/widgets/bugs-status-widget/${id}`, filters);
  });
};

export const useGetBugsTypes = () => {
  return useMutation(({ id, filters }) => {
    return client.post(`/api/widgets/bugs-types-widget/${id}`, filters);
  });
};

export const useGetBugsSeverity = () => {
  return useMutation(({ id, filters }) => {
    return client.post(`/api/widgets/bugs-severity-widget/${id}`, filters);
  });
};

export const useGetAnalytics = ({ id, filters }) => {
  return useQuery({
    queryKey: ['overallAnalytics', id, filters?.testedEnvironment, filters?.testedVersion],
    queryFn: () => {
      return client.get(`/api/widgets/overall-analytics-widget/${id}`, { params: filters });
    },
    refetchOnWindowFocus: false,
  });
};

export const useGetBugsAging = ({ id, filters }) => {
  return useQuery({
    queryKey: ['bugsAgingWidget', id, filters?.testedEnvironment, filters?.testedVersion],
    queryFn: () => {
      return client.get(`/api/widgets/bugs-aging-widget/${id}`, { params: filters });
    },
    refetchOnWindowFocus: false,
  });
};

export const useBugReporter = () => {
  return useMutation(({ id, filters }) => {
    return client.post(`/api/widgets/bugs-reporter-widget/${id}`, filters);
  });
};

export const useDevelopersBug = () => {
  return useMutation(({ id, filters }) => {
    return client.post(`/api/widgets/developer-bugs-widget/${id}`, filters);
  });
};
