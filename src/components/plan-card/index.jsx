import React, { useCallback } from 'react';

import { isEqual } from 'lodash';

import style from './style.module.scss';

const PlanCard = ({ ele, activePlan, handleButtonClick, planPeriod, index }) => {
  const handleClick = useCallback(() => {
    handleButtonClick(ele?.heading);
  }, [ele?.heading, handleButtonClick]);

  return (
    <div
      className={`${style.mainCard} ${activePlan === ele?.heading && style.active}`}
      key={ele.heading}
      onClick={handleClick}
      data-cy={`onboard-plans-btn${index}`}
    >
      <h6 style={{ color: ele.color }}>{ele.heading}</h6>
      <p className={style.p}>{ele.subtitle}</p>
      <h1>
        <span>$</span>

        {planPeriod === 'Monthly' ? ele?.price : ele?.priceYearly}
      </h1>
      <p className={style.p}>per member/month</p>
      <div className={`${style.div} ${style.borderDiv}`}>
        <div className={style.text}>{ele.heading} includes:</div>
        {ele.description.map((x) => (
          <div key={ele?.price} className={style.text2}>
            {x}
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(PlanCard, (prevProps, nextProps) => isEqual(prevProps, nextProps));
