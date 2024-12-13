import { useCallback } from 'react';

import Modal from 'components/modal';
import Button from 'components/button';

import style from './remove-confirm-modal.module.scss';
import Icon from '../icon/themed-icon';

const GenericModal = ({
  openModal,
  setOpenModal,
  secondLine,
  backClass,
  modalTitle,
  clickHandler,
  saveText,
  mainIcon,
  modalClass,
  cancelText,
  btnDivClass,
  discardBtnClass,
  modalSubtitle,
  hideButtons,
  iconDivClass,
  onLeftClick,
  trialEnd,
  isLoading,
  modalDynamicSubtitle,
}) => {
  const handleClose = useCallback(() => {
    setOpenModal(false);
  }, [setOpenModal]);

  return (
    <Modal
      open={openModal}
      handleClose={handleClose}
      className={`${style.mainDiv} ${modalClass}`}
      backClass={`${style.classBack} ${backClass}`}
    >
      <div>
        <div className={`${iconDivClass} ${style.iconRefresh}`}>{mainIcon ? mainIcon : <Icon name={'DelIcon'} />}</div>
        <p className={style.modalTitle}>{modalTitle ? modalTitle : ''}</p>
        <p className={style.modalSubtitle}>{modalSubtitle ? modalSubtitle : ''}</p>
        {modalDynamicSubtitle ? (
          <p className={style.modalDynamicSubtitle}>{modalDynamicSubtitle}</p>
        ) : (
          <p className={style.modalDynamicSubtitle}>
            You have access to premium features until <span>{trialEnd}</span>. Enjoy the enhanced capabilities and see
            the difference!
          </p>
        )}
        {secondLine && <p className={style.modalSubtitle}>{secondLine}</p>}
      </div>
      {!hideButtons && (
        <div className={`${style.mainBtnDiv} ${btnDivClass}`}>
          <Button
            text={cancelText ? cancelText : 'No, Keep it'}
            btnClass={`${discardBtnClass} ${style.btnClassUncheckModal}`}
            handleClick={onLeftClick ? onLeftClick : handleClose}
            disabled={isLoading}
            data-cy="project-nokeepit--btn"
          />

          <Button text={saveText ? saveText : 'saveText'} onClick={clickHandler} data-cy="project-del--btn" />
        </div>
      )}
    </Modal>
  );
};

export default GenericModal;
