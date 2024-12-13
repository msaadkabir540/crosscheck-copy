import PropTypes from 'prop-types';

import Modal from 'components/modal';
import Button from 'components/button';

import style from './remove-confirm-modal.module.scss';
import Icon from '../../../components/icon/themed-icon';

const DeleteModal = ({ handleUserDelete, removeText, cancelText, title, icon, openDelModal, setOpenDelModal }) => {
  let id = openDelModal;

  return (
    <Modal
      open={openDelModal}
      handleClose={() => setOpenDelModal(false)}
      className={style.mainDiv}
      backClass={style.backClass}
    >
      <div className={`${icon ? style.iconRefreshLarge : style.iconRefresh}`}>
        {icon ? icon : <Icon name={'DelIcon'} />}
      </div>

      <p className={style.modalTitle}>{title ? title : 'Are you sure you want to delete this user?'}</p>
      <div className={style.mainBtnDiv}>
        <Button text={removeText ? removeText : 'Yes, delete this user'} handleClick={() => handleUserDelete(id)} />
        <Button
          text={cancelText ? cancelText : 'No, keep it'}
          btnClass={style.btnClassUncheckModal}
          handleClick={() => setOpenDelModal(false)}
        />
      </div>
    </Modal>
  );
};

DeleteModal.propTypes = {
  handleUserDelete: PropTypes.func.isRequired,
  removeText: PropTypes.string.isRequired,
  cancelText: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.any.isRequired,
  openDelModal: PropTypes.bool.isRequired,
  setOpenDelModal: PropTypes.func.isRequired,
};

export default DeleteModal;
