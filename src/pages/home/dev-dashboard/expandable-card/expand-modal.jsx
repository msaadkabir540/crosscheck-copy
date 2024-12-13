import Modal from 'components/modal';

import style from './expandable.module.scss';
import ExpandableCard from '.';

const ExpandModal = ({ open, setOpen, className, title, data }) => {
  return (
    <Modal open={open} handleClose={setOpen} className={`${style.modalClass} ${className && className}`}>
      <div className={style.innerWrapper}>
        <ExpandableCard expanded title={title} data={data} />
      </div>
    </Modal>
  );
};

export default ExpandModal;