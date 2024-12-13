import { useCallback, useEffect } from 'react';

import { useForm } from 'react-hook-form';

import Modal from 'components/modal';
import TextField from 'components/text-field';
import Button from 'components/button';

import cross from 'assets/cross.svg';

import style from './add.module.scss';
import Icon from '../../../../../../components/icon/themed-icon';

const AddFeature = ({ openAddModal, isLoading, setOpenAddModal, id, clickHandler, defaultValue, name }) => {
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

  const handleCloseAddModal = useCallback(() => {
    reset();
    setOpenAddModal(false);
  }, [reset, setOpenAddModal]);

  return (
    <div>
      <Modal open={openAddModal} handleClose={handleCloseAddModal} className={style.mainDiv}>
        <div className={style.crossImg}>
          <span className={style.modalTitle}>{id ? 'Rename' : 'Add'} Feature</span>
          <div src={cross} alt="" onClick={handleCloseAddModal} className={style.hover}>
            <Icon name={'CrossIcon'} />
            <div className={style.tooltip}>
              <p>Close</p>
            </div>
          </div>
        </div>
        <p className={style.p}>{name}</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            // eslint-disable-next-line react/jsx-no-bind
            register={() => register('name', { required: 'Required' })}
            label="Feature Name"
            name="name"
            placeholder="Enter feature name"
            errorMessage={errors.name && errors.name.message}
            data-cy="feature-name-input"
          />
          <div className={style.innerFlex}>
            <Button
              text="Cancel"
              handleClick={handleCloseAddModal}
              btnClass={style.btn}
              data-cy="add-milestone-save-btn"
            />

            <Button text="Save" type={'submit'} disabled={isLoading} data-cy="feature-name-save-btn" />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddFeature;
