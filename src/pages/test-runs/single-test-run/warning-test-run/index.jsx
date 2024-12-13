import PropTypes from 'prop-types';

import Modal from 'components/modal';
import Button from 'components/button';

import delIcon from 'assets/warning.svg';

import style from './close.module.scss';

const WarningTestRun = ({ closeTestRun, setCloseTestRun, backClass, msg }) => {
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

      <p className={style.modalTitle}>Warning</p>
      <p className={style.p}>{msg}</p>
      <div className={style.mainBtnDiv}>
        <Button text={`Back to Test Run`} onClick={setCloseTestRun} />
      </div>
    </Modal>
  );
};

WarningTestRun.propTypes = {
  closeTestRun: PropTypes.func.isRequired,
  setCloseTestRun: PropTypes.func.isRequired,
  backClass: PropTypes.any.isRequired,
  msg: PropTypes.string.isRequired,
};

export default WarningTestRun;
