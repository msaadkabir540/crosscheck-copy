import { useCallback, useEffect } from 'react';

import { useToaster } from 'hooks/use-toaster';

import { useAddFeature } from 'api/v1/feature/feature';
import { useAddMilestone } from 'api/v1/milestone/milestone';

export const useAddFeatureAndMilestones = ({
  data,
  refetch,
  setValue,
  PROJECT_ID = '',
  MILESTONE_ID = '',
  FEATURE_ID = '',
  featuresOptions,
  setMilestoneFirst,
  mileStonesOptions,
  allowSetValue = true,
}) => {
  const { toastSuccess, toastError } = useToaster();
  const { mutateAsync: _addFeatureHandler } = useAddFeature();
  const { mutateAsync: _addMilestoneHandler } = useAddMilestone();

  useEffect(() => {
    if (allowSetValue) {
      if (typeof MILESTONE_ID === 'string') {
        const validMilestoneId = data?.mileStonesOptions?.find((x) => x?._id === MILESTONE_ID);

        if (validMilestoneId?._id) {
          setValue('milestoneId', validMilestoneId);
        }
      }

      if (typeof FEATURE_ID === 'string') {
        const validFeatureId = data?.featuresOptions?.find((x) => x?._id === FEATURE_ID);

        if (validFeatureId?._id) {
          setValue('featureId', validFeatureId);
        }
      }
    }
  }, [data, setValue, MILESTONE_ID, FEATURE_ID, allowSetValue]);

  const onMilestoneChange = useCallback(
    async ({ selectedOption }) => {
      setValue('featureId', null);
      setMilestoneFirst(false);
      const milestoneName = selectedOption?.value;

      if (
        milestoneName &&
        mileStonesOptions?.every((option) => option?.name !== milestoneName && option?._id !== milestoneName)
      ) {
        try {
          const res = await _addMilestoneHandler({ name: milestoneName, projectId: PROJECT_ID });
          toastSuccess(res.msg);

          if (res?.milestone) {
            const newMilestone = {
              ...res?.milestone,
              value: res?.milestone?._id,
              label: res?.milestone?.name,
            };
            setValue('milestoneId', newMilestone);
            await refetch();
          }
        } catch (error) {
          toastError(error);
        }
      }
    },
    [
      refetch,
      setValue,
      toastError,
      PROJECT_ID,
      toastSuccess,
      mileStonesOptions,
      setMilestoneFirst,
      _addMilestoneHandler,
    ],
  );

  const onFeatureChange = useCallback(
    async ({ selectedOption }) => {
      const featureName = selectedOption?.value;

      if (
        featureName &&
        MILESTONE_ID?._id &&
        featuresOptions?.every((option) => option?.name !== featureName && option?._id !== featureName)
      ) {
        try {
          const res = await _addFeatureHandler({
            name: featureName,
            projectId: PROJECT_ID,
            milestoneId: MILESTONE_ID?._id,
          });
          toastSuccess(res.msg);

          if (res?.feature) {
            const newFeature = {
              ...res?.feature,
              value: res?.feature?._id,
              label: res?.feature?.name,
            };
            setValue('featureId', newFeature);
            await refetch();
          }
        } catch (error) {
          toastError(error);
        }
      } else if (featureName && !MILESTONE_ID?._id) {
        setMilestoneFirst(true);
        toastError({ msg: 'First Select a Milestone!' });
        setValue('featureId', null);
      }
    },
    [
      MILESTONE_ID?._id,
      featuresOptions,
      _addFeatureHandler,
      PROJECT_ID,
      toastSuccess,
      setValue,
      refetch,
      toastError,
      setMilestoneFirst,
    ],
  );

  return { onMilestoneChange, onFeatureChange };
};
