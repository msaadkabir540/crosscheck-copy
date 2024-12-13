import { useCallback, useEffect } from 'react';

import { useForm } from 'react-hook-form';

import SelectBox from 'components/select-box';
import Button from 'components/button';
import TextField from 'components/text-field';
import CreatableSelectComponent from 'components/select-box/creatable-select';
import TextEditor from 'components/editor/text-editor';
import UploadAttachment from 'components/upload-attachments/upload-attachment';

import { useToaster } from 'hooks/use-toaster';

import { useReportBugFromFeedBack } from 'api/v1/projects/feedbacks';

import { validateDescription } from 'utils/validations';

import style from './report.module.scss';
import Icon from '../../../../../components/icon/themed-icon';
import SideModal from '../../../../../components/side-modal';

const ReportBug = ({
  setReportBug,
  options,
  projectId,
  milestoneId,
  featureId,
  setEditRecord,
  editRecord,
  noHeader,
}) => {
  const {
    projectOptions,
    mileStonesOptions,
    featuresOptions,
    bugSubtypeOptions = [],
    severityOptions,
    testingTypeOptions,
    bugTypeOptions,
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
  } = useForm();
  const { toastError, toastSuccess } = useToaster();

  useEffect(() => {
    Object.entries({ projectId, milestoneId, featureId }).forEach(([key, val]) => {
      setValue(key, val);
    });
  }, [projectId, milestoneId, featureId]);

  const { mutateAsync: _createReportBugHandler, isLoading: _isCreateBugLoading } = useReportBugFromFeedBack();

  const onSubmit = useCallback(
    async (data) => {
      try {
        const formData = {
          ...data,
          taskId: watch('relatedTicketId'),
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
          testEvidence: data.testEvidence.base64,
          testingType: watch('testingType'),
          bugSubType: watch('bugSubType')?.value || '',
        };
        const res = await _createReportBugHandler({ id: editRecord, body: formData });

        setEditRecord(null);
        toastSuccess(res.msg);
        setReportBug(false);
        reset();
      } catch (error) {
        toastError(error, setError);
      }
    },
    [_createReportBugHandler, editRecord, watch, setEditRecord, toastSuccess, setReportBug, reset, setError],
  );

  const handleCancelReportBug = useCallback(() => {
    setReportBug(false);
    setEditRecord(null);
  }, [setReportBug, setEditRecord]);

  const handleRegisterTestedVersion = useCallback(() => {
    register('testedVersion');
  }, [register]);

  const handleRegisterRelatedTicketId = useCallback(() => {
    register('relatedTicketId');
  }, [register]);

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

  const handleCancelEdit = useCallback(
    (e) => {
      e.preventDefault();
      setEditRecord(null);
      setReportBug(false);
      reset();
    },
    [setEditRecord, setReportBug, reset],
  );

  const handleTestEvidenceChange = useCallback(
    (e) => {
      setValue('testEvidence', {
        base64: e.target.value,
        url: e.target.value,
      });
    },
    [setValue],
  );

  return (
    <SideModal open={true} handleClose={setReportBug} className={style.main}>
      <div className={style.main}>
        <div className={style.mainInnerFlex}>
          <p>Report a bug</p>
          <div onClick={handleCancelReportBug} className={style.hover1}>
            <Icon name={'CrossIcon'} />
            <div className={style.tooltip}>
              <p>Cross</p>
            </div>
          </div>
        </div>
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
                />
              </div>
              <SelectBox
                options={testingTypeOptions}
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
              />
              <div>
                <TextField
                  register={handleRegisterTestedVersion}
                  name={'testedVersion'}
                  placeholder="Enter Test Version"
                  label="Tested Version"
                  errorMessage={errors?.testedVersion?.message}
                />
              </div>
              <TextField
                register={handleRegisterRelatedTicketId}
                name={'relatedTicketId'}
                placeholder="Enter Task ID"
                label="Task ID"
                errorMessage={errors?.relatedTicketId?.message}
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
                rules={{
                  required: { value: true, message: 'Required' },
                }}
                errorMessage={errors?.developerId?.message}
              />
            </div>
            <div className={style.innerFlex}>
              <UploadAttachment
                control={control}
                name={'testEvidence'}
                watch={watch}
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
            <Button text="Discard" type={'button'} btnClass={style.btn} handleClick={handleCancelEdit} />
            <Button text="Save" type={'submit'} disabled={_isCreateBugLoading} />
          </div>
        </form>
      </div>
    </SideModal>
  );
};

export default ReportBug;
