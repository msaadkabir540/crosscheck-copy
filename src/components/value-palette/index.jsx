import { useEffect, useState } from 'react';

import style from './value-palette.module.scss';

const ValuePalette = ({ className, heading, data }) => {
  const [maxValue, setMaxValue] = useState(0);
  const [sum, setSum] = useState(0);
  const [max2Value, set2MaxValue] = useState(0);
  const [max3Value, set3MaxValue] = useState(0);
  const [max4Value, set4MaxValue] = useState(0);

  useEffect(() => {
    if (data !== undefined && data !== null) {
      const values = Object.values(data)?.sort((a, b) => b - a);
      setSum(values?.reduce((acc, val) => acc + val, 0));
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
      <span className={style.heading}>{heading}</span>

      <div className={style.boxDiv}>
        <div className={style.upperHalf}>
          <div
            className={style.miniBox}
            style={{
              background:
                data?.UI === 0
                  ? '#FF666666'
                  : data?.UI === maxValue
                    ? '#FF6666'
                    : data?.UI === max2Value
                      ? '#FF6666CC'
                      : data?.UI === max3Value
                        ? '#FF6666CC'
                        : data?.UI === max4Value && '#FF666666',
            }}
          >
            <span>UI</span>
            <div className={style.tooltip}>
              {' '}
              {data?.UI ? ((data?.UI / sum) * 100).toFixed(2) || '0%' : '0'}%,{data?.UI}
            </div>
          </div>
          <div
            className={style.miniBox}
            style={{
              background:
                data?.Performance === 0
                  ? '#FF666666'
                  : data?.Performance === maxValue
                    ? '#FF6666'
                    : data?.Performance === max2Value
                      ? '#FF6666CC'
                      : data?.Performance === max3Value
                        ? '#FF6666CC'
                        : data?.Performance === max4Value && '#FF666666',
            }}
          >
            <span>Performance</span>
            <div className={style.tooltip}>
              {data?.Performance ? ((data?.Performance / sum) * 100).toFixed(2) || '0' : '0'}%,
              {data?.Performance}
            </div>
          </div>
        </div>
        <div className={style.lowerHalf}>
          <div
            className={style.miniBox}
            style={{
              background:
                data?.Functionality === 0
                  ? '#FF666666'
                  : data?.Functionality === maxValue
                    ? '#FF6666'
                    : data?.Functionality === max2Value
                      ? '#FF6666CC'
                      : data?.Functionality === max3Value
                        ? '#FF6666CC'
                        : data?.Functionality === max4Value && '#FF666666',
            }}
          >
            <span>Functionality</span>
            <div className={style.tooltip}>
              {data?.Functionality ? ((data?.Functionality / sum) * 100).toFixed(2) || '0' : '0'}%,
              {data?.Functionality}
            </div>
          </div>
          <div
            className={style.miniBox}
            style={{
              background:
                data?.Security === 0
                  ? '#FF666666'
                  : data?.Security === maxValue
                    ? '#FF6666'
                    : data?.Security === max2Value
                      ? '#FF6666CC'
                      : data?.Security === max3Value
                        ? '#FF6666CC'
                        : data?.Security === max4Value && '#FF666666',
            }}
          >
            <span>Security</span>
            <div className={style.tooltip}>
              {data?.Security ? ((data?.Security / sum) * 100).toFixed(2) || '0' : '0'}%,
              {data?.Security},
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValuePalette;
