// NOTE: components
import Modal from 'components/modal';

// NOTE: styles
import style from './style-modal.module.scss';
import BugsReporter from '..';

const ExpandModal = ({ open, setOpen, className, bugsReporter, name }) => {
  return (
    <Modal open={open} handleClose={setOpen} className={`${style.modalClass} ${className && className}`}>
      <BugsReporter name={name} bugsReporter={bugsReporter} modalMode />
    </Modal>
  );
};

export default ExpandModal;
