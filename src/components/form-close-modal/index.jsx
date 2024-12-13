import React from 'react';

import Modal from 'components/modal';
import Button from 'components/button';

import style from './style.module.scss';

const FormCloseModal = ({
  modelOpen,
  setModelOpen,
  icon,
  heading,
  subHeading,
  confirmBtnText,
  cancelBtnText,
  confirmBtnHandler,
  cancelBtnHandler,
  noBackground = true,
}) => {
  return (
    <Modal open={modelOpen} handleClose={cancelBtnHandler} className={style.main} noBackground={noBackground}>
      <div className={style.header}>
        <div>{icon}</div>
        <div className={style.titleDiv}>
          <p className={style.title}>{heading}</p>
          <p className={style.subtitle}>{subHeading}</p>
        </div>
      </div>
      <div className={style.btnDiv}>
        <Button
          text={cancelBtnText}
          btnClass={style.cancelBtn}
          handleClick={() => setModelOpen(false)}
          data-cy="bugreporting-backtoform-btn"
        />
        <Button
          text={confirmBtnText}
          btnClass={style.confirmBtn}
          onClick={confirmBtnHandler}
          data-cy="bugreporting-discardchanging-btn"
        />
      </div>
    </Modal>
  );
};

export default React.memo(FormCloseModal);
