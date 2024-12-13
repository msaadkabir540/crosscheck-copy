import Modal from 'components/modal';
import Button from 'components/button';

import style from './remove-confirm-modal.module.scss';
import Icon from '../icon/themed-icon';

const ReportBug = ({
  openDelModal,
  setOpenDelModal,
  closeHandler = () => {},
  setModalDismissed,
  clickHandler,
  backClass,
  locked = false,
  isStatusUpdating,
  btnType,
  noBackground,
}) => {
  return (
    <Modal
      open={openDelModal}
      handleClose={() => {
        setOpenDelModal(false);
        setModalDismissed(true);
      }}
      className={style.mainDiv}
      backClass={backClass}
      {...{ noBackground }}
    >
      <div className={style.iconRefresh}>
        <Icon name={'BugIcon'} height={80} width={78} />
      </div>

      <p className={style.modalTitle}>Do you want to report bug for this failed test case ?</p>
      {locked && <p className={style.modalError}>Update Your Package to Report Bug</p>}
      <div className={style.mainBtnDiv}>
        <Button
          text={locked ? 'No, Fail Test Case' : 'Discard'}
          type={'button'}
          btnClass={style.btnClassUncheckModal}
          handleClick={async () => {
            await closeHandler();
            setOpenDelModal(false);
            setModalDismissed(true);
          }}
          data-cy="testcase-reportabug-discard-btn"
          disabled={isStatusUpdating}
        />
        <Button
          text={'Yes, Report a Bug'}
          disabled={locked}
          handleClick={clickHandler}
          type={btnType && btnType}
          data-cy="testcase-reportabug-btn"
        />
      </div>
    </Modal>
  );
};

export default ReportBug;
