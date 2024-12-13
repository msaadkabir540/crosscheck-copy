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
import RelatedBugs from 'components/related-bugs';
import Tabs from 'components/tabs';

import { useGetTestCaseById } from 'api/v1/test-cases/test-cases';
import { useGetBugById } from 'api/v1/bugs/bugs';

import { pick as _pick, isEmpty as _isEmpty } from 'utils/lodash';

import BugReportingForm from './form';
import style from './start-testing.module.scss';
import Icon from '../icon/themed-icon';

const StartTestingModal = ({
  open,
  handleClose,
  backClass,
  projectId = null,
  editRecordId,
  type = 'bugs',
  setEditRecord,
  onSubmit,
  isLoading,
  source,
  noBackground,
  relatedRunId,
  duplicateRecordId,
  setDuplicateRecord,
}) => {
  const { control, register, watch, setValue, formState, handleSubmit, reset } = useForm({
    defaultValues: {
      bugSubType: null,
      bugType: null,
      developerId: null,
      featureId: null,
      feedback: {
        text: '',
      },
      idealBehaviour: {
        text: '',
      },
      milestoneId: null,
      projectId: null,
      reproduceSteps: {
        text: '',
      },
      severity: null,
      taskId: '',
      testEvidence: {},
      testedDevice: null,
      testedEnvironment: null,
      testedVersion: '',
      addAnother: false,
      testingType: null,
    },
  });
  const { dirtyFields, isDirty } = formState;

  const [viewSizes, setViewSizes] = useState(['80%', 'auto']);
  const [viewRelatedInfo, setViewRelatedInfo] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [testCaseId, setTestCaseId] = useState('');
  const [newBugId, setNewBugId] = useState('');
  const [openFormCloseModal, setOpenFormCloseModal] = useState(false);

  const { data: _testCaseData = {}, isFetching: _isTestCaseFetching } = useGetTestCaseById(
    type === 'testCases' ? editRecordId || duplicateRecordId : testCaseId,
  );
  const { testCase = {} } = _testCaseData;

  const { data: _bugData = {}, isFetching: _isBugFetching } = useGetBugById(
    type === 'bugs' ? editRecordId || duplicateRecordId : '',
  );
  const { bug = {} } = _bugData;
  const WATCH_TASK_ID = watch('taskId');
  const WATCH_PROJECT_ID = watch('projectId');
  const WATCH_FEATURE_ID = watch('featureId');
  const WATCH_FEEDBACK_ID = watch('feedback');
  const WATCH_MILESTONE_ID = watch('milestoneId');
  const WATCH_TEST_EVIDENCE_ID = watch('testEvidence');
  const WATCH_IDEAL_BEHAVIOUR_ID = watch('idealBehaviour');
  const WATCH_REPRODUCE_STEPS_ID = watch('reproduceSteps');

  //NOTE:prefill source
  useEffect(() => {
    if (source) {
      setValue('testEvidence', {
        base64: source,
        url: source,
      });
    }
  }, [setValue, source]);

  useEffect(() => {
    if (!WATCH_PROJECT_ID) {
      setValue('milestoneId', null);
    }
  }, [WATCH_PROJECT_ID, setValue]);

  useEffect(() => {
    if (!WATCH_MILESTONE_ID) {
      setValue('featureId', null);
    }
  }, [WATCH_MILESTONE_ID, setValue]);

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

  //NOTE: on Changing testCase status How a bug form is filled
  useEffect(() => {
    (async () => {
      if (testCase && !_isEmpty(testCase)) {
        let values = _pick(testCase, [
          'testObjective',
          'testSteps',
          'expectedResults',
          'projectId',
          'milestoneId',
          'featureId',
          'bugType',
          'relatedTicketId',
          'testType',
          'bugSubType',
          'severity',
          'testedVersion',
          'taskId',
          'developerId',
          'testEvidence',
        ]);

        const feedback = values?.testObjective?.description && JSON.parse(values?.testObjective?.description);
        const reproduceSteps = values?.testSteps?.description && JSON.parse(values?.testSteps?.description);
        const idealBehaviour = values?.expectedResults?.description && JSON.parse(values?.expectedResults?.description);

        const developerId = values?.developerId?._id;
        const projectId = values.projectId?._id;
        const milestoneId = values.milestoneId?._id;
        const featureId = values.featureId?._id;
        const bugType = values.testType;

        values = {
          ...values,

          feedback: {
            ...values?.testObjective,
            description: feedback,
            editorState: EditorState.createWithContent(convertFromRaw(feedback)),
          },
          reproduceSteps: {
            ...values?.testSteps,
            description: reproduceSteps,
            editorState: EditorState.createWithContent(convertFromRaw(reproduceSteps)),
          },
          idealBehaviour: {
            ...values?.expectedResults,
            description: idealBehaviour,
            editorState: EditorState.createWithContent(convertFromRaw(idealBehaviour)),
          },
          developerId,
          testEvidence: {
            url: values.testEvidence,
            base64: values.testEvidence,
          },
          projectId,
          milestoneId,
          featureId,
          bugType,
        };
        Object.entries(values).forEach(([key, val]) => {
          setValue(key, val);
        });
      }
    })();
  }, [testCase, setValue]);

  //NOTE:in Case of Edit how Form Fields Are filled
  useEffect(() => {
    (async () => {
      if (!_isBugFetching) {
        if (bug && !_isEmpty(bug)) {
          let values = _pick(bug, [
            'feedback',
            'idealBehaviour',
            'reproduceSteps',
            'projectId',
            'milestoneId',
            'featureId',
            'bugType',
            'bugSubType',
            'severity',
            'testingType',
            'testedVersion',
            'taskId',
            'tags',
            'developerId',
            'testEvidence',
            'testedEnvironment',
            'testedDevice',
            'taskId',
            'testedVersion',
          ]);

          const feedback = values?.feedback?.description && JSON.parse(values?.feedback?.description);
          const idealBehaviour = values?.idealBehaviour?.description && JSON.parse(values?.idealBehaviour?.description);
          const reproduceSteps = values?.reproduceSteps?.description && JSON.parse(values?.reproduceSteps?.description);

          const developerId = values?.developerId?._id ? values?.developerId?._id : '';
          const projectId = values.projectId?._id;
          const bugType = values.bugType ? values.bugType : values.testType;
          const taskId = values?.taskId ? values?.taskId : '';

          const milestoneId = {
            label: values.milestoneId?.name,
            value: values.milestoneId?._id,
          };

          const featureId = {
            label: values.featureId?.name,
            value: values.featureId?._id,
          };

          const bugSubType = {
            label: values.bugSubType,
            value: values.bugSubType,
          };

          const testedDevice = {
            label: values.testedDevice,
            value: values.testedDevice,
          };

          const testedEnvironment = {
            label: values.testedEnvironment?.name,
            value: values.testedEnvironment?._id,
          };

          const testedVersion = {
            label: values.testedVersion?.name,
            value: values.testedVersion?._id,
          };
          const tags = values?.tags?.length ? values?.tags?.map((tag) => tag._id) : [];

          values = {
            ...values,
            feedback: {
              ...values?.feedback,
              description: feedback,
              editorState: EditorState.createWithContent(convertFromRaw(feedback)),
            },
            idealBehaviour: {
              ...values?.idealBehaviour,
              description: idealBehaviour,
              editorState: EditorState.createWithContent(convertFromRaw(idealBehaviour)),
            },
            reproduceSteps: {
              ...values?.reproduceSteps,
              description: reproduceSteps,
              editorState: EditorState.createWithContent(convertFromRaw(reproduceSteps)),
            },
            developerId,
            testEvidence: {
              url: values.testEvidence,
              base64: values.testEvidence,
            },
            testedEnvironment,
            taskId,
            testedVersion,
            projectId,
            testedDevice,
            milestoneId,
            featureId,
            bugType,
            bugSubType,
            tags,
          };
          Object.entries(values).forEach(([key, val]) => {
            setValue(key, val);
          });
        }
      }
    })();
  }, [bug, setValue, _isBugFetching]);

  const pages = useMemo(() => {
    return [
      {
        id: 0,
        tabTitle: `Related Test Case `,
        content: (
          <RelatedTestCases
            handleClose={handleClose}
            projectId={WATCH_PROJECT_ID}
            mileStoneId={WATCH_MILESTONE_ID?._id || WATCH_MILESTONE_ID}
            featureId={WATCH_FEATURE_ID?._id || WATCH_FEATURE_ID}
            taskId={WATCH_TASK_ID}
            {...{ setTestCaseId, testCaseId, newBugId }}
          />
        ),
      },
      {
        id: 0,
        tabTitle: `Related Bugs `,
        content: (
          <RelatedBugs
            projectId={WATCH_PROJECT_ID}
            mileStoneId={WATCH_MILESTONE_ID}
            featureId={WATCH_FEATURE_ID}
            taskId={WATCH_TASK_ID}
          />
        ),
      },
    ];
  }, [WATCH_PROJECT_ID, WATCH_MILESTONE_ID, WATCH_FEATURE_ID, WATCH_TASK_ID, handleClose, newBugId, testCaseId]);

  const resetHandler = useCallback(
    (data) => {
      reset();

      if (data?.addAnother) {
        Object.entries({
          taskId: data.taskId,
          projectId: data.projectId,
          featureId: data.featureId,
          addAnother: data.addAnother,
          milestoneId: data.milestoneId,
          testingType: data.testingType,
          reproduceSteps: data.reproduceSteps,
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
  }, [handleClose, resetHandler, setEditRecord, setDuplicateRecord]);

  const handleDiscard = useCallback(() => {
    if (editRecordId) {
      const isFormChanged = isDirty;
      isFormChanged ? setOpenFormCloseModal(true) : closeForm();
    } else {
      const isFormChanged =
        dirtyFields.bugSubType !== undefined ||
        dirtyFields.bugType !== undefined ||
        dirtyFields.developerId !== undefined ||
        dirtyFields.featureId !== undefined ||
        WATCH_FEEDBACK_ID?.text !== '' ||
        WATCH_IDEAL_BEHAVIOUR_ID?.text !== '' ||
        WATCH_REPRODUCE_STEPS_ID?.text !== '' ||
        dirtyFields.milestoneId !== undefined ||
        dirtyFields.projectId !== undefined ||
        dirtyFields.severity !== undefined ||
        dirtyFields.taskId !== undefined ||
        dirtyFields.testedDevice !== undefined ||
        dirtyFields.testedEnvironment !== undefined ||
        dirtyFields.testedVersion !== undefined ||
        dirtyFields.testingType !== undefined ||
        dirtyFields.addAnother !== undefined ||
        WATCH_TEST_EVIDENCE_ID?.url ||
        isDirty
          ? true
          : false;
      isFormChanged ? setOpenFormCloseModal(true) : closeForm();
    }
  }, [
    dirtyFields,
    isDirty,
    closeForm,
    editRecordId,
    WATCH_FEEDBACK_ID,
    WATCH_TEST_EVIDENCE_ID,
    WATCH_IDEAL_BEHAVIOUR_ID,
    WATCH_REPRODUCE_STEPS_ID,
  ]);

  const onSubmitHandler = async (data) => {
    try {
      let testEvidenceValue = data.testEvidence.base64;

      const { milestoneId, featureId } = data;

      if (data.testEvidence.url && !data.testEvidence.url.startsWith('blob:')) {
        testEvidenceValue = data.testEvidence.url;
      }

      const formData = {
        ...data,
        bugSubType: data?.bugSubType?.value,
        testedDevice: data?.testedDevice?.value,
        testedVersion: data?.testedVersion?.value,
        testedEnvironment: data?.testedEnvironment?.value,
        featureId: featureId?._id || featureId?.value || featureId,
        milestoneId: milestoneId?._id || milestoneId?.value || milestoneId,
        relatedRunId: relatedRunId && relatedRunId,
        feedback: {
          ...data.feedback,
          description: JSON.stringify(data.feedback?.description),
        },
        idealBehaviour: {
          ...data.idealBehaviour,
          description: JSON.stringify(data.idealBehaviour?.description),
        },
        reproduceSteps: {
          ...data.reproduceSteps,
          description: JSON.stringify(data.reproduceSteps?.description),
        },
        testEvidence: testEvidenceValue,
        tags: data?.tags || [],
      };

      if (formData.developerId === null || formData.developerId === undefined || formData.developerId === '') {
        delete formData.developerId;
      }

      if (formData.bugType === null || formData.bugType === undefined || formData.bugType === '') {
        delete formData.bugType;
      }

      if (formData.severity === null || formData.severity === undefined || formData.severity === '') {
        delete formData.severity;
      }

      if (formData.testingType === null || formData.testingType === undefined || formData.testingType === '') {
        delete formData.testingType;
      }

      const res = onSubmit && (await onSubmit(formData));

      testCaseId && setNewBugId(res?.newBugId);

      if (!watch('addAnother') && !testCaseId && res?.msg) {
        handleClose();
      }

      res && resetHandler(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewRelatedInfo = useCallback(() => {
    setViewRelatedInfo((pre) => !pre);
  }, []);

  const handleDiscardBtn = useCallback(
    (e) => {
      e.preventDefault();
      handleDiscard();
    },
    [handleDiscard],
  );

  return (
    <Modal
      open={open}
      handleClose={handleDiscard}
      className={`${style.mainDiv} ${viewRelatedInfo ? style.widthOpened : style.widthClosed} `}
      backClass={backClass}
      noBackground={noBackground}
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
          {duplicateRecordId && type !== 'testCases'
            ? 'Duplicate Bug'
            : editRecordId && type !== 'testCases'
              ? 'Update Bug'
              : 'Report Bug'}
        </span>{' '}
        <div className={style.hover}>
          <div className={style.iconClass} onClick={handleDiscard} data-cy="close-bugreporting-modal">
            <Icon name={'CrossIcon'} />
          </div>
          {WATCH_PROJECT_ID && WATCH_MILESTONE_ID && WATCH_FEATURE_ID && !editRecordId && !relatedRunId && (
            <div
              onClick={handleViewRelatedInfo}
              style={{
                transform: viewRelatedInfo ? 'rotate(180deg)' : '',
                padding: viewRelatedInfo ? '0px 5px 10px 0px' : '',
              }}
            >
              <Icon name={'DashedLeftArrow'} />
            </div>
          )}
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <div className={style.modalBody}>
          <SplitPane sizes={viewSizes} onChange={setViewSizes} allowResize={viewRelatedInfo}>
            {_isTestCaseFetching || _isBugFetching ? (
              <Loader />
            ) : (
              <BugReportingForm
                handleClose={handleClose}
                projectId={projectId}
                closeForm={closeForm}
                testCaseId={testCaseId}
                formHook={{
                  control,
                  register,
                  watch,
                  setValue,
                  errors: formState.errors,
                }}
              />
            )}

            <div className={style.tabsClass}>
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
            handleClick={handleDiscardBtn}
            id="reportbug-discard-btn"
          />
          <Button text="Save" type={'submit'} disabled={isLoading} id="reportbug-save-btn" />
        </div>
      </form>
    </Modal>
  );
};

export default StartTestingModal;
