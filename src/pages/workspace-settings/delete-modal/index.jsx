import { useState } from 'react';

import PropTypes from 'prop-types';

import Modal from 'components/modal';
import Button from 'components/button';

import TextField from '../../../components/text-field';
import style from './remove-confirm-modal.module.scss';
import Icon from '../../../components/icon/themed-icon';

const DeleteModal = ({
  handleUserDelete,
  removeText,
  cancelText,
  title,
  subtitle,
  icon,
  openDelModal,
  workspaceName,
  setOpenDelModal,
}) => {
  let id = openDelModal;
  const [inputValue, setInputValue] = useState('');

  return (
    <Modal
      open={openDelModal}
      handleClose={() => {
        setInputValue('');
        setOpenDelModal(false);
      }}
      className={style.mainDiv}
    >
      <div className={`${icon ? style.iconRefreshLarge : style.iconRefresh}`}>
        {icon ? icon : <Icon name={'DelIcon'} height={48} width={42} />}
      </div>

      <p className={style.modalTitle}>{title ? title : 'Are you sure you want to delete this user?'}</p>
      <p className={style.modalSubtitle}>{subtitle && subtitle}</p>
      <TextField label={'Type workspace name to proceed'} onChange={(e) => setInputValue(e?.target?.value)} />

      <div className={style.mainBtnDiv}>
        <Button
          text={cancelText ? cancelText : 'No, keep it'}
          btnClass={style.btnClassUncheckModal}
          handleClick={() => {
            setOpenDelModal(false);
            setInputValue('');
          }}
        />
        <Button
          disabled={workspaceName !== inputValue}
          text={removeText ? removeText : 'Yes, delete this user'}
          handleClick={() => handleUserDelete(id)}
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
  subtitle: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired, // NOTE: You might adjust this depending on the actual type of 'icon'
  openDelModal: PropTypes.bool.isRequired,
  setOpenDelModal: PropTypes.func.isRequired,
};

export default DeleteModal;
