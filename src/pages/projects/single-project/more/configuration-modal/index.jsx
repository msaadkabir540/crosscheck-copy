import { useCallback, useEffect, useMemo, useState } from 'react';

import { useForm } from 'react-hook-form';

import Checkbox from 'components/checkbox';
import Icon from 'components/icon/themed-icon';
import FormCloseModal from 'components/form-close-modal';
import Button from 'components/button';
import Loader from 'components/loader';

import { useProjectFormConfiguration } from 'api/v1/projects/projects';

import { pick as _pick, isEmpty as _isEmpty, isEqual as _isEqual } from 'utils/lodash';

import { bugConfiguration, testCaseConfiguration } from './helper';
import style from './style.module.scss';

const Index = ({ type, id, isLoading, onSubmit }) => {
  const { register, setValue, handleSubmit, reset } = useForm();

  const { data: _formConfiguration, isFetching } = useProjectFormConfiguration(id);

  const [openDiscard, setOpenDiscard] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [currentValues, setCurrentValues] = useState({});

  const configuration = useMemo(() => {
    return type === 'Bug' ? bugConfiguration : testCaseConfiguration;
  }, [type]);

  const hasFormChanged = useMemo(() => {
    return !_isEqual(initialValues, currentValues);
  }, [currentValues, initialValues]);

  useEffect(() => {
    let values = {};

    const configurations =
      type === 'Bug'
        ? _formConfiguration?.config?.bugFormConfig || {}
        : _formConfiguration?.config?.testCaseFormConfig || {};

    if (configurations && !_isEmpty(configurations)) {
      values = _pick(configurations, [
        'stepsToReproduce',
        'feedback',
        'reproduceSteps',
        'idealBehaviour',
        'severity',
        'bugType',
        'bugSubType',
        'developerId',
        'taskId',
        'testedVersion',
        'testingType',
        'testedDevice',
        'testedEnvironment',
        'testEvidence',
        'tags',
        'milestoneId',
        'featureId',
        'testObjective',
        'preConditions',
        'testSteps',
        'expectedResults',
        'weightage',
        'testType',
        'relatedTaskId',
      ]);
      values.projectId = true;

      setInitialValues(values);
      setCurrentValues(values);
      Object.entries(values).forEach(([key, val]) => {
        setValue(key, val);
      });
    }
  }, [_formConfiguration, setValue, type]);

  const onSubmitHandler = async (data) => {
    onSubmit && (await onSubmit(data, type));
  };

  const handleDiscard = useCallback(() => {
    if (hasFormChanged) {
      setOpenDiscard(true);
    }
  }, [hasFormChanged, setOpenDiscard]);

  const formCloseHandler = useCallback(() => {
    reset(initialValues);
    setCurrentValues(initialValues);
    setOpenDiscard(false);
  }, [reset, initialValues]);

  const onFeatureClick = useCallback(
    ({ target }) => {
      setCurrentValues((prev) => ({ ...prev, [target.name]: target.checked }));

      if (target.name === 'featureId' && target.checked) {
        setValue('milestoneId', true);
      }
    },
    [setValue],
  );

  const handlePreventDefault = useCallback(
    (e) => {
      e.preventDefault();
      handleDiscard();
    },
    [handleDiscard],
  );

  return (
    <>
      <div className={style.main}>
        <div className={style.mainInnerFlex}>
          <p>{`${type} Form Configuration`}</p>
        </div>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div className={style.fields}>
            {isFetching ? (
              <Loader />
            ) : (
              configuration.map((field) => {
                return (
                  <div key={field.value} className={style.fieldDiv}>
                    <span className={style.labelClass}> {field.label} </span>
                    <div className={style.checkboxDiv}>
                      <Checkbox
                        disabledCheck={field.isaDisabled}
                        name={field.value}
                        handleChange={onFeatureClick}
                        register={register}
                        containerClass={style.checkboxContainer}
                      />
                      <p className={style.labelClass}>Required</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className={style.btnDiv}>
            <Button
              text="Cancel"
              type={'button'}
              btnClass={style.btn}
              disabled={!hasFormChanged}
              handleClick={handlePreventDefault}
            />
            <Button text="Update" type={'submit'} disabled={isLoading || !hasFormChanged} btnClass={style.submitbtn} />
          </div>
        </form>
      </div>
      {openDiscard && (
        <FormCloseModal
          modelOpen={openDiscard}
          setModelOpen={setOpenDiscard}
          confirmBtnHandler={formCloseHandler}
          heading={`You have unsaved changes`}
          subHeading={` Are you sure you want to exit? Your unsaved changes will be discarded.`}
          confirmBtnText={`Discard Changes`}
          icon={<Icon name={'WarningRedIcon'} height={80} width={80} />}
          cancelBtnText={`Back To Form`}
          noBackground
        />
      )}
    </>
  );
};

export default Index;
