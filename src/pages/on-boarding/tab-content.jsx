import React from 'react';

import { isEqual } from 'lodash';

import Loader from 'components/loader';
import TextField from 'components/text-field';
import Button from 'components/button';

import style from './boarding.module.scss';
import { hasFreePlanWorkspace } from './helper';

const TabContent = ({
  active,
  tabs,
  isSubmitting,
  handleActiveIncrement,
  handleActiveDecrement,
  handleSkip,
  activePlan,
  register,
  isBackDisabled,
  workspaces,
  workspacesLoading,
}) => {
  return (
    <>
      {workspacesLoading ? (
        <Loader />
      ) : (
        <>
          <div className={style.tabWrapper}>{tabs[active].component}</div>
          {!(active === 5) && (
            <div className={`${style.btnWrapper} ${active === 0 ? style.endClass : ''}`}>
              <div className={style.btnFlex}>
                {active === 0 ? (
                  <>
                    {!hasFreePlanWorkspace(workspaces) && (
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        text="Skip Onboarding"
                        btnClass={style.btnSkip}
                        handleClick={handleSkip}
                      />
                    )}
                  </>
                ) : (
                  <>
                    {!isBackDisabled && (
                      <Button type="button" text="Back" btnClass={style.btn} handleClick={handleActiveDecrement} />
                    )}
                  </>
                )}
              </div>
              <div className={style.btnFlex}>
                {active !== 4 ? (
                  <Button
                    text="Next"
                    btnClass={style.nextBtn}
                    type="button"
                    handleClick={handleActiveIncrement}
                    data-cy="onboarding-next-btn"
                  />
                ) : (
                  <div className={style.seatsGeneric}>
                    {activePlan !== 'Free' && (
                      <div className={style.seatsCount}>
                        <span>No. of Seats</span>
                        <TextField
                          type="number"
                          name="seatsCount"
                          className={style.input}
                          defaultValue={2}
                          register={register}
                          minVal={0}
                          data-cy="onboard-plan-no-of-seats"
                        />
                      </div>
                    )}
                    <Button
                      text="Next"
                      btnClass={style.nextBtn}
                      type="submit"
                      disabled={isSubmitting}
                      data-cy="onboard-plan-submit-btn"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default React.memo(TabContent, (prevProps, nextProps) => isEqual(prevProps, nextProps));
