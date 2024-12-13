import { useCallback, useEffect } from 'react';

import { useForm } from 'react-hook-form';

import Modal from 'components/modal';
import TextField from 'components/text-field';
import Button from 'components/button';

import cross from 'assets/cross.svg';

import style from './add.module.scss';
import Icon from '../../../../../components/icon/themed-icon';

const RenameFile = ({ openRenameModal, setOpenRenameModal, isLoading, defaultValue, handleSubmitFile }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
  } = useForm();

  const onSubmit = (data) => {
    handleSubmitFile(data, setError);
  };

  useEffect(() => {
    setValue('name', defaultValue);
  }, [defaultValue, setValue]);

  const handleOpenRenameModal = useCallback(() => {
    setOpenRenameModal({});
  }, [setOpenRenameModal]);

  return (
    <Modal open={openRenameModal} handleClose={handleOpenRenameModal} className={style.mainDiv} backClass={style.modal}>
      <div className={style.crossImg}>
        <span className={style.modalTitle}>Rename File</span>
        <div onClick={handleOpenRenameModal} className={style.hover}>
          <Icon name={'CrossIcon'} />
          <div className={style.tooltip}>
            <p>Cross</p>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          // eslint-disable-next-line react/jsx-no-bind
          register={() => register('name', { required: 'Required' })}
          label="File Name"
          name="name"
          placeholder="File Name"
          errorMessage={errors?.name?.message}
          clearIcon={cross}
        />
        <div className={style.innerFlex}>
          <Button btnClass={style.btn} text="Cancel" handleClick={handleOpenRenameModal} />

          <Button text="Save" type={'submit'} disabled={isLoading} />
        </div>
      </form>
    </Modal>
  );
};

export default RenameFile;
