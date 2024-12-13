import { useCallback, useRef } from 'react';

import ReactDOM from 'react-dom';

import { useMode } from 'context/dark-mode';

import style from './modal.module.scss';

const Modal = ({ open, children, className, handleClose, backClass, noBackground }) => {
  const modalRef = useRef(null);

  const { isDarkMode } = useMode();

  const handleClickWrapper = useCallback(
    (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        handleClose?.();
      }
    },
    [handleClose],
  );

  const handleStopPropagation = useCallback((e) => e.stopPropagation(), []);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      id="generalModal"
      className={`${style.modalWrapper} ${backClass} ${noBackground ? style.noBackground : ''} ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
      onMouseDown={handleClickWrapper}
    >
      <div ref={modalRef} className={`${style.modalContentWrapper} ${className}`} onMouseDown={handleStopPropagation}>
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
