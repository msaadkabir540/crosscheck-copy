import { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { EditorState, convertFromRaw } from 'draft-js';

import TextEditor from 'components/editor/text-editor';
import RangeInput from 'components/range-input/range-input';
import Checkbox from 'components/checkbox';
import Button from 'components/button';
import SelectBox from 'components/select-box';
import TextField from 'components/text-field';
import CustomTags from 'components/custom-tags-input';
import Loader from 'components/loader';
import FormCloseModal from 'components/form-close-modal';

import { useGetTestCaseById } from 'api/v1/test-cases/test-cases';

import { validateDescription } from 'utils/validations';

import goIcon from 'assets/cross.svg';

import style from './drawer.module.scss';
import Icon from '../../../../components/icon/themed-icon';

const Drawer = ({
  submitHandler,
  setDrawerOpen,
  resetHandler,
  setEditRecord,
  editRecord,
  projectId,
  _createUpdateIsLoading,
  addMore = false,
  noHeader = false,
}) => {
  const {
    control,
    watch,
    register,
    formState: { errors, dirtyFields },
    handleSubmit,
    setValue,
    reset,
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
  const { data: _testCaseData, isLoading: gettingTestCaseById } = useGetTestCaseById(editRecord);
  const [openFormCloseModal, setOpenFormCloseModal] = useState(false);
  useEffect(() => {
    if (_testCaseData?.testCase && !_.isEmpty(_testCaseData?.testCase)) {
      let values = _.pick(_testCaseData?.testCase, [
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
      const expectedResults = values?.expectedResults?.description && JSON.parse(values?.expectedResults?.description);
      const preConditions = values?.preConditions?.description && JSON.parse(values?.preConditions?.description);
      const testObjective = values?.testObjective?.description && JSON.parse(values?.testObjective?.description);
      const testSteps = values?.testSteps?.description && JSON.parse(values?.testSteps?.description);
      const tags = values?.tags?.map((tag) => tag._id);

      const projectId = values?.projectId?._id;
      const featureId = values?.featureId?._id;
      const milestoneId = values?.milestoneId?._id;

      values = {
        ...values,
        projectId,
        featureId,
        milestoneId,
        tags,
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
  }, [_testCaseData]);

  const onSubmit = (data) => {
    submitHandler(data, reset, setValue);
  };

  const closeForm = () => {
    resetHandler();
    setEditRecord(null);
    !watch('addAnother') && setDrawerOpen(false);
    setOpenFormCloseModal(false);
  };

  const handleDiscard = () => {
    if (editRecord) {
      const isFormChanged =
        watch('preConditions')?.text !== _testCaseData?.testCase?.preConditions?.text ||
        watch('testObjective')?.text !== _testCaseData?.testCase?.testObjective?.text ||
        watch('testSteps')?.text !== _testCaseData?.testCase?.testSteps?.text ||
        watch('expectedResults')?.text !== _testCaseData?.testCase?.expectedResults?.text ||
        watch('relatedTicketId') !== _testCaseData?.testCase?.relatedTicketId ||
        watch('testType') !== _testCaseData?.testCase?.testType ||
        watch('state') !== _testCaseData?.testCase?.state ||
        Number(watch('weightage')) !== Number(_testCaseData?.testCase?.weightage);
      isFormChanged ? setOpenFormCloseModal(true) : closeForm();
    } else {
      const isFormChanged =
        watch('testObjective')?.text ||
        watch('preConditions')?.text ||
        watch('testSteps')?.text ||
        watch('expectedResults')?.text ||
        dirtyFields.weightage ||
        dirtyFields.relatedTicketId ||
        dirtyFields.testType ||
        dirtyFields.addAnother
          ? true
          : false;
      isFormChanged ? setOpenFormCloseModal(true) : closeForm();
    }
  };

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
          <span className={style.headerText}>{editRecord ? 'Edit' : 'Add'} Test Case</span>
          <div
            src={goIcon}
            alt=""
            onClick={() => {
              handleDiscard();
            }}
            className={style.hover1}
          >
            <Icon name={'CrossIcon'} />
            <div className={style.tooltip}>
              <p>Close</p>
            </div>
          </div>
        </div>
        {gettingTestCaseById ? (
          <Loader />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div
              className={style.body}
              style={{
                height: noHeader ? '78vh' : '100vh',
                overflowY: 'auto',
              }}
            >
              <div className={style.contentDiv}>
                <TextEditor
                  label={'Test Objective'}
                  name="testObjective"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: 'Required',
                    },
                    validate: validateDescription,
                  }}
                  watch={watch}
                  errorMessage={errors?.testObjective?.message}
                  id="testcases-txteditor-testobjective"
                />
              </div>
              <div className={style.contentDiv}>
                <TextEditor
                  label={'Pre Conditions'}
                  name="preConditions"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: 'Required',
                    },
                    validate: validateDescription,
                  }}
                  watch={watch}
                  errorMessage={errors?.preConditions?.message}
                  id="testcases-txteditor-preconditions"
                />
              </div>
              <div className={style.contentDiv}>
                <TextEditor
                  label={'Test Steps'}
                  name="testSteps"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: 'Required',
                    },
                    validate: validateDescription,
                  }}
                  watch={watch}
                  errorMessage={errors?.testSteps?.message}
                  id="testcases-txteditor-teststeps"
                />
              </div>
              <div className={style.contentDiv}>
                <TextEditor
                  label={'Expected Results'}
                  name="expectedResults"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: 'Required',
                    },
                    validate: validateDescription,
                  }}
                  watch={watch}
                  errorMessage={errors?.expectedResults?.message}
                  id="testcases-txteditor-expectedresult"
                />
              </div>

              <div className={style.flex}>
                <div
                  style={{
                    flex: '1',
                  }}
                >
                  <RangeInput
                    label={'Weightage'}
                    watch={watch}
                    rules={{ required: 'Required' }}
                    control={control}
                    setValue={setValue}
                    name={'weightage'}
                    errorMessage={errors?.weightage?.message}
                    dataCY={'rangeinput-testcases'}
                  />
                </div>
                <div
                  style={{
                    minWidth: '185px',
                    width: '50%',
                  }}
                >
                  <SelectBox
                    control={control}
                    watch={watch}
                    name={'testType'}
                    label={'Test Type'}
                    isSearchable={false}
                    options={[
                      { label: 'Functionality Testing', value: 'Functionality' },
                      { label: 'Performance Testing', value: 'Performance' },
                      { label: 'UI Testing', value: 'UI' },
                      { label: 'Security Testing', value: 'Security' },
                    ]}
                    placeholder="Select"
                    rules={{ required: 'Required' }}
                    errorMessage={errors?.testType?.message}
                    isClearable={false}
                    id="testcases-testtype-selectbox"
                  />
                </div>
              </div>
              <div className={style.flex}>
                <div className={style.relatedDiv}>
                  <TextField
                    label={'Related Ticket ID'}
                    placeholder={'Enter Ticket ID'}
                    name={'relatedTicketId'}
                    register={register}
                    errors={errors?.relatedTicketId?.message}
                    data-cy="testcases-related-test-ID"
                  />
                </div>
                {editRecord && (
                  <div className={style.relatedDiv}>
                    <SelectBox
                      control={control}
                      watch={watch}
                      name={'state'}
                      isSearchable={false}
                      label={'State'}
                      disabled={!editRecord}
                      defaultValue={!editRecord && 'Active'}
                      options={[
                        { label: 'Active', value: 'Active' },
                        { label: 'Obsolete', value: 'Obsolete' },
                      ]}
                      placeholder="Select"
                      rules={{ required: 'Required' }}
                      errorMessage={errors?.state?.message}
                      isClearable={false}
                    />
                  </div>
                )}
              </div>
              <div className={style.customTagDiv}>
                <CustomTags
                  watch={watch}
                  openUp
                  control={control}
                  setValue={setValue}
                  label="Tags"
                  projectId={watch('projectId') || projectId}
                  name={'tags'}
                  required
                  register={() => register('tags', { required: 'Required' })}
                  errorMessage={errors.tags && errors.tags.message}
                />
              </div>
              <div className={style.btnFlex}>
                {addMore && !editRecord && (
                  <Checkbox
                    name={'addAnother'}
                    label={'Add another'}
                    register={register}
                    handleChange={(e) => {
                      e.preventDefault();
                    }}
                    dataCy={'add-testcase-checkbox-addanother'}
                  />
                )}
                <Button
                  text={'Discard'}
                  type={'button'}
                  btnClass={style.btn}
                  handleClick={(e) => {
                    e.preventDefault();
                    handleDiscard();
                  }}
                />
                <Button
                  text={'Save'}
                  type={'submit'}
                  disabled={_createUpdateIsLoading}
                  data-cy="add-testcase-save-btn"
                />
              </div>
            </div>
          </form>
        )}
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
