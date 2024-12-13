import { useCallback, useEffect } from 'react';

import { useForm } from 'react-hook-form';

import Modal from 'components/modal';
import TextField from 'components/text-field';
import Button from 'components/button';

import cross from 'assets/cross.svg';

import style from './add.module.scss';
import Icon from '../../../../../../components/icon/themed-icon';

const AddMilestone = ({ openAddModal, isLoading, setOpenAddModal, id, clickHandler, defaultValue }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    setError,
  } = useForm();

  const onSubmit = (data) => {
    clickHandler(data, id, setError);
    reset();
  };

  useEffect(() => {
    if (defaultValue) {
      setValue('name', defaultValue);
    }
  }, [defaultValue, setValue]);

  const handleResetAndCloseAddModal = useCallback(() => {
    reset();
    setOpenAddModal(false);
  }, [reset, setOpenAddModal]);

  const handleRegisterName = useCallback(() => register('name', { required: 'Required' }), [register]);

  return (
    <div>
      <Modal
        open={openAddModal}
        handleClose={handleResetAndCloseAddModal}
        className={style.mainDiv}
        backClass={style.backBack}
      >
        <div className={style.crossImg}>
          <span className={style.modalTitle}>{id ? 'Rename' : 'Add'} Milestone</span>
          <div src={cross} alt="" onClick={handleResetAndCloseAddModal} className={style.hover}>
            <Icon name={'CrossIcon'} />
            <div className={style.tooltip}>
              <p>Close</p>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            data-cy="add-milestone-input"
            register={handleRegisterName}
            label="Milestone Name"
            name="name"
            placeholder="Milestone Name"
            errorMessage={errors.name && errors.name.message}
          />
          <div className={style.innerFlex}>
            <Button
              text="Cancel"
              handleClick={handleResetAndCloseAddModal}
              btnClass={style.btn}
              data-cy="add-milestone-save-btn"
            />
            <Button text="Save" type={'submit'} isLoading={isLoading} data-cy="add-milestone-save-btn" />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddMilestone;
