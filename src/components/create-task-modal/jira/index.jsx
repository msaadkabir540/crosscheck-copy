import { useState, useEffect, useCallback, useMemo } from 'react';

import _ from 'lodash';

import SelectTestCases from 'pages/test-runs/select-test-cases';

import Button from 'components/button';
import Loader from 'components/loader';
import Checkbox from 'components/checkbox';
import TextArea from 'components/text-area';
import SelectBox from 'components/select-box';
import TextField from 'components/text-field';
import DatePicker from 'components/date-picker';
import FormCloseModal from 'components/form-close-modal';

import { useToaster } from 'hooks/use-toaster';

import { getUsers } from 'api/v1/settings/user-management';
import { useGetIssuesType, useGetJiraSites, useGetJiraUsers, useJiraProjects } from 'api/v1/task/task';

import { formattedDate } from 'utils/date-handler';

import style from './jira.module.scss';
import Icon from '../../icon/themed-icon';
import { useAddOptions } from '../helper';

const JiraTask = ({
  type,
  FORM_HOOK,
  isChanged,
  setIsChanged,
  discardModal,
  setDiscardModal,
  taskType,
  bugsData,
  checkData,
  isEditable,
  setBugsData,
  setTestCaseData,
  editRecordValues,
  checkPrefillText,
  testCaseData,
  projectId,
  setSelectedBugs,
  selectedRecords,
  assignedTo,
  priorityOptions,
  setTextareaValue,
  isJiraSubmitting,
  isSubmitting,
  setOpenDelModal,
  prefillText,
  prefillTextTestCase,
  submitHandlerJiraTask,
  setSelectedRecords,
  handleTextareaChange,
}) => {
  const {
    control,
    watch,
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
    setError,
    setValue,
  } = FORM_HOOK;

  const { toastError } = useToaster();
  const { data = {} } = useAddOptions();
  const [jiraSites, setJiraSites] = useState([]);
  const [issueType, setIssueType] = useState([]);
  const [jiraUsers, setJiraUsers] = useState([]);
  const [addModal, setAddModal] = useState(false);
  const [jiraProjects, setJiraProjects] = useState([]);
  const [crossCheckUsers, setCrossCheckUsers] = useState([]);

  const formValues = watch();
  const [userMadeChanges, setUserMadeChanges] = useState(false);
  const [initialValues, setInitialValues] = useState({ selectRecordsCount: selectedRecords?.length });

  const checkIfUserMadeChanges = useCallback(
    (currentValues) => {
      const formValuesMatches = Object.keys(initialValues).some((key) => {
        const initialValue = initialValues[key];
        const currentValue = currentValues[key];

        if (initialValue && currentValue) {
          if (initialValue && currentValue && typeof initialValue === 'object' && typeof currentValue === 'object') {
            return initialValue.id !== currentValue.id;
          }

          return initialValue !== currentValue;
        }
      });

      const countMatches = initialValues?.selectRecordsCount !== selectedRecords?.length;

      return formValuesMatches || countMatches;
    },
    [initialValues, selectedRecords],
  );

  const WATCH_JIRA_SITES = watch('jiraSites');
  const WATCH_ISSUE_TYPE_ID = watch('issueTypeId');
  const WATCH_JIRA_POJECT_ID = watch('jiraProjectId');

  // NOTE: get jira sites
  const { mutateAsync: _sitesData, isLoading: _isFetchingSites } = useGetJiraSites();

  useEffect(() => {
    if (isEditable) {
      const changesMade = checkIfUserMadeChanges(formValues);
      setUserMadeChanges(changesMade);
    }
  }, [formValues, isEditable, checkIfUserMadeChanges]);

  useEffect(() => {
    const fetchJiraSites = async () => {
      try {
        const response = await _sitesData();
        setJiraSites(
          response &&
            response.sites.map((x) => ({
              label: x.name,
              ...(x.avatarUrl && { image: x.avatarUrl }),
              ...(!x.avatarUrl && { imagAlt: _.first(x.name) }),
              value: { id: `${x.id}`, crossCheckUserId: x.crossCheckUserId },
            })),
        );
      } catch (error) {
        toastError(error);
      }
    };

    if (taskType) {
      fetchJiraSites();
    }
  }, [taskType, _sitesData, toastError]);

  // NOTE: get jira sites
  const { mutateAsync: _projectsData, isLoading: _isFetchingProjects } = useJiraProjects();

  useEffect(() => {
    const fetchJiraProjects = async (id) => {
      try {
        const response = await _projectsData(id);
        setJiraProjects(
          response.projects.map((x) => ({
            label: x.name,
            value: x.id,
          })),
        );
      } catch (error) {
        toastError(error);
      }
    };

    if (WATCH_JIRA_SITES) {
      fetchJiraProjects(WATCH_JIRA_SITES.id);
    }
  }, [WATCH_JIRA_SITES, _projectsData, toastError]);

  // NOTE: get issues type
  const { mutateAsync: _getAllIssuesType, isLoading: _isLoadingIssueTypes } = useGetIssuesType();

  useEffect(() => {
    const fetchIssuesType = async (JiraProjectId) => {
      try {
        const response = await _getAllIssuesType({
          id: WATCH_JIRA_SITES && WATCH_JIRA_SITES.id,
          projectId: JiraProjectId,
        });
        setIssueType(
          response.issueTypes.map((x) => ({
            label: x.name,
            value: x.id,
          })),
        );
      } catch (error) {
        toastError(error);
      }
    };

    if (WATCH_JIRA_POJECT_ID) {
      fetchIssuesType(WATCH_JIRA_POJECT_ID);
    }
  }, [WATCH_JIRA_POJECT_ID, WATCH_JIRA_SITES, _getAllIssuesType, toastError]);

  const descriptionText = useMemo(() => {
    if (type && type === 'Check' && checkData?.length) {
      return checkPrefillText;
    } else {
      return bugsData?.length ? prefillText : prefillTextTestCase;
    }
  }, [prefillText, prefillTextTestCase, checkPrefillText, bugsData, checkData, type]);

  useEffect(() => {
    if (descriptionText) {
      setValue('description', descriptionText?.content?.[0]?.content?.[0]?.text || descriptionText);
      setInitialValues((prev) => ({
        ...prev,
        description: descriptionText?.content?.[0]?.content?.[0]?.text || descriptionText,
      }));
    }
  }, [descriptionText, setValue]);

  // NOTE: get user
  const { mutateAsync: _getAllUsers, isLoading: _isLoadingUsers } = useGetJiraUsers();

  useEffect(() => {
    const fetchUsers = async (projectId) => {
      try {
        const response = await _getAllUsers({
          id: WATCH_JIRA_SITES && WATCH_JIRA_SITES.id,
          projectId: projectId,
        });
        setJiraUsers(
          response.projectMembers.map((x) => ({
            label: x.name,
            value: { id: `${x.id}`, crossCheckUserId: x.crossCheckUserId },
          })),
        );
      } catch (error) {
        toastError(error);
      }
    };

    if (WATCH_JIRA_POJECT_ID) {
      fetchUsers(WATCH_JIRA_POJECT_ID);
    }
  }, [WATCH_JIRA_POJECT_ID, WATCH_JIRA_SITES, _getAllUsers, toastError]);

  useEffect(() => {
    if (isEditable) {
      if (jiraSites?.length) {
        let jiraSite = jiraSites.find((x) => x.label == editRecordValues?.jiraSite) || null;

        if (jiraSite) {
          setValue('jiraSites', jiraSite?.value);
          setInitialValues((prev) => ({ ...prev, jiraSites: jiraSite?.value }));
        }
      }
    }
  }, [jiraSites, isEditable, editRecordValues, setValue]);

  useEffect(() => {
    if (isEditable) {
      if (jiraProjects?.length) {
        let jiraProject = jiraProjects.find((x) => x.label == editRecordValues?.project?.name) || null;

        if (jiraProject) {
          setValue('jiraProjectId', jiraProject?.value);
          setInitialValues((prev) => ({ ...prev, jiraProjectId: jiraProject?.value }));
        }
      }
    }
  }, [isEditable, editRecordValues, jiraProjects, setValue]);

  useEffect(() => {
    if (isEditable) {
      if (issueType?.length) {
        let type = issueType.find((x) => x.value == editRecordValues?.issuetype?.id) || null;

        if (type) {
          setValue('issueTypeId', type?.value);
          setInitialValues((prev) => ({ ...prev, issueTypeId: type?.value }));
        }
      }
    }
  }, [isEditable, editRecordValues, issueType, setValue]);

  useEffect(() => {
    if (isEditable) {
      if (jiraUsers?.length) {
        let assignee = jiraUsers.find((x) => x.label == editRecordValues?.assignee?.displayName) || null;

        if (assignee) {
          setValue('jiraAssignee', assignee?.value);
          setInitialValues((prev) => ({
            ...prev,
            jiraAssignee: assignee?.value,
          }));
        }
      }

      setValue('summary', editRecordValues?.summary);
      setValue('taskType', editRecordValues?.taskType);
      setInitialValues((prev) => ({
        ...prev,
        summary: editRecordValues?.summary,
        taskType: editRecordValues?.taskType,
      }));
    }
  }, [isEditable, editRecordValues, selectedRecords, jiraUsers, setValue]);

  // NOTE: get crosscheck users

  useEffect(() => {
    const fetchCrossCheckUsers = async () => {
      try {
        const response = await getUsers({
          sortBy: '',
          sort: '',
          search: '',
        });
        setCrossCheckUsers(
          response &&
            response.users.map((x) => ({
              label: x.name,
              ...(x.profilePicture && { image: x.profilePicture }),
              ...(!x.profilePicture && { imagAlt: _.first(x.name) }),
              value: x._id,
              checkbox: true,
            })),
        );
      } catch (error) {
        toastError(error);
      }
    };

    if (WATCH_ISSUE_TYPE_ID) {
      fetchCrossCheckUsers();
    }
  }, [WATCH_ISSUE_TYPE_ID, toastError]);

  const onSubmit = async (data) => {
    try {
      const formData = {
        ...data,
        applicationType: 'Jira',
        summary: data.summary,
        description: data.description,
        jiraAssignee: watch('jiraAssignee') && watch('jiraAssignee').id,
        taskType: type === 'Check' ? 'Check' : testCaseData?.length ? 'Test Case' : 'Bug',

        crossCheckAssignee: watch('jiraAssignee').crossCheckUserId
          ? watch('jiraAssignee').crossCheckUserId
          : watch('crossCheckAssignee'),
        projectId: projectId
          ? projectId
          : bugsData
            ? bugsData[0]?.projectId?._id
            : testCaseData && testCaseData[0]?.projectId?._id,
        issueTypeId: WATCH_ISSUE_TYPE_ID && WATCH_ISSUE_TYPE_ID,
        jiraProjectId: WATCH_JIRA_POJECT_ID && WATCH_JIRA_POJECT_ID,
        bugIds: bugsData?.length ? selectedRecords : [],
        testCaseIds: testCaseData?.length ? selectedRecords : [],
      };

      const formRunData = {
        name: watch('runName') ? watch('runName') : watch('name'),
        assignee: watch('runAssignee') && watch('runAssignee'),
        priority: watch('priority') && watch('priority'),
        dueDate: formattedDate(watch('dueDate'), 'yyyy-MM-dd'),
        testCases: testCaseData ? selectedRecords : [],
        bugs: bugsData ? selectedRecords : [],
        projectId: projectId
          ? projectId
          : bugsData
            ? bugsData[0]?.projectId?._id
            : testCaseData && testCaseData[0]?.projectId?._id,
        description: JSON.stringify(watch('descriptionTestRun') && watch('descriptionTestRun')),
        evidenceRequired: false,
      };

      submitHandlerJiraTask(
        isEditable ? editRecordValues?._id : WATCH_JIRA_SITES.id,
        formData,
        watch('testRunChecked') && formRunData,
      );
    } catch (error) {
      toastError(error, setError);
    }
  };

  const formDiscardHandler = useCallback(() => {
    reset();
    setSelectedBugs([]);
    setTextareaValue('');
    setSelectedRecords([]);
    setOpenDelModal(false);
  }, [reset, setOpenDelModal, setSelectedBugs, setSelectedRecords, setTextareaValue]);

  const handleDiscard = useCallback(() => {
    if (isChanged || isDirty) {
      setDiscardModal(true);
    } else {
      setOpenDelModal(false);
    }
  }, [isChanged, isDirty, setOpenDelModal, setDiscardModal]);

  const handleRegisterDiscription = useCallback(() => register('description'), [register]);
  const handleRegisterTestRunDescription = useCallback(() => register('descriptionTestRun'), [register]);
  const handleRegisterSummary = useCallback(() => register('summary', { required: 'Required' }), [register]);
  const handleRegisterRunName = useCallback(() => register('runName', { required: 'Required' }), [register]);

  const handleChangeTestRunCheck = useCallback(({ target }) => setValue('testRunChecked', target.checked), [setValue]);

  const onMoreClick = useCallback(() => {
    if (!(_isFetchingSites || _isFetchingProjects || (!jiraUsers?.length && _isLoadingUsers) || _isLoadingIssueTypes)) {
      setAddModal(true);
    }
  }, [_isFetchingProjects, _isFetchingSites, _isLoadingIssueTypes, _isLoadingUsers, jiraUsers]);

  const onSelectTestCasesSubmit = useCallback(
    (testCases, projectId = '') => {
      setIsChanged(true);
      console.log({ projectId });
      setSelectedRecords(
        testCases.map((x) => {
          return x._id;
        }),
      );

      if (watch('taskType') === 'Bug') {
        setBugsData(testCases);
      }

      if (watch('taskType') === 'Check') {
        setBugsData(checkData);
      }

      if (watch('taskType') === 'Test Case') {
        setTestCaseData(testCases);
      }
    },
    [checkData, setBugsData, setSelectedRecords, setTestCaseData, watch, setIsChanged],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={isEditable ? style.headerForEdit : style.header}>
        <span>
          {isEditable ? 'Edit Task' : 'Create Task'} {watch('testRunChecked') ? '& Run' : ''}
        </span>
        <div onClick={handleDiscard} className={style.hover}>
          <Icon name={'CrossIcon'} />
          <div className={style.tooltip}>
            <p>Close</p>
          </div>
        </div>
      </div>
      <div className={style.wrapper}>
        <div className={`${style.checkDiv} ${style.checkDivClass}`}>
          {_isFetchingSites ||
          _isFetchingProjects ||
          (!jiraUsers?.length && _isLoadingUsers) ||
          _isLoadingIssueTypes ? (
            <Loader tableMode />
          ) : null}
        </div>
        {!isEditable && (
          <div className={style.flexDiv}>
            <SelectBox
              options={jiraSites && jiraSites}
              label={'Jira Site'}
              control={control}
              placeholder="Select"
              name={'jiraSites'}
              watch={watch}
              rules={{ required: 'Required' }}
              dynamicClass={style.selectClass}
              errorMessage={errors?.jiraSites?.message}
              disabled={isEditable ? true : jiraSites?.length > 0 ? false : true}
            />
            <SelectBox
              options={jiraProjects && jiraProjects}
              label={'Jira Project'}
              control={control}
              placeholder="Select"
              name={'jiraProjectId'}
              watch={watch}
              rules={{ required: 'Required' }}
              dynamicClass={style.selectClass}
              errorMessage={errors?.jiraProjectId?.message}
              disabled={isEditable ? true : jiraProjects?.length > 0 ? false : true}
            />
          </div>
        )}
        <SelectBox
          options={issueType && issueType}
          label={'Issue Type'}
          control={control}
          placeholder="Select"
          name={'issueTypeId'}
          watch={watch}
          rules={{ required: 'Required' }}
          dynamicClass={style.selectClass}
          errorMessage={errors?.issueTypeId?.message}
          disabled={issueType?.length > 0 ? false : true}
        />
        <div className={style.selectDiv}>
          {}
          <div className={style.assigneeWrapper}>
            <SelectBox
              options={jiraUsers && jiraUsers}
              label={'Jira’s Assignee'}
              control={control}
              placeholder="Select"
              name={'jiraAssignee'}
              watch={watch}
              rules={{ required: 'Required' }}
              errorMessage={errors?.jiraAssignee?.message}
              disabled={jiraUsers?.length > 0 ? false : true}
            />

            {watch('jiraAssignee')?.crossCheckUserId === null && (
              <>
                <div className={style.crosscheckAssignee}>
                  <Icon name={'ArrowRight'} iconClass={style.icon} />
                </div>
                <SelectBox
                  options={crossCheckUsers && crossCheckUsers}
                  label={'Cross Check Assignee'}
                  name={'crossCheckAssignee'}
                  control={control}
                  dynamicClass={style.zDynamicState4}
                  rules={{ required: 'Required' }}
                  errorMessage={errors?.crossCheckAssignee?.message}
                  placeholder="Select"
                />
              </>
            )}
          </div>
          {watch('jiraAssignee')?.crossCheckUserId === null && (
            <div className={style.syncText}>
              <span>Sync this cross check user with Jira for future </span>
            </div>
          )}
          <TextField
            label={'Task Title / Summary'}
            name={'summary'}
            register={handleRegisterSummary}
            errorMessage={errors.summary && errors.summary.message}
          />
        </div>
        <TextArea
          label={'Task Description'}
          name={'description'}
          defaultValue={type === 'Check' ? checkPrefillText : bugsData ? prefillText : prefillTextTestCase}
          onChange={handleTextareaChange}
          row={10}
          register={handleRegisterDiscription}
          errorMessage={errors?.description?.message}
        />
        {watch('testRunChecked') && (
          <div
            className={`${style.testRunSection} ${watch('testRunChecked') ? style['slide-down'] : style['slide-up']}`}
          >
            <div className={style.divider} />
            <div className={style.selectFlex}>
              <TextField
                label={'Run Title'}
                name={'runName'}
                register={handleRegisterRunName}
                placeholder={'Enter Run Title'}
                errorMessage={errors?.name?.message}
                defaultValue={watch('summary') && watch('summary')}
                wraperClass={style.inputField}
                data-cy="testrun-modal-runtitle"
              />
              <SelectBox
                control={control}
                placeholder="Select"
                dynamicWrapper={style.dynamicWrapper}
                name={'runAssignee'}
                watch={watch}
                options={assignedTo}
                label={'Assignee'}
                rules={{ required: 'Required' }}
                errorMessage={errors?.runAssignee?.message}
                id="testrun-modal-assignee"
              />
            </div>
            <TextArea
              label={'Description'}
              name={'descriptionTestRun'}
              placeholder={'Write Your Text Here'}
              register={handleRegisterTestRunDescription}
              row={5}
              dataCy="testrun-modal-description"
            />
            <div className={style.selectFlex}>
              <SelectBox
                control={control}
                name={'priority'}
                label={'Priority'}
                options={priorityOptions}
                menuPlacement={'top'}
                placeholder="Select"
                rules={{ required: 'Required' }}
                errorMessage={errors?.priority?.message}
                id="testrun-modal-priority"
              />
              <div className={style.flexDate}>
                <DatePicker
                  control={control}
                  label={'Due Date'}
                  name={'dueDate'}
                  className={style.dateClass}
                  placeholder={'Select'}
                  rules={{ required: 'Required' }}
                  errorMessage={errors?.dueDate?.message}
                  id="testrun-modal-datepicker"
                />
              </div>
            </div>
          </div>
        )}

        {isEditable && (
          <div className={style.addMore}>
            <span className={style.moreText}>
              {`${selectedRecords.length} ${editRecordValues?.taskType}s`} Selected
            </span>

            <span className={style.moreBtn} onClick={onMoreClick}>
              <Icon name={'PlusIcon'} /> add More
            </span>
          </div>
        )}

        {addModal && (
          <SelectTestCases
            openAddModal={addModal}
            setOpenAddModal={setAddModal}
            projectId={projectId}
            type={`${editRecordValues?.taskType}s`}
            tasks={true}
            options={data}
            editRecords={
              isEditable ? (editRecordValues?.taskType === 'Bug' ? bugsData : testCaseData) : selectedRecords
            }
            onSubmit={onSelectTestCasesSubmit}
          />
        )}
        <div className={style.btnDiv}>
          {!isEditable && (
            <div>
              <Checkbox
                disabledCheck={isSubmitting}
                containerClass={style.check}
                name={'testRunChecked'}
                label={'Create Test Run'}
                register={register}
                handleChange={handleChangeTestRunCheck}
              />
            </div>
          )}
          <div className={style.discardBtn}>
            <Button
              text={'Discard'}
              type={'button'}
              handleClick={handleDiscard}
              btnClass={style.btnClassUncheckModal}
            />
            <Button
              text={`${isEditable ? 'Save' : 'Create Task'} ${watch('testRunChecked') ? '& Run' : ''}`}
              type={'submit'}
              disabled={isJiraSubmitting || (isEditable && !userMadeChanges)}
            />
          </div>
        </div>
      </div>
      {discardModal && (
        <FormCloseModal
          modelOpen={discardModal}
          setModelOpen={setDiscardModal}
          confirmBtnHandler={formDiscardHandler}
          heading={`You have unsaved changes`}
          subHeading={` Are you sure you want to exit? Your unsaved changes will be discarded.`}
          confirmBtnText={`Discard Changes`}
          icon={<Icon name={'WarningRedIcon'} height={80} width={80} />}
          cancelBtnText={`Back To Form`}
        />
      )}
    </form>
  );
};

export default JiraTask;
