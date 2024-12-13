import React, { useCallback, useRef } from 'react';

import Slider from 'react-slick';
import { isEqual } from 'lodash';

import TextField from 'components/text-field';
import PlanCard from 'components/plan-card';

import { planCards } from './helper';
import style from './boarding.module.scss';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const settings = {
  className: 'center',
  centerMode: true,
  infinite: true,
  centerPadding: '10px',
  slidesToShow: 1,
  speed: 500,
  autoPlay: true,
  dots: true,
};

const WorkspacePlan = ({
  planPeriod,
  setPlanPeriod,
  activePlan,
  setActivePlan,
  register,
  excludeFreePlan,
  workspaceName,
}) => {
  const sliderRef = useRef(null);

  const handleSetPlanPeriodMonthly = useCallback(() => {
    setPlanPeriod('Monthly');
  }, [setPlanPeriod]);

  const handleSetPlanPeriodYearly = useCallback(() => {
    setPlanPeriod('Yearly');
  }, [setPlanPeriod]);

  const handleButtonClick = useCallback(
    (plan) => {
      setActivePlan(plan);
    },
    [setActivePlan],
  );

  const filteredPlanCards = excludeFreePlan ? planCards.filter((plan) => plan.heading !== 'Free') : planCards;

  return (
    <>
      <div className={style.workspace}>
        <div className={style.mainMain}>
          <h1>
            Choose a Plan for <span className={style.workspace_name_style}>{workspaceName}</span>
          </h1>
          <div className={style.tabDiv}>
            <div
              className={`${style.innerTab} ${planPeriod === 'Monthly' ? style.greyColor : ''}`}
              onClick={handleSetPlanPeriodMonthly}
            >
              <p className={planPeriod === 'Monthly' ? style.classBack : ''}>Monthly</p>
            </div>
            <div
              className={`${style.innerTab} ${planPeriod === 'Yearly' ? style.greyColor : ''}`}
              onClick={handleSetPlanPeriodYearly}
            >
              <p className={planPeriod === 'Yearly' ? style.classBack : ''}>Yearly</p>
            </div>
          </div>
        </div>
        <div className={style.planCard}>
          {filteredPlanCards?.map((ele) => (
            <PlanCard
              key={ele?.price}
              ele={ele}
              activePlan={activePlan}
              handleButtonClick={handleButtonClick}
              planPeriod={planPeriod}
            />
          ))}
        </div>

        <div className={style.planCard1}>
          <Slider {...settings} ref={sliderRef}>
            {planCards?.map((ele) => (
              <PlanCard
                key={ele?.price}
                ele={ele}
                activePlan={activePlan}
                handleButtonClick={handleButtonClick}
                planPeriod={planPeriod}
              />
            ))}
          </Slider>
        </div>
      </div>
      <div className={style.seats}>
        {activePlan !== 'Free' && (
          <div className={style.seatsCount1}>
            <span> No. of Seats</span>
            <TextField
              type={'number'}
              name={'seatsCount'}
              className={style.input}
              defaultValue={2}
              register={register}
              minVal={0}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default React.memo(WorkspacePlan, (prevProps, nextProps) => isEqual(prevProps, nextProps));
