import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import style from './value-box.module.scss';

const ValueBox = ({ className, heading, link, value }) => {
  const navigate = useNavigate();

  const handleNavigate = useCallback(() => {
    if (link) {
      navigate(link);
    }
  }, [link, navigate]);

  return (
    <div onClick={handleNavigate} className={`${style.wrapper} ${className && className}`}>
      <span className={style.heading}>{heading}</span>
      <span className={style.value}>{value ? value : '-'}</span>
    </div>
  );
};

export default ValueBox;
