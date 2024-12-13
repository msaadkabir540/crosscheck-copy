import { useMemo, useState, useEffect, useRef, useCallback } from 'react';

import { endOfMonth, endOfWeek, startOfMonth, startOfWeek, subMonths, subWeeks } from 'date-fns';
import { useForm } from 'react-hook-form';
import _ from 'lodash';

import DateRange from 'components/date-range';
import Menu from 'components/menu';
// NOTE: hooks
import LineChart from 'components/chart';

import { useToaster } from 'hooks/use-toaster';

import { useShareableWidget } from 'api/v1/projects/dashboard';

// NOTE: utils
import { formattedDate } from 'utils/date-handler';
// NOTE: assets
import { exportAsPDF, exportAsPNG } from 'utils/file-handler';

import dots from 'assets/threeDots.svg';

// NOTE: styles
import style from './style.module.scss';

const Index = () => {
  const componentRef = useRef();
  const { toastError } = useToaster();
  const { control } = useForm();
  const today = useMemo(() => new Date(), []);
  const [more, setMore] = useState({ open: false, view: '' });
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [type, setType] = useState({
    open: false,
    view: 'This Week',
    values: {
      start: startOfWeek(today),
      end: endOfWeek(today),
    },
  });
  const [_bugsReportedData, setBugsReportedData] = useState({});

  const link = useMemo(() => window.location.origin + window.location.pathname, []);

  const { mutateAsync: _getWidgetData } = useShareableWidget();

  const getData = async () => {
    try {
      const res = await _getWidgetData({
        link: link,
        startDate: formattedDate(type?.values?.start, 'yyyy-MM-dd'),
        endDate: formattedDate(type?.values?.end, 'yyyy-MM-dd'),
        timeZone: userTimeZone,
      });
      setBugsReportedData(res);
    } catch (e) {
      toastError(e);
    }
  };

  useEffect(() => {
    type?.values?.start && type?.values?.end && getData();
  }, [type?.values]);

  const downloadHandler = (type) => {
    if (type === 'PNG') {
      exportAsPNG(componentRef);
    }

    if (type === 'PDF') {
      exportAsPDF(componentRef);
    }
  };

  const menu = [
    {
      title: 'This Week',
      click: () => {
        setType((pre) => ({
          ...pre,
          open: false,
          view: 'This Week',
          values: {
            start: startOfWeek(today),
            end: endOfWeek(today),
          },
        }));
      },
    },
    {
      title: 'Last Week',
      click: () => {
        setType((pre) => ({
          ...pre,
          open: false,
          view: 'Last Week',
          values: {
            start: startOfWeek(subWeeks(today, 1)),
            end: endOfWeek(subWeeks(today, 1)),
          },
        }));
      },
    },
    {
      title: 'This Month',
      click: () => {
        setType((pre) => ({
          ...pre,
          open: false,
          view: 'This Month',
          values: {
            start: startOfMonth(today),
            end: endOfMonth(today),
          },
        }));
      },
    },
    {
      title: 'Last Month',
      click: () => {
        setType((pre) => ({
          ...pre,
          open: false,
          view: 'Last Month',
          values: {
            start: startOfMonth(subMonths(today, 1)),
            end: endOfMonth(subMonths(today, 1)),
          },
        }));
      },
    },
    {
      title: 'Range',
      click: () => {
        setType((pre) => ({
          ...pre,
          open: false,
          view: 'Range',
        }));
      },
    },
  ];

  const menu2 = [
    {
      title: 'Download as',
      click: () => {
        setMore((pre) => ({
          ...pre,
          view: 'Download as',
        }));
      },
      subMenu: [
        {
          title: 'PDF',
          click: () => {
            setMore(() => ({ open: false, view: '' }));
            _.delay(() => downloadHandler('PDF'), 2000, 'PDF download');
          },
        },
        {
          title: 'PNG',
          click: () => {
            setMore(() => ({ open: false, view: '' }));
            _.delay(() => downloadHandler('PNG'), 2000, 'PNG download');
          },
        },
      ],
    },
  ];

  const handleTypeUpdate = useCallback(() => {
    setType((prevType) => ({ ...prevType, open: true }));
  }, []);

  const handleMoreUpdate = useCallback(() => {
    setMore((prevMore) => ({ ...prevMore, open: true }));
  }, []);

  const handleTypeClose = useCallback(() => {
    setType((prevType) => ({ ...prevType, open: false }));
  }, []);

  const handleMoreClose = useCallback(() => {
    setMore((prevMore) => ({ ...prevMore, open: false, view: '' }));
  }, []);

  return (
    <div className={`${style.mainWrapper} `}>
      <div className={`${style.main} `} ref={componentRef}>
        <div className={style.header}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              position: 'relative',
            }}
          >
            <h2>Bugs Reported</h2>
          </div>

          <div
            style={{
              display: 'flex',

              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              {type?.view === 'Range' && (
                <DateRange
                  handleChange={(e) => {
                    const [start, end] = e;
                    setType((pre) => ({
                      ...pre,
                      values: {
                        start,
                        end,
                      },
                    }));
                  }}
                  startDate={type?.view === 'Range' && type?.values?.start}
                  endDate={type?.view === 'Range' && type?.values?.end}
                  placeholder={'Select'}
                  name={'Range'}
                  control={control}
                />
              )}

              <div className={style.day} onClick={handleTypeUpdate}>
                {type?.view}
              </div>

              {type?.open && (
                <div className={style.menuDiv}>
                  <Menu menu={menu} active={style.active} />
                </div>
              )}
            </div>

            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <img src={dots} onClick={handleMoreUpdate} alt="" />

              {more?.open && (
                <div className={style.menuDiv}>
                  <Menu menu={menu2} active={style.active} />
                </div>
              )}
              {more?.view === 'Download as' && (
                <div className={style.menuDiv2}>
                  <Menu menu={menu2.find((x) => x.title === more?.view).subMenu} active={style.active} />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={style.chartMain}>
          <LineChart
            className={style.chart}
            chartOptions={{
              plugins: {
                legend: {
                  labels: {
                    usePointStyle: true,
                    boxWidth: 10, // NOTE: Set the width of the legend item (square)
                    boxHeight: 10,
                  },
                },
              },
            }}
            chartData={{
              labels: _bugsReportedData?.bugsReportedData?.map((x) => x.date),
              datasets: [
                {
                  label: 'Open',
                  data: _bugsReportedData?.bugsReportedData?.map((x) => x.Open),
                  fill: false,
                  borderColor: '#F96E6E',
                  tension: 0.4,
                  backgroundColor: '#F96E6E',
                },
                {
                  label: 'Closed',
                  data: _bugsReportedData?.bugsReportedData?.map((x) => x.Closed),
                  fill: false,
                  borderColor: '#34C369',
                  tension: 0.4,
                  backgroundColor: '#34C369',
                },
                {
                  label: 'Reproducible',
                  data: _bugsReportedData?.bugsReportedData?.map((x) => x.Reproducible),
                  fill: false,
                  borderColor: '#B79C11',
                  tension: 0.4,
                  backgroundColor: '#B79C11',
                },
                {
                  label: 'Need To Discuss',
                  data: _bugsReportedData?.bugsReportedData?.map((x) => x['Need To Discuss']),
                  fill: false,
                  borderColor: '#11103D',
                  tension: 0.4,
                  backgroundColor: '#11103D',
                },
                {
                  label: 'Blocked',
                  data: _bugsReportedData?.bugsReportedData?.map((x) => x.Blocked),
                  fill: false,
                  borderColor: ' #F80101',
                  tension: 0.4,
                  backgroundColor: '#F80101',
                },
              ],
            }}
          />
        </div>
        {type?.open && <div className={style.backdropDiv} onClick={handleTypeClose}></div>}
        {more?.open && <div className={style.backdropDiv} onClick={handleMoreClose}></div>}
      </div>
    </div>
  );
};

export default Index;
