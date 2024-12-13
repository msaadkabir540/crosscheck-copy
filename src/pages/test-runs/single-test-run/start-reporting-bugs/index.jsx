import { useCallback } from 'react';

import BugReportingModule from 'components/bug-reporting-module';

import { useToaster } from 'hooks/use-toaster';

import { useCreateBug } from 'api/v1/bugs/bugs';
import { useUpdateStatusTestCase } from 'api/v1/test-cases/test-cases';

const StartTesting = ({
  open,
  handleClose,
  backClass,
  refetch,
  refetchReportedBugs,
  projectId = null,
  relatedRunId,
  editRecord,
  setEditRecord,
}) => {
  const { mutateAsync: _createBugHandler, isLoading: _createIsLoading } = useCreateBug();
  const { isLoading: _isStatusLoading } = useUpdateStatusTestCase();
  const { toastError, toastSuccess } = useToaster();

  const onSubmit = useCallback(
    async (formData) => {
      try {
        const data = {
          ...formData,
          relatedTestCaseId: editRecord?.id,
          relatedRunId: relatedRunId ?? '',
        };
        const res = await _createBugHandler(data);

        if (editRecord?.refetch) {
          await editRecord?.refetch();
        }

        toastSuccess(res?.msg);
        refetchReportedBugs && refetchReportedBugs();

        return res;
      } catch (error) {
        toastError(error);
      }
    },
    [editRecord, relatedRunId, _createBugHandler, toastSuccess, refetchReportedBugs, toastError],
  );

  return (
    <BugReportingModule
      {...{
        open,
        handleClose,
        backClass,
        refetch,
        projectId,
        editRecordId: editRecord?.id || null,
        type: editRecord?.type,
      }}
      fromRun
      relatedRunId={relatedRunId}
      isLoading={_createIsLoading || _isStatusLoading}
      onSubmit={onSubmit}
      setEditRecord={setEditRecord}
      noBackground
    />
  );
};

export default StartTesting;
