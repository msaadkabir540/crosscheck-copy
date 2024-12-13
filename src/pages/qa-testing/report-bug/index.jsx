import { useCallback, useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import _ from 'lodash';
import { EditorState, convertFromRaw } from 'draft-js';

import SelectBox from 'components/select-box';
import Button from 'components/button';
import TextField from 'components/text-field';
import Checkbox from 'components/checkbox';
import CreatableSelectComponent from 'components/select-box/creatable-select';
import CustomTags from 'components/custom-tags-input';
import TextEditor from 'components/editor/text-editor';
import UploadAttachment from 'components/upload-attachments/upload-attachment';
import Loader from 'components/loader';
import FormCloseModal from 'components/form-close-modal';

import { useToaster } from 'hooks/use-toaster';

import { useCreateBug, useGetBugById, useUpdateBug } from 'api/v1/bugs/bugs';

import { validateDescription } from 'utils/validations';

import style from './report.module.scss';
import Icon from '../../../components/icon/themed-icon';

const ReportBug = ({
  setReportBug,
  options,
  projectId,
  milestoneId,
  featureId,
  refetch,
  setEditRecord,
  editRecord,
  viewBugId,
  noHeader,
}) => {
  const {
    projectOptions,
    mileStonesOptions,
    featuresOptions,
    bugTypeOptions,
    bugSubtypeOptions = [],
    severityOptions,
    testTypeOptions,
    assignedToOptions,
  } = options;

  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
    setError,
    reset,
  } = useForm({
    defaultValues: {
      feedback: {},
      idealBehaviour: {},
      reproduceSteps: {},
      projectId: '',
      milestoneId: '',
      featureId: '',
      bugType: '',
      bugSubType: {},
      severity: '',
      testingType: '',
      testedVersion: '',
      taskId: '',
      developerId: '',
      testEvidence: {},
    },
  });
  const [openFormCloseModal, setOpenFormCloseModal] = useState(false);

  const { toastError, toastSuccess } = useToaster();

  useEffect(() => {
    Object.entries({ projectId, milestoneId, featureId }).forEach(([key, val]) => {
      setValue(key, val);
    });
  }, [projectId, milestoneId, featureId]);

  const { mutateAsync: _createBugHandler, isLoading: _createIsLoading } = useCreateBug();
  const { mutateAsync: _createUpdateHandler, isLoading: _updateIsLoading } = useUpdateBug();

  const onSubmit = async (data) => {
    try {
      let testEvidenceValue = data.testEvidence.base64;

      if (data.testEvidence.url && !data.testEvidence.url.startsWith('blob:')) {
        testEvidenceValue = data.testEvidence.url;
      }

      const formData = {
        ...data,
        bugSubType: data?.bugSubType?.value,
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
        ...(editRecord?.reopen && { issueType: 'Reopened Bug' }),
        ...(editRecord?.reopen && { reOpenId: editRecord?.id }),
        tags: data?.tags,
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

      const res =
        editRecord?.id && !editRecord?.reopen
          ? await _createUpdateHandler({ id: editRecord?.id, body: formData })
          : await _createBugHandler(formData);

      toastSuccess(res.msg);
      refetch(editRecord?.id, editRecord?.id && !editRecord?.reopen ? 'edit' : 'add', res?.bugData);
      editRecord?.refetch && (await editRecord?.refetch());

      if (!watch('addAnother')) {
        !viewBugId && setReportBug(false);
        setEditRecord(null);
      }

      reset();
    } catch (error) {
      toastError(error, setError);
    }
  };

  const { data: _bugDetails, isLoading: isLoading } = useGetBugById(editRecord?.id);

  useEffect(() => {
    (async () => {
      if (_bugDetails?.bug && !_.isEmpty(_bugDetails?.bug)) {
        let values = _.pick(_bugDetails?.bug, [
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
          'taskId',
          'testedVersion',
        ]);

        const feedback = values?.feedback?.description && JSON.parse(values?.feedback?.description);
        const idealBehaviour = values?.idealBehaviour?.description && JSON.parse(values?.idealBehaviour?.description);
        const reproduceSteps = values?.reproduceSteps?.description && JSON.parse(values?.reproduceSteps?.description);

        const developerId = values?.developerId?._id ? values?.developerId?._id : '';
        const projectId = values.projectId?._id;
        const milestoneId = values.milestoneId?._id;
        const featureId = values.featureId?._id;
        const bugType = values.bugType ? values.bugType : values.testType;

        const bugSubType = {
          label: values.bugSubType,
          value: values.bugSubType,
        };
        const tags = values?.tags?.map((tag) => tag._id);

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
          projectId,
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
    })();
  }, [_bugDetails]);

  const closeForm = () => {
    setEditRecord(null);
    !watch('addAnother') && setReportBug(false);
    reset();
    setOpenFormCloseModal(false);
  };

  const handleDiscard = useCallback(() => {
    const isFormChanged =
      watch('bugSubType')?.value !== _bugDetails?.bug?.bugSubType ||
      watch('bugType') !== _bugDetails?.bug?.bugType ||
      watch('developerId') !== _bugDetails?.bug?.developerId?._id ||
      watch('featureId') !== _bugDetails?.bug?.featureId?._id ||
      watch('milestoneId') !== (_bugDetails?.bug?.milestoneId?._id || '') ||
      watch('projectId') !== _bugDetails?.bug?.projectId?._id ||
      watch('severity') !== _bugDetails?.bug?.severity ||
      watch('taskId') !== (_bugDetails?.bug?.taskId || '') ||
      watch('testedVersion') !== (_bugDetails?.bug?.testedVersion || '') ||
      watch('testingType') !== _bugDetails?.bug?.testingType ||
      watch('feedback')?.text !== _bugDetails?.bug.feedback?.text ||
      watch('idealBehaviour')?.text !== _bugDetails?.bug?.idealBehaviour?.text ||
      watch('testEvidence')?.base64 !== _bugDetails?.bug?.testEvidence ||
      watch('reproduceSteps')?.text !== _bugDetails?.bug?.reproduceSteps?.text
        ? true
        : false;
    isFormChanged ? setOpenFormCloseModal(true) : closeForm();
  }, [
    watch,
    _bugDetails?.bug?.bugSubType,
    _bugDetails?.bug?.bugType,
    _bugDetails?.bug?.developerId?._id,
    _bugDetails?.bug?.featureId?._id,
    _bugDetails?.bug?.milestoneId?._id,
    _bugDetails?.bug?.projectId?._id,
    _bugDetails?.bug?.severity,
    _bugDetails?.bug?.taskId,
    _bugDetails?.bug?.testedVersion,
    _bugDetails?.bug?.testingType,
    _bugDetails?.bug.feedback?.text,
    _bugDetails?.bug?.idealBehaviour?.text,
    _bugDetails?.bug?.testEvidence,
    _bugDetails?.bug?.reproduceSteps?.text,
    setOpenFormCloseModal,
    closeForm,
  ]);

  const handleTestEvidenceChange = useCallback(
    (e) => {
      setValue('testEvidence', {
        base64: e.target.value,
        url: e.target.value,
      });
    },
    [setValue],
  );

  const validateTestEvidence = useCallback((e) => {
    if (!e.base64) {
      return 'Required';
    }

    try {
      new URL(e.base64);

      return true;
    } catch (err) {
      return 'Not a valid URL';
    }
  }, []);

  const registerTestedVersion = useCallback(() => {
    register('testedVersion');
  }, [register]);

  const registerTags = useCallback(() => {
    register('tags', { required: 'Required' });
  }, [register]);

  return (
    <div className={style.main}>
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
      <div className={style.mainInnerFlex}>
        <p>Report a bug</p>
        <div className={style.img} onClick={handleDiscard}>
          <Icon name={'CrossIcon'} />
          <div className={style.tooltip}>
            <p>Cross</p>
          </div>
        </div>
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} style={{ height: noHeader ? '78vh' : '90vh', overflowY: 'auto' }}>
          <div className={style.bottom}>
            <div className={style.gridTwo}>
              <div>
                <SelectBox
                  options={projectOptions}
                  label={'Project'}
                  name={'projectId'}
                  placeholder="Select"
                  control={control}
                  numberBadgeColor={'#39695b'}
                  showNumber
                  rules={{
                    required: {
                      value: true,
                      message: 'Required',
                    },
                  }}
                  errorMessage={errors?.projectId?.message}
                  id={'bugreporting-editfoem-projectdropdown'}
                />
              </div>
              <div>
                <SelectBox
                  options={mileStonesOptions?.filter((x) => x.projectId === watch('projectId'))}
                  label={'Milestone'}
                  name={'milestoneId'}
                  placeholder="Select"
                  control={control}
                  numberBadgeColor={'#39695b'}
                  showNumber
                  rules={{
                    required: {
                      value: true,
                      message: 'Required',
                    },
                  }}
                  errorMessage={errors?.milestoneId?.message}
                  id={'bugreporting-editfoem-milestonedropdown'}
                />
              </div>
            </div>
            <div
              style={{
                marginTop: '10px',
              }}
            >
              <SelectBox
                options={featuresOptions?.filter((x) => x.milestoneId === watch('milestoneId'))}
                label={'Feature'}
                name={'featureId'}
                placeholder="Select"
                control={control}
                numberBadgeColor={'#39695b'}
                showNumber
                rules={{
                  required: {
                    value: true,
                    message: 'Required',
                  },
                }}
                errorMessage={errors?.featureId?.message}
                id={'bugreporting-editfoem-featuredropdown'}
              />
            </div>
            <div
              style={{
                marginTop: '10px',
              }}
            >
              <TextEditor
                control={control}
                name={'feedback'}
                label={'Feedback'}
                placeholder="Write your text here"
                watch={watch}
                rules={{
                  required: {
                    value: true,
                    message: 'Required',
                  },
                  validate: validateDescription,
                }}
                errorMessage={errors?.feedback?.message}
                id="bugreport-edit-feedback"
              />
            </div>
            <div
              style={{
                marginTop: '10px',
              }}
            >
              <TextEditor
                control={control}
                name={'reproduceSteps'}
                label={'Steps to Reproduce'}
                placeholder="Write your text here"
                watch={watch}
                rules={{
                  required: {
                    value: true,
                    message: 'Required',
                  },
                  validate: validateDescription,
                }}
                errorMessage={errors?.reproduceSteps?.message}
                id="bugreport-edit-reproducesteps"
              />
            </div>
            <div
              style={{
                marginTop: '10px',
              }}
            >
              <TextEditor
                control={control}
                name={'idealBehaviour'}
                label={'Ideal Behavior'}
                placeholder="Write your text here"
                watch={watch}
                rules={{
                  required: {
                    value: true,
                    message: 'Required',
                  },
                  validate: validateDescription,
                }}
                errorMessage={errors?.idealBehaviour?.message}
                id="bugreport-edit-idealbehaviour"
              />
            </div>
            <div
              className={style.gridTwo}
              style={{
                marginTop: '10px',
              }}
            >
              <div>
                <SelectBox
                  options={bugTypeOptions}
                  label={'Bug Type'}
                  name={'bugType'}
                  placeholder="Select"
                  control={control}
                  numberBadgeColor={'#39695b'}
                  showNumber
                  rules={{
                    required: { value: true, message: 'Required' },
                  }}
                  errorMessage={errors?.bugType?.message}
                  id="bugreport-edit-bugtype"
                />
              </div>
              <CreatableSelectComponent
                defaultOptions={bugSubtypeOptions}
                label={'Bug Subtype'}
                name={'bugSubType'}
                placeholder="Select or Create"
                control={control}
                isClearable
                watch={watch}
                errorMessage={errors?.bugSubType?.message}
                id="bugreport-edit-bugsubtype"
              />
              <div>
                <SelectBox
                  options={severityOptions}
                  label={'Severity'}
                  name={'severity'}
                  placeholder="Select"
                  control={control}
                  numberBadgeColor={'#39695b'}
                  showNumber
                  rules={{
                    required: { value: true, message: 'Required' },
                  }}
                  errorMessage={errors?.severity?.message}
                  id="bugreport-edit-severity"
                />
              </div>
              <div>
                <SelectBox
                  options={testTypeOptions}
                  label={'Testing Type'}
                  name={'testingType'}
                  placeholder="Select"
                  control={control}
                  numberBadgeColor={'#39695b'}
                  showNumber
                  rules={{
                    required: { value: true, message: 'Required' },
                  }}
                  errorMessage={errors?.testingType?.message}
                  id="bugreport-edit-testingtype"
                />
              </div>
              <TextField
                register={registerTestedVersion}
                name={'testedVersion'}
                placeholder="Enter Test Version"
                label="Tested Version"
                id="bugreport-edit-testedversion"
                watch={watch}
              />
              <TextField
                register={register}
                name={'taskId'}
                placeholder="Enter Task ID"
                label="Task ID"
                id="bugreport-edit-taskid"
                watch={watch}
              />
            </div>
            <div style={{ marginTop: '10px' }}>
              <SelectBox
                options={assignedToOptions}
                label={'Developer Name'}
                name={'developerId'}
                placeholder="Select"
                control={control}
                numberBadgeColor={'#39695b'}
                showNumber
                id="bugreport-edit-dev-name"
              />
            </div>
            <div className={style.innerFlex}>
              <div className={style.customTagDiv}>
                <CustomTags
                  watch={watch}
                  openUp
                  control={control}
                  setValue={setValue}
                  label="Tags"
                  projectId={watch('projectId')}
                  name={'tags'}
                  required
                  register={registerTags}
                  errorMessage={errors.tags && errors.tags.message}
                />
              </div>
              <UploadAttachment
                control={control}
                watch={watch}
                name={'testEvidence'}
                rules={{
                  required: 'Required',
                  validate: validateTestEvidence,
                }}
                onTextChange={handleTestEvidenceChange}
                placeholder="Attach Test Evidence"
                label="Test Evidence"
                setValue={setValue}
                errorMessage={errors?.testEvidence?.message}
              />
            </div>
          </div>

          <div className={style.btnDiv}>
            {!editRecord?.id && <Checkbox register={register} name={'addAnother'} label={'Add another'} />}
            <Button
              text="Discard"
              type={'button'}
              btnClass={style.btn}
              handleClick={handleDiscard}
              data-cy="bugreport-edit-dicard-btn"
            />
            <Button
              text="Save"
              type={'submit'}
              disabled={_createIsLoading || _updateIsLoading}
              data-cy="bugreport-edit-save-btn"
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default ReportBug;
