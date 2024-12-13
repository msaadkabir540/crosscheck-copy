import { useCallback, useEffect, useMemo, useState } from 'react';

import { useForm } from 'react-hook-form';

import Modal from 'components/modal';
import Button from 'components/button';
import TextField from 'components/text-field';
import SelectBox from 'components/select-box';
import CustomTags from 'components/custom-tags-input';
import RangeInput from 'components/range-input/range-input';
import TextEditor from 'components/editor/text-editor';
import CreatableSelectComponent from 'components/select-box/creatable-select';

import { useAddFeatureAndMilestones } from 'hooks/use-add-features-milestones';

import style from './style.module.scss';
import Icon from '../icon/themed-icon';

const Index = ({
  type = 'testCase',
  open,
  refetch,
  handleClose,
  selectedRecords,
  backClass,
  projectId,
  milestoneId,
  featureId,
  options,
  onSubmit,
  isLoading,
}) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    formState: { errors, isDirty },
  } = useForm();

  const MILESTONE_ID = watch('milestoneId');
  const [milestoneFirst, setMilestoneFirst] = useState(false);

  const {
    mileStonesOptions,
    featuresOptions,
    severityOptions,
    bugTypeOptions,
    bugSubtypeOptions,
    testTypeOptions,
    assignedToOptions,
  } = useMemo(() => {
    return {
      ...options,
      mileStonesOptions: options?.mileStonesOptions?.filter((x) => x.projectId === projectId),
      featuresOptions: options?.featuresOptions?.filter((x) => x.milestoneId === MILESTONE_ID?._id),
    };
  }, [options, MILESTONE_ID, projectId]);

  const registerTags = useCallback(() => register('tags'), [register]);

  const { onMilestoneChange, onFeatureChange } = useAddFeatureAndMilestones({
    refetch,
    setValue,
    MILESTONE_ID,
    data: options,
    featuresOptions,
    mileStonesOptions,
    setMilestoneFirst,
    allowSetValue: false,
    PROJECT_ID: projectId,
  });

  useEffect(() => {
    milestoneId && setValue('milestoneId', milestoneId);
    featureId && setValue('featureId', featureId);
  }, [milestoneId, featureId, setValue]);

  const handleCancel = useCallback(
    (e) => {
      e.preventDefault();
      reset();
      handleClose();
    },
    [reset, handleClose],
  );

  return (
    <Modal open={open} handleClose={handleClose} className={style.mainDiv} backClass={backClass}>
      <div className={style.crossImg}>
        <span className={style.modalTitle}>Bulk Edit</span>
        <div alt="" onClick={handleClose} className={style.hover}>
          <Icon name={'CrossIcon'} />
          <div className={style.tooltip}>
            <p>Close</p>
          </div>
        </div>
      </div>
      <p className={style.infotext}>
        Update the fields below which you want to update for all the{' '}
        {type === 'bug' ? 'selected bugs' : 'selected test cases'}.
      </p>
      <form onSubmit={handleSubmit((data) => onSubmit({ projectId, selectedRecords, ...data }, setError))}>
        <div className={style.main}>
          <div className={style.body}>
            {type === 'bug' && (
              <div className={style.flex}>
                <div className={style.contentDiv}>
                  <SelectBox
                    control={control}
                    watch={watch}
                    name={'severity'}
                    label={'Severity'}
                    options={severityOptions}
                    placeholder="Select"
                    errorMessage={errors?.severity?.message}
                    isClearable={false}
                    id="bug-bulkedit-severity"
                  />
                </div>
                <div className={style.contentDiv}>
                  <SelectBox
                    control={control}
                    watch={watch}
                    name={'bugType'}
                    label={'Bug Type'}
                    options={bugTypeOptions}
                    placeholder="Select"
                    errorMessage={errors?.bugType?.message}
                    isClearable={false}
                    id="bug-bulkedit-bugtype"
                  />
                </div>
              </div>
            )}
            <div className={style.flex}>
              <CreatableSelectComponent
                isClearable
                control={control}
                isEditMode={false}
                label={'Milestone'}
                name={'milestoneId'}
                allowSetValue={false}
                id="bug-bulkedit-milestone"
                placeholder="Select or Create"
                defaultOptions={mileStonesOptions}
                onChangeHandler={onMilestoneChange}
                errorMessage={errors?.milestoneId?.message}
              />

              <CreatableSelectComponent
                isClearable
                label={'Feature'}
                control={control}
                name={'featureId'}
                isEditMode={false}
                allowSetValue={false}
                id="bug-bulkedit-feature"
                defaultOptions={featuresOptions}
                onChangeHandler={onFeatureChange}
                errorMessage={errors?.featureId?.message}
                placeholder={milestoneFirst ? 'Select Milestone first' : 'Select or Create'}
              />
            </div>
            {type === 'testCase' && (
              <div className={style.flex}>
                <div className={style.innerFlex}>
                  <SelectBox
                    control={control}
                    watch={watch}
                    name={'testType'}
                    label={'Test Type'}
                    options={testTypeOptions}
                    placeholder="Select"
                    isSearchable={false}
                    errorMessage={errors?.testType?.message}
                    isClearable={true}
                    id="bug-bulkedit-testtype"
                  />
                </div>
                <div className={style.rangeContainer}>
                  <RangeInput
                    label={'Weightage'}
                    watch={watch}
                    control={control}
                    setValue={setValue}
                    name={'weightage'}
                    errorMessage={errors?.weightage?.message}
                    id="bug-bulkedit-range"
                  />
                </div>
              </div>
            )}

            {type === 'bug' && (
              <div className={style.flex}>
                <div className={style.contentDiv}>
                  <SelectBox
                    watch={watch}
                    control={control}
                    isClearable={false}
                    placeholder="Select"
                    name={'developerId'}
                    label={'Developer '}
                    options={assignedToOptions}
                    id="bug-bulkedit-developerID"
                    errorMessage={errors?.developerId?.message}
                  />
                </div>
                <div className={style.contentDiv}>
                  <CreatableSelectComponent
                    defaultOptions={bugSubtypeOptions}
                    label={'Bug Subtype'}
                    name={'bugSubType'}
                    placeholder="Select or Create"
                    control={control}
                    isClearable
                    watch={watch}
                    rules={{}}
                    errorMessage={errors?.bugSubType?.message}
                    id="bug-bulkedit-bug-subtype"
                  />
                </div>
              </div>
            )}
            <div className={style.flex}>
              <div className={style.contentDiv}>
                <SelectBox
                  control={control}
                  watch={watch}
                  name={'testingType'}
                  label={'Testing Type'}
                  options={testTypeOptions}
                  placeholder="Select"
                  errorMessage={errors?.testingType?.message}
                  isClearable={false}
                  id="bug-bulkedit-testing-type"
                />
              </div>

              {type === 'testCase' && (
                <div className={style.contentDiv}>
                  <SelectBox
                    control={control}
                    watch={watch}
                    name={'state'}
                    label={'State'}
                    options={[
                      { label: 'Active', value: 'Active' },
                      { label: 'Obsolete', value: 'Obsolete' },
                    ]}
                    placeholder="Select"
                    errorMessage={errors?.testType?.message}
                    isClearable={true}
                    id="bug-bulkedit-state"
                  />
                </div>
              )}
              {type === 'bug' && (
                <div className={style.contentDiv}>
                  <TextField
                    label={'Tested Version'}
                    placeholder={'Enter Ticket ID'}
                    name={'testedVersion'}
                    register={register}
                    errors={type === 'testCase' ? errors?.relatedTicketId?.message : errors?.taskId?.message}
                    data-cy="bug-bulkedit-tested-version"
                  />
                </div>
              )}
            </div>
            {type === 'bug' && (
              <div className={style.flex}>
                <div className={style.contentDiv}>
                  <TextField
                    label={type === 'testCase' ? 'Related Ticket ID' : 'Task ID'}
                    placeholder={'Enter Ticket ID'}
                    name={type === 'testCase' ? 'relatedTicketId' : 'taskId'}
                    register={register}
                    errors={type === 'testCase' ? errors?.relatedTicketId?.message : errors?.taskId?.message}
                    data-cy="bulkedit-bug-ticketID"
                  />
                </div>
                <div className={style.contentDiv}>
                  <CustomTags
                    openUp
                    label="Tags"
                    watch={watch}
                    name={'tags'}
                    control={control}
                    setValue={setValue}
                    projectId={projectId}
                    register={registerTags}
                    errorMessage={errors?.tags?.message}
                  />
                </div>
              </div>
            )}

            {type === 'testCase' && (
              <>
                {' '}
                <div className={style.contentDiv}>
                  <TextEditor
                    label={'Pre Conditions'}
                    name="preConditions"
                    control={control}
                    watch={watch}
                    errorMessage={errors?.preConditions?.message}
                    id="bulkedit-"
                  />
                </div>
                <div className={style.contentDiv}>
                  <TextEditor
                    label={'Test Steps'}
                    name="testSteps"
                    control={control}
                    watch={watch}
                    errorMessage={errors?.testSteps?.message}
                    id="bulkedit-"
                  />
                </div>
              </>
            )}

            <div className={style.btnFlex}>
              <Button
                text={'Cancel'}
                type={'button'}
                btnClass={style.btn1}
                handleClick={handleCancel}
                data-cy="bulkedit-cancel-btn"
              />
              <Button
                text={'Update all'}
                type={'submit'}
                disabled={isLoading || !isDirty}
                data-cy="bulkedit-submit-btn"
                btnClass={style.btn2}
              />
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default Index;
