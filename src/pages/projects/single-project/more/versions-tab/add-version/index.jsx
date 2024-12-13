import { useCallback, useEffect, useMemo, useState } from 'react';

import { useForm } from 'react-hook-form';

import Modal from 'components/modal';
import Button from 'components/button';
import SelectBox from 'components/select-box';
import TextField from 'components/text-field';
import Icon from 'components/icon/themed-icon';

import cross from 'assets/cross.svg';

import style from './add.module.scss';
import StatusChangeContainer from './status-change-container';
import { bugStatusOptions, statusOptions, testCaseStatusOptions, testRunStatusOptions } from './helper';

const AddVersion = ({
  id,
  _formCounts,
  openAddModal,
  clickHandler,
  defaultValue,
  setOpenAddModal,
  enivronmentOptions,
}) => {
  const {
    reset,
    watch,
    control,
    setError,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [formCounts, setFormCounts] = useState(_formCounts);

  const environmentDropDownOptions = useMemo(() => {
    return (
      enivronmentOptions?.map((x) => ({
        ...x,
        label: x?.name,
        value: x?._id,
        checkbox: true,
      })) || []
    );
  }, [enivronmentOptions]);

  const onSubmit = (data) => {
    const hasNewStatus = Object.values(formCounts).some((statusArray) => statusArray.some((item) => item.newStatus));

    if (hasNewStatus) {
      clickHandler({ ...data, formCounts }, id, setError, reset);
    } else {
      clickHandler(data, id, setError, reset);
    }
  };

  useEffect(() => {
    if (defaultValue) {
      setValue('name', defaultValue?.name);
      setValue('status', defaultValue?.status);
      setValue('testedEnvironment', defaultValue?.testedEnvironment?._id);
    }

    if (!id) {
      reset({ status: 'Active', bugs: 'keep', testCases: 'keep', testRuns: 'keep' });
    }
  }, [defaultValue, id, reset, setValue]);

  const handleResetAndCloseAddModal = useCallback(() => {
    setOpenAddModal(false);
  }, [setOpenAddModal]);

  const handleRegisterName = useCallback(() => register('name', { required: 'Required' }), [register]);

  const handleBulkStatusSelect = ({ selectedOption, field, radioName }) => {
    setFormCounts((prevState) => {
      const updatedStatusArr = { ...prevState };

      if (updatedStatusArr[radioName]) {
        updatedStatusArr[radioName] = updatedStatusArr[radioName].map((item) => {
          return item.name === field ? { ...item, newStatus: selectedOption?.value ?? null } : item;
        });
      }

      return updatedStatusArr;
    });
  };

  useEffect(() => {
    setFormCounts(_formCounts);
  }, [_formCounts]);

  return (
    <div>
      <Modal
        open={openAddModal}
        className={style.mainDiv}
        backClass={style.backBack}
        handleClose={handleResetAndCloseAddModal}
      >
        <div className={style.crossImg}>
          <span className={style.modalTitle}>{id ? 'Edit' : 'Add'} Version</span>
          <div src={cross} alt="" onClick={handleResetAndCloseAddModal} className={style.hover}>
            <Icon name={'CrossIcon'} />
            <div className={style.tooltip}>
              <p>Close</p>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={style.modalBody}>
            <TextField
              name="name"
              label="Version Name"
              data-cy="add-version-input"
              register={handleRegisterName}
              placeholder="Enter version name or ID"
              errorMessage={errors.name && errors.name.message}
            />
            <div className={style.selectBoxDiv}>
              <SelectBox
                showNumber
                control={control}
                placeholder="Select"
                label={'Environment'}
                name={'testedEnvironment'}
                numberBadgeColor={'#39695b'}
                options={environmentDropDownOptions}
                id={'add-version-tested-environment-dropdown'}
                errorMessage={errors?.testedEnvironment?.message}
              />
              <SelectBox
                showNumber
                isClearable={false}
                name={'status'}
                label={'Status'}
                control={control}
                placeholder="Select"
                options={statusOptions}
                numberBadgeColor={'#39695b'}
                errorMessage={errors?.status?.message}
                id={'add-version-tested-status-dropdown'}
              />
            </div>
            {!id && (
              <>
                <StatusChangeContainer
                  {...{
                    watch,
                    errors,
                    control,
                    title: 'Bugs',
                    radioName: 'bugs',
                    handleBulkStatusSelect,
                    statusArr: formCounts?.bugs,
                    statusOptions: bugStatusOptions,
                    changeText: 'Change status for bugs',
                    keepText: 'Keep status same for all previously reported bugs',
                  }}
                />
                <StatusChangeContainer
                  {...{
                    watch,
                    errors,
                    control,
                    title: 'Test Cases',
                    radioName: 'testCases',
                    handleBulkStatusSelect,
                    statusArr: formCounts?.testCases,
                    statusOptions: testCaseStatusOptions,
                    changeText: 'Change status for test cases',
                    keepText: 'Keep status same for all test cases',
                  }}
                />
                <StatusChangeContainer
                  {...{
                    watch,
                    errors,
                    control,
                    title: 'Test Runs',
                    radioName: 'testRuns',
                    handleBulkStatusSelect,
                    statusArr: formCounts?.testRuns,
                    statusOptions: testRunStatusOptions,
                    changeText: 'Change status for test runs',
                    keepText: 'Keep status same for all test runs',
                  }}
                />
              </>
            )}
          </div>
          <div className={style.innerFlex}>
            <Button
              text="Cancel"
              btnClass={style.btn}
              data-cy="add-version-save-btn"
              handleClick={handleResetAndCloseAddModal}
            />
            <Button text={id ? 'Save' : 'Add'} type={'submit'} data-cy="add-version-save-btn" />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddVersion;
