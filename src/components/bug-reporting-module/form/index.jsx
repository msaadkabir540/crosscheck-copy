import React, { useCallback, useEffect, useMemo, useState } from 'react';

import SelectBox from 'components/select-box';
import TextField from 'components/text-field';
import CreatableSelectComponent from 'components/select-box/creatable-select';
import TextEditor from 'components/editor/text-editor';
import UploadAttachment from 'components/upload-attachments/upload-attachment';
import CustomTags from 'components/custom-tags-input';

import { useToaster } from 'hooks/use-toaster';
import { useAddFeatureAndMilestones } from 'hooks/use-add-features-milestones';

import { useProjectFormConfiguration } from 'api/v1/projects/projects';
import { useAddTestedVersion } from 'api/v1/tested-version/tested-version';
import { useAddTestedEnvironment } from 'api/v1/tested-environment/tested-environment';

import { useBugsDropDownOptions } from 'utils/drop-down-options';
import { isEmpty as _isEmpty, pick as _pick } from 'utils/lodash';

import { InitialRules, validationHandler } from './helper';
import style from './report.module.scss';

const ReportBug = ({ formHook, projectId }) => {
  const { toastSuccess, toastError } = useToaster();
  const { data = {}, refetch } = useBugsDropDownOptions();
  const { mutateAsync: _addTestedVersionHandler } = useAddTestedVersion();
  const { mutateAsync: _addTestedEnvironmentHandler } = useAddTestedEnvironment();

  const { control, register, watch, setValue, errors } = formHook;

  const PROJECT_ID = watch('projectId');
  const FEATURE_ID = watch('featureId');
  const MILESTONE_ID = watch('milestoneId');
  const Tested_Version_watch = watch('testedVersion');
  const Tested_Environment_watch = watch('testedEnvironment');

  const [rules, setRules] = useState(InitialRules);
  const [milestoneFirst, setMilestoneFirst] = useState(false);

  const {
    projectOptions = [],
    featuresOptions = [],
    mileStonesOptions = [],
    bugSubtypeOptions = [],
    assignedToOptions = [],
    testedDevicesOptions = [],
    testedVersionOptions = [],
    testedEnvironmentOptions = [],
  } = useMemo(() => {
    return {
      ...data,
      projectOptions: data?.projectOptions,
      testedVersionOptions: data?.testedVersionOptions?.filter((x) => x.projectId === PROJECT_ID),
      testedEnvironmentOptions: data?.testedEnvironmentOptions?.filter((x) => x.projectId === PROJECT_ID),
      mileStonesOptions: data?.mileStonesOptions?.filter((x) => x.projectId === PROJECT_ID),
      featuresOptions: data?.featuresOptions?.filter((x) => x.milestoneId === MILESTONE_ID?._id),
    };
  }, [data, PROJECT_ID, MILESTONE_ID]);

  const { data: _configurations } = useProjectFormConfiguration(PROJECT_ID);

  const { onMilestoneChange, onFeatureChange } = useAddFeatureAndMilestones({
    data,
    refetch,
    setValue,
    FEATURE_ID,
    PROJECT_ID,
    MILESTONE_ID,
    featuresOptions,
    mileStonesOptions,
    setMilestoneFirst,
  });

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
          const res = await _addTestedEnvironmentHandler({ name: testedEnvironmentName, projectId: PROJECT_ID });
          toastSuccess(res.msg);

          if (res?.testedEnvironment) {
            const newtestedEnvironment = {
              ...res?.testedEnvironment,
              value: res?.testedEnvironment?._id,
              label: res?.testedEnvironment?.name,
            };
            setValue('testedEnvironment', newtestedEnvironment);
            await refetch();
          }
        } catch (error) {
          toastError(error);
        }
      }
    },
    [refetch, setValue, toastError, PROJECT_ID, toastSuccess, _addTestedEnvironmentHandler, testedEnvironmentOptions],
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
          const res = await _addTestedVersionHandler({ name: testedVersionName, projectId: PROJECT_ID });
          toastSuccess(res.msg);

          if (res?.testedVersion) {
            const newtestedVersion = {
              ...res?.testedVersion,
              value: res?.testedVersion?._id,
              label: res?.testedVersion?.name,
            };
            setValue('testedVersion', newtestedVersion);
            await refetch();
          }
        } catch (error) {
          toastError(error);
        }
      }
    },
    [refetch, setValue, toastError, PROJECT_ID, toastSuccess, _addTestedVersionHandler, testedVersionOptions],
  );

  useEffect(() => {
    if (typeof Tested_Environment_watch === 'string') {
      const validtestedEnvironment = data?.testedEnvironmentOptions?.find((x) => x?._id === Tested_Environment_watch);

      if (validtestedEnvironment?._id) {
        setValue('testedEnvironment', validtestedEnvironment);
      }
    }

    if (typeof Tested_Version_watch === 'string') {
      const validtestedVersion = data?.testedVersionOptions?.find((x) => x?._id === Tested_Version_watch);

      if (validtestedVersion?._id) {
        setValue('testedVersion', validtestedVersion);
      }
    }
  }, [data, setValue, Tested_Environment_watch, Tested_Version_watch]);

  useEffect(() => {
    if (_configurations?.config?.bugFormConfig && !_isEmpty(_configurations?.config?.bugFormConfig)) {
      const rules = _pick(_configurations?.config?.bugFormConfig, [
        'bugSubType',
        'bugType',
        'developerId',
        'featureId',
        'feedback',
        'idealBehaviour',
        'milestoneId',
        'reproduceSteps',
        'severity',
        'tags',
        'taskId',
        'testEvidence',
        'testedDevice',
        'testedEnvironment',
        'testedVersion',
        'testingType',
      ]);

      const appliedValidation = validationHandler(rules);
      setRules(appliedValidation);
    }
  }, [_configurations]);

  useEffect(() => {
    if (PROJECT_ID) {
      setValue('milestoneId', null);
      setValue('featureId', null);
    }
  }, [PROJECT_ID, setValue]);

  const registerTags = useCallback(() => register('tags', rules['tags']), [register, rules]);
  const registerTaskId = useCallback(() => register('taskId', rules['taskId']), [register, rules]);

  const onTextChange = useCallback(
    (e) => {
      setValue('testEvidence', {
        base64: e.target.value,
        url: e.target.value,
      });
    },
    [setValue],
  );

  return (
    <>
      <div>
        <div className={style.main}>
          <div className={style.bottom}>
            <div className={style.gridThree}>
              <div>
                <SelectBox
                  options={projectOptions}
                  label={'Project'}
                  name={'projectId'}
                  placeholder="Select"
                  control={control}
                  numberBadgeColor={'#39695b'}
                  showNumber
                  disabled={projectId}
                  rules={rules['projectId']}
                  errorMessage={errors?.projectId?.message}
                  id={'reportbug-project-dropdown'}
                />
              </div>
              <div>
                <CreatableSelectComponent
                  isClearable
                  control={control}
                  label={'Milestone'}
                  name={'milestoneId'}
                  allowSetValue={false}
                  rules={rules['milestoneId']}
                  placeholder="Select or Create"
                  id="reportbug-milestone-dropdown"
                  defaultOptions={mileStonesOptions}
                  onChangeHandler={onMilestoneChange}
                  errorMessage={errors?.milestoneId?.message}
                />
              </div>

              <div>
                <CreatableSelectComponent
                  isClearable
                  label={'Feature'}
                  control={control}
                  name={'featureId'}
                  allowSetValue={false}
                  rules={rules['featureId']}
                  placeholder={milestoneFirst ? 'Select Milestone first' : 'Select or Create'}
                  id="reportbug-feature-dropdown"
                  defaultOptions={featuresOptions}
                  onChangeHandler={onFeatureChange}
                  errorMessage={errors?.featureId?.message}
                />
              </div>
            </div>

            <div className={style.marginClass}>
              <TextEditor
                control={control}
                name={'feedback'}
                label={'Feedback'}
                placeholder="Write your text here"
                watch={watch}
                rules={rules['feedback']}
                errorMessage={errors?.feedback?.message}
                id="feedback-texteditor"
              />
            </div>
            <div className={style.marginClass}>
              <TextEditor
                control={control}
                name={'reproduceSteps'}
                label={'Steps to Reproduce'}
                placeholder="Write your text here"
                watch={watch}
                rules={rules['reproduceSteps']}
                errorMessage={errors?.reproduceSteps?.message}
                id="reproduceSteps-texteditor"
              />
            </div>
            <div className={style.marginClass}>
              <TextEditor
                control={control}
                name={'idealBehaviour'}
                label={'Ideal Behavior'}
                placeholder="Write your text here"
                watch={watch}
                rules={rules['idealBehaviour']}
                errorMessage={errors?.idealBehaviour?.message}
                id="idealBehaviour-texteditor"
              />
            </div>
            <div className={`${style.gridThree} ${style.marginClass}`}>
              <div>
                <SelectBox
                  options={[
                    { label: 'Critical', value: 'Critical', checkbox: true },
                    { label: 'High', value: 'High', checkbox: true },
                    { label: 'Medium', value: 'Medium', checkbox: true },
                    { label: 'Low', value: 'Low', checkbox: true },
                  ]}
                  label={'Severity'}
                  name={'severity'}
                  placeholder="Select"
                  control={control}
                  numberBadgeColor={'#39695b'}
                  showNumber
                  rules={rules['severity']}
                  errorMessage={errors?.severity?.message}
                  id="reportbug-severity-dropdown"
                />
              </div>{' '}
              <div>
                <SelectBox
                  options={[
                    { label: 'Functionality', value: 'Functionality', checkbox: true },
                    { label: 'Performance', value: 'Performance', checkbox: true },
                    { label: 'UI', value: 'UI', checkbox: true },
                    { label: 'Security', value: 'Security', checkbox: true },
                  ]}
                  label={'Bug Type'}
                  name={'bugType'}
                  placeholder="Select"
                  control={control}
                  numberBadgeColor={'#39695b'}
                  showNumber
                  rules={rules['bugType']}
                  errorMessage={errors?.bugType?.message}
                  id="reportbug-bugtype-dropdown"
                />
              </div>
              <CreatableSelectComponent
                defaultOptions={bugSubtypeOptions}
                label={'Bug Subtype'}
                name={'bugSubType'}
                rules={rules['bugSubType']}
                placeholder="Select or Create"
                control={control}
                isClearable
                watch={watch}
                errorMessage={errors?.bugSubType?.message}
                id="reportbug-bugsubtype-dropdown"
              />
              <div>
                <SelectBox
                  options={assignedToOptions}
                  label={'Developer Name'}
                  name={'developerId'}
                  placeholder="Select"
                  rules={rules['developerId']}
                  errorMessage={errors?.developerId?.message}
                  control={control}
                  numberBadgeColor={'#39695b'}
                  showNumber
                  id="reportbug-developername-dropdown"
                />
              </div>
              <TextField
                register={registerTaskId}
                errorMessage={errors?.taskId?.message}
                name={'taskId'}
                placeholder="Enter Task ID"
                label="Task ID"
                data-cy="reportbug-taskid"
              />
              <div>
                <SelectBox
                  options={[
                    {
                      label: 'Functional Testing',
                      value: 'Functional Testing',
                      checkbox: true,
                    },
                    {
                      label: 'Regression Testing',
                      value: 'Regression Testing',
                      checkbox: true,
                    },
                    {
                      label: 'Integration Testing',
                      value: 'Integration Testing',
                      checkbox: true,
                    },
                    {
                      label: 'User Acceptance Testing',
                      value: 'User Acceptance Testing',
                      checkbox: true,
                    },
                  ]}
                  label={'Testing Type'}
                  name={'testingType'}
                  placeholder="Select"
                  control={control}
                  numberBadgeColor={'#39695b'}
                  showNumber
                  rules={rules['testingType']}
                  errorMessage={errors?.testingType?.message}
                  id="reportbug-testingtype-dropdown"
                />
              </div>
            </div>
            <div className={`${style.gridThree} ${style.marginClass}`}>
              <CreatableSelectComponent
                rules={rules['testedDevice']}
                defaultOptions={testedDevicesOptions}
                label={'Tested Device'}
                name={'testedDevice'}
                placeholder="Select or Create"
                control={control}
                isClearable
                watch={watch}
                errorMessage={errors?.testedDevice?.message}
                id="reportbug-testeddevice-dropdown"
              />
              <CreatableSelectComponent
                rules={rules['testedEnvironment']}
                defaultOptions={testedEnvironmentOptions}
                label={'Tested Environment '}
                name={'testedEnvironment'}
                placeholder="Select or Create"
                control={control}
                isClearable
                watch={watch}
                onChangeHandler={onTestedEnvironmentChange}
                errorMessage={errors?.testedEnvironment?.message}
                id="reportbug-testedenvironment-dropdown"
              />
              <CreatableSelectComponent
                rules={rules['testedVersion']}
                defaultOptions={testedVersionOptions}
                label={'Tested Version '}
                name={'testedVersion'}
                placeholder="Select or Create"
                control={control}
                isClearable
                watch={watch}
                onChangeHandler={onTestedVersionChange}
                errorMessage={errors?.testedVersion?.message}
                id="reportbug-testedversion-dropdown"
              />
            </div>
            <div className={style.innerFlex}>
              <div className={style.customTagDiv}>
                <CustomTags
                  rules={rules['tags']}
                  watch={watch}
                  openUp
                  control={control}
                  label="Tags"
                  projectId={PROJECT_ID}
                  name={'tags'}
                  setValue={setValue}
                  register={registerTags}
                  errorMessage={errors?.tags?.message}
                />
              </div>
              <UploadAttachment
                control={control}
                watch={watch}
                name={'testEvidence'}
                rules={rules['testEvidence']}
                onTextChange={onTextChange}
                placeholder="Attach Test Evidence"
                label="Test Evidence"
                setValue={setValue}
                errorMessage={errors?.testEvidence?.message}
                id="testEvidence"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(ReportBug);
