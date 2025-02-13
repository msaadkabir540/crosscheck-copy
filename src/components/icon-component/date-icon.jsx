import style from './icons.module.scss';

const DateIcon = () => {
  return (
    <>
      <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M1.59998 4.19961C1.59998 3.31595 2.31632 2.59961 3.19998 2.59961H14.4C15.2837 2.59961 16 3.31595 16 4.19961V15.3996C16 16.2833 15.2837 16.9996 14.4 16.9996H3.19998C2.31632 16.9996 1.59998 16.2833 1.59998 15.3996V4.19961Z"
          stroke="#8B909A"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={style.greyStroke}
        />
        <path
          d="M1.59998 7.40039H16"
          stroke="#8B909A"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={style.greyStroke}
        />
        <path
          d="M12.0002 1V4.2"
          stroke="#8B909A"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={style.greyStroke}
        />
        <path
          d="M5.59998 1V4.2"
          stroke="#8B909A"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={style.greyStroke}
        />
        <path
          d="M9.79944 13H10.1994C10.7517 13 11.1994 13.4477 11.1994 14V14.4C11.1994 14.9523 10.7517 15.4 10.1994 15.4H9.79944C9.24715 15.4 8.79944 14.9523 8.79944 14.4V14C8.79944 13.4477 9.24715 13 9.79944 13Z"
          fill="#8B909A"
          className={style.grey}
        />
        <path
          d="M13.0002 13H13.4002C13.9525 13 14.4002 13.4477 14.4002 14V14.4C14.4002 14.9523 13.9525 15.4 13.4002 15.4H13.0002C12.448 15.4 12.0002 14.9523 12.0002 14.4V14C12.0002 13.4477 12.448 13 13.0002 13Z"
          fill="#8B909A"
          className={style.grey}
        />
      </svg>
    </>
  );
};

export default DateIcon;
