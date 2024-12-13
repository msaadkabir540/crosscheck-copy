import BugReportingModule from 'components/bug-reporting-module';

import { useToaster } from 'hooks/use-toaster';

import { useCreateBug } from 'api/v1/bugs/bugs';
import { useUpdateStatusTestCase } from 'api/v1/test-cases/test-cases';

const StartTesting = ({
  open,
  handleClose,
  backClass,
  refetch,
  projectId = null,
  editRecord,
  setEditRecord,
  statusData,
}) => {
  const { mutateAsync: _createBugHandler, isLoading: _createIsLoading } = useCreateBug();
  const { mutateAsync: _updateStatusTestCase, isLoading: _isStatusLoading } = useUpdateStatusTestCase();
  const { toastError, toastSuccess } = useToaster();

  const onSubmit = async (formData) => {
    try {
      const data = { ...formData, relatedTestCaseId: editRecord?.id };

      const res = await _createBugHandler(data);

      if (res?.newBugId) {
        const body = {
          ...statusData,
          testEvidence: statusData?.testEvidence?.base64,
          source: 'Test Case',
          relatedBug: res?.newBugId,
        };

        const res2 = await _updateStatusTestCase({
          id: editRecord.id,
          body,
        });
        refetch(editRecord.id, 'edit', res2?.testCaseData);
        toastSuccess(res2?.msg);
      }

      editRecord?.refetch && (await editRecord?.refetch());
      toastSuccess(res?.msg);

      return res;
    } catch (error) {
      toastError(error);
    }
  };

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
      isLoading={_createIsLoading || _isStatusLoading}
      onSubmit={onSubmit}
      setEditRecord={setEditRecord}
    />
  );
};

export default StartTesting;
