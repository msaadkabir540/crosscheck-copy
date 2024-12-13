import React from 'react';

import { Chart } from 'primereact/chart';

import { isEqual as _isEqual } from 'utils/lodash';

const LineChart = (props) => {
  const { mainClassName, className, chartOptions, chartData, type = 'line' } = props;

  return (
    <div className={`card ${mainClassName && mainClassName}`}>
      <Chart
        type={type}
        data={chartData && chartData}
        options={chartOptions && chartOptions}
        className={className && className}
      />
    </div>
  );
};

export default React.memo(LineChart, (prevProps, nextProps) => {
  return _isEqual(prevProps, nextProps);
});
