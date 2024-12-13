import PropTypes from 'prop-types';

import Modal from 'components/modal';
import Button from 'components/button';
import TextField from 'components/text-field';

import style from './remove-confirm-modal.module.scss';

const SeatsFullModal = ({ seatsFull, setSeatsFull }) => {
  return (
    <Modal
      open={seatsFull}
      backClass={style.backClass}
      handleClose={() => setSeatsFull(false)}
      className={style.mainDiv}
    >
      <div>
        <div className={style.iconRefreshLarge}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M20 14.9339V21.5701M20 28.2229L20.0166 28.2045M33.3436 34.8425H6.65639C4.10473 34.8425 2.50799 32.0825 3.77992 29.8705L17.1236 6.66413C18.3994 4.4453 21.6007 4.44528 22.8765 6.66411L36.2202 29.8705C37.492 32.0825 35.8954 34.8425 33.3436 34.8425Z"
              stroke="#F80101"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <p className={style.modalTitle}>
          Your paid seats limit is full. You cannot invite a paid users. Please buy seat/s.
        </p>
      </div>
      <div className={style.mainBtnDiv}>
        <div className={style.innerFlex}>
          <TextField placeholder={'5'} type="number" />
          <Button text={'Buy Seats'} />
        </div>
        <Button text={'Discard'} btnClass={style.btnClassUncheckModal} handleClick={() => setSeatsFull(false)} />
      </div>
    </Modal>
  );
};

SeatsFullModal.propTypes = {
  seatsFull: PropTypes.any.isRequired,
  setSeatsFull: PropTypes.func.isRequired,
};
export default SeatsFullModal;
