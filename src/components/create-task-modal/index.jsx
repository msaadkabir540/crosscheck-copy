import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useAppContext } from 'context/app-context';

import Modal from 'components/modal';
import Button from 'components/button';
import Loader from 'components/loader';

import { useToaster } from 'hooks/use-toaster';

import { useRefreshToken } from 'api/v1/task/task';
import { useGetUserById } from 'api/v1/settings/user-management';

import { envObject } from 'constants/environmental';

import JiraTask from './jira';
import ClickUpTask from './clickup';
import Icon from '../icon/themed-icon';
import { useProjectOptions } from './helper';
import style from './task-modal.module.scss';

const CreateTaskModal = ({
  isFetching,
  type,
  isEditable,
  editRecordValues,
  setBugsData = () => {},
  setTestCaseData = () => {},
  bugsData,
  testCaseData,
  checkData,
  setCheckData,
  projectId,
  setSelectedBugs,
  clickUpTaskDetails,
  selectedRecords,
  backClass,
  openDelModal,
  isSubmitting,
  setOpenDelModal,
  submitHandlerTask,
  submitHandlerJiraTask,
  isJiraSubmitting,
  setSelectedRecords,
  setSelectedRunRecords,
}) => {
  const navigate = useNavigate();
  const isFirstRender = useRef(false);

  const FORM_HOOK = useForm();

  const [taskType, setTaskType] = useState('');
  const { userDetails } = useAppContext();
  const { toastError } = useToaster();
  const [next, setNext] = useState('');
  const [isChanged, setIsChanged] = useState(false);
  const [discardModal, setDiscardModal] = useState(false);
  const { data = {} } = useProjectOptions();
  const { assignedTo = [], priorityOptions = [], priorityOptionsClickUp = [] } = data;

  const { data: _userDataById } = useGetUserById(userDetails?.id);

  const currentWS = _userDataById?.user?.workspaces?.find(
    (workspace) => workspace?.workSpaceId === _userDataById?.user?.lastAccessedUserWorkspace,
  );

  const { mutateAsync: _RefreshToken, isLoading: _isRefreshing } = useRefreshToken();

  const refreshJiraToken = useCallback(async () => {
    try {
      await _RefreshToken();
    } catch (error) {
      toastError(error);
    }
  }, [_RefreshToken, toastError]);

  useEffect(() => {
    if (openDelModal && currentWS?.jiraUserId && !isEditable) {
      refreshJiraToken();
    }
  }, [openDelModal, currentWS?.jiraUserId, isEditable, _RefreshToken, toastError, refreshJiraToken]);

  // NOTE: Extract the data you want to display in the textarea
  const testCasesPrefillText = useMemo(() => {
    if (isEditable && editRecordValues.description && !isFirstRender.current && testCaseData?.length) {
      isFirstRender.current = true;

      return editRecordValues.description;
    } else {
      return (
        testCaseData?.length > 0 &&
        testCaseData
          ?.map((selectedObject) => {
            return keysToDisplayTestCase
              .map((key) => {
                if (
                  key === 'testObjective' ||
                  key === 'testSteps' ||
                  key === 'expectedResults' ||
                  key === 'preConditions'
                ) {
                  const description = selectedObject[key]?.description || '';
                  const descriptionObj = JSON.parse(description);

                  const descriptionText = descriptionObj?.blocks
                    ?.map((block) => block.text) // NOTE: Extract all lines
                    .join('\n'); // NOTE: Join lines with "\n"

                  return `${keyNameMappingTestCase[key]}: ${descriptionText}`;
                } else {
                  return `${keyNameMappingTestCase[key]}: ${selectedObject[key]}`;
                }
              })
              .filter(Boolean) // NOTE: Remove empty lines
              .join('\n');
          })
          .filter(Boolean) // NOTE: Remove empty sections
          .join('\n -------------------------- \n')
      );
    }
  }, [testCaseData, editRecordValues, isEditable]);

  // NOTE: Extract the data you want to display in the textarea
  const bugPrefillText = useMemo(() => {
    if (isEditable && editRecordValues.description && !isFirstRender.current && bugsData?.length) {
      isFirstRender.current = true;

      return editRecordValues.description;
    } else {
      return (
        bugsData?.length > 0 &&
        bugsData
          ?.map((selectedObject) => {
            return keysToDisplay
              .map((key) => {
                if (key === 'feedback' || key === 'reproduceSteps' || key === 'idealBehaviour') {
                  const description = selectedObject[key]?.description || '';
                  const descriptionObj = JSON.parse(description);
                  const descriptionText = descriptionObj?.blocks?.map((block) => block.text).join('\n');

                  return `${keyNameMapping[key]}: ${descriptionText !== undefined ? descriptionText : ''}`;
                } else if (key === 'reportedBy') {
                  const name = selectedObject[key]?.name || '';

                  return `${keyNameMapping[key]}: ${name !== undefined ? name : ''}`;
                } else if (key === 'testedVersion') {
                  const name = selectedObject[key]?.name || '';

                  return `${keyNameMapping[key]}: ${name !== undefined ? name : ''}`;
                } else {
                  const value = selectedObject[key];

                  return `${keyNameMapping[key]}: ${value !== undefined ? value : ''}`;
                }
              })
              .join('\n');
          })
          .join('\n -------------------------- \n')
      );
    }
  }, [bugsData, isEditable, editRecordValues]);

  // NOTE: Extract the data you want to display in the textarea
  const checkPrefillText = useMemo(() => {
    if (isEditable && editRecordValues.description && !isFirstRender.current && bugsData?.length) {
      isFirstRender.current = true;

      return editRecordValues.description;
    } else {
      return (
        checkData?.length &&
        checkData
          ?.map((selectedObject) => {
            return (
              keysToDisplayCheck
                .map((key) => {
                  const value = key === 'createdBy' ? selectedObject[key]?.name : selectedObject[key];

                  return `${keyNameMappingCheck[key]}: ${value !== undefined ? value : ''}`;
                })
                .join('\n') + `\nEvidence Link: ${envObject.BASE_URL}/captures/${selectedObject?._id}`
            );
          })
          .join('\n -------------------------- \n')
      );
    }
  }, [checkData, bugsData, editRecordValues, isEditable]);

  const [textareaValue, setTextareaValue] = useState();

  useEffect(() => {
    if (type === 'Check' && checkData) {
      setTextareaValue(checkPrefillText);
    } else {
      setTextareaValue(bugsData ? bugPrefillText : testCasesPrefillText);
    }
  }, [type, checkData, bugPrefillText, bugsData, checkPrefillText, testCasesPrefillText]);

  const handleTextareaChange = useCallback((e) => {
    setTextareaValue(e?.target?.value);
  }, []);

  useEffect(() => {
    if (type) {
      setNext(type === 'ClickUp' ? 'clickup' : type === 'Jira' ? 'jira' : '');
      setTaskType(type === 'ClickUp' ? 'clickup' : type === 'Jira' ? 'jira' : '');
    }
  }, [type]);

  const handleCloss = useCallback(() => {
    setSelectedBugs([]);
    setTextareaValue('');
    setSelectedRecords([]);
    setSelectedRunRecords([]);

    if (isChanged || FORM_HOOK?.formState?.isDirty) {
      setDiscardModal(true);
    } else {
      setOpenDelModal(false);
      console.log(textareaValue);
    }
  }, [
    FORM_HOOK,
    isChanged,
    textareaValue,
    setOpenDelModal,
    setSelectedBugs,
    setSelectedRecords,
    setSelectedRunRecords,
  ]);

  const onClickUpIcon = useCallback(() => setTaskType('clickup'), []);
  const onJiraIcon = useCallback(() => setTaskType('jira'), []);

  const handleIntegration = useCallback(() => navigate('/integrations'), [navigate]);

  const handleNext = useCallback(() => setNext(taskType), [taskType]);

  return (
    <Modal open={openDelModal} handleClose={handleCloss} className={style.mainDiv} noBackground>
      {isFetching ? (
        <Loader />
      ) : (
        <>
          {next === '' && (
            <div className={style.innerWrapper}>
              <div>
                <div className={style.header}>
                  <span>Create Task</span>
                  <div onClick={handleCloss} className={style.hover}>
                    <Icon name={'CrossIcon'} />
                    <div className={style.tooltip}>
                      <p>Close</p>
                    </div>
                  </div>
                </div>
                <span className={style.desc}>Choose application where you want to create task.</span>
                <div className={style.flexButtons}>
                  {currentWS?.clickUpUserId && (
                    <div
                      className={style.box}
                      style={{ borderColor: taskType === 'clickup' ? '#2151fd' : '' }}
                      onClick={onClickUpIcon}
                    >
                      <div className={style.flexDiv}>
                        <div className={style.iconSide}>
                          <Icon name={'ClickUpSvg'} width={63} height={73} />
                          <p>Clickup</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {currentWS?.jiraUserId && (
                    <div
                      className={style.box}
                      style={{ borderColor: taskType === 'jira' ? '#2151fd' : '' }}
                      onClick={onJiraIcon}
                      data-cy="task-integration-clickup"
                    >
                      <div className={style.flexDiv}>
                        <div className={style.iconSide}>
                          <Icon name={'JiraIcon'} width={63} height={73} />
                          <p>Jira</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <span className={style.linkText} onClick={handleIntegration}>
                  Go to <span>Integrations</span> page, to find out more integrations.
                </span>
              </div>

              <div className={style.btnWrapper}>
                <Button
                  text={'Discard'}
                  type={'button'}
                  btnClass={style.btnClassUncheckModal}
                  handleClick={handleCloss}
                  data-cy="task-integration-discard-btn"
                />
                <Button
                  text={'Next'}
                  disabled={_isRefreshing}
                  handleClick={handleNext}
                  data-cy="task-integration-nxt-btn"
                />
              </div>
            </div>
          )}

          {next === 'clickup' && (
            <ClickUpTask
              type={type}
              FORM_HOOK={FORM_HOOK}
              isChanged={isChanged}
              setIsChanged={setIsChanged}
              discardModal={discardModal}
              setDiscardModal={setDiscardModal}
              isEditable={isEditable}
              editRecordValues={editRecordValues}
              assignedTo={assignedTo}
              priorityOptionsClickUp={priorityOptionsClickUp}
              priorityOptions={priorityOptions}
              bugsData={bugsData}
              testCaseData={testCaseData}
              clickUpTaskDetails={clickUpTaskDetails}
              checkData={checkData}
              setCheckData={setCheckData}
              projectId={projectId}
              setSelectedBugs={setSelectedBugs}
              selectedRecords={selectedRecords}
              backClass={backClass}
              openDelModal={openDelModal}
              setTextareaValue={setTextareaValue}
              isSubmitting={isSubmitting}
              setOpenDelModal={setOpenDelModal}
              bugPrefillText={bugPrefillText}
              checkPrefillText={checkPrefillText}
              testCasesPrefillText={testCasesPrefillText}
              submitHandlerTask={submitHandlerTask}
              setSelectedRecords={setSelectedRecords}
              handleTextareaChange={handleTextareaChange}
              {...{ setBugsData, setTestCaseData, setCheckData }}
            />
          )}
          {next === 'jira' && (
            <JiraTask
              type={type}
              FORM_HOOK={FORM_HOOK}
              isChanged={isChanged}
              setIsChanged={setIsChanged}
              discardModal={discardModal}
              setDiscardModal={setDiscardModal}
              isEditable={isEditable}
              assignedTo={assignedTo}
              priorityOptions={priorityOptions}
              editRecordValues={editRecordValues}
              taskType={taskType}
              bugsData={bugsData}
              testCaseData={testCaseData}
              checkData={checkData}
              setCheckData={setCheckData}
              projectId={projectId}
              setSelectedBugs={setSelectedBugs}
              selectedRecords={selectedRecords}
              setTextareaValue={setTextareaValue}
              isSubmitting={isSubmitting}
              setOpenDelModal={setOpenDelModal}
              prefillText={bugPrefillText}
              checkPrefillText={checkPrefillText}
              prefillTextTestCase={testCasesPrefillText}
              submitHandlerJiraTask={submitHandlerJiraTask}
              setSelectedRecords={setSelectedRecords}
              handleTextareaChange={handleTextareaChange}
              isJiraSubmitting={isJiraSubmitting}
              {...{ setBugsData, setTestCaseData }}
            />
          )}
        </>
      )}
    </Modal>
  );
};

export default CreateTaskModal;

const keyNameMappingTestCase = {
  testCaseId: 'Test Case ID',
  testObjective: 'Test Objective',
  preConditions: 'Precondition',
  testSteps: 'Test Steps',
  status: 'Test Case Status',
  expectedResults: 'Expected Results',
};

const keysToDisplayTestCase = [
  'testCaseId',
  'testObjective',
  'preConditions',
  'status',
  'testSteps',
  'expectedResults',
];

const keyNameMapping = {
  bugId: 'Bug ID',
  severity: 'Severity',
  status: 'Status',
  feedback: 'Feedback',
  reproduceSteps: 'Reproduce Steps',
  idealBehaviour: 'Ideal Behaviour',
  testedVersion: 'Tested Version',
  testEvidence: 'Test Evidence',
  reportedBy: 'Reported By',
};

const keysToDisplay = [
  'bugId',
  'severity',
  'status',
  'feedback',
  'reproduceSteps',
  'idealBehaviour',
  'testedVersion',
  'testEvidence',
  'reportedBy',
];

const keyNameMappingCheck = {
  url: 'Website url',
  createdAt: 'created at',
  device: 'Device',
  browser: 'Browser',
  viewPortSize: 'Port Size',
  country: 'Country',
  createdBy: 'CreatedBy',
};

const keysToDisplayCheck = ['url', 'createdAt', 'device', 'browser', 'viewPortSize', 'country', 'createdBy'];
