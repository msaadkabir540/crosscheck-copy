import { useEffect, useState } from 'react';

import Chart from 'components/chart';

import style from './analytics.module.scss';

const TestRunsCreated = ({ trData }) => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const data = {
      labels: trData?.testRunsPerDayBreakdown?.map(() => 'Test Runs Created'),
      datasets: [
        {
          label: 'First Dataset',
          data: trData?.testRunsPerDayBreakdown?.map((item) => item.testRuns),
          fill: false,
          borderColor: '#E25E3E',
          tension: 0.5, // NOTE: Set tension to 0 for pointy lines
          pointRadius: 0.1, // NOTE: Set pointRadius to 0 to hide the dots
          pointStyle: 'transparent', // NOTE: Set pointRadius to 0 to hide the dots
        },
      ],
    };

    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0,
      plugins: {
        legend: {
          display: false, // NOTE: Hide the legend
        },
      },
      scales: {
        x: {
          display: false, // NOTE: Hide the x-axis
        },
        y: {
          display: false, // NOTE: Hide the y-axis
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [trData]);

  return (
    <div className={style.main}>
      <span className={style.heading}>Test Runs Created</span>
      <div className={style.count}>
        {trData?.totalTestRuns}
        <div className={style.chartDiv}>
          <Chart type="line" chartData={chartData} className={style.chart} chartOptions={chartOptions} />
        </div>
      </div>
      <span className={style.subHeading}>Last 7 days</span>
    </div>
  );
};

export default TestRunsCreated;
