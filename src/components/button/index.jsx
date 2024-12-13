import style from './button.module.scss';

const Button = ({
  buttonClassName,
  text,
  iconStart,
  handleClick,
  type,
  className,
  btnClass,
  disabled,
  form,
  width,
  startCompo,
  ...restOfProps
}) => {
  return (
    <>
      <button
        className={`${style.btn} ${btnClass} ${buttonClassName}`}
        type={type}
        form={form}
        onClick={handleClick}
        disabled={disabled}
        style={{
          pointerEvents: disabled ? 'none' : 'auto',
          width,
        }}
        {...restOfProps}
      >
        {iconStart ? <img src={iconStart} alt="" className={style.img} /> : startCompo ? startCompo : ''}
        {text && <span className={`${style.btnTitle} ${className}`}>{text}</span>}
      </button>
    </>
  );
};

export default Button;
