import { useCallback, useEffect, useState } from 'react';

import CreateTaskModal from 'components/create-task-modal';

import { useToaster } from 'hooks/use-toaster';

import { useGetTaskById, useUpdateClickUpTask, useUpdateJiraTask } from 'api/v1/task/task';

import { isEmpty as _isEmpty, pick as _pick } from 'utils/lodash';

const Index = ({ editRecordId, openDelModal, setOpenDelModal, onRefetch }) => {
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [values, setValues] = useState([]);

  const [bugsData, setBugsData] = useState([]);
  const [testCaseData, setTestCaseData] = useState([]);
  const { toastError, toastSuccess } = useToaster();

  const { data: _taskDetails, isFetching } = useGetTaskById(editRecordId);
  const { mutateAsync: _taskUpdateHandler, isLoading } = useUpdateClickUpTask();
  const { mutateAsync: _jiraTaskUpdateHandler, isLoading: isJiraEditLoading } = useUpdateJiraTask();

  useEffect(() => {
    if (!_isEmpty(_taskDetails?.task) && !_isEmpty(_taskDetails?.clickUpTaskDetails)) {
      let values = _pick(_taskDetails.task, [
        'bugIds',
        'testCaseIds',
        'crossCheckAssignee',
        'projectId',
        'taskType',
        'workSpaceId',
      ]);

      let clickUpDetails = _pick(_taskDetails?.clickUpTaskDetails, [
        'list',
        'team_id',
        'name',
        'assignees',
        'description',
      ]);

      if (values?.bugIds?.length) {
        setSelectedRecords(values.bugIds.map((x) => x._id));
        setBugsData(values.bugIds);
      }

      if (values?.testCaseIds?.length) {
        setSelectedRecords(values.testCaseIds.map((x) => x._id));
        setTestCaseData(values.testCaseIds);
      }

      setValues({ ...values, ...clickUpDetails });
    } else if (!_isEmpty(_taskDetails?.task) && !_isEmpty(_taskDetails?.jiraTaskDetails)) {
      let values = _pick(_taskDetails.task, [
        '_id',
        'bugIds',
        'testCaseIds',
        'jiraAssignee',
        'projectId',
        'taskType',
        'workSpaceId',
        'crossCheckAssignee',
      ]);

      let jiraDetails = _pick(_taskDetails?.jiraTaskDetails?.fields, [
        'issuetype.id',
        'project.name',
        'description.content',
        'assignee.displayName',
        'summary',
      ]);

      if (values?.bugIds?.length) {
        setSelectedRecords(values.bugIds.map((x) => x._id));
        setBugsData(values.bugIds);
      }

      if (values?.testCaseIds?.length) {
        setSelectedRecords(values.testCaseIds.map((x) => x._id));
        setTestCaseData(values.testCaseIds);
      }

      const jiraSite = _taskDetails?.jiraTaskDetails?.fields?.priority?.iconUrl
        ?.split('://')[1]
        ?.split('.atlassian.net/')[0];

      setValues({ ...values, ...jiraDetails, jiraSite });
    }
  }, [_taskDetails]);

  const onEditTaskHandler = useCallback(
    async (data) => {
      try {
        const res = await _taskUpdateHandler({ id: editRecordId, body: data });

        if (res.msg) {
          toastSuccess(res.msg);
          setOpenDelModal(false);
          onRefetch && onRefetch();
        }
      } catch (error) {
        toastError(error);
      }
    },
    [_taskUpdateHandler, editRecordId, onRefetch, setOpenDelModal, toastError, toastSuccess],
  );

  const onEditJiraHandler = useCallback(
    async (id, body, formRunData) => {
      try {
        const [res, runRes] = await Promise.all([
          _jiraTaskUpdateHandler({
            id,
            body,
          }),
        ]);
        toastSuccess(`${res.msg} ${formRunData ? runRes.msg : ''}`);
        setOpenDelModal(false);
        setSelectedRecords([]);
      } catch (error) {
        toastError(error);
      }
    },
    [_jiraTaskUpdateHandler, setOpenDelModal, toastError, toastSuccess],
  );

  const onSelectedBugs = useCallback(() => {}, []);

  return (
    <CreateTaskModal
      isFetching={isFetching}
      clickUpTaskDetails={_taskDetails?.clickUpTaskDetails}
      type={_taskDetails?.task?.applicationType}
      isEditable={true}
      editRecordValues={values}
      setSelectedBugs={onSelectedBugs}
      bugsData={bugsData}
      testCaseData={testCaseData}
      {...{ setBugsData, setTestCaseData }}
      isSubmitting={isLoading || isJiraEditLoading}
      submitHandlerTask={onEditTaskHandler}
      isJiraSubmitting={false}
      submitHandlerJiraTask={onEditJiraHandler}
      openDelModal={openDelModal}
      projectId={values?.projectId?._id}
      selectedRecords={selectedRecords}
      setSelectedRecords={setSelectedRecords}
      setOpenDelModal={setOpenDelModal}
    />
  );
};

export default Index;
