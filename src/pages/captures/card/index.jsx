import { useCallback, useState } from 'react';

import CaptureCard from 'components/capture-card';

import { useToaster } from 'hooks/use-toaster';

import { useDeleteCaptureById } from 'api/v1/captures/capture.js';

const CheckCard = ({
  ele,
  tabIndex,
  setReportingIndex,
  reportingIndex,
  openOptionIndex,
  setOpenOptionIndex,
  setOpenBug,
}) => {
  const [checks, setChecks] = useState({ checks: [], count: 0 });

  const { toastSuccess, toastError } = useToaster();
  const { mutateAsync: _checkDeleteHandler } = useDeleteCaptureById();

  const handleDelete = useCallback(async () => {
    try {
      const res = await _checkDeleteHandler(ele._id);
      setChecks({
        count: checks?.count - 1 || 0,
        checks: checks?.checks?.filter((x) => x._id !== ele._id) || [],
      });
      toastSuccess(res?.msg);
    } catch (error) {
      console.error(error);
      toastError(error);
    }
  }, [_checkDeleteHandler, checks?.count, checks?.checks, ele._id, toastError, toastSuccess]);

  const toggleOption = useCallback(() => {
    setOpenOptionIndex(openOptionIndex === tabIndex ? null : tabIndex);
  }, [openOptionIndex, tabIndex, setOpenOptionIndex]);

  return (
    <div key={ele._id}>
      <CaptureCard
        handleDelete={handleDelete}
        {...ele}
        isOpen={tabIndex === openOptionIndex}
        setOpenOptionIndex={setOpenOptionIndex}
        toggleOption={toggleOption}
        setOpenBug={setOpenBug}
        reportingIndex={reportingIndex}
        setReportingIndex={setReportingIndex}
      />
    </div>
  );
};

export default CheckCard;
