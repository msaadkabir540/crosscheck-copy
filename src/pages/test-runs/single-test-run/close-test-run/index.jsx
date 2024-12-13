import PropTypes from 'prop-types';

import Modal from 'components/modal';
import Button from 'components/button';

import delIcon from 'assets/warning.svg';

import style from './close.module.scss';

const CloseTestRun = ({ closeTestRun, setCloseTestRun, backClass, clickHandler, _isCloseLoading }) => {
  return (
    <Modal
      open={closeTestRun}
      handleClose={() => setCloseTestRun(false)}
      className={style.mainDiv}
      backClass={backClass}
    >
      <div className={style.iconRefresh}>
        <img src={delIcon} alt="delIcon" />
      </div>

      <p className={style.modalTitle}>Are you sure you want to close this test run?</p>
      <p className={style.p}>Once you set status as closed, you will not be able to update test run anymore.</p>
      <div className={style.mainBtnDiv}>
        <Button
          text={'Discard'}
          type={'button'}
          btnClass={style.btnClassUncheckModal}
          handleClick={() => setCloseTestRun(false)}
        />
        <Button text={`Close Test Run`} onClick={clickHandler} disabled={_isCloseLoading} />
      </div>
    </Modal>
  );
};

CloseTestRun.propTypes = {
  closeTestRun: PropTypes.func.isRequired,
  setCloseTestRun: PropTypes.func.isRequired,
  backClass: PropTypes.string.isRequired,
  clickHandler: PropTypes.func.isRequired,
  _isCloseLoading: PropTypes.bool.isRequired,
};

export default CloseTestRun;
