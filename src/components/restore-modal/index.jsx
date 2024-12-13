import Modal from 'components/modal';
import Button from 'components/button';

import resIcon from 'assets/restoreIcon.svg';

import style from './remove-confirm-modal.module.scss';

const RestoreModal = ({ openDelModal, setOpenDelModal, backClass, clickHandler, cancelText, isLoading }) => {
  return (
    <Modal
      open={openDelModal}
      handleClose={() => setOpenDelModal(false)}
      className={style.mainDiv}
      backClass={backClass}
    >
      <div>
        <div className={style.iconRefresh}>
          <img src={resIcon} alt="" />
        </div>

        <p className={style.modalTitle}>Are you sure you want to restore all?</p>
      </div>

      <div className={style.mainBtnDiv}>
        <Button text={'Restore all'} onClick={clickHandler} disabled={isLoading} />

        <Button
          text={cancelText ? cancelText : 'Discard'}
          type={'button'}
          btnClass={style.btnClassUncheckModal}
          handleClick={() => setOpenDelModal(false)}
        />
      </div>
    </Modal>
  );
};

export default RestoreModal;
