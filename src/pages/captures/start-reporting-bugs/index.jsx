import { useCallback } from 'react';

import BugReportingModule from 'components/bug-reporting-module';

import { useToaster } from 'hooks/use-toaster';

import { useCreateBug } from 'api/v1/bugs/bugs';
import { useUpdateStatusTestCase } from 'api/v1/test-cases/test-cases';

const StartTesting = ({
  open,
  source,
  handleClose,
  backClass,
  refetch,
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
        if (!formData.testedVersion) {
          delete formData.testedVersion;
        }

        const data = {
          ...formData,
        };
        const res = await _createBugHandler(data);

        if (editRecord?.refetch) {
          await editRecord?.refetch();
        }

        toastSuccess(res?.msg);

        return res;
      } catch (error) {
        toastError(error);
      }
    },
    [editRecord, _createBugHandler, toastSuccess, toastError],
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
        source,
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
