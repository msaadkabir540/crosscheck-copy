import ReactApexChart from 'react-apexcharts';

import style from './apex.module.scss';

const DynamicChart = ({ after, chartType, testStatusObj, height, data, bugType }) => {
  let options = {};
  let series = [];

  const totalValueForBars = data && data?.critical + data?.high + data?.medium + data?.low;

  switch (chartType) {
    case 'bar':
      series = [
        {
          data: [
            {
              x: 'Critical',
              y: data?.critical,
              fillColor: '#F80101',
            },
            {
              x: 'High',
              y: data?.high,
              fillColor: '#F96E6E',
            },
            {
              x: 'Medium',
              y: data?.medium,
              fillColor: '#FF9843',
            },
            {
              x: 'Low',
              y: data?.low,
              fillColor: '#879DFF',
            },
          ],
        },
      ];

      options = {
        chart: {
          type: 'bar',
          height: height || 350,
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: ['Critical', 'High', 'Medium', 'Low'],
          labels: {
            show: false,
          },
        },
        tooltip: {
          custom: function ({ seriesIndex, dataPointIndex, w }) {
            const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];

            return `<div style="padding: 5px; display: flex; align-items:baseline; gap:5px; ">
            <div style=" height:10px; width:10px; border-radius:50%; background-color: ${data.fillColor};"></div>
                      <span style="font-size:13px;">${data.x}:</span>
                      <span style="font-size:13px;">${data.y},</span>
                      <span style="font-size:13px;">${((data.y * 100) / totalValueForBars).toFixed(1)}%</span>
                    </div>`;
          },
          shared: false,
          intersect: true,
        },
      };
      break;

    case 'donut':
      series = bugType
        ? after
          ? [
              data?.closed,
              data?.open,
              data?.blocked,
              data?.needToDiscuss,
              data?.reopen,
              data?.reproducible,
              data?.notTested,
            ]
          : [data?.closed, data?.open, data?.blocked, data?.needToDiscuss, data?.reopen]
        : [data?.passed, data?.failed, data?.blocked, data?.notTested];

      options = {
        chart: {
          type: 'donut',
        },
        labels: bugType
          ? after
            ? ['Closed', 'Open', 'Blocked', 'Need to Discuss', 'Reopened', 'Reproducible', 'Not Tested']
            : ['Closed', 'Open', 'Blocked', 'Need to Discuss', 'Reopened']
          : ['Pass', 'Failed', 'Blocked', 'Not Tested'],
        colors: bugType
          ? after
            ? ['#34C369', '#F96E6E', '#F80101', '#879DFF', '#DEBB00', '#FF9843', '#656F7D']
            : ['#34C369', '#F96E6E', '#F80101', '#879DFF', '#DEBB00', '#FF9843']
          : ['#34C369', '#F96E6E', '#F80101', '#656F7D'],
        legend: {
          show: false,
        },
        plotOptions: {
          pie: {
            donut: {
              size: '65%',
            },
            stroke: {
              width: 2,
              colors: undefined,
            },
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: 'bottom',
              },
            },
          },
        ],
        tooltip: {
          custom: function ({ series, seriesIndex, w }) {
            let label = w.config.labels[seriesIndex];
            let value = series[seriesIndex];
            let color = w.config.colors[seriesIndex];

            return `<div style="padding: 5px; display: flex; align-items: baseline; gap: 5px; background: #fff; ">
            <div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${color};"></div>
            <span style="font-size: 13px;">${label}:</span>
            <span style="font-size: 13px;">${value}</span>
          </div>`;
          },
          shared: false,
          intersect: true,
        },
      };
      break;

    case 'radialBar':
      series = [data];

      options = {
        chart: {
          type: 'radialBar',
          offsetY: -20,
          sparkline: {
            enabled: true,
          },
        },
        plotOptions: {
          radialBar: {
            startAngle: -90,
            endAngle: 90,
            track: {
              background: 'red',
              strokeWidth: '90%',
              margin: 5,
              dropShadow: {
                enabled: true,
                top: 2,
                left: 0,
                color: '#999',
                opacity: 1,
                blur: 2,
              },
            },
            hollow: {
              size: '65%',
            },
            dataLabels: {
              name: {
                show: false,
              },
              value: {
                offsetY: -2,
                fontSize: '22px',
                formatter: function () {
                  return ``;
                },
              },
            },
          },
        },
        grid: {
          padding: {
            top: -10,
          },
        },
        fill: {
          type: 'solid',
          colors: ['#34C369'],
          gradient: {
            shade: 'light',
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 50, 53, 91],
          },
        },
        labels: ['Average Results'],
      };
      break;

    default:
      break;
  }

  return (
    <div>
      <div id="chart" style={{ position: chartType === 'radialBar' ? 'relative' : '' }}>
        <ReactApexChart options={options} series={series} type={chartType} height={height} />
        {chartType === 'radialBar' && (
          <div className={style.radialText}>
            <p>{data}%</p>
            <span>
              {testStatusObj?.testedCount} of {testStatusObj?.totalCount}
            </span>
          </div>
        )}
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default DynamicChart;
