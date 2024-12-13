import style from './icons.module.scss';

const BorderArrowRight = () => {
  return (
    <>
      <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect
          x="0.5"
          y="0.501709"
          width="30"
          height="29"
          rx="2.5"
          fill="white"
          stroke="#11103D"
          className={`${style.fill2} ${style.bg}`}
        />
        <path
          d="M21 15.0017H11M21 15.0017L17 11.0017M21 15.0017L17 19.0017"
          stroke="black"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={style.whiteStroke}
        />
      </svg>
    </>
  );
};

export default BorderArrowRight;
