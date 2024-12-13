import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useLocation } from 'react-router-dom';

import TextField from 'components/text-field';
import TextArea from 'components/text-area';
import SelectBox from 'components/select-box';
import DatePicker from 'components/date-picker';
import Button from 'components/button';
import { RadioButtons } from 'components/form-fields';
import Loader from 'components/loader';
import FormCloseModal from 'components/form-close-modal';
import CreatableSelectComponent from 'components/select-box/creatable-select';

import { useToaster } from 'hooks/use-toaster';

import {
  useCreateTestRun,
  useGetTestRunById,
  useUpdateTestRun,
  useCreateBugsRun,
  useUpdateBugsRun,
} from 'api/v1/test-runs/test-runs';
import { useAddTestedVersion } from 'api/v1/tested-version/tested-version';
import { useAddTestedEnvironment } from 'api/v1/tested-environment/tested-environment';

import { formattedDate } from 'utils/date-handler';

import { useProjectOptions } from '../helper';
import SelectTestCases from '../select-test-cases';
import style from './drawer.module.scss';
import Switch from '../../../components/switch';
import Icon from '../../../components/icon/themed-icon';

const Drawer = ({
  setDrawerOpen,
  refetch,
  editRecord,
  setEditRecord,
  projectId,
  selectedRunRecords,
  setSelectedRunRecords,
  duplicate,
  setDuplicate,
}) => {
  const {
    control,
    register,
    watch,
    reset,
    setValue,
    setError,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      dueDate: null,
      assignee: null,
      priority: null,
      testCases: [],
      runType: 'Test Cases',
      evidenceRequired: false,
    },
  });

  const initialRender = useRef(false);

  const [openFormCloseModal, setOpenFormCloseModal] = useState(false);
  const location = useLocation();
  const { data = {}, refetch: refetchData } = useProjectOptions();
  const { toastError, toastSuccess } = useToaster();
  const [openModal, setOpenModal] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState(selectedRunRecords?.length > 0 ? selectedRunRecords : []);

  const {
    assignedTo = [],
    priorityOptions = [],
    testedVersionOptions = [],
    testedEnvironmentOptions = [],
  } = useMemo(() => {
    return {
      ...data,
      testedEnvironmentOptions: projectId
        ? data?.testedEnvironmentOptions?.filter((envOption) => envOption?.projectId === projectId)
        : data?.testedEnvironmentOptions,
      testedVersionOptions: projectId
        ? data?.testedVersionOptions?.filter((verOption) => verOption?.projectId === projectId)
        : data?.testedVersionOptions,
    };
  }, [data, projectId]);

  const {
    data: _testRunData,
    isLoading,
    isFetching,
  } = useGetTestRunById({
    id: editRecord,
    tested: watch('tested') || 'all',
  });
  useEffect(() => {
    if (location?.pathname === '/test-cases' || location?.search?.includes('?active=1')) {
      setValue('runType', 'Test Cases');
    } else if (location?.pathname === '/qa-testing' || location?.search?.includes('?active=2')) {
      setValue('runType', 'Bugs');
    }
  }, [location?.pathname, location?.search, setValue]);

  useEffect(() => {
    if (editRecord && _testRunData?.testRun) {
      let values = _.pick(_testRunData.testRun, [
        'name',
        'projectId',
        'description',
        'priority',
        'assignee',
        'dueDate',
        'runType',
        'bugs',
        'testCases',
        'testedVersion',
        'evidenceRequired',
        'testedEnvironment',
      ]);

      const records = editRecord
        ? values.runType === 'Bugs'
          ? values.bugs.map((x) => ({
              bugId: x.bugId._id,
              tested: x.tested,
            }))
          : values.testCases.map((x) => ({
              testCaseId: x.testCaseId._id,
              tested: x.tested,
            }))
        : values.runType === 'Bugs'
          ? values?.bugs?.map((x) => x.bugId._id)
          : values?.testCases?.map((x) => x.testCaseId._id);

      Object.entries({
        ...values,
        assignee: values?.assignee?._id,
        testCases: records,
        dueDate: duplicate ? new Date() : new Date(values.dueDate),
        testedVersion: { value: values?.testedVersion?._id, label: values?.testedVersion?.name },
        testedEnvironment: { value: values?.testedEnvironment?._id, label: values?.testedEnvironment?.name },
      }).forEach(([key, val]) => {
        setValue(key, val);
      });
    }

    if (editRecord && _testRunData?.testRun?.runType === 'Bugs') {
      initialRender.current = false;
    }
  }, [_testRunData, duplicate, editRecord, setValue]);

  const { mutateAsync: _addTestedVersionHandler } = useAddTestedVersion();
  const { mutateAsync: _addTestedEnvironmentHandler } = useAddTestedEnvironment();
  const { mutateAsync: _createTestRunHandler, isLoading: _createIsLoading } = useCreateTestRun();
  const { mutateAsync: _createBugsRunHandler, isLoading: _createBugRunIsLoading } = useCreateBugsRun();
  const { mutateAsync: _updateTestRunHandler, isLoading: _updateIsLoading } = useUpdateTestRun();
  const { mutateAsync: _updateBugsRunHandler, isLoading: _updateBugsRunIsLoading } = useUpdateBugsRun();

  const submitHandler = async (data) => {
    try {
      const testCases = editRecord
        ? watch('runType') === 'Bugs'
          ? data.testCases.map((bug) => ({
              bugId: typeof bug === 'string' ? bug : bug.bugId,
              tested:
                _testRunData?.testRun?.bugs?.find((x) => x.bugId._id === (typeof bug === 'string' ? bug : bug.bugId))
                  ?.tested || false,
            }))
          : data.testCases.map((testCase) => ({
              testCaseId: typeof testCase === 'string' ? testCase : testCase.testCaseId,
              tested:
                _testRunData?.testRun?.testCases?.find(
                  (x) => x.testCaseId._id === (typeof testCase === 'string' ? testCase : testCase.testCaseId),
                )?.tested || false,
            }))
        : data?.testCases;

      const formData = {
        ...data,
        dueDate: formattedDate(watch('dueDate'), 'yyyy-MM-dd'),
        testCases,
        testedVersion: data?.testedVersion?.value,
        projectId: projectId || watch('projectId'),
        testedEnvironment: data?.testedEnvironment?.value,
        evidenceRequired: watch('runType') === 'Bugs' ? true : data?.evidenceRequired,
      };

      if (watch('runType') === 'Bugs') {
        delete formData.testCases;
        formData.bugs = testCases;
      }

      if (duplicate) {
        if (watch('runType') === 'Bugs') {
          delete formData.testCases;
          formData.bugs = testCases.map((x) => x.bugId);
        }

        if (watch('runType') === 'Test Cases') {
          formData.testCases = testCases.map((x) => x.testCaseId);
        }
      }

      const res =
        editRecord && !duplicate
          ? watch('runType') === 'Bugs'
            ? await _updateBugsRunHandler({ id: editRecord, body: formData })
            : await _updateTestRunHandler({ id: editRecord, body: formData })
          : watch('runType') === 'Bugs'
            ? await _createBugsRunHandler(formData)
            : await _createTestRunHandler(formData);

      toastSuccess(res.msg);
      refetch && refetch(editRecord, editRecord && !duplicate ? 'edit' : 'add', res?.runData);
      setSelectedRecords && setSelectedRecords([]);
      setSelectedRunRecords && setSelectedRunRecords([]);

      reset();
      setDrawerOpen && setDrawerOpen(null);
      setEditRecord && setEditRecord(null);
      setDuplicate && setDuplicate(false);
    } catch (error) {
      toastError(error, setError);
    }
  };

  const onSubmit = (data) => {
    submitHandler(data, reset);
  };

  useEffect(() => {
    const allSelectedTestCasesIds = selectedRecords.map((x) => x._id);
    setValue('testCases', allSelectedTestCasesIds);
  }, [selectedRecords, setValue]);

  const closeForm = useCallback(() => {
    reset();
    setSelectedRecords([]);
    setDrawerOpen(null);
    setEditRecord && setEditRecord(null);
    setOpenFormCloseModal(false);
    initialRender.current = false;
  }, [reset, setDrawerOpen, setEditRecord]);

  const onTestedEnvironmentChange = useCallback(
    async ({ selectedOption }) => {
      const testedEnvironmentName = selectedOption?.label;

      if (
        testedEnvironmentName &&
        testedEnvironmentOptions?.every(
          (option) => option?.label !== testedEnvironmentName && option?.value !== testedEnvironmentName,
        )
      ) {
        try {
          const res = await _addTestedEnvironmentHandler({
            name: testedEnvironmentName,
            projectId,
          });
          toastSuccess(res.msg);

          if (res?.testedEnvironment) {
            const newtestedEnvironment = {
              ...res?.testedEnvironment,
              value: res?.testedEnvironment?._id,
              label: res?.testedEnvironment?.name,
            };
            setValue('testedEnvironment', newtestedEnvironment);
            await refetchData();
          }
        } catch (error) {
          toastError(error);
        }
      }
    },
    [
      setValue,
      projectId,
      toastError,
      refetchData,
      toastSuccess,
      testedEnvironmentOptions,
      _addTestedEnvironmentHandler,
    ],
  );

  const onTestedVersionChange = useCallback(
    async ({ selectedOption }) => {
      const testedVersionName = selectedOption?.label;

      if (
        testedVersionName &&
        testedVersionOptions?.every(
          (option) => option?.label !== testedVersionName && option?.value !== testedVersionName,
        )
      ) {
        try {
          const res = await _addTestedVersionHandler({
            name: testedVersionName,
            projectId: projectId,
          });
          toastSuccess(res.msg);

          if (res?.testedVersion) {
            const newtestedVersion = {
              ...res?.testedVersion,
              value: res?.testedVersion?._id,
              label: res?.testedVersion?.name,
            };
            setValue('testedVersion', newtestedVersion);
            await refetchData();
          }
        } catch (error) {
          toastError(error);
        }
      }
    },
    [setValue, toastError, refetchData, toastSuccess, testedVersionOptions, _addTestedVersionHandler, projectId],
  );

  const handleDiscard = useCallback(() => {
    if (editRecord) {
      const isFormChanged =
        formattedDate(watch('dueDate'), 'yyyy-MM-dd') !== formattedDate(_testRunData.testRun?.dueDate, 'yyyy-MM-dd') ||
        watch('testCases')?.length !== _testRunData.testRun?.testCases?.length ||
        watch('assignee') !== _testRunData.testRun?.assignee._id ||
        watch('priority') !== _testRunData.testRun?.priority ||
        watch('name') !== _testRunData.testRun?.name ||
        watch('description') !== _testRunData.testRun?.description
          ? true
          : false;
      isFormChanged ? setOpenFormCloseModal(true) : closeForm();
    } else {
      const isFormChanged =
        dirtyFields?.name ||
        watch('testCases').length > 0 ||
        dirtyFields?.description ||
        dirtyFields?.dueDate ||
        dirtyFields?.assignee ||
        dirtyFields?.priority
          ? true
          : false;
      isFormChanged ? setOpenFormCloseModal(true) : closeForm();
    }
  }, [editRecord, watch, _testRunData, dirtyFields, closeForm, setOpenFormCloseModal]);

  useEffect(() => {
    if (initialRender.current && (location?.pathname === '/test-run' || location?.search === '?active=3')) {
      setSelectedRecords([]);
      setSelectedRunRecords([]);
      setValue('testCases', []);
      setValue('projectId', '');
    }

    initialRender.current = true;
  }, [location?.pathname, location?.search, setSelectedRunRecords, setValue]);

  const onClickHandle = useCallback(() => {
    setOpenModal(true);
  }, []);

  const registerDescription = useCallback(() => register('description'), [register]);
  const registerName = useCallback(() => register('name', { required: 'Required' }), [register]);

  const handleDiscardClick = useCallback(
    (e) => {
      e.preventDefault();
      handleDiscard();
    },
    [handleDiscard],
  );

  const onTestCaseDiscard = useCallback(() => {
    setSelectedRecords([]);
    setValue('projectId', '');
  }, [setValue]);

  const onTestCaseSubmit = useCallback(
    (testCases, projectId) => {
      setSelectedRecords(testCases);
      setValue('projectId', projectId);
    },
    [setValue],
  );

  const memoizedData = useMemo(() => {
    if (openModal && editRecord && watch('testCases')?.length) {
      return watch('runType') === 'Bugs'
        ? _testRunData?.testRun?.bugs.map((x) => x.bugId)
        : _testRunData?.testRun?.testCases.map((x) => x.testCaseId);
    }

    return selectedRecords;
  }, [openModal, editRecord, watch, selectedRecords, _testRunData?.testRun?.bugs, _testRunData?.testRun?.testCases]);

  return (
    <>
      {openFormCloseModal && (
        <FormCloseModal
          modelOpen={openFormCloseModal}
          setModelOpen={setOpenFormCloseModal}
          confirmBtnHandler={closeForm}
          heading={`You have unsaved changes`}
          subHeading={` Are you sure you want to exit? Your unsaved changes will be discarded.`}
          confirmBtnText={`Discard Changes`}
          icon={<Icon name={'WarningRedIcon'} height={80} width={80} />}
          cancelBtnText={`Back To Form`}
        />
      )}
      <div className={style.main}>
        <div className={style.header}>
          <span className={style.headerText}>{editRecord && !duplicate ? 'Edit' : `Create`} Test Run</span>
          <div alt="" onClick={handleDiscard} className={style.hover1}>
            <Icon name={'CrossIcon'} />
            <div className={style.tooltip}>
              <p>Close</p>
            </div>
          </div>
        </div>
        {editRecord && (isLoading || isFetching) ? (
          <div className={style.loaderDiv}>
            <Loader />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={style.body}>
              <div className={style.contentDiv}>
                <TextField
                  label={'Run Title'}
                  name={'name'}
                  register={registerName}
                  placeholder={'Enter Run Title'}
                  errorMessage={errors?.name?.message}
                  data-cy="testrun-modal-runtitle"
                />
              </div>

              <div className={style.contentDiv}>
                <RadioButtons
                  options={[
                    { value: 'Test Cases', label: 'Test Cases' },
                    { value: 'Bugs', label: 'Bugs' },
                  ]}
                  name={'runType'}
                  control={control}
                  isDisabled={
                    (editRecord && !duplicate) ||
                    location?.pathname === '/test-cases' ||
                    location?.pathname === '/qa-testing' ||
                    location?.search === '?active=2' ||
                    location?.search === '?active=1'
                      ? true
                      : false
                  }
                />
              </div>
              <div className={style.contentDiv}>
                <TextField
                  label={watch('runType')}
                  name={'testCases'}
                  placeholder={`Select ${watch('runType')}`}
                  value={watch('testCases')?.length ? `${watch('testCases')?.length} Selected` : ''}
                  onClickHandle={onClickHandle}
                  errorMessage={errors?.testCases?.message}
                  data-cy="testrun-modal-testcase"
                  disabled={
                    location?.pathname === '/test-cases' ||
                    location?.pathname === '/qa-testing' ||
                    location?.search === '?active=2' ||
                    location?.search === '?active=1'
                      ? true
                      : false
                  }
                />
              </div>
              <div className={style.contentDiv}>
                <TextArea
                  label={'Description'}
                  name={'description'}
                  placeholder={'Write Your Text Here'}
                  register={registerDescription}
                  dataCy="testrun-modal-description"
                />
              </div>
              <div className={style.flex}>
                <div className={style.flexDate}>
                  <CreatableSelectComponent
                    defaultOptions={testedVersionOptions}
                    onChangeHandler={onTestedVersionChange}
                    label={'Tested Version '}
                    name={'testedVersion'}
                    placeholder="Select or Create (e.g: 1.1)"
                    control={control}
                    isClearable
                    watch={watch}
                    errorMessage={errors?.testedVersion?.message}
                    id="tested-version-status-testcase"
                  />
                </div>
                <div className={style.flexSelect}>
                  <CreatableSelectComponent
                    defaultOptions={testedEnvironmentOptions}
                    onChangeHandler={onTestedEnvironmentChange}
                    label={'Tested Environment '}
                    name={'testedEnvironment'}
                    placeholder="Select or Create"
                    control={control}
                    isClearable
                    watch={watch}
                    errorMessage={errors?.testedEnvironment?.message}
                    id="tested-env-status-testcase"
                  />
                </div>
              </div>
              <div className={style.flex}>
                <div className={style.flexDate}>
                  <DatePicker
                    control={control}
                    label={'Due Date'}
                    name={'dueDate'}
                    placeholder={'Select'}
                    rules={{ required: 'Required' }}
                    errorMessage={errors?.dueDate?.message}
                    id="testrun-modal-datepicker"
                    popperPlacement={'auto'}
                  />
                </div>
                <div className={style.flexSelect}>
                  <SelectBox
                    control={control}
                    name={'priority'}
                    label={'Priority'}
                    options={priorityOptions}
                    placeholder="Select"
                    rules={{ required: 'Required' }}
                    errorMessage={errors?.priority?.message}
                    id="testrun-modal-priority"
                  />
                </div>
              </div>
              <SelectBox
                control={control}
                placeholder="Select"
                name={'assignee'}
                watch={watch}
                options={assignedTo}
                label={'Assignee'}
                rules={{ required: 'Required' }}
                errorMessage={errors?.assignee?.message}
                id="testrun-modal-assignee"
              />
              {watch('runType') !== 'Bugs' && (
                <div className={style.evidenceToggle}>
                  <span>Test Evidence Required</span>
                  <Switch control={control} name={'evidenceRequired'} id={'evidenceRequired'} watch={watch} />
                </div>
              )}

              <div className={style.btnFlex}>
                <Button
                  text={'Discard'}
                  type={'button'}
                  btnClass={style.reset}
                  handleClick={handleDiscardClick}
                  data-cy="testrun-modal-discard-btn"
                />

                <Button
                  text={'Save'}
                  type={'submit'}
                  disabled={_createIsLoading || _updateIsLoading || _createBugRunIsLoading || _updateBugsRunIsLoading}
                  isLoading={_createIsLoading || _updateIsLoading || _createBugRunIsLoading || _updateBugsRunIsLoading}
                  data-cy="testrun-modal-save-btn"
                />
              </div>
            </div>
          </form>
        )}
      </div>
      {openModal && (
        <>
          <SelectTestCases
            openAddModal={openModal}
            setOpenAddModal={setOpenModal}
            projectId={editRecord || selectedRecords?.length ? watch('projectId') : projectId}
            options={data}
            type={watch('runType')}
            editRecords={memoizedData}
            onDiscard={onTestCaseDiscard}
            onSubmit={onTestCaseSubmit}
          />
        </>
      )}
    </>
  );
};

Drawer.propTypes = {
  setDrawerOpen: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
  editRecord: PropTypes.any,
  setEditRecord: PropTypes.func.isRequired,
  noHeader: PropTypes.bool.isRequired,
  projectId: PropTypes.string.isRequired,
  selectedRunRecords: PropTypes.any.isRequired,
  setSelectedRunRecords: PropTypes.func.isRequired,
};

export default Drawer;
