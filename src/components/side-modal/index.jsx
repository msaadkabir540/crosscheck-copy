import { useCallback } from 'react';

import style from './side-modal.module.scss';

const SideModal = ({ open, handleClose, children, className, backClass, filterMode, noBackground }) => {
  const handleStopPropogation = useCallback((e) => e.stopPropagation(), []);
  const handleCloseModal = useCallback(() => handleClose(false), [handleClose]);

  return (
    <>
      {open && (
        <div
          id="generalModal"
          className={`${style.modalWrapper} ${backClass} ${filterMode && style.filterMode} ${
            noBackground && style.noBackground
          }`}
          onClick={handleCloseModal}
        >
          <div
            className={`${style.modalContentWrapper}  ${filterMode && style.radiusMode} ${className}`}
            onClick={handleStopPropogation}
          >
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default SideModal;
