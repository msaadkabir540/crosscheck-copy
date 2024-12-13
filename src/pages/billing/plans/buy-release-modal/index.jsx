import Modal from 'components/modal';
import Button from 'components/button';

import warning from 'assets/warning.svg';

import style from './style.module.scss';

const Index = ({ isOpen, setIsOpen, backClass, isLoading, type, onSubmitHandler }) => {
  return (
    <Modal open={isOpen} handleClose={setIsOpen} className={style.mainDiv} backClass={backClass}>
      <div className={style.header}>
        <img src={warning} alt="warning-icon"></img>
        {type === 'update' ? (
          <div className={style.headerText}>
            <p>Are you sure you want to Update Subscription?</p>
          </div>
        ) : (
          <div className={style.headerText}>
            <p>Are you sure you want to cancel Subscription?</p>
          </div>
        )}{' '}
      </div>

      <div className={style.wrapper}>
        <div className={style.wrapperInner}>
          <Button
            text={'Discard'}
            type={'button'}
            btnClass={style.btn2}
            className={style.btnText}
            handleClick={() => {
              setIsOpen();
            }}
          />
          <Button text={`Yes`} btnClass={style.btn} handleClick={onSubmitHandler} disabled={isLoading} />
        </div>
      </div>
    </Modal>
  );
};

export default Index;
