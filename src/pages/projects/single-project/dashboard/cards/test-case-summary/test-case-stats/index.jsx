// NOTE: component
import MultiColorProgressBar from 'components/progress-bar';
import Loader from 'components/loader';

// NOTE: scss
import style from './test-case-stats.module.scss';

const TestCasesStatus = ({ view, type, feature, setFeature, data, totalData, isLoading, setselectedMilestone }) => {
  return (
    <div className={style.frame}>
      <div className={style.divo}>
        <div className={style.divWrapper}>
          <div className={style.textWrapper}>{feature ? 'Features' : 'Milestones'}</div>
        </div>
        <div className={style.divWrapperInner}>
          <div className={style.divWrapper2}>
            <div className={style.textWrapper}>Total Test Cases</div>
          </div>
          {view === 'table' ? (
            <>
              <div className={style.divWrapper2}>
                <div className={style.textWrapper}>Passed</div>
              </div>
              <div className={style.divWrapper2}>
                <div className={style.textWrapper}>Fail</div>
              </div>
              <div className={style.divWrapper2}>
                <div className={style.textWrapper}>Blocked</div>
              </div>
              <div className={style.divWrapper2}>
                <div className={style.textWrapper}>Not Tested</div>
              </div>
            </>
          ) : (
            <>
              <div className={`${style.divWrapper2} ${style.widthAdjuster} `}>
                <div className={style.textWrapper}>Status</div>
              </div>
            </>
          )}
        </div>
      </div>
      <div style={{ maxHeight: '47vh', overflowY: 'auto' }}>
        {isLoading ? (
          <Loader className={style.loader} />
        ) : (
          data.map((x) => {
            return (
              <div key={feature ? x.featureId : x.milestoneId} className={style.div2}>
                <div
                  className={style.divWrapper}
                  style={{ cursor: 'pointer' }}
                  onClick={
                    !feature
                      ? () => {
                          setFeature(x?.milestoneId);
                          setselectedMilestone(x?.milestoneName);
                        }
                      : () => {}
                  }
                >
                  <div className={style.textWrapper2}>{feature ? x?.featureName : x?.milestoneName}</div>
                </div>
                <div className={style.divWrapperInner}>
                  <div className={style.divWrapper2}>
                    <div className={style.textWrapper2}>
                      {type === 'Percentage'
                        ? `${x.totalTestCases}`
                        : type === 'Weightage'
                          ? `${x?.totalWeightage}`
                          : `${x.totalTestCases}`}
                    </div>
                  </div>
                  {view === 'table' ? (
                    <>
                      <div className={style.divWrapper2}>
                        <div className={style.textWrapper2}>
                          {type === 'Percentage'
                            ? `${x?.passed?.percentage} %`
                            : type === 'Weightage'
                              ? `${x?.passed?.weightage}`
                              : `${x?.passed?.count}`}
                        </div>
                      </div>
                      <div className={style.divWrapper2}>
                        <div className={style.textWrapper2}>
                          {type === 'Percentage'
                            ? `${x?.failed?.percentage} %`
                            : type === 'Weightage'
                              ? `${x?.failed?.weightage}`
                              : `${x?.failed?.count}`}{' '}
                        </div>
                      </div>
                      <div className={style.divWrapper2}>
                        <div className={style.textWrapper2}>
                          {type === 'Percentage'
                            ? `${x?.blocked?.percentage} %`
                            : type === 'Weightage'
                              ? `${x?.blocked?.weightage}`
                              : `${x?.blocked?.count}`}{' '}
                        </div>
                      </div>
                      <div className={style.divWrapper2}>
                        <div className={style.textWrapper2}>
                          {type === 'Percentage'
                            ? `${x?.notTested?.percentage} %`
                            : type === 'Weightage'
                              ? `${x?.notTested?.weightage}`
                              : `${x?.notTested?.count}`}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className={`${style.divWrapper2} ${style.widthAdjuster} `}>
                      <MultiColorProgressBar
                        className={style.multiColorProgressBar}
                        readings={[
                          {
                            name: 'Passed',
                            value:
                              type === 'Percentage'
                                ? x?.passed?.percentage
                                : type === 'Weightage'
                                  ? (x?.passed?.weightage / x?.totalWeightage) * 100
                                  : type === 'Count'
                                    ? (x?.passed?.count / x?.totalTestCases) * 100
                                    : 25,
                            color: 'var(--green)',
                          },
                          {
                            name: 'Failed',
                            value:
                              type === 'Percentage'
                                ? x?.failed?.percentage
                                : type === 'Weightage'
                                  ? (x?.failed?.weightage / x?.totalWeightage) * 100
                                  : type === 'Count'
                                    ? (x?.failed?.count / x?.totalTestCases) * 100
                                    : 25,
                            color: 'var(--red)',
                          },
                          {
                            name: 'Blocked',
                            value:
                              type === 'Percentage'
                                ? x?.blocked?.percentage
                                : type === 'Weightage'
                                  ? (x?.blocked?.weightage / x?.totalWeightage) * 100
                                  : type === 'Count'
                                    ? (x?.blocked?.count / x?.totalTestCases) * 100
                                    : 25,
                            color: 'var(--light-red)',
                          },
                          {
                            name: 'Not Tested',
                            value:
                              type === 'Percentage'
                                ? x?.notTested?.percentage
                                : type === 'Weightage'
                                  ? (x?.notTested?.weightage / x?.totalWeightage) * 100
                                  : type === 'Count'
                                    ? (x?.notTested?.count / x?.totalTestCases) * 100
                                    : 25,
                            color: 'var(--blue)',
                          },
                        ]}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className={style.div3}>
        <div className={style.divWrapper}>
          <div className={style.textWrapper}>Total</div>
        </div>
        <div className={style.divWrapperInner}>
          <div className={style.divWrapper2}>
            <div className={style.textWrapper}>
              {type === 'Percentage'
                ? `${totalData?.totalTestCasesCount || '0'}`
                : type === 'Weightage'
                  ? `${totalData?.totalWeightage || '0'}`
                  : `${totalData?.totalTestCasesCount || '0'}`}
            </div>
          </div>
          {view === 'table' ? (
            <>
              <div className={style.divWrapper2}>
                <div className={style.textWrapper}>
                  {type === 'Percentage'
                    ? `${totalData?.totalPassed?.percentage || '0'} %`
                    : type === 'Weightage'
                      ? `${totalData?.totalPassed?.weightage || '0'}`
                      : `${totalData?.totalPassed?.count || '0'}`}
                </div>
              </div>
              <div className={style.divWrapper2}>
                <div className={style.textWrapper}>
                  {type === 'Percentage'
                    ? `${totalData?.totalFailed?.percentage || '0'} %`
                    : type === 'Weightage'
                      ? `${totalData?.totalFailed?.weightage || '0'}`
                      : `${totalData?.totalFailed?.count || '0'}`}
                </div>
              </div>
              <div className={style.divWrapper2}>
                <div className={style.textWrapper}>
                  {type === 'Percentage'
                    ? `${totalData?.totalBlocked?.percentage || '0'} %`
                    : type === 'Weightage'
                      ? `${totalData?.totalBlocked?.weightage || '0'}`
                      : `${totalData?.totalBlocked?.count || '0'}`}
                </div>
              </div>
              <div className={style.divWrapper2}>
                <div className={style.textWrapper}>
                  {type === 'Percentage'
                    ? `${totalData?.totalNotTested?.percentage || '0'} %`
                    : type === 'Weightage'
                      ? `${totalData?.totalNotTested?.weightage || '0'}`
                      : `${totalData?.totalNotTested?.count || '0'}`}
                </div>
              </div>
            </>
          ) : (
            <div className={`${style.divWrapper2} ${style.widthAdjuster} `}>
              <MultiColorProgressBar
                className={style.multiColorProgressBar}
                readings={[
                  {
                    name: 'Passed',
                    value:
                      type === 'Percentage'
                        ? totalData?.totalPassed?.percentage
                        : type === 'Weightage'
                          ? (totalData?.totalPassed?.weightage / totalData?.totalWeightage) * 100
                          : type === 'Count'
                            ? (totalData?.totalPassed?.count / totalData?.totalTestCasesCount) * 100
                            : 25,
                    color: 'var(--green)',
                  },
                  {
                    name: 'Failed',
                    value:
                      type === 'Percentage'
                        ? totalData?.totalFailed?.percentage
                        : type === 'Weightage'
                          ? (totalData?.totalFailed?.weightage / totalData?.totalWeightage) * 100
                          : type === 'Count'
                            ? (totalData?.totalFailed?.count / totalData?.totalTestCasesCount) * 100
                            : 25,
                    color: 'var(--red)',
                  },
                  {
                    name: 'Blocked',
                    value:
                      type === 'Percentage'
                        ? totalData?.totalBlocked?.percentage
                        : type === 'Weightage'
                          ? (totalData?.totalBlocked?.weightage / totalData?.totalWeightage) * 100
                          : type === 'Count'
                            ? (totalData?.totalBlocked?.count / totalData?.totalTestCasesCount) * 100
                            : 25,
                    color: 'var(--light-red)',
                  },
                  {
                    name: 'Not Tested',
                    value:
                      type === 'Percentage'
                        ? totalData?.totalNotTested?.percentage
                        : type === 'Weightage'
                          ? (totalData?.totalNotTested?.weightage / totalData?.totalWeightage) * 100
                          : type === 'Count'
                            ? (totalData?.totalNotTested?.count / totalData?.totalTestCasesCount) * 100
                            : 25,
                    color: 'var(--blue)',
                  },
                ]}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestCasesStatus;
