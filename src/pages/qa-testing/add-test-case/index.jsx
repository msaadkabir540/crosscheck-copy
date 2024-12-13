import AddTestCaseModal from 'components/add-test-case-module';

import { useToaster } from 'hooks/use-toaster';

import { useCreateTestCase } from 'api/v1/test-cases/test-cases';

const Index = ({ open, handleClose, backClass, refetch, projectId = null, editRecord, setEditRecord }) => {
  const { mutateAsync: _createTestCaseHandler, isLoading: _createIsLoading } = useCreateTestCase();

  const { toastError, toastSuccess } = useToaster();

  const submitHandler = async (formData) => {
    try {
      const res = await _createTestCaseHandler(formData);

      editRecord?.id && setEditRecord({});
      refetch(editRecord, editRecord ? 'edit' : 'add', res?.testCaseData);
      editRecord?.refetch && (await editRecord?.());
      toastSuccess(res?.msg);

      return res;
    } catch (error) {
      toastError(error);

      return null;
    }
  };

  return (
    <AddTestCaseModal
      open={open}
      handleClose={handleClose}
      backClass={backClass}
      projectId={projectId}
      type={editRecord?.type}
      editRecordId={editRecord?.id}
      setEditRecord={setEditRecord}
      onSubmit={submitHandler}
      isLoading={_createIsLoading}
    />
  );
};

export default Index;
