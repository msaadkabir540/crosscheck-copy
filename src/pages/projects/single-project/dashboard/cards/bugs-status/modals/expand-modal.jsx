// NOTE: components
import Modal from 'components/modal';

import BugsStatus from '..';
// NOTE: utils
// NOTE: styles
import style from './style-modal.module.scss';

const ExpandModal = ({ open, setOpen, className, statusData }) => {
  return (
    <Modal open={open} handleClose={setOpen} className={`${style.modalClass} ${className && className}`}>
      <BugsStatus statusData={statusData} modalMode />
    </Modal>
  );
};

export default ExpandModal;
