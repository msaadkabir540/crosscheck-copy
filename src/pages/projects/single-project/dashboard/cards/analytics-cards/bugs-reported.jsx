import { useEffect, useState } from 'react';

import Chart from 'components/chart';

import style from './analytics.module.scss';

const BugsReported = ({ bugsData }) => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const data = {
      labels: bugsData?.bugsPerDayBreakdown?.map(() => 'Bugs Reported'),
      datasets: [
        {
          label: 'First Dataset',
          data: bugsData?.bugsPerDayBreakdown?.map((item) => item.bugs),
          fill: false,
          borderColor: '#F96E6E',
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
  }, [bugsData]);

  return (
    <div className={style.main}>
      <span className={style.heading}>Bugs Reported</span>
      <div className={style.count}>
        {bugsData?.totalBugs}
        <div className={style.chartDiv}>
          <Chart type="line" chartData={chartData} className={style.chart} chartOptions={chartOptions} />
        </div>
      </div>
      <span className={style.subHeading}>Last 7 days</span>
    </div>
  );
};

export default BugsReported;
