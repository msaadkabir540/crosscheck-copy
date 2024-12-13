import { useEffect, useState } from 'react';

import style from './value-palette.module.scss';

const ValuePaletteFilters = ({ className, percentage, data }) => {
  const [maxValue, setMaxValue] = useState(0);
  const [max2Value, set2MaxValue] = useState(0);
  const [max3Value, set3MaxValue] = useState(0);
  const [max4Value, set4MaxValue] = useState(0);

  useEffect(() => {
    if (data !== undefined && data !== null) {
      const values = Object.entries(data)
        .filter(([key]) => key !== 'allBugs')
        .map(([, value]) => Number(value))
        .sort((a, b) => b - a);

      setMaxValue(values[0]);
      set2MaxValue(values[1]);
      set3MaxValue(values[2]);
      set4MaxValue(values[3]);
    } else {
      console.error('data is undefined or null');
    }
  }, [data]);

  return (
    <div className={`${style.wrapper} ${className && className}`}>
      <div className={style.boxDiv}>
        <div className={style.upperHalf}>
          <div
            className={style.miniBox}
            style={{
              background:
                data?.UIBugs === 0
                  ? '#FF666666'
                  : data?.UIBugs === maxValue
                    ? '#FF6666'
                    : data?.UIBugs === max2Value
                      ? '#FF6666CC'
                      : data?.UIBugs === max3Value
                        ? '#FF6666CC'
                        : data?.UIBugs === max4Value && '#FF666666',
            }}
          >
            <span>UI</span>
            <div className={style.tooltip}>
              {' '}
              {percentage?.UIBugs}%,{data?.UIBugs}
            </div>
          </div>
          <div
            className={style.miniBox}
            style={{
              background:
                data?.performanceBugs === 0
                  ? '#FF666666'
                  : data?.performanceBugs === maxValue
                    ? '#FF6666'
                    : data?.performanceBugs === max2Value
                      ? '#FF6666CC'
                      : data?.performanceBugs === max3Value
                        ? '#FF6666CC'
                        : data?.performanceBugs === max4Value && '#FF666666',
            }}
          >
            <span>Performance</span>
            <div className={style.tooltip}>
              {percentage?.performanceBugs}%,{data?.performanceBugs}
            </div>
          </div>
        </div>
        <div className={style.lowerHalf}>
          <div
            className={style.miniBox}
            style={{
              background:
                data?.functionalityBugs === 0
                  ? '#FF666666'
                  : data?.functionalityBugs === maxValue
                    ? '#FF6666'
                    : data?.functionalityBugs === max2Value
                      ? '#FF6666CC'
                      : data?.functionalityBugs === max3Value
                        ? '#FF6666CC'
                        : data?.functionalityBugs === max4Value && '#FF666666',
            }}
          >
            <span>Functionality</span>
            <div className={style.tooltip}>
              {' '}
              {percentage?.functionalityBugs}%,
              {data?.functionalityBugs}
            </div>
          </div>
          <div
            className={style.miniBox}
            style={{
              background:
                data?.securityBugs === 0
                  ? '#FF666666'
                  : data?.securityBugs === maxValue
                    ? '#FF6666'
                    : data?.securityBugs === max2Value
                      ? '#FF6666CC'
                      : data?.securityBugs === max3Value
                        ? '#FF6666CC'
                        : data?.securityBugs === max4Value && '#FF666666',
            }}
          >
            <span>Security</span>
            <div className={style.tooltip}>
              {percentage?.securityBugs}%,{data?.securityBugs},
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValuePaletteFilters;
