import { useMemo, useState, useEffect, useCallback } from 'react';

import _ from 'lodash';
import { useForm } from 'react-hook-form';

import SelectTestCases from 'pages/test-runs/select-test-cases';

import Checkbox from 'components/checkbox';
import SelectBox from 'components/select-box';
import HierarchicalDropdown from 'components/hierarchy-selectbox';
import FormCloseModal from 'components/form-close-modal';
import TextArea from 'components/text-area';
import Button from 'components/button';
import TextField from 'components/text-field';
import Loader from 'components/loader';
import DatePicker from 'components/date-picker';

import { useToaster } from 'hooks/use-toaster';

import { getUsers } from 'api/v1/settings/user-management';
import {
  useGetAllMembers,
  useGetLocation,
  useGetTaskTypes,
  useGetClickUpTags,
  useGetParentsTasks,
  useGetCustomFields,
} from 'api/v1/task/task';

import { formattedDate } from 'utils/date-handler';

import style from './clickup.module.scss';
import { useAddOptions } from '../helper';
import Icon from '../../icon/themed-icon';
import CustomFields from '../custom-fields';

const ClickUpTask = ({
  type,
  isEditable,
  editRecordValues,
  clickUpTaskDetails,
  setBugsData,
  setTestCaseData,
  bugsData,
  checkData,
  testCaseData,
  projectId,
  setSelectedBugs,
  selectedRecords,
  assignedTo,
  priorityOptions,
  priorityOptionsClickUp,
  openDelModal,
  setTextareaValue,
  isSubmitting,
  setOpenDelModal,
  checkPrefillText,
  bugPrefillText,
  testCasesPrefillText,
  submitHandlerTask,
  setSelectedRecords,
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
  } = useForm();
  const [locationError, setLocationError] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [expand, setExpand] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [location, setLocation] = useState({});
  const [crossCheckUsers, setCrossCheckUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const [taskTypes, setTaskTypes] = useState([]);
  const [parentTasks, setParentTasks] = useState([]);
  const [clickUpTags, setClickUpTags] = useState([]);
  const [customFields, setCustomFields] = useState([]);
  const { toastError } = useToaster();
  const { data = {} } = useAddOptions();
  const WATCH_LOCATION = watch('location');
  const WATCH_teamID = watch('location')?.teamId;
  const WATCH_listId = watch('location')?.listId;
  const customItemId = watch('custom_item_id');

  const priorityMap = {
    Urgent: 1,
    High: 2,
    Medium: 3,
    Low: 4,
  };

  const [isChanged, setIsChanged] = useState(false);
  const [discardModal, setDiscardModal] = useState(false);

  // NOTE: get members data
  const { mutateAsync: _getAllMembers, isLoading: _isLoading } = useGetAllMembers();
  const { mutateAsync: _getAllTaskTypes } = useGetTaskTypes();
  const { mutateAsync: _getAllParentTasks } = useGetParentsTasks();
  const { mutateAsync: _getAllClickUpTags } = useGetClickUpTags();
  const { mutateAsync: _getAllCustomFields } = useGetCustomFields();

  // NOTE: get locations
  const { mutateAsync: _locationData, isLoading: _isFetchingLocation } = useGetLocation();

  const fetchLocations = useCallback(async () => {
    try {
      const response = await _locationData();
      setLocation(response);
    } catch (error) {
      toastError(error);
    }
  }, [_locationData, toastError]);

  const fetchMembers = useCallback(
    async (selectedValue) => {
      try {
        const response = await _getAllMembers(selectedValue);
        setMembers(
          response?.members?.map((x) => ({
            label: x.name,
            ...(x?.profilePicture && { image: x?.profilePicture }),
            ...(!x?.profilePicture && { imagAlt: _.first(x?.name) }),
            value: { id: `${x.id}`, crossCheckUserId: x.crossCheckUserId },
          })),
        );
      } catch (error) {
        toastError(error);
      }
    },
    [_getAllMembers, toastError],
  );

  const fetchTaskTypes = useCallback(
    async (teamId) => {
      try {
        const response = await _getAllTaskTypes(teamId);

        const fetchedTaskTypes =
          response?.taskTypes?.map((x) => ({
            label: x.name,
            value: x.name,
            id: x.id,
          })) || [];

        setTaskTypes([{ label: 'Task', value: 'Task', id: 0 }, ...fetchedTaskTypes]);
      } catch (error) {
        toastError(error);
      }
    },
    [_getAllTaskTypes, toastError],
  );

  const fetchParentTasks = useCallback(
    async (teamId) => {
      try {
        const response = await _getAllParentTasks(teamId);
        setParentTasks(
          response?.parentTasks?.map((x) => ({
            label: x.name,
            value: x.id,
            checkbox: true,
          })),
        );
      } catch (error) {
        toastError(error);
      }
    },
    [_getAllParentTasks, toastError],
  );

  const fetchClickUpTags = useCallback(
    async (spaceId) => {
      try {
        const response = await _getAllClickUpTags(spaceId);

        setClickUpTags(
          response?.tags?.map((x) => ({
            label: x.name,
            value: x.name,
            checkbox: true,
          })),
        );
      } catch (error) {
        console.error(error);
      }
    },
    [_getAllClickUpTags],
  );

  const fetchCustomFields = useCallback(
    async (listId) => {
      try {
        const response = await _getAllCustomFields(listId);
        setCustomFields(response?.customFields);
      } catch (error) {
        toastError(error);
      }
    },
    [_getAllCustomFields, toastError],
  );

  useEffect(() => {
    if (openDelModal) {
      fetchLocations();
    }
  }, [fetchLocations, openDelModal]);

  useEffect(() => {
    if (selectedValue) {
      fetchMembers(selectedValue);
    }
  }, [fetchMembers, selectedValue]);

  useEffect(() => {
    if (WATCH_teamID) {
      fetchTaskTypes(WATCH_teamID);
    }
  }, [WATCH_teamID, fetchTaskTypes]);

  useEffect(() => {
    if (WATCH_listId) {
      fetchParentTasks(WATCH_listId);
    }
  }, [WATCH_listId, fetchParentTasks]);

  useEffect(() => {
    if (WATCH_listId) {
      fetchCustomFields(WATCH_listId);
    }
  }, [WATCH_listId, fetchCustomFields]);

  const matchingSpace =
    location &&
    location?.workSpaces
      ?.flatMap((workspace) => workspace?.spaces)
      ?.find((space) => space?.parentId === WATCH_LOCATION?.teamId);

  useEffect(() => {
    if (matchingSpace?.id) {
      fetchClickUpTags(matchingSpace?.id);
    }
  }, [matchingSpace?.id, fetchClickUpTags]);

  // NOTE: get crosscheck users
  const fetchCrossCheckUsers = useCallback(async () => {
    try {
      const response = await getUsers({
        sortBy: '',
        sort: '',
        search: '',
      });
      setCrossCheckUsers(
        response?.users?.map((x) => ({
          label: x.name,
          ...(x?.profilePicture && { image: x?.profilePicture }),
          ...(!x?.profilePicture && { imagAlt: _.first(x?.name) }),
          value: x._id,
          checkbox: true,
        })),
      );
    } catch (error) {
      toastError(error);
    }
  }, [toastError]);

  useEffect(() => {
    if (members) {
      fetchCrossCheckUsers();
    }
  }, [fetchCrossCheckUsers, members]);

  const dropdwonMenuOptions = useMemo(() => {
    const input = location?.workSpaces || [];

    const addParentIds = (obj, parentId) => {
      if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
          addParentIds(obj[i], parentId);
        }
      } else if (typeof obj === 'object') {
        obj.parentId = parentId;

        for (let key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key) && Array.isArray(obj[key])) {
            addParentIds(obj[key], obj.id);
          }
        }
      }
    };

    addParentIds(input, null);

    const convertInputToOutput = (input) => {
      return input.map((item) => {
        const { id, name, spaces, parentId } = item;

        const child = spaces.map((space) => {
          const {
            id: spaceId,

            name: spaceName,

            folders,

            folderLessList,

            parentId: spaceParentId,
          } = space;

          const folderChild = folders.map((folder) => {
            const { id: folderId, name: folderName, lists, parentId: folderParentId } = folder;

            const listChild = lists.map((list) => ({
              ...list,
              parentId: folderId,
            }));

            return {
              id: folderId,
              name: folderName,
              child: listChild,
              parentId: folderParentId,
            };
          });

          const folderLessListChild = folderLessList.map((list) => ({
            ...list,
            parentId: spaceId,
          }));

          return {
            id: spaceId,

            name: spaceName,

            child: [...folderChild, ...folderLessListChild],

            parentId: spaceParentId,
          };
        });

        return { id, name, child, parentId };
      });
    };

    const output = convertInputToOutput(input);

    const convertKeysAndValues = (obj) => {
      if (obj['id']) {
        obj['key'] = obj['id'];

        delete obj['id'];
      }

      if (obj['name']) {
        obj['value'] = obj['name'];

        delete obj['name'];
      }

      if (obj['child'] && Array.isArray(obj['child'])) {
        obj['child'].forEach(convertKeysAndValues);
      }
    };

    output.forEach(convertKeysAndValues);

    return output;
  }, [location?.workSpaces]);

  const onSubmit = async (data) => {
    const customFieldsArray =
      !isEditable &&
      customFields &&
      customFields
        ?.map((field) => {
          const dataKey = `field-${field?.name}`;
          const peopleDataKey = `user-field-${field?.name}`;

          let value;

          switch (field?.type) {
            case 'text':
            case 'number':
            case 'email':
            case 'short_text':
              value = data[dataKey];
              break;
            case 'date':
              value = data[dataKey] && new Date(data[dataKey])?.getTime();
              break;
            case 'labels':
              value = (data[dataKey] || [])
                ?.map((label) => {
                  const matchedOption = field?.type_config?.options?.find((option) => option?.label === label);

                  return matchedOption ? matchedOption?.id : null;
                })
                .filter((id) => id !== null);
              break;

            case 'drop_down':
              value = field?.type_config?.options?.find((option) => option?.name === data[dataKey])?.id;
              break;
            case 'users':
              value = { add: [data[peopleDataKey]?.id] };
              break;
          }

          return value !== undefined ? { id: field.id, value } : null;
        })
        .filter((field) => field !== null);

    try {
      const formData = {
        ...data,
        applicationType: 'ClickUp',
        name: data?.name,
        description: data?.description,
        custom_item_id:
          (data?.custom_item_id && taskTypes?.find((taskType) => taskType.label === customItemId)?.id) || 0,
        taskType: type === 'Check' ? 'Check' : bugsData ? 'Bug' : 'Test Case',
        teamId: watch('location')?.teamId,
        listId: watch('location')?.listId,
        start_date: formattedDate(data?.start_date, 'yyyy-MM-dd'),
        due_date: formattedDate(data?.due_date, 'yyyy-MM-dd'),
        clickUpAssignee: watch('clickUpAssignee')?.id,
        crossCheckAssignee: watch('clickUpAssignee')?.crossCheckUserId
          ? watch('clickUpAssignee')?.crossCheckUserId
          : watch('crossCheckAssignee'),
        projectId: projectId
          ? projectId
          : bugsData
            ? bugsData[0]?.projectId?._id
            : testCaseData && testCaseData[0]?.projectId?._id,
        bugIds: bugsData ? selectedRecords : [],
        priority: watch('priorityClickUp') && priorityMap[watch('priorityClickUp')],
        testCaseIds: testCaseData ? selectedRecords : [],
        custom_fields: customFieldsArray,
        tags: data?.tags,
      };

      if (!data?.parent) {
        delete formData.parent;
      }

      if (!data?.due_date) {
        delete formData.due_date;
      }

      if (!data?.start_date) {
        delete formData.start_date;
      }

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

      submitHandlerTask(formData, watch('testRunChecked') && formRunData);
    } catch (error) {
      toastError(error, setError);
    }
  };

  const onUpdate = async (data) => {
    try {
      const formData = {
        applicationType: 'ClickUp',
        name: data?.name,
        description: data?.description,
        clickUpAssignee: watch('clickUpAssignee')?.id,
        teamId: watch('location')?.teamId,
        listId: watch('location')?.listId,
        custom_item_id:
          (data?.custom_item_id && taskTypes?.find((taskType) => taskType.label === customItemId)?.id) || 0,
        crossCheckAssignee: watch('clickUpAssignee')?.crossCheckUserId
          ? watch('clickUpAssignee')?.crossCheckUserId
          : watch('crossCheckAssignee'),
        projectId: projectId ? projectId : bugsData ? bugsData[0]?.projectId?._id : testCaseData[0]?.projectId?._id,
        taskType: type === 'Check' ? 'Check' : bugsData?.length ? 'Bug' : 'Test Case',
        ...(bugsData?.length
          ? { bugIds: selectedRecords, testCaseIds: [] }
          : { bugIds: [], testCaseIds: selectedRecords }),
        priority: watch('priorityClickUp') && priorityMap[watch('priorityClickUp')],
        start_date: formattedDate(data?.start_date, 'yyyy-MM-dd'),
        due_date: formattedDate(data?.due_date, 'yyyy-MM-dd'),
        parent: data?.parent,
        tags: ['tag1', 'tag2'],
      };

      if (!data?.parent) {
        delete formData.parent;
      }

      if (!data?.due_date) {
        delete formData.due_date;
      }

      if (!data?.start_date) {
        delete formData.start_date;
      }

      submitHandlerTask(formData);
    } catch (error) {
      toastError(error, setError);
    }
  };

  useEffect(() => {
    if (isEditable) {
      setSelectedValue(editRecordValues?.list?.id);
    }
  }, [editRecordValues, isEditable]);

  useEffect(() => {
    if (members.length && isEditable) {
      const assignee = members?.find((x) => x.value.id == editRecordValues?.assignees?.[0]?.id) || null;
      const customItemId = taskTypes?.find((x) => x?.id == clickUpTaskDetails?.custom_item_id) || null;
      const priority = priorityOptions[clickUpTaskDetails?.priority?.orderindex - 1] || null;
      const startDate = new Date(Number(clickUpTaskDetails?.start_date));
      const dueDate = new Date(Number(clickUpTaskDetails?.due_date));

      setValue('clickUpAssignee', assignee?.value);
      setValue('clickUpAssigneeDefaultValue', assignee);
      setValue('name', editRecordValues?.name);
      setValue('location.listId', editRecordValues?.list?.id);
      setValue('location.teamId', editRecordValues?.team_id);
      setValue('custom_item_id', customItemId?.value);
      setValue('priorityClickUp', priority?.value);
      setValue('parent', clickUpTaskDetails?.parent);
      setValue('start_date', startDate);
      setValue('due_date', dueDate);
    }
  }, [
    clickUpTaskDetails?.priority?.orderindex,
    clickUpTaskDetails?.custom_item_id,
    clickUpTaskDetails?.parent,
    editRecordValues?.assignees,
    editRecordValues?.list?.id,
    editRecordValues?.name,
    editRecordValues?.team_id,
    isEditable,
    members,
    priorityOptions,
    setValue,
    taskTypes,
    clickUpTaskDetails?.start_date,
    clickUpTaskDetails?.due_date,
  ]);

  const descriptionText = useMemo(() => {
    if (type && type === 'Check' && checkData?.length) {
      return checkPrefillText;
    } else {
      return bugsData?.length ? bugPrefillText : testCasesPrefillText;
    }
  }, [type, checkData?.length, checkPrefillText, bugsData?.length, bugPrefillText, testCasesPrefillText]);

  useEffect(() => {
    if (descriptionText) {
      setValue('description', descriptionText);
    }
  }, [descriptionText, setValue]);

  const handleDiscard = useCallback(() => {
    if (isChanged || isDirty) {
      setDiscardModal(true);
    } else {
      setOpenDelModal(false);
    }
  }, [isChanged, isDirty, setOpenDelModal]);

  const formDiscardHandler = useCallback(() => {
    reset();
    setSelectedBugs([]);
    setTextareaValue('');
    setSelectedRecords([]);
    setLocationError(false);
    setOpenDelModal(false);
  }, [reset, setOpenDelModal, setSelectedBugs, setSelectedRecords, setTextareaValue]);

  const handleAddModalTrue = useCallback(() => {
    setAddModal(true);
  }, []);

  const handleExpandButton = useCallback(() => {
    if (customFields?.length > 0) {
      setExpand(!expand);
    }
  }, [customFields?.length, expand]);

  const handleChangeTestRunCheck = useCallback(({ target }) => setValue('testRunChecked', target.checked), [setValue]);

  const handleSubmitBtn = useCallback(() => setLocationError(WATCH_LOCATION?.teamId ? false : true), [WATCH_LOCATION]);

  const titleRegister = useCallback(() => register('name', { required: 'Required' }), [register]);
  const runNameRegister = useCallback(() => register('runName', { required: 'Required' }), [register]);
  const descriptionRegister = useCallback(() => register('description'), [register]);
  const descriptionTestRunRegister = useCallback(() => register('descriptionTestRun'), [register]);

  const onTestCaseSubmit = useCallback(
    (testCases) => {
      setIsChanged(true);
      setSelectedRecords(
        testCases.map((x) => {
          return x._id;
        }),
      );

      if (bugsData?.length) {
        setBugsData(testCases);
      }

      if (checkData?.length) {
        setBugsData(checkData);
      }

      if (testCaseData?.length) {
        setTestCaseData(testCases);
      }
    },
    [setSelectedRecords, bugsData?.length, checkData, testCaseData?.length, setBugsData, setTestCaseData],
  );

  return isEditable && _isLoading ? (
    <Loader />
  ) : (
    <>
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

      <form onSubmit={handleSubmit(isEditable ? onUpdate : onSubmit)}>
        <div className={style.header}>
          <span>Create Task {watch('testRunChecked') ? '& Run' : ''}</span>
          <div onClick={formDiscardHandler} className={style.hover}>
            <Icon name={'CrossIcon'} />
            <div className={style.tooltip}>
              <p>Close</p>
            </div>
          </div>
        </div>
        <div className={style.wrapper}>
          <div className={style.checkDiv}>{_isFetchingLocation && !isEditable && <Loader tableMode />}</div>
          <div className={`${style.marginTen} ${style.selectDiv}`}>
            {!isEditable && (
              <HierarchicalDropdown
                options={dropdwonMenuOptions}
                label={'Location'}
                name={'location'}
                selectedValue={selectedValue}
                setSelectedValue={setSelectedValue}
                placeholder="Select"
                setValue={setValue}
                setMembers={setMembers}
                reset
                errorMsg={locationError && !watch('location')?.teamId && 'Required'}
                id="HierarchicalDropdown-ticket-model"
              />
            )}
            <div className={style.selectDivInner}>
              <SelectBox
                options={members && members}
                label={'Clickup Assignee'}
                control={control}
                placeholder="Select"
                name={'clickUpAssignee'}
                defaultValue={watch('clickUpAssigneeDefaultValue')}
                watch={watch}
                rules={{ required: 'Required' }}
                errorMessage={errors?.clickUpAssignee?.message}
                disabled={members?.length > 0 ? false : true}
                id="clickup-assignee-dropdown"
              />

              {watch('clickUpAssignee')?.crossCheckUserId === null && (
                <>
                  <div className={style.arrowDiv}>
                    <Icon name={'ArrowRight'} iconClass={style.icon} />
                  </div>
                  <SelectBox
                    options={crossCheckUsers}
                    label={'Cross Check Assignee'}
                    name={'crossCheckAssignee'}
                    control={control}
                    dynamicClass={style.zDynamicState4}
                    rules={{ required: 'Required' }}
                    errorMessage={errors?.crossCheckAssignee?.message}
                    placeholder="Select"
                    data-cy="clickup-crosscheck-asignee"
                  />
                </>
              )}
              {_isLoading && <Loader tableMode />}
            </div>
            {watch('clickUpAssignee')?.crossCheckUserId === null && (
              <div className={style.syncText}>
                <span>Sync this cross check user with clickup for future </span>
              </div>
            )}
            <TextField
              label={'Task Title'}
              name={'name'}
              register={titleRegister}
              wraperClass={style.inputField}
              errorMessage={errors.name && errors.name.message}
              data-cy="tasktitle-textfield"
            />
          </div>

          <TextArea
            label={'Task Description'}
            name={'description'}
            defaultValue={descriptionText}
            row={10}
            register={descriptionRegister}
            errorMessage={errors?.description?.message}
          />
          <div className={style.selectDivBottom}>
            <SelectBox
              options={taskTypes}
              label={'Task Type'}
              name={'custom_item_id'}
              control={control}
              defaultValue={!isEditable && { label: 'Task', value: 'Task', id: 0 }}
              rules={{ required: 'Required' }}
              errorMessage={errors?.custom_item_id?.message}
              placeholder="Select"
              disabled={taskTypes?.length > 0 ? false : true}
            />

            <SelectBox
              options={priorityOptionsClickUp}
              label={'Priority'}
              name={'priorityClickUp'}
              control={control}
              placeholder="Select"
            />
          </div>
          <div className={style.selectDivBottom}>
            <div className={style.flexDate}>
              <DatePicker
                control={control}
                label={'Start Date'}
                name={'start_date'}
                className={style.dateClass}
                placeholder={'Select'}
                popperPlacement={'auto'}
              />
            </div>
            <div className={style.flexDate}>
              <DatePicker
                control={control}
                label={'End Date'}
                name={'due_date'}
                className={style.dateClass}
                placeholder={'Select'}
              />
            </div>
          </div>

          <div className={style.selectDivBottom}>
            {!isEditable && (
              <SelectBox
                options={clickUpTags}
                disabled={clickUpTags?.length > 0 ? false : true}
                label={'Tags'}
                name={'tags'}
                isMulti
                control={control}
                showNumber
                placeholder="Select"
                menuPlacement="top"
              />
            )}
            <SelectBox
              options={parentTasks}
              label={'Parent Task'}
              name={'parent'}
              menuPlacement="top"
              control={control}
              placeholder="Select"
            />
          </div>

          {!isEditable && (
            <div className={style.customFieldSection}>
              <div className={style.customFieldTop}>
                <span>Custom Fields</span>
                <span
                  className={style.underline}
                  style={{ cursor: customFields?.length > 0 ? 'pointer' : 'not-allowed' }}
                  onClick={handleExpandButton}
                >
                  {expand ? 'Collapse' : 'Expand'}
                </span>
              </div>

              <div className={`${expand && style.expanded} ${style.customFields}`}>
                {expand && customFields && (
                  <CustomFields people={members} fields={customFields} control={control} register={register} />
                )}
              </div>
            </div>
          )}

          {watch('testRunChecked') && (
            <div
              className={`${style.testRunSection} ${watch('testRunChecked') === true ? style['slide-down'] : style['slide-up']}`}
            >
              <div className={style.divider} />
              <div className={style.selectFlex}>
                <TextField
                  label={'Run Title'}
                  name={'runName'}
                  register={runNameRegister}
                  placeholder={'Enter Run Title'}
                  errorMessage={errors?.name?.message}
                  defaultValue={watch('name') && watch('name')}
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
                register={descriptionTestRunRegister}
                row={5}
                dataCy="testrun-modal-description"
                className={style.textAreaRun}
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
                {`${selectedRecords.length} ${editRecordValues?.taskType}'s`} Selected
              </span>

              <span className={style.moreBtn} onClick={handleAddModalTrue}>
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
              onSubmit={onTestCaseSubmit}
            />
          )}
          <div className={style.btnDiv}>
            <div>
              {!isEditable && (
                <Checkbox
                  disabledCheck={isSubmitting}
                  containerClass={style.check}
                  name={'testRunChecked'}
                  label={'Create Test Run'}
                  register={register}
                  handleChange={handleChangeTestRunCheck}
                  data-cy="checkbox-test-run-task"
                />
              )}
            </div>
            <div className={style.bottomBtns}>
              <Button
                text={'Discard'}
                type={'button'}
                btnClass={style.btnClassUncheckModal}
                handleClick={handleDiscard}
                data-cy="discard-button-ticket"
              />
              <Button
                text={`${isEditable ? 'Update' : 'Create'} Task ${watch('testRunChecked') ? '& Run' : ''}`}
                type={'submit'}
                disabled={isSubmitting}
                handleClick={handleSubmitBtn}
                data-cy="create-task-button-ticket"
              />
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default ClickUpTask;
