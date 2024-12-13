import { useCallback, useEffect, useMemo, useState } from 'react';

import PropTypes from 'prop-types';

import SelectBox from 'components/select-box';
import TextField from 'components/text-field';
import CustomTags from 'components/custom-tags-input';
import TextEditor from 'components/editor/text-editor';
import RangeInput from 'components/range-input/range-input';
import CreatableSelectComponent from 'components/select-box/creatable-select';

import { useAddFeatureAndMilestones } from 'hooks/use-add-features-milestones';

import { useProjectFormConfiguration } from 'api/v1/projects/projects';

import { isEmpty as _isEmpty, pick as _pick } from 'utils/lodash';
import { useTestCasesDropDownOptions } from 'utils/drop-down-options';

import { InitialRules, validationHandler } from './helper';
import style from './report.module.scss';

const Drawer = ({ formHook, projectId, editRecordId }) => {
  const { data = {}, refetch } = useTestCasesDropDownOptions();

  const [rules, setRules] = useState(InitialRules);
  const [milestoneFirst, setMilestoneFirst] = useState(false);

  const { control, register, watch, setValue, errors } = formHook;

  const PROJECT_ID = watch('projectId');
  const FEATURE_ID = watch('featureId');
  const MILESTONE_ID = watch('milestoneId');

  const {
    projectOptions = [],
    featuresOptions = [],
    mileStonesOptions = [],
  } = useMemo(() => {
    return {
      projectOptions: data?.projectOptions,
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

  useEffect(() => {
    if (_configurations?.config?.testCaseFormConfig && !_isEmpty(_configurations?.config?.testCaseFormConfig)) {
      const rules = _pick(_configurations?.config?.testCaseFormConfig, [
        'testObjective',
        'preConditions',
        'testSteps',
        'expectedResults',
        'weightage',
        'testType',
        'relatedTaskId',
        'tags',
        'milestoneId',
        'featureId',
      ]);

      const appliedValidation = validationHandler(rules);
      setRules(appliedValidation);
    }
  }, [_configurations]);

  const registerTagsId = useCallback(() => register('tags', rules['tags']), [register, rules]);
  const registerRelatedTastId = useCallback(() => register('relatedTaskId', rules['relatedTaskId']), [register, rules]);

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
                name={'testObjective'}
                label={'Test Objective'}
                placeholder="Write your text here"
                watch={watch}
                rules={rules['testObjective']}
                errorMessage={errors?.testObjective?.message}
                id="testcases-txteditor-testobjective"
              />
            </div>

            <div className={style.marginClass}>
              <TextEditor
                control={control}
                name={'preConditions'}
                label={'Pre Conditions'}
                placeholder="Write your text here"
                watch={watch}
                rules={rules['preConditions']}
                errorMessage={errors?.preConditions?.message}
                id="testcases-txteditor-preconditions"
              />
            </div>
            <div className={style.marginClass}>
              <TextEditor
                control={control}
                name={'testSteps'}
                label={'Test Steps'}
                placeholder="Write your text here"
                watch={watch}
                rules={rules['testSteps']}
                errorMessage={errors?.testSteps?.message}
                id="testcases-txteditor-teststeps"
              />
            </div>
            <div className={style.marginClass}>
              <TextEditor
                control={control}
                name={'expectedResults'}
                label={'Expected Results '}
                placeholder="Write your text here"
                watch={watch}
                rules={rules['expectedResults']}
                errorMessage={errors?.expectedResults?.message}
                id="testcases-txteditor-expectedresult"
              />
            </div>
            <div className={`${style.gridThree} ${style.marginClass}`}>
              <div>
                <RangeInput
                  label={'Weightage'}
                  watch={watch}
                  rules={rules['weightage']}
                  control={control}
                  setValue={setValue}
                  name={'weightage'}
                  errorMessage={errors?.weightage?.message}
                  dataCY={'rangeinput-testcases'}
                />
              </div>
              <div>
                <SelectBox
                  options={[
                    { label: 'Functionality Testing', value: 'Functionality' },
                    { label: 'Performance Testing', value: 'Performance' },
                    { label: 'UI Testing', value: 'UI' },
                    { label: 'Security Testing', value: 'Security' },
                  ]}
                  label={'Test Type'}
                  name={'testType'}
                  placeholder="Select"
                  control={control}
                  numberBadgeColor={'#39695b'}
                  showNumber
                  rules={rules['testType']}
                  errorMessage={errors?.testType?.message}
                  id="testcases-testtype-selectbox"
                />
              </div>

              <TextField
                label={'Related Ticket ID'}
                placeholder={'Enter Ticket ID'}
                name={'relatedTaskId'}
                register={registerRelatedTastId}
                errorMessage={errors?.relatedTaskId?.message}
                data-cy="testcases-related-test-ID"
              />
            </div>
            <div className={style.tagDiv}>
              <div className={style.tagSectionInner} style={{ width: !editRecordId && '100%' }}>
                <CustomTags
                  rules={rules['tags']}
                  watch={watch}
                  openUp
                  control={control}
                  label="Tags"
                  projectId={PROJECT_ID}
                  name={'tags'}
                  register={registerTagsId}
                  errorMessage={errors?.tags?.message}
                />
              </div>

              {editRecordId && (
                <div className={style.tagSectionInner1}>
                  <SelectBox
                    options={[
                      { label: 'Active', value: 'Active' },
                      { label: 'Obsolete', value: 'Obsolete' },
                    ]}
                    name={'state'}
                    label={'State'}
                    placeholder="Select"
                    rules={rules['state']}
                    control={control}
                    numberBadgeColor={'#39695b'}
                    showNumber
                    errorMessage={errors?.state?.message}
                    id="testcases-testtype-selectbox"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Drawer.propTypes = {
  submitHandler: PropTypes.func.isRequired,
  setDrawerOpen: PropTypes.func.isRequired,
  resetHandler: PropTypes.func.isRequired,
  setEditRecord: PropTypes.func.isRequired,
  editRecord: PropTypes.object,
  _createUpdateIsLoading: PropTypes.bool,
  addMore: PropTypes.bool,
  noHeader: PropTypes.bool,
};

export default Drawer;
