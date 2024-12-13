// NOTE: components
import Modal from 'components/modal';

// NOTE: utils
// NOTE: styles
import style from './style-modal.module.scss';
import BugsType from '..';

const ExpandModal = ({ open, setOpen, className, data }) => {
  return (
    <Modal open={open} handleClose={setOpen} className={`${style.modalClass} ${className && className}`}>
      <BugsType data={data} modalMode />
    </Modal>
  );
};

export default ExpandModal;
