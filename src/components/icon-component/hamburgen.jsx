import style from './icons.module.scss';

const HamburgerIcon = () => {
  return (
    <>
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M1 1.5H9.27559M1 5.5H9.27559M1 9.5H9.27559"
          stroke="#11103D"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={style.fill2}
        />
      </svg>
    </>
  );
};

export default HamburgerIcon;
