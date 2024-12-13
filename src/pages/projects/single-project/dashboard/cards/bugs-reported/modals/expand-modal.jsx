import { useRef } from 'react';

// NOTE: components
import Modal from 'components/modal';

import { exportAsPDF, exportAsPNG } from 'utils/file-handler';

import BugsReported from '..';
// NOTE: styles
import style from './style-modal.module.scss';

const ExpandModal = ({ open, setOpen, className }) => {
  const componentRef = useRef();

  const downloadHandler = (type) => {
    if (type === 'PNG') {
      exportAsPNG(componentRef);
    }

    if (type === 'PDF') {
      exportAsPDF(componentRef);
    }
  };

  return (
    <Modal open={open} handleClose={setOpen} className={`${style.modalClass} ${className && className}`}>
      <div className={style.innerWrapper}>
        <BugsReported
          componentRef={componentRef}
          downloadHandler={downloadHandler}
          expanded
          handleClose={setOpen}
          modalMode
        />
      </div>
    </Modal>
  );
};

export default ExpandModal;
