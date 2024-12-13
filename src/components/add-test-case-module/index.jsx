import { useEffect, useMemo, useCallback, useState } from 'react';

import { useForm } from 'react-hook-form';
import { EditorState, convertFromRaw } from 'draft-js';

import Modal from 'components/modal';
import SplitPane from 'components/split-pane/split-pane';
import FormCloseModal from 'components/form-close-modal';
import Checkbox from 'components/checkbox';
import Button from 'components/button';
import Loader from 'components/loader';
import RelatedTestCases from 'components/related-test-cases';
import Tabs from 'components/tabs';

import { useGetTestCaseById } from 'api/v1/test-cases/test-cases';
import { useGetBugById } from 'api/v1/bugs/bugs';

import { pick as _pick, isEmpty as _isEmpty } from 'utils/lodash';

import TestCaseForm from './form';
import style from './start-testing.module.scss';
import Icon from '../icon/themed-icon';

const AddTestCaseModal = ({
  open,
  handleClose,
  backClass,
  type = 'testCases',
  projectId = null,
  editRecordId,
  setEditRecord,
  onSubmit,
  isLoading,
  duplicateRecordId,
  setDuplicateRecord,
}) => {
  const {
    control,
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { dirtyFields, isDirty, errors },
  } = useForm({
    defaultValues: {
      testObjective: {},
      preConditions: {},
      testSteps: {},
      expectedResults: {},
      weightage: '1',
      testType: '',
      relatedTicketId: '',
      addAnother: false,
    },
  });
  const [viewSizes, setViewSizes] = useState(['80%', 'auto']);
  const [viewRelatedInfo, setViewRelatedInfo] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [testCasesLength, setTestCasesLength] = useState(0);
  const [openFormCloseModal, setOpenFormCloseModal] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const WATCHprojectId = watch('projectId');
  const WATCHmilestoneId = watch('milestoneId');
  const WATCHfeatureId = watch('featureId');
  const WATCHtaskId = watch('taskId');

  const { data: _testCaseData = {}, isFetching: _isTestCaseFetching } = useGetTestCaseById(
    type === 'testCases' ? editRecordId || duplicateRecordId : '',
  );
  const { testCase = {} } = _testCaseData;

  const { data: _bugData = {} } = useGetBugById(type === 'bugs' ? editRecordId || duplicateRecordId : '');
  const { bug = {} } = _bugData;

  useEffect(() => {
    if (!watch('projectId')) {
      setValue('milestoneId', null);
    }
  }, [setValue, watch]);

  useEffect(() => {
    if (!watch('milestoneId')) {
      setValue('featureId', null);
    }
  }, [setValue, watch]);

  useEffect(() => {
    if (projectId) {
      setValue('projectId', projectId);
    }
  }, [projectId, setValue]);

  useEffect(() => {
    if (viewRelatedInfo) {
      if (window.innerWidth <= 768) {
        setViewSizes(['0%', '99%']);
      } else {
        setViewSizes(['40%', '60%']);
      }
    } else {
      setViewSizes(['99%', '0%']);
    }
  }, [viewRelatedInfo]);

  //NOTE:in Case of Edit how Form Fields Are filled
  useEffect(() => {
    (async () => {
      if (testCase && !_isEmpty(testCase)) {
        let values = _pick(testCase, [
          'expectedResults',
          'preConditions',
          'relatedTicketId',
          'projectId',
          'milestoneId',
          'featureId',
          'testObjective',
          'testSteps',
          'tags',
          'state',
          'testType',
          'weightage',
        ]);

        const expectedResults =
          values?.expectedResults?.description && JSON.parse(values?.expectedResults?.description);
        const preConditions = values?.preConditions?.description && JSON.parse(values?.preConditions?.description);
        const testObjective = values?.testObjective?.description && JSON.parse(values?.testObjective?.description);
        const testSteps = values?.testSteps?.description && JSON.parse(values?.testSteps?.description);
        const tags = values?.tags?.map((tag) => tag._id);

        const projectId = values?.projectId?._id;

        const milestoneId = {
          label: values.milestoneId?.name,
          value: values.milestoneId?._id,
        };

        const featureId = {
          label: values.featureId?.name,
          value: values.featureId?._id,
        };

        const relatedTaskId = values.relatedTicketId;

        values = {
          ...values,
          projectId,
          featureId,
          milestoneId,
          tags,
          relatedTaskId,
          expectedResults: {
            ...values?.expectedResults,
            description: expectedResults,
            editorState: EditorState.createWithContent(convertFromRaw(expectedResults)),
          },
          preConditions: {
            ...values?.preConditions,
            description: preConditions,
            editorState: EditorState.createWithContent(convertFromRaw(preConditions)),
          },
          testObjective: {
            ...values?.testObjective,
            description: testObjective,
            editorState: EditorState.createWithContent(convertFromRaw(testObjective)),
          },
          testSteps: {
            ...values?.testSteps,
            description: testSteps,
            editorState: EditorState.createWithContent(convertFromRaw(testSteps)),
          },
        };
        Object.entries(values).forEach(([key, val]) => {
          setValue(key, val);
        });
      }
    })();
  }, [setValue, testCase]);

  //NOTE:in Bug Conversion to Test Case
  useEffect(() => {
    (async () => {
      if (bug && !_isEmpty(bug)) {
        let values = _pick(bug, [
          'preConditions',
          'bugId',
          'projectId',
          'milestoneId',
          'featureId',
          'reproduceSteps',
          'idealBehaviour',
          'feedback',
          'bugType',
          'weightage',
        ]);

        const idealBehaviour = values?.idealBehaviour?.description && JSON.parse(values?.idealBehaviour?.description);
        const feedback = values?.feedback?.description && JSON.parse(values?.feedback?.description);
        const reproduceSteps = values?.reproduceSteps?.description && JSON.parse(values?.reproduceSteps?.description);

        const projectId = values?.projectId?._id;
        const testType = values?.bugType;
        const relatedTicketId = values?.bugId;
        const featureId = values?.featureId?._id;
        const milestoneId = values?.milestoneId?._id;

        values = {
          ...values,
          projectId,
          featureId,
          relatedTicketId,
          testType,
          milestoneId,
          expectedResults: {
            ...values?.idealBehaviour,
            description: idealBehaviour,
            editorState: EditorState.createWithContent(convertFromRaw(idealBehaviour)),
          },
          testSteps: {
            ...values?.reproduceSteps,
            description: reproduceSteps,
            editorState: EditorState.createWithContent(convertFromRaw(reproduceSteps)),
          },
          testObjective: {
            ...values?.feedback,
            description: feedback,
            editorState: EditorState.createWithContent(convertFromRaw(feedback)),
          },
        };
        Object.entries(values).forEach(([key, val]) => {
          setValue(key, val);
        });
      }
    })();
  }, [bug, setValue]);

  const resetHandler = useCallback(
    (data) => {
      reset();

      if (data.addAnother) {
        Object.entries({
          projectId: data.projectId,
          milestoneId: data.milestoneId,
          featureId: data.featureId,
          preConditions: data.preConditions,
          tags: data.tags,
          testSteps: data.testSteps,
          testType: data.testType,
          relatedTicketId: data.relatedTicketId,
          relatedTaskId: data.relatedTaskId,
          addAnother: data.addAnother,
        }).forEach(([key, val]) => {
          setValue(key, val);
        });
      }
    },
    [reset, setValue],
  );

  const closeForm = useCallback(() => {
    setEditRecord && setEditRecord(null);
    setDuplicateRecord && setDuplicateRecord(null);
    setOpenFormCloseModal(false);
    handleClose();
    resetHandler();
  }, [handleClose, resetHandler, setDuplicateRecord, setEditRecord]);

  const handleDiscard = useCallback(() => {
    if (editRecordId) {
      const isFormChanged = isDirty;
      isFormChanged ? setOpenFormCloseModal(true) : closeForm();
    } else {
      const isFormChanged =
        watch('testObjective')?.text ||
        watch('preConditions')?.text ||
        watch('testSteps')?.text ||
        watch('expectedResults')?.text ||
        dirtyFields?.weightage ||
        dirtyFields?.relatedTicketId ||
        dirtyFields?.testType ||
        dirtyFields?.addAnother ||
        isDirty
          ? true
          : false;
      isFormChanged ? setOpenFormCloseModal(true) : closeForm();
    }
  }, [
    closeForm,
    dirtyFields?.addAnother,
    dirtyFields?.relatedTicketId,
    dirtyFields?.testType,
    dirtyFields?.weightage,
    editRecordId,
    isDirty,
    watch,
  ]);

  const onSubmitHandler = async (data) => {
    try {
      const { milestoneId, featureId } = data;

      const formData = {
        ...data,
        testObjective: {
          ...data.testObjective,
          description: JSON.stringify(data.testObjective?.description),
        },
        featureId: featureId?._id || featureId?.value || featureId,
        milestoneId: milestoneId?._id || milestoneId?.value || milestoneId,
        testSteps: {
          ...data.testSteps,
          description: JSON.stringify(data.testSteps?.description),
        },
        expectedResults: {
          ...data.expectedResults,
          description: JSON.stringify(data.expectedResults?.description),
        },
        preConditions: {
          ...data.preConditions,
          description: JSON.stringify(data.preConditions?.description),
        },
        tags: data?.tags,
        relatedTicketId: data?.relatedTaskId,
      };

      if (
        formData.testType === null ||
        formData.testType === undefined ||
        formData.testType === '' ||
        formData.testType === 'N/A'
      ) {
        delete formData.testType;
      }

      const res = onSubmit && (await onSubmit(formData));

      if (!watch('addAnother') && res.msg) {
        handleClose();
      }

      resetHandler(data);
      setEditRecord(null);
      setDuplicateRecord(null);
      setUpdateTrigger((prev) => prev + 1);
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewRelatedInfo = useCallback(() => {
    setViewRelatedInfo((pre) => !pre);
  }, []);

  const pages = useMemo(() => {
    return [
      {
        id: 0,
        tabTitle: `Related Test Cases (${testCasesLength || 0})`,
        content: (
          <RelatedTestCases
            setCount={setTestCasesLength}
            projectId={watch('projectId')}
            featureId={watch('featureId')?._id || watch('featureId')}
            mileStoneId={watch('milestoneId')?._id || watch('milestoneId')}
            taskId={watch('taskId')}
            tableView
            key={updateTrigger}
          />
        ),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testCasesLength, WATCHprojectId, WATCHmilestoneId, WATCHfeatureId, WATCHtaskId, watch]);

  return (
    <Modal
      open={open}
      handleClose={handleDiscard}
      className={`${style.mainDiv} ${viewRelatedInfo ? style.widthOpened : style.widthClosed} `}
      backClass={backClass}
    >
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
          noBackground
        />
      )}
      <div className={style.crossImg}>
        <span className={style.modalTitle}>
          {duplicateRecordId && type !== 'bugs'
            ? 'Duplicate Test Case'
            : editRecordId && type !== 'bugs'
              ? 'Edit Test Case'
              : 'Add Test Case'}
        </span>

        <div className={style.hover}>
          <div
            style={{ marginTop: viewRelatedInfo ? '5px' : '10px' }}
            onClick={handleDiscard}
            data-cy="close-bugreporting-modal"
          >
            <Icon name={'CrossIcon'} height={24} width={24} />
          </div>
          {watch('projectId') && watch('milestoneId') && watch('featureId') && !editRecordId && (
            <div
              className={style.relatedICon}
              style={{ rotate: viewRelatedInfo ? '180deg' : '0deg' }}
              onClick={handleViewRelatedInfo}
            >
              <Icon name={'DashedLeftArrow'} height={24} width={24} />
            </div>
          )}
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <div className={style.modalBody}>
          <SplitPane sizes={viewSizes} onChange={setViewSizes} allowResize={viewRelatedInfo}>
            {_isTestCaseFetching ? (
              <Loader />
            ) : (
              <TestCaseForm
                projectId={projectId}
                editRecordId={editRecordId}
                duplicateRecordId={duplicateRecordId}
                formHook={{
                  control,
                  register,
                  watch,
                  setValue,
                  errors: errors,
                }}
              />
            )}

            <div className={style.tabsContainer}>
              {!editRecordId && (
                <Tabs pages={pages?.filter((x) => x.tabTitle)} activeTab={activeTab} setActiveTab={setActiveTab} />
              )}
            </div>
          </SplitPane>
        </div>
        <div className={style.btnDiv}>
          {!editRecordId && <Checkbox register={register} name={'addAnother'} label={'Add another'} />}
          <Button
            text="Discard"
            type={'button'}
            btnClass={style.btn}
            handleClick={handleDiscard}
            id="reportbug-discard-btn"
          />
          <Button text="Save" btnClass={style.btn2} type={'submit'} disabled={isLoading} id="reportbug-save-btn" />
        </div>
      </form>
    </Modal>
  );
};

export default AddTestCaseModal;
