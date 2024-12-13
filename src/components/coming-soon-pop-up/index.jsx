import Modal from '../modal';
import style from './coming-soon.module.scss';
import Icon from '../icon/themed-icon';

const ComingSoon = ({ open, setOpen }) => {
  return (
    <>
      <Modal open={open} handleClose={() => setOpen(false)} className={style.mainModalDiv}>
        <div className={style.inner}>
          <Icon name={'ComingSoonIcon'} />
          <span className={style.innerText}>We will notify you once the feature is ready!</span>
        </div>
      </Modal>
    </>
  );
};

export default ComingSoon;
