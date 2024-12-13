import Modal from 'components/modal';
import Button from 'components/button';

import style from './remove-confirm-modal.module.scss';
import Icon from '../icon/themed-icon';

const DeleteModal = ({
  openDelModal,
  setOpenDelModal,
  backClass,
  clickHandler,
  cancelText,
  isLoading,
  title = 'Are you sure you want to delete this forever?',
  subtitle = 'This action cannot be undone and the item will be deleted forever',
  btnText = 'Delete, forever',
}) => {
  return (
    <Modal
      open={openDelModal}
      handleClose={() => setOpenDelModal(false)}
      className={style.mainDiv}
      backClass={backClass}
    >
      <div className={style.iconRefresh}>
        <Icon name={'DelIcon'} />
      </div>

      <p className={style.modalTitle}>{title}</p>

      <p className={style.modalSubtitle}>{subtitle}</p>

      <div className={style.mainBtnDiv}>
        <Button text={btnText} onClick={clickHandler} disabled={isLoading} />

        <Button
          text={cancelText ? cancelText : 'No, Keep it'}
          btnClass={style.btnClassUncheckModal}
          handleClick={() => setOpenDelModal(false)}
        />
      </div>
    </Modal>
  );
};

export default DeleteModal;
