import PropTypes from 'prop-types';

import Modal from 'components/modal';
import Button from 'components/button';

import style from './remove-confirm-modal.module.scss';

const RemoveModal = ({
  handleUserRemove,
  removeText,
  title,
  selectedUser,
  icon,
  loading,
  openRemoveModal,
  setOpenRemoveModal,
}) => {
  return (
    <Modal
      open={openRemoveModal}
      handleClose={() => setOpenRemoveModal(false)}
      className={style.mainDiv}
      backClass={style.backClass}
    >
      <div>
        <div className={style.iconRefreshLarge}>{icon}</div>

        <p className={style.modalTitle}>{title}</p>
      </div>
      <div className={style.mainBtnDiv}>
        <Button disabled={loading} text={removeText} handleClick={() => handleUserRemove(selectedUser)} />
        <Button text={'Close'} btnClass={style.btnClassUncheckModal} handleClick={() => setOpenRemoveModal(false)} />
      </div>
    </Modal>
  );
};

RemoveModal.propTypes = {
  handleUserRemove: PropTypes.func.isRequired,
  removeText: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  selectedUser: PropTypes.object.isRequired,
  icon: PropTypes.node.isRequired,
  loading: PropTypes.bool.isRequired,
  openRemoveModal: PropTypes.bool.isRequired,
  setOpenRemoveModal: PropTypes.func.isRequired,
};

export default RemoveModal;
