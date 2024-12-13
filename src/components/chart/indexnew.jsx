import { useMemo } from 'react';

import Chart from 'react-apexcharts';

import { isEmpty as _isEmpty } from 'utils/lodash';

import { makeDataOptionsAndSeries, typesOfChart } from './helper';

const IndexNew = ({ basicData, chartData }) => {
  const chartOptions = useMemo(() => {
    if (!_isEmpty(basicData) && !_isEmpty(chartData)) {
      const res = makeDataOptionsAndSeries(basicData, chartData);
      const type = typesOfChart[basicData?.dataSet?.type];

      return { ...res, type };
    }
  }, [chartData, basicData]);

  return (
    <div>
      {chartOptions && (
        <Chart
          type={chartOptions?.type}
          options={chartOptions?.options}
          series={chartOptions?.series}
          width={'100%'}
          key={basicData?.key}
        />
      )}
    </div>
  );
};

export default IndexNew;
