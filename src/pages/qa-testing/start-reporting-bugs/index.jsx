import { useCallback } from 'react';

import BugReportingModule from 'components/bug-reporting-module';

import { useToaster } from 'hooks/use-toaster';

import { useCreateBug, useUpdateBug } from 'api/v1/bugs/bugs';

const StartTesting = ({
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
  const { mutateAsync: _createBugHandler, isLoading: _createIsLoading } = useCreateBug();
  const { mutateAsync: _createUpdateHandler, isLoading: _updateIsLoading } = useUpdateBug();
  const { toastError, toastSuccess } = useToaster();

  const onSubmit = useCallback(
    async (formData) => {
      try {
        const res =
          editRecord?.id && !editRecord?.reopen
            ? await _createUpdateHandler({ id: editRecord?.id, body: formData })
            : await _createBugHandler(formData);

        if (editRecord?.id) setEditRecord({});
        if (duplicateRecord?.id) setDuplicateRecord({});
        refetch(editRecord?.id, editRecord?.id && !editRecord?.reopen ? 'edit' : 'add', res?.bugData);

        toastSuccess(res?.msg);

        return res;
      } catch (error) {
        toastError(error);
      }
    },
    [
      refetch,
      editRecord,
      toastError,
      toastSuccess,
      setEditRecord,
      duplicateRecord,
      _createBugHandler,
      setDuplicateRecord,
      _createUpdateHandler,
    ],
  );

  return (
    <BugReportingModule
      {...{ open, handleClose, backClass, refetch, projectId, editRecordId: editRecord?.id || null }}
      isLoading={_createIsLoading || _updateIsLoading}
      onSubmit={onSubmit}
      setEditRecord={setEditRecord}
      setDuplicateRecord={setDuplicateRecord}
      duplicateRecordId={duplicateRecord?.id || null}
    />
  );
};

export default StartTesting;
