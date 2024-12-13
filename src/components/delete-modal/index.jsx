
import Modal from 'components/modal';
import Button from 'components/button';

import style from './remove-confirm-modal.module.scss';
import Icon from '../icon/themed-icon';

const DeleteModal = ({
  openDelModal,
  setOpenDelModal,
  name,
  secondLine,
  backClass,
  clickHandler,
  trashMode,
  cancelText,
  isLoading,
}) => {
  return (
    <Modal
      open={openDelModal}
      handleClose={() => setOpenDelModal(false)}
      className={style.mainDiv}
      backClass={`${style.classBack} ${backClass}`}
    >
      <div>
        <div className={style.iconRefresh}>
          <Icon name={'DelIcon'} height={48} width={42} />
        </div>

        {trashMode ? (
          <p className={style.modalTitle}>Are you sure you want to clear all trash?</p>
        ) : (
          <p className={style.modalTitle}>Are you sure you want to delete this {name}?</p>
        )}

        {trashMode && (
          <p className={style.modalSubtitle}>This action cannot be undone and all the items will be deleted forever</p>
        )}
        {secondLine && <p className={style.modalSubtitle}>{secondLine}</p>}
      </div>
      <div className={style.mainBtnDiv}>
        {trashMode ? (
          <Button text={`Yes, Clear all trash`} onClick={clickHandler} disabled={isLoading} />
        ) : (
          <Button
            text={`Yes, Delete this ${name}`}
            onClick={clickHandler}
            disabled={isLoading}
            data-cy="project-del--btn"
          />
        )}
        <Button
          text={cancelText ? cancelText : 'No, Keep it'}
          btnClass={style.btnClassUncheckModal}
          handleClick={() => setOpenDelModal(false)}
          disabled={isLoading}
          data-cy="project-nokeepit--btn"
        />
      </div>
    </Modal>
  );
};

export default DeleteModal;
