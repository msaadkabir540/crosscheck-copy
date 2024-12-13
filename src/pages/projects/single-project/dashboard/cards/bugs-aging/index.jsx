import style from './bugs-aging.module.scss';

const BugsAging = ({ data }) => {
  return (
    <div className={style.wrapper}>
      <span className={style.mainHeading}>Bugs Aging</span>
      <span className={style.subHeading}>Avg {data?.avgDaysToClose} days</span>
      <div className={style.lowerSection}>
        <div>
          <p className={style.headings}>Critical</p>
          <p className={style.value}>
            {data?.avgDaysToCloseCritical
              ? `${data?.avgDaysToCloseCritical} ${data?.avgDaysToCloseCritical > 1 ? 'days' : 'day'}`
              : '-'}
          </p>
        </div>
        <div>
          <p className={style.headings}>High</p>
          <p className={style.value}>
            {data?.avgDaysToCloseHigh > 0
              ? `${data?.avgDaysToCloseHigh} ${data?.avgDaysToCloseHigh > 1 ? 'days' : 'day'}`
              : '-'}
          </p>
        </div>
        <div>
          <p className={style.headings}>Medium</p>
          <p className={style.value}>
            {data?.avgDaysToCloseMedium > 0
              ? `${data?.avgDaysToCloseMedium} ${data?.avgDaysToCloseMedium > 1 ? 'days' : 'day'}`
              : '-'}
          </p>
        </div>
        <div>
          <p className={style.headings}>Low</p>
          <p className={style.value}>
            {data?.avgDaysToCloseLow > 0
              ? `${data?.avgDaysToCloseLow} ${data?.avgDaysToCloseLow > 1 ? 'days' : 'day'}`
              : '-'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BugsAging;
