import { useCallback, useEffect } from 'react';

import { useForm } from 'react-hook-form';

import Modal from 'components/modal';
import TextField from 'components/text-field';
import Icon from 'components/icon/themed-icon';
import Button from 'components/button';

import cross from 'assets/cross.svg';

import style from './add.module.scss';

const AddEnvironment = ({ openAddModal, setOpenAddModal, id, clickHandler, defaultValue }) => {
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
      setValue('name', defaultValue?.name);
      setValue('url', defaultValue?.url);
    }
  }, [defaultValue, setValue]);

  const handleResetAndCloseAddModal = useCallback(() => {
    reset();
    setOpenAddModal(false);
  }, [reset, setOpenAddModal]);

  const handleRegisterUrl = useCallback(() => register('url'), [register]);
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
          <span className={style.modalTitle}>{id ? 'Edit' : 'Add'} Environment</span>
          <div src={cross} alt="" onClick={handleResetAndCloseAddModal} className={style.hover}>
            <Icon name={'CrossIcon'} />
            <div className={style.tooltip}>
              <p>Close</p>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            data-cy="add-environment-input"
            register={handleRegisterName}
            label="Environment Name"
            name="name"
            placeholder="Enter Environment Name"
            errorMessage={errors.name && errors.name.message}
          />
          <TextField
            data-cy="add-environment-url-input"
            register={handleRegisterUrl}
            label="Environment Url"
            name="url"
            placeholder="Enter Environment's Url"
            errorMessage={errors.url && errors.url.message}
          />
          <div className={style.innerFlex}>
            <Button
              text="Cancel"
              handleClick={handleResetAndCloseAddModal}
              btnClass={style.btn}
              data-cy="add-environment-save-btn"
            />
            <Button text={id ? 'Save' : 'Add'} type={'submit'} data-cy="add-environment-save-btn" />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddEnvironment;
