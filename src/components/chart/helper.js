import { has as _has } from 'utils/lodash';

const basicOptions = {
  colors: [
    '#FF5733',
    '#66CCFF',
    '#FF99CC',
    '#339966',
    '#FFD700',
    '#CC99FF',
    '#66FF33',
    '#FF6666',
    '#3399FF',
    '#CCFF00',
    '#9966CC',
    '#00FF99',
    '#FF3399',
    '#66FF66',
    '#FF9933',
    '#99CCFF',
    '#FF6600',
    '#33CCFF',
    '#FFCC66',
    '#66FFFF',
  ],
  yaxis: {
    min: 0,
  },
  legend: {
    position: 'top',
    horizontalAlign: 'center',
    
    
    
  },
};

const options = {
  'Line Chart': {
    Basic: {
      chart: {
        toolbar: {
          show: false,
        },
        
        type: 'line',
        zoom: {
          enabled: false,
        },

        
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], 
          opacity: 0.5,
        },
      },
      ...basicOptions,
    },
    'Line With Data Labels': {
      chart: {
        height: 350,
        type: 'line',
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: 'smooth',
      },

      grid: {
        borderColor: '#e7e7e7',
        row: {
          colors: ['#f3f3f3', 'transparent'], 
          opacity: 0.5,
        },
      },
      markers: {
        size: 1,
      },

      ...basicOptions,
    },
    'Zoomable Timeseries': {
      chart: {
        type: 'area',
        stacked: true,
        height: 350,
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true,
        },
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
      },

      ...basicOptions,
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
      },
    },

    'Line Chart with Annotations': {
      chart: {
        height: 350,
        type: 'line',
        id: 'areachart-2',
        toolbar: {
          show: false,
        },
      },
      ...basicOptions,
      annotations: {
        yaxis: [
          {
            y: 100,
            borderColor: '#00E396',
            label: {
              borderColor: '#00E396',
              style: {
                color: '#fff',
                background: '#00E396',
              },
              text: 'Support',
            },
          },
          {
            y: 100,
            y2: 200,
            borderColor: '#000',
            fillColor: '#FEB019',
            opacity: 0.2,
            label: {
              borderColor: '#333',
              style: {
                fontSize: '10px',
                color: '#333',
                background: '#FEB019',
              },
              text: 'Y-axis range',
            },
          },
        ],
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        

        
        
        
        
        
        
        
        
        
        
        
        
        
        
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
      },
      grid: {
        padding: {
          right: 30,
          left: 20,
        },
      },
    },
    Stepline: {
      chart: {
        type: 'line',
        height: 350,
        toolbar: {
          show: false,
        },
      },
      ...basicOptions,
      stroke: {
        curve: 'stepline',
      },
      dataLabels: {
        enabled: false,
      },

      markers: {
        hover: {
          sizeOffset: 4,
        },
      },
    },
    'Gradient Line': {
      chart: {
        height: 350,
        type: 'line',
        toolbar: {
          show: false,
        },
      },
      ...basicOptions,
      forecastDataPoints: {
        count: 7,
      },
      stroke: {
        width: 5,
        curve: 'smooth',
      },

      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          gradientToColors: ['#FDD835'],
          shadeIntensity: 1,
          type: 'horizontal',
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100],
        },
      },
    },
    'Brush Chart': {
      chart: {
        id: 'chart2',
        type: 'line',
        height: 230,
        toolbar: {
          autoSelected: 'pan',
          show: false,
        },
      },
      ...basicOptions,
      stroke: {
        width: 3,
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        opacity: 1,
      },
      markers: {
        size: 0,
      },
    },
    'Synchronized Charts': {
      chart: {
        id: 'fb',
        group: 'social',
        type: 'line',
        height: 160,
        toolbar: {
          show: false,
        },
      },
      ...basicOptions,
    },
    Realtime: {
      chart: {
        id: 'realtime',
        height: 350,
        type: 'line',
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: {
            speed: 1000,
          },
        },
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      ...basicOptions,
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },

      markers: {
        size: 0,
      },

      legend: {
        show: false,
      },
    },
    Dashed: {
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false,
        },
      },
      ...basicOptions,
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        curve: 'straight',
        dashArray: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
      },

      legend: {
        tooltipHoverFormatter: function (val, opts) {
          return val + ' - <strong>' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + '</strong>';
        },
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6,
        },
      },

      grid: {
        borderColor: '#f1f1f1',
      },
    },
    'Missing / null values': {
      chart: {
        height: 350,
        type: 'line',
        toolbar: { show: false },
        zoom: {
          enabled: false,
        },
        animations: {
          enabled: false,
        },
      },
      ...basicOptions,
      stroke: {
        width: [5, 5, 4],
        curve: 'straight',
      },
    },
  },
  'Bar Chart': {
    Basic: {
      chart: {
        type: 'bar',
        
        toolbar: {
          show: false,
        },
      },
      ...basicOptions,
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
    },
    Grouped: {
      chart: {
        type: 'bar',
        height: 430,
        toolbar: { show: false },
      },
      ...basicOptions,
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            position: 'top',
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 1,
        colors: ['#fff'],
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
    },
    Stacked: {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      ...basicOptions,
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            total: {
              enabled: true,
              offsetX: 0,
              style: {
                fontSize: '13px',
                fontWeight: 900,
              },
            },
          },
        },
      },
      stroke: {
        width: 1,
        colors: ['#fff'],
      },
      fill: {
        opacity: 1,
      },
    },
    'Stacked 100': {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        stackType: '100%',
        toolbar: {
          show: false,
        },
      },
      ...basicOptions,
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      stroke: {
        width: 1,
        colors: ['#fff'],
      },

      fill: {
        opacity: 1,
      },
    },
    'Grouped Stacked': {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      ...basicOptions,
      stroke: {
        width: 1,
        colors: ['#fff'],
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
      },

      plotOptions: {
        bar: {
          horizontal: true,
        },
      },

      fill: {
        opacity: 1,
      },
    },

    'Bar with Negative Values': {
      chart: {
        type: 'bar',
        height: 440,
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      ...basicOptions,
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '80%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 1,
        colors: ['#fff'],
      },

      grid: {
        xaxis: {
          lines: {
            show: false,
          },
        },
      },
      yaxis: {
        min: -5,
        max: 5,
      },
      tooltip: {
        shared: false,
      },
    },
    'Reversed Bar Chart': {
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: false,
        },
      },
      ...basicOptions,
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: true,
      },

      grid: {
        xaxis: {
          lines: {
            show: true,
          },
        },
      },
      yaxis: {
        reversed: true,
        axisTicks: {
          show: true,
        },
      },
    },
    'Custom DataLabels Bar': {
      chart: {
        type: 'bar',
        height: 380,
        toolbar: {
          show: false,
        },
      },
      ...basicOptions,
      plotOptions: {
        bar: {
          barHeight: '100%',
          distributed: true,
          horizontal: true,
          dataLabels: {
            position: 'bottom',
          },
        },
      },

      dataLabels: {
        enabled: true,
        textAnchor: 'start',
        style: {
          colors: ['#fff'],
        },
        formatter: function (val, opt) {
          return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val;
        },
        offsetX: 0,
        dropShadow: {
          enabled: true,
        },
      },
      stroke: {
        width: 1,
        colors: ['#fff'],
      },

      yaxis: {
        labels: {
          show: false,
        },
      },

      tooltip: {
        theme: 'dark',
        x: {
          show: false,
        },
        y: {
          title: {
            formatter: function () {
              return '';
            },
          },
        },
      },
    },
    Patterned: {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
          show: false,
        },
        dropShadow: {
          enabled: true,
          blur: 1,
          opacity: 0.25,
        },
      },
      ...basicOptions,
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '60%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 2,
      },

      fill: {
        type: 'pattern',
        opacity: 1,
        pattern: {
          style: ['circles', 'slantedLines', 'verticalLines', 'horizontalLines'], 
        },
      },

      states: {
        hover: {
          filter: 'none',
        },
      },
      legend: {
        position: 'right',
        offsetY: 40,
      },
    },
    'Bar with Images': {
      chart: {
        type: 'bar',
        height: 410,
        animations: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      ...basicOptions,
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '100%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        colors: ['#fff'],
        width: 0.2,
      },

      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
        },
      },
      grid: {
        position: 'back',
      },

      fill: {
        type: 'image',
        opacity: 0.87,
        image: {
          src: ['../../assets/images/4274635880_809a4b9d0d_z.jpg'],
          width: 466,
          height: 406,
        },
      },
    },
  },
  'Pie Chart': {
    'Simple Pie': {
      chart: {
        width: 380,
        type: 'pie',
      },
      ...basicOptions,
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
    },
    'Simple Donut': {
      chart: {
        type: 'donut',
      },
      ...basicOptions,
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
    },
    'Donut Update': {
      chart: {
        width: 380,
        type: 'donut',
      },
      ...basicOptions,
      dataLabels: {
        enabled: false,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              show: false,
            },
          },
        },
      ],
      legend: {
        position: 'right',
        offsetY: 0,
        height: 230,
      },
    },
    'Monochrome Pie': {
      chart: {
        width: '100%',
        type: 'pie',
      },
      ...basicOptions,
      theme: {
        monochrome: {
          enabled: true,
        },
      },
      plotOptions: {
        pie: {
          dataLabels: {
            offset: -5,
          },
        },
      },

      
      
      
      
      
      
      legend: {
        show: false,
      },
    },
    'Gradient Donut': {
      chart: {
        width: 380,
        type: 'donut',
      },
      ...basicOptions,
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 270,
        },
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        type: 'gradient',
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
    },
    'Semi Donut': {
      chart: {
        type: 'donut',
      },
      ...basicOptions,
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 90,
          offsetY: 10,
        },
      },
      grid: {
        padding: {
          bottom: -80,
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
    },
    'Donut with Pattern': {
      chart: {
        width: 380,
        type: 'donut',
        dropShadow: {
          enabled: true,
          color: '#111',
          top: -1,
          left: 3,
          blur: 3,
          opacity: 0.2,
        },
      },
      stroke: {
        width: 0,
      },
      ...basicOptions,
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                showAlways: true,
                show: true,
              },
            },
          },
        },
      },
      dataLabels: {
        dropShadow: {
          blur: 3,
          opacity: 0.8,
        },
      },
      fill: {
        type: 'pattern',
        opacity: 1,
        pattern: {
          enabled: true,
          style: ['verticalLines', 'squares', 'horizontalLines', 'circles', 'slantedLines'],
        },
      },
      states: {
        hover: {
          filter: 'none',
        },
      },
      theme: {
        palette: 'palette2',
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
    },
    'Pie with Image': {
      chart: {
        width: 380,
        type: 'pie',
      },
      ...basicOptions,
      fill: {
        type: 'image',
        opacity: 0.85,
        image: {
          src: [
            '../../assets/images/stripes.jpg',
            '../../assets/images/1101098.png',
            '../../assets/images/4679113782_ca13e2e6c0_z.jpg',
            '../../assets/images/2979121308_59539a3898_z.jpg',
          ],
          width: 25,
          imagedHeight: 25,
        },
      },
      stroke: {
        width: 4,
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ['#111'],
        },
        background: {
          enabled: true,
          foreColor: '#fff',
          borderWidth: 0,
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
    },
  },
  'Area Chart': {
    Basic: {
      chart: {
        type: 'area',
        height: 350,
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      ...basicOptions,
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
      },

      yaxis: {
        opposite: true,
      },
      legend: {
        horizontalAlign: 'left',
      },
    },
    'Spline Area': {
      chart: {
        height: 350,
        type: 'area',
        toolbar: {
          show: false,
        },
      },
      ...basicOptions,
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },

      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm',
        },
      },
    },
    'Datetime X-axis': {
      chart: {
        id: 'area-datetime',
        type: 'area',
        height: 350,
        zoom: {
          autoScaleYaxis: true,
        },
        toolbar: {
          show: false,
        },
      },
      annotations: {
        yaxis: [
          {
            y: 30,
            borderColor: '#999',
            label: {
              show: true,
              text: 'Support',
              style: {
                color: '#fff',
                background: '#00E396',
              },
            },
          },
        ],
        xaxis: [
          {
            x: new Date('14 Nov 2012').getTime(),
            borderColor: '#999',
            yAxisIndex: 0,
            label: {
              show: true,
              text: 'Rally',
              style: {
                color: '#fff',
                background: '#775DD0',
              },
            },
          },
        ],
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
        style: 'hollow',
      },

      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 100],
        },
      },
    },
    Negative: {
      chart: {
        type: 'area',
        height: 350,
        toolbar: {
          show: false,
        },
      },
      ...basicOptions,
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
      },

      yaxis: {
        tickAmount: 4,
        floating: false,

        labels: {
          style: {
            colors: '#8e8da4',
          },
          offsetY: -7,
          offsetX: 0,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      fill: {
        opacity: 0.5,
      },

      grid: {
        yaxis: {
          lines: {
            offsetX: -30,
          },
        },
        padding: {
          left: 20,
        },
      },
    },
    'Github Style': {
      chart: {
        id: 'chartyear',
        type: 'area',
        height: 160,
        background: '#F6F8FA',
        toolbar: {
          show: false,
          autoSelected: 'pan',
        },
        events: {
          mounted: function (chart) {
            var commitsEl = document.querySelector('.cmeta span.commits');
            var commits = chart.getSeriesTotalXRange(chart.w.globals.minX, chart.w.globals.maxX);

            commitsEl.innerHTML = commits;
          },
          updated: function (chart) {
            var commitsEl = document.querySelector('.cmeta span.commits');
            var commits = chart.getSeriesTotalXRange(chart.w.globals.minX, chart.w.globals.maxX);

            commitsEl.innerHTML = commits;
          },
        },
      },
      ...basicOptions,
      stroke: {
        width: 0,
        curve: 'smooth',
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        opacity: 1,
        type: 'solid',
      },
      yaxis: {
        show: false,
        tickAmount: 3,
      },
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
    },
    Stacked: {
      chart: {
        type: 'area',
        height: 350,
        stacked: true,
        events: {
          selection: function (chart, e) {
            console.log(new Date(e.xaxis.min));
          },
        },
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      fill: {
        type: 'gradient',
        gradient: {
          opacityFrom: 0.6,
          opacityTo: 0.8,
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
      },
    },
    'Irregular Timeseries': {
      chart: {
        type: 'area',
        stacked: false,
        height: 350,
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      ...basicOptions,
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.45,
          opacityTo: 0.05,
          stops: [20, 100, 100, 100],
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#8e8da4',
          },
          offsetX: 0,
          formatter: function (val) {
            return (val / 1000000).toFixed(2);
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },

      tooltip: {
        shared: true,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        offsetX: -10,
      },
    },
    'Missing / Null values': {
      chart: {
        type: 'area',
        height: 350,
        animations: {
          enabled: false,
        },
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
      },
      fill: {
        opacity: 0.8,
        type: 'pattern',
        pattern: {
          style: ['verticalLines', 'horizontalLines'],
          width: 5,
          height: 6,
        },
      },
      markers: {
        size: 5,
        hover: {
          size: 9,
        },
      },

      tooltip: {
        intersect: true,
        shared: false,
      },
      theme: {
        palette: 'palette1',
      },
    },
  },
  'Combo Chart': {
    'Line & Column': {
      chart: {
        height: 350,
        type: 'line',
        toolbar: {
          show: false,
        },
      },
      ...basicOptions,
      stroke: {
        width: [0, 4],
      },

      dataLabels: {
        enabled: true,
        enabledOnSeries: [1],
      },
    },
    'Multiple Y-axis': {
      chart: {
        height: 350,
        type: 'line',
        stacked: false,
        toolbar: {
          show: false,
        },
      },
      ...basicOptions,
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: [1, 1, 4],
      },

      tooltip: {
        fixed: {
          enabled: true,
          position: 'topLeft', 
          offsetY: 30,
          offsetX: 60,
        },
      },
      legend: {
        horizontalAlign: 'left',
        offsetX: 40,
      },
    },
    'Line & Area': {
      chart: {
        height: 350,
        type: 'line',
        toolbar: {
          show: false,
        },
      },
      stroke: {
        curve: 'smooth',
      },
      fill: {
        type: 'solid',
        opacity: [0.35, 1],
      },
      markers: {
        size: 0,
      },

      tooltip: {
        shared: true,
        intersect: false,
      },
    },
    'Line, Column & Area': {
      chart: {
        height: 350,
        type: 'line',
        stacked: false,
        toolbar: {
          show: false,
        },
      },
      stroke: {
        width: [0, 2, 5],
        curve: 'smooth',
      },
      plotOptions: {
        bar: {
          columnWidth: '50%',
        },
      },

      fill: {
        opacity: [0.85, 0.25, 1],
        gradient: {
          inverseColors: false,
          shade: 'light',
          type: 'vertical',
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100],
        },
      },

      markers: {
        size: 0,
      },

      tooltip: {
        shared: true,
        intersect: false,
      },
    },
    'Line & Scatter': {
      chart: {
        height: 350,
        type: 'line',
        toolbar: {
          show: false,
        },
      },
      fill: {
        type: 'solid',
      },
      markers: {
        size: [6, 0],
      },
      tooltip: {
        shared: false,
        intersect: true,
      },
      legend: {
        show: false,
      },
    },
  },
  'Radial Chart': {
    Basic: {
      options: {
        chart: {
          height: 350,
          type: 'radialBar',
        },
        plotOptions: {
          radialBar: {
            hollow: {
              size: '70%',
            },
          },
        },
      },
    },
    Multiple: {
      chart: {
        height: 350,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: '22px',
            },
            value: {
              fontSize: '16px',
            },
            total: {
              show: true,
              label: 'Total',
              
              
              
              
            },
          },
        },
      },
    },
    'Custom Angle Circle': {
      chart: {
        height: 390,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: '30%',
            background: 'transparent',
            image: undefined,
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              show: false,
            },
          },
        },
      },
      colors: ['#1ab7ea', '#0084ff', '#39539E', '#0077B5'],
      legend: {
        show: true,
        floating: true,
        fontSize: '16px',
        position: 'left',
        offsetX: 160,
        offsetY: 15,
        labels: {
          useSeriesColors: true,
        },
        markers: {
          size: 0,
        },
        
        
        
        itemMargin: {
          vertical: 3,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              show: false,
            },
          },
        },
      ],
    },
    Gradient: {
      chart: {
        height: 350,
        type: 'radialBar',
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 225,
          hollow: {
            margin: 0,
            size: '70%',
            background: '#fff',
            image: undefined,
            imageOffsetX: 0,
            imageOffsetY: 0,
            position: 'front',
            dropShadow: {
              enabled: true,
              top: 3,
              left: 0,
              blur: 4,
              opacity: 0.24,
            },
          },
          track: {
            background: '#fff',
            strokeWidth: '67%',
            margin: 0, 
            dropShadow: {
              enabled: true,
              top: -3,
              left: 0,
              blur: 4,
              opacity: 0.35,
            },
          },

          dataLabels: {
            show: true,
            name: {
              offsetY: -10,
              show: true,
              color: '#888',
              fontSize: '17px',
            },
            value: {
              formatter: function (val) {
                return parseInt(val);
              },
              color: '#111',
              fontSize: '36px',
              show: true,
            },
          },
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          shadeIntensity: 0.5,
          gradientToColors: ['#ABE5A1'],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100],
        },
      },
      stroke: {
        lineCap: 'round',
      },
    },
    'Radialbar with Image': {
      chart: {
        height: 350,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 15,
            size: '70%',
            image: '../../assets/images/clock.png',
            imageWidth: 64,
            imageHeight: 64,
            imageClipped: false,
          },
          dataLabels: {
            name: {
              show: false,
              color: '#fff',
            },
            value: {
              show: true,
              color: '#333',
              offsetY: 70,
              fontSize: '22px',
            },
          },
        },
      },
      fill: {
        type: 'image',
        image: {
          src: ['../../assets/images/4274635880_809a4b9d0d_z.jpg'],
        },
      },
      stroke: {
        lineCap: 'round',
      },
    },
    'Stroked Gauge': {
      chart: {
        height: 350,
        type: 'radialBar',
        offsetY: -10,
      },
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 135,
          dataLabels: {
            name: {
              fontSize: '16px',
              color: undefined,
              offsetY: 120,
            },
            value: {
              offsetY: 76,
              fontSize: '22px',
              color: undefined,
              formatter: function (val) {
                return val + '%';
              },
            },
          },
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          shadeIntensity: 0.15,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 65, 91],
        },
      },
      stroke: {
        dashArray: 4,
      },
    },
    'Semi Circle Gauge': {
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
            background: '#e7e7e7',
            strokeWidth: '97%',
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
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              offsetY: -2,
              fontSize: '22px',
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
        type: 'gradient',
        gradient: {
          shade: 'light',
          shadeIntensity: 0.4,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 53, 91],
        },
      },
    },
  },
  'Timeline Chart': {
    Basic: {
      chart: {
        height: 350,
        type: 'rangeBar',
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
    },
    'Custom Colors': {
      chart: {
        height: 350,
        type: 'rangeBar',
      },
      ...basicOptions,
      plotOptions: {
        bar: {
          horizontal: true,
          distributed: true,
          dataLabels: {
            hideOverflowingLabels: false,
          },
        },
      },

      grid: {
        row: {
          colors: ['#f3f4f5', '#fff'],
          opacity: 1,
        },
      },
    },
    'Multi-series': {
      chart: {
        height: 350,
        type: 'rangeBar',
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: true,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [50, 0, 100, 100],
        },
      },

      legend: {
        position: 'top',
      },
    },
    'Advanced (Multi-range)': {
      chart: {
        height: 450,
        type: 'rangeBar',
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '80%',
        },
      },

      stroke: {
        width: 1,
      },
      fill: {
        type: 'solid',
        opacity: 0.6,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
      },
    },
    'Multiple series – Group rows': {
      chart: {
        height: 350,
        type: 'rangeBar',
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '50%',
          rangeBarGroupRows: true,
        },
      },
      colors: [
        '#008FFB',
        '#00E396',
        '#FEB019',
        '#FF4560',
        '#775DD0',
        '#3F51B5',
        '#546E7A',
        '#D4526E',
        '#8D5B4C',
        '#F86624',
        '#D7263D',
        '#1B998B',
        '#2E294E',
        '#F46036',
        '#E2C044',
      ],
      fill: {
        type: 'solid',
      },

      legend: {
        position: 'right',
      },
    },
    'Dumbbell Chart (Horizontal)': {
      chart: {
        height: 390,
        type: 'rangeBar',
        zoom: {
          enabled: false,
        },
      },
      colors: ['#EC7D31', '#36BDCB'],
      plotOptions: {
        bar: {
          horizontal: true,
          isDumbbell: true,
          dumbbellColors: [['#EC7D31', '#36BDCB']],
        },
      },

      legend: {
        show: true,
        showForSingleSeries: true,
        position: 'top',
        horizontalAlign: 'left',
        customLegendItems: ['Female', 'Male'],
      },
      fill: {
        type: 'gradient',
        gradient: {
          gradientToColors: ['#36BDCB'],
          inverseColors: false,
          stops: [0, 100],
        },
      },
      grid: {
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: false,
          },
        },
      },
    },
  },
  'Tree Chart': {
    Basic: {
      legend: {
        show: false,
      },
      chart: {
        height: 350,
        type: 'treemap',
      },
      title: {
        text: 'Basic Treemap',
      },
    },
    'Treemap Multiple Series': {
      legend: {
        show: false,
      },
      chart: {
        height: 350,
        type: 'treemap',
      },
      title: {
        text: 'Multi-dimensional Treemap',
        align: 'center',
      },
    },
    'Color Range': {
      legend: {
        show: false,
      },
      chart: {
        height: 350,
        type: 'treemap',
      },

      dataLabels: {
        enabled: true,
        style: {
          fontSize: '12px',
        },

        offsetY: -4,
      },
      plotOptions: {
        treemap: {
          enableShades: true,
          shadeIntensity: 0.5,
          reverseNegativeShade: true,
          colorScale: {
            ranges: [
              {
                from: -6,
                to: 0,
                color: '#CD363A',
              },
              {
                from: 0.001,
                to: 6,
                color: '#52B12C',
              },
            ],
          },
        },
      },
    },
    Distributed: {
      legend: {
        show: false,
      },
      chart: {
        height: 350,
        type: 'treemap',
      },

      colors: [
        '#3B93A5',
        '#F7B844',
        '#ADD8C7',
        '#EC3C65',
        '#CDD7B6',
        '#C1F666',
        '#D43F97',
        '#1E5D8C',
        '#421243',
        '#7F94B0',
        '#EF6537',
        '#C0ADDB',
      ],
      plotOptions: {
        treemap: {
          distributed: true,
          enableShades: false,
        },
      },
    },
  },
  'Heat Chart': {
    Basic: {
      chart: {
        height: 350,
        type: 'heatmap',
      },
      dataLabels: {
        enabled: false,
      },
      colors: ['#008FFB'],
      title: {
        text: 'HeatMap Chart (Single color)',
      },
    },
    'Multiple Colors for each Series': {
      chart: {
        height: 450,
        type: 'heatmap',
      },
      dataLabels: {
        enabled: false,
      },

      grid: {
        padding: {
          right: 20,
        },
      },
    },
    'Multiple Series – colors flipped': {
      chart: {
        height: 350,
        type: 'heatmap',
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        heatmap: {
          colorScale: {
            inverse: true,
          },
        },
      },
      colors: [
        '#F3B415',
        '#F27036',
        '#663F59',
        '#6A6E94',
        '#4E88B4',
        '#00A7C6',
        '#18D8D8',
        '#A9D794',
        '#46AF78',
        '#A93F55',
        '#8C5E58',
        '#2176FF',
        '#33A1FD',
        '#7A918D',
        '#BAFF29',
      ],
    },
    'Color range': {
      chart: {
        height: 350,
        type: 'heatmap',
      },
      plotOptions: {
        heatmap: {
          shadeIntensity: 0.5,
          radius: 0,
          useFillColorAsStroke: true,
          colorScale: {
            ranges: [
              {
                from: -30,
                to: 5,
                name: 'low',
                color: '#00A100',
              },
              {
                from: 6,
                to: 20,
                name: 'medium',
                color: '#128FD9',
              },
              {
                from: 21,
                to: 45,
                name: 'high',
                color: '#FFB200',
              },
              {
                from: 46,
                to: 55,
                name: 'extreme',
                color: '#FF0000',
              },
            ],
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 1,
      },
    },
    'Rounded (Range without shades)': {
      chart: {
        height: 350,
        type: 'heatmap',
      },
      stroke: {
        width: 0,
      },
      plotOptions: {
        heatmap: {
          radius: 30,
          enableShades: false,
          colorScale: {
            ranges: [
              {
                from: 0,
                to: 50,
                color: '#008FFB',
              },
              {
                from: 51,
                to: 100,
                color: '#00E396',
              },
            ],
          },
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ['#fff'],
        },
      },
    },
  },
};

const gettingBasicOptions = (type, subType) => {
  return options?.[type]?.[subType] ?? {};
};

const makeDataOptionsAndSeries = (basic, populated) => {
  let options = {};
  let series = [];

  if (!populated || populated.length === 0) {
    return { options, series };
  }

  const firstDataItem = populated[0];

  if (_has(firstDataItem, 'primaryGroupByData')) {
    
    const firstSecondaryDataItem = firstDataItem.primaryGroupByData[0];

    if (!_has(firstSecondaryDataItem, 'secondaryGroupByData')) {
      const uniqueGroupNames = new Set();
      populated?.forEach((item) => {
        const primaryGroupByData = item.primaryGroupByData || [];
        primaryGroupByData.forEach((groupData) => {
          uniqueGroupNames.add(groupData.primaryGroupByName);
        });
      });
      const uniqueNames = Array.from(uniqueGroupNames);
      uniqueNames.forEach((name) => {
        const newData = {
          name: name,
          data: [],
        };

        populated.forEach((item) => {
          const primaryGroupByData = item.primaryGroupByData || [];
          const foundData = primaryGroupByData.find((groupData) => groupData.primaryGroupByName === name);
          newData.data.push({ x: item.qualitativeName, y: foundData?.resultCount ? foundData?.resultCount ?? 0 : 0 });
        });

        series.push(newData);
      });
    } else {
      const primaryUniqueGroupNames = new Set();
      const secondaryUniqueGroupNames = new Set();

      populated?.forEach((item) => {
        const primaryGroupByData = item?.primaryGroupByData || [];
        primaryGroupByData.forEach((groupData) => {
          primaryUniqueGroupNames.add(groupData?.primaryGroupByName);
        });
      });
      const primaryUniqueNamesArray = Array.from(primaryUniqueGroupNames);

      populated?.forEach((item) => {
        const primaryGroupByData = item?.primaryGroupByData || [];
        primaryGroupByData.forEach((primaryGroupData) => {
          const secondaryGroupByData = primaryGroupData?.secondaryGroupByData || [];
          secondaryGroupByData.forEach((secondaryGroupData) => {
            secondaryGroupData?.secondaryGroupByName &&
              secondaryUniqueGroupNames.add(secondaryGroupData?.secondaryGroupByName);
          });
        });
      });

      const secondaryUniqueNamesArray = Array.from(secondaryUniqueGroupNames);

      primaryUniqueNamesArray.forEach((firstName) => {
        secondaryUniqueNamesArray.forEach((secondName) => {
          const newData = {
            name: `${firstName} - ${secondName}`,
            group: secondName,
            data: [],
          };

          populated.forEach((item) => {
            const primaryGroupByData = item?.primaryGroupByData || [];

            const primaryFoundData = primaryGroupByData?.find(
              (groupData) => groupData.primaryGroupByName === firstName,
            );

            const secondaryGroupByData = primaryFoundData?.secondaryGroupByData || [];

            const secondaryFoundData = secondaryGroupByData?.find(
              (groupData) => groupData.secondaryGroupByName === secondName,
            );
            newData.data.push({
              x: item?.qualitativeName,
              y: secondaryFoundData?.resultCount ? secondaryFoundData?.resultCount ?? 0 : 0,
            });
          });

          series.push(newData);
        });
      });

      return { options, series };
    }
  } else {
    
    series = [
      {
        name: 'Result Count',
        data: populated.map((item) => ({ x: item.qualitativeName, y: item?.resultCount ?? 0 })),
      },
    ];
  }

  const type = basic?.dataSet?.type;
  const subType = basic?.dataSet?.subtype;

  const basicOptions = gettingBasicOptions(type, subType);

  return {
    options: {
      ...basicOptions,
      ...options,
    },
    series,
  };
};

const typesOfChart = {
  'Line Chart': 'line',
  'Bar Chart': 'bar',
  'Pie Chart': 'pie',
  'Donut Chart': 'donut',
  'Area Chart': 'area',
  'Combo Chart': 'line',
  'Radial Chart': 'radialBar',
  'Timeline Chart': 'rangeBar',
  'Tree Chart': 'treemap',
  'Heat Chart': 'heatmap',
};

export { gettingBasicOptions, makeDataOptionsAndSeries, typesOfChart };
