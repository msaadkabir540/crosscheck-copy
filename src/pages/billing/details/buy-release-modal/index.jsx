import { useForm } from 'react-hook-form';

import Button from 'components/button';
import TextField from 'components/text-field';
import Modal from 'components/modal';

import { useToaster } from 'hooks/use-toaster';

import { useBuyReleaseSeats } from 'api/v1/payment/payment';

import warning from 'assets/warning.svg';

import style from './style.module.scss';

const Index = ({ isOpen, setIsOpen, backClass, type, refetch }) => {
  const { toastError, toastSuccess } = useToaster();
  const { register, reset, watch } = useForm();

  const { mutateAsync: _buyReleaseHandler, isLoading: _buyReleaseLoading } = useBuyReleaseSeats();

  const onSubmitHandler = async () => {
    try {
      const formData = {
        purpose: type,
        count: +watch('seatsCount'),
      };

      const res = await _buyReleaseHandler(formData);

      if (res?.msg) {
        toastSuccess(res?.msg);
        setTimeout(() => {
          refetch();
        }, 2000);
        setIsOpen();
      }
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <Modal open={isOpen} handleClose={setIsOpen} className={style.mainDiv} backClass={backClass}>
      <div className={style.header}>
        <img src={warning} alt="warning"></img>
        {type === 'buy' ? (
          <div className={style.headerText}>
            <p>Are you sure you want to Buy seat?</p>
            <span>You will also add 5 developer role users per paid seat</span>
          </div>
        ) : (
          <div className={style.headerText}>
            <p>Are you sure you want to release seat?</p>
            <span>You will also release 5 developer role users per paid seat</span>
          </div>
        )}{' '}
      </div>

      <div className={style.wrapper}>
        <div className={style.wrapperInner}>
          <TextField
            type={'number'}
            name={'seatsCount'}
            className={style.input}
            defaultValue={2}
            register={register}
            min={0}
          />
          <Button
            text={`${type === 'buy' ? 'Buy' : 'Release'} Seats`}
            btnClass={style.btn}
            handleClick={onSubmitHandler}
            disabled={_buyReleaseLoading}
          />
        </div>
        <Button
          text={'Discard'}
          type={'button'}
          btnClass={style.btn2}
          className={style.btnText}
          handleClick={() => {
            reset();
            setIsOpen();
          }}
        />
      </div>
    </Modal>
  );
};

export default Index;
