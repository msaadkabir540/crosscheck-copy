import { useCallback, useEffect, useState } from 'react';

import { endOfMonth, endOfWeek, startOfMonth, startOfWeek, subMonths, subWeeks } from 'date-fns';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
// NOTE: comonents
import _ from 'lodash';

import { useAppContext } from 'context/app-context';

import Menu from 'components/menu';
import DateRange from 'components/date-range';
import Chart from 'components/chart';
import Loader from 'components/loader';
import Icon from 'components/icon/themed-icon';

import { useBugsReported } from 'api/v1/projects/dashboard';

// NOTE: utils
import { formattedDate } from 'utils/date-handler';

// NOTE: css
import style from './testcase.module.scss';
import ShareModal from './modals/share-modal';
import ExpandModal from './modals/expand-modal';

const TestCaseSummary = ({ downloadHandler, componentRef, expanded, handleClose, modalMode, filters }) => {
  const { id } = useParams();
  const { control } = useForm();
  const { userDetails } = useAppContext();
  const [more, setMore] = useState({ open: false, view: '' });
  const [shareModal, setShareModal] = useState(false);
  const [expandModal, setExpandModal] = useState(false);
  const today = new Date();

  const [type, setType] = useState({
    open: false,
    view: 'This Week',
    values: {
      start: startOfWeek(today),
      end: endOfWeek(today),
    },
  });

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

    userDetails?.activePlan !== 'Free' &&
      !modalMode && {
        title: 'Shareable Link',
        click: () => {
          setShareModal(true);
          setMore((pre) => ({
            ...pre,
            open: false,
            view: 'Shareable Link',
          }));
        },
      },
  ];

  const {
    refetch,
    isLoading: _isLoading,
    data: _bugsReportedData,
  } = useBugsReported({
    id,
    filters: {
      endDate: formattedDate(type?.values?.end, 'yyyy-MM-dd'),
      startDate: formattedDate(type?.values?.start, 'yyyy-MM-dd'),
      ...(filters?.testedVersion && { testedVersion: filters?.testedVersion }),
      ...(filters?.testedEnvironment && { testedEnvironment: filters?.testedEnvironment }),
    },
  });

  const handleSetTypeOpen = useCallback(() => {
    setType((prev) => ({ ...prev, open: true }));
  }, [setType]);

  const handleToggleExpand = useCallback(() => {
    if (!expanded) {
      setExpandModal(true);
    } else {
      handleClose();
    }
  }, [expanded, setExpandModal, handleClose]);

  const handleSetMoreOpen = useCallback(() => {
    setMore((prev) => ({ ...prev, open: true }));
  }, [setMore]);

  const handleSetTypeClose = useCallback(() => {
    setType((prev) => ({ ...prev, open: false }));
  }, [setType]);

  const handleSetMoreClose = useCallback(() => {
    setMore(() => ({ open: false, view: '' }));
  }, [setMore]);

  const handleSetShareModalClose = useCallback(() => {
    setShareModal(false);
  }, [setShareModal]);

  const handleSetExpandModalClose = useCallback(() => {
    setExpandModal(false);
  }, [setExpandModal]);

  const handleDateRangeChange = useCallback((e) => {
    const [start, end] = e;
    setType((pre) => ({
      ...pre,
      values: {
        start,
        end,
      },
    }));
  }, []);

  useEffect(() => {
    refetch();
  }, [filters, refetch]);

  return (
    <div className={`${style.main} ${expanded && style.noBorder}`} ref={componentRef}>
      <div className={style.header}>
        <div className={style.bugTitleClass}>
          <h2>Bugs Reported</h2>
        </div>

        <div className={style.leftClass}>
          <div className={style.dateRangeWrapper}>
            {type?.view === 'Range' && (
              <DateRange
                className={style.dateRange}
                handleChange={handleDateRangeChange}
                startDate={type?.view === 'Range' && type?.values?.start}
                endDate={type?.view === 'Range' && type?.values?.end}
                placeholder={'Select'}
                name={'Range'}
                control={control}
              />
            )}

            {!modalMode && (
              <div className={style.day} onClick={handleSetTypeOpen}>
                {type?.view}
              </div>
            )}

            {type?.open && (
              <div className={style.menuDiv}>
                <Menu menu={menu} active={style.active} />
              </div>
            )}
          </div>
          {!modalMode && (
            <div onClick={handleToggleExpand}>
              <Icon name={'expand'} iconClass={style.icon} />
            </div>
          )}
          <div className={style.invertIconSlass}>
            <div onClick={handleSetMoreOpen}>
              <Icon name={'MoreInvertIcon'} iconClass={style.icon1} />
            </div>

            {more?.open && (
              <div className={style.menuDiv}>
                <Menu
                  menu={menu2?.filter((x) => {
                    return x.title;
                  })}
                  active={style.active}
                />
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
        {_isLoading ? (
          <Loader className={style.loaderHeight} />
        ) : (
          <Chart
            className={style.chart}
            chartOptions={chartOptions}
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
        )}
      </div>
      {type?.open && <div className={style.backdropDiv} onClick={handleSetTypeClose}></div>}
      {more?.open && <div className={style.backdropDiv} onClick={handleSetMoreClose}></div>}

      {shareModal && <ShareModal open={shareModal} setOpen={handleSetShareModalClose} />}
      {expandModal && <ExpandModal open={expandModal} setOpen={handleSetExpandModalClose} className={style.modal} />}
    </div>
  );
};

export default TestCaseSummary;

const chartOptions = {
  plugins: {
    legend: {
      labels: {
        usePointStyle: true,
        boxWidth: 10, // NOTE: Set the width of the legend item (square)
        boxHeight: 10,
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
    },
    y: {
      grid: {
        display: false,

        drawBorder: false,
      },
    },
  },
};
