import BugsReported from './bugs-reported';
import style from './analytics.module.scss';
import TestCasesAdded from './test-cases-added';
import TestRunsCreated from './test-runs-created';

const AnalyticsCards = ({ analyticsData }) => {
  return (
    <div className={style.mainWrapper}>
      <div className={style.innerDiv}>
        <BugsReported bugsData={analyticsData?.bugs} />
      </div>
      <div className={style.innerDiv}>
        <TestCasesAdded tcData={analyticsData?.testCases} />
      </div>
      <div className={style.innerDiv}>
        <TestRunsCreated trData={analyticsData?.testRuns} />
      </div>
    </div>
  );
};

export default AnalyticsCards;
