import { useCallback } from 'react';

import AddTestCaseModal from 'components/add-test-case-module';

import { useToaster } from 'hooks/use-toaster';

import { useCreateTestCase, useUpdateTestCase } from 'api/v1/test-cases/test-cases';

const Index = ({
  open,
  refetch,
  backClass,
  editRecord,
  handleClose,
  setEditRecord,
  duplicateRecord,
  projectId = null,
  setDuplicateRecord,
}) => {
  const { mutateAsync: _createTestCaseHandler, isLoading: _createIsLoading } = useCreateTestCase();
  const { mutateAsync: _updateTestCaseHandler, isLoading: _updateIsLoading } = useUpdateTestCase();
  const { toastError, toastSuccess } = useToaster();

  const submitHandler = useCallback(
    async (formData) => {
      try {
        const res = editRecord
          ? await _updateTestCaseHandler({ id: editRecord.id, body: formData })
          : await _createTestCaseHandler(formData);

        editRecord?.id && setEditRecord({});
        duplicateRecord?.id && setDuplicateRecord({});
        refetch(editRecord && editRecord, editRecord ? 'edit' : 'add', res?.testCaseData);

        toastSuccess(`${res?.msg} ${editRecord ? `(${res?.testCaseData?.testCaseId})` : ''}`);

        return res;
      } catch (error) {
        toastError(error);

        return null;
      }
    },
    [
      refetch,
      editRecord,
      toastError,
      toastSuccess,
      setEditRecord,
      duplicateRecord,
      setDuplicateRecord,
      _updateTestCaseHandler,
      _createTestCaseHandler,
    ],
  );

  return (
    <AddTestCaseModal
      open={open}
      handleClose={handleClose}
      backClass={backClass}
      projectId={projectId}
      editRecordId={editRecord?.id}
      setEditRecord={setEditRecord}
      onSubmit={submitHandler}
      setDuplicateRecord={setDuplicateRecord}
      duplicateRecordId={duplicateRecord?.id}
      isLoading={_createIsLoading || _updateIsLoading}
    />
  );
};

export default Index;
