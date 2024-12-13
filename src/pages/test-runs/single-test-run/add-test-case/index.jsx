import AddTestCaseModal from 'components/add-test-case-module';

import { useToaster } from 'hooks/use-toaster';

import { useCreateTestCase } from 'api/v1/test-cases/test-cases';

import { useAddMoreTestCases } from '../../../../api/v1/test-runs/test-runs';

const Index = ({
  open,
  refetchTestRun,
  setNewTestCaseModal,
  handleClose,
  relatedRunId,
  backClass,
  projectId = null,
}) => {
  const { mutateAsync: _createTestCaseHandler, isLoading: _createIsLoading } = useCreateTestCase();
  const { mutateAsync: _addMoreTestCases, isLoading: _isAddingMore } = useAddMoreTestCases();

  const { toastError, toastSuccess } = useToaster();

  const submitHandler = async (formData) => {
    try {
      const res = await _createTestCaseHandler(formData);
      toastSuccess(res?.msg);

      const res2 =
        res && (await _addMoreTestCases({ id: relatedRunId, body: { bugs: [], testcases: [res?.testCaseData?._id] } }));
      setNewTestCaseModal(false);
      toastSuccess(res2?.msg);
      refetchTestRun();
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
      onSubmit={submitHandler}
      isLoading={_createIsLoading || _isAddingMore}
    />
  );
};

export default Index;
