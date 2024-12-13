
import style from './value-chart.module.scss';

const ValueChart = ({ data, percentage, bugType }) => {
  const calculateWidth = (value) => {
    return (value / data?.allBugs) * 100 + '%'; // NOTE: Calculate the width as a percentage
  };

  return (
    <div className={style.mainWrapper}>
      {bugType ? (
        <>
          {data?.UIBugs > 0 && (
            <div className={style.innerBox} style={{ backgroundColor: '#A2FF86', width: calculateWidth(data?.UIBugs) }}>
              {data?.UIBugs}
              <div className={style.tooltip}>
                UI: {data?.UIBugs}, {percentage?.UIBugs}%
              </div>
            </div>
          )}
          {data?.functionalityBugs > 0 && (
            <div
              className={style.innerBox}
              style={{ backgroundColor: '#C70039', width: calculateWidth(data?.functionalityBugs) }}
            >
              {data?.functionalityBugs}
              <div className={style.tooltip}>
                Functionality: {data?.functionalityBugs}, {percentage?.functionalityBugs}%
              </div>
            </div>
          )}
          {data?.securityBugs > 0 && (
            <div
              className={style.innerBox}
              style={{ backgroundColor: '#D988B9', width: calculateWidth(data?.securityBugs) }}
            >
              {data?.securityBugs}
              <div className={style.tooltip}>
                Security: {data?.securityBugs}, {percentage?.securityBugs}%
              </div>
            </div>
          )}
          {data?.performanceBugs > 0 && (
            <div
              className={style.innerBox}
              style={{ backgroundColor: '#E25E3E', width: calculateWidth(data?.performanceBugs) }}
            >
              {data?.performanceBugs}
              <div className={style.tooltip}>
                Performance: {data?.performanceBugs}, {percentage?.performanceBugs}%
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {data?.criticalBugs > 0 && (
            <div
              className={style.innerBox}
              style={{ backgroundColor: '#F80101', width: calculateWidth(data?.criticalBugs) }}
            >
              {data?.criticalBugs}
              <div className={style.tooltip}>
                Critical: {data?.criticalBugs}, {percentage?.criticalBugs}%
              </div>
            </div>
          )}
          {data?.highBugs > 0 && (
            <div
              className={style.innerBox}
              style={{ backgroundColor: '#F96E6E', width: calculateWidth(data?.highBugs) }}
            >
              {data?.highBugs}
              <div className={style.tooltip}>
                High: {data?.highBugs}, {percentage?.highBugs}%
              </div>
            </div>
          )}
          {data?.mediumBugs > 0 && (
            <div
              className={style.innerBox}
              style={{ backgroundColor: '#B79C11', width: calculateWidth(data?.mediumBugs) }}
            >
              {data?.mediumBugs}
              <div className={style.tooltip}>
                Medium: {data?.mediumBugs}, {percentage?.mediumBugs}%
              </div>
            </div>
          )}
          {data?.lowBugs > 0 && (
            <div
              className={style.innerBox}
              style={{ backgroundColor: '#4F4F6E', width: calculateWidth(data?.lowBugs) }}
            >
              {data?.lowBugs}
              <div className={style.tooltip}>
                Low: {data?.lowBugs}, {percentage?.lowBugs}%
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ValueChart;
