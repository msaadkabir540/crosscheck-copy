import { useCallback, useEffect, useRef, useState } from 'react';

import { useForm } from 'react-hook-form';
// NOTE: comonents
import _ from 'lodash';

import { useAppContext } from 'context/app-context';

import Menu from 'components/menu';
import Chart from 'components/chart';
// NOTE: hooks
// NOTE: utils
import Loader from 'components/loader';
import Button from 'components/button';
import Icon from 'components/icon/themed-icon';

import { formattedDate } from 'utils/date-handler';
import { exportAsPDF, exportAsPNG } from 'utils/file-handler';

// NOTE: css
import style from './bugs-status.module.scss';
import ShareModal from './modals/share-modal';
import ExpandModal from './modals/expand-modal';
import FiltersModal from './modals/filters-modal';

const BugsStatus = ({
  expanded,
  modalMode,
  isLoading,
  handleClose,
  projectId,
  statusData,
  setFilters,
  initialFilter,
}) => {
  const componentRef = useRef();
  const { control, reset, watch, setValue } = useForm();
  const { userDetails } = useAppContext();
  const [more, setMore] = useState({ open: false, view: '' });
  const [shareModal, setShareModal] = useState(false);
  const [expandModal, setExpandModal] = useState(false);
  const [filtersModal, setFiltersModal] = useState(false);
  const [filtersCount, setFiltersCount] = useState(0);
  const [chartData, setChartData] = useState({});

  const downloadHandler = (type) => {
    if (type === 'PNG') {
      exportAsPNG(componentRef);
    }

    if (type === 'PDF') {
      exportAsPDF(componentRef);
    }
  };

  useEffect(() => {
    const data = {
      datasets: [
        {
          // NOTE: their arrangement is important for colors to match
          data: [
            statusData?.openBugs,
            statusData?.closedBugs,
            statusData?.reproducibleBugs,
            statusData?.needToDiscussBugs,
            statusData?.blockedBugs,
          ],
          backgroundColor: ['#F96E6E', '#34C369', '#B79C11', '#11103D', '#F80101'],
          hoverBackgroundColor: ['#F96E6E', '#34C369', '#B79C11', '#11103D', '#F80101'],
        },
      ],
      labels: ['Open ', 'Closed', 'Reproducible', 'Need to Discuss', 'Blocked'],
    };

    setChartData(data);
  }, [statusData]);

  // NOTE: onFilter Apply
  const onFilterApply = _.debounce(() => {
    setFilters((pre) => ({
      ...pre,
      page: 1,
      ...(watch('reportedAt') &&
        watch('reportedAt.start') &&
        watch('reportedAt.end') && {
          reportedAt: {
            start: formattedDate(watch('reportedAt.start'), 'yyyy-MM-dd'),
            end: formattedDate(watch('reportedAt.end'), 'yyyy-MM-dd'),
          },
        }),
      ...(watch('milestones') && { milestones: watch('milestones') || [] }),
      ...(watch('features') && { features: watch('features') || [] }),
      ...(watch('assignedTo') && { assignedTo: watch('assignedTo') || [] }),
      ...(watch('testingType') && { testingType: watch('testingType') || [] }),
      ...(watch('bugType') && { bugType: watch('bugType') || [] }),
      ...(watch('developers') && { developers: watch('developers') || [] }),
      ...(watch('reportedBy') && { reportedBy: watch('reportedBy') || [] }),
      ...(watch('severity') && { severity: watch('severity') || [] }),
      ...(watch('assignedTo') && { assignedTo: watch('assignedTo') || [] }),
    }));
    countAppliedFilters();
    setFiltersModal(false);
  }, 1000);

  const countAppliedFilters = () => {
    let count = 0;

    if (
      watch('reportedAt')?.start !== null &&
      watch('reportedAt')?.start !== undefined &&
      watch('reportedAt')?.start !== ''
    ) {
      count++;
    }

    if (watch('milestones')?.length > 0) {
      count++;
    }

    if (watch('features')?.length > 0) {
      count++;
    }

    if (watch('testingType')?.length > 0) {
      count++;
    }

    if (watch('bugType')?.length > 0) {
      count++;
    }

    if (watch('developers')?.length > 0) {
      count++;
    }

    if (watch('assignedTo')?.length > 0) {
      count++;
    }

    if (watch('reportedBy')?.length > 0) {
      count++;
    }

    if (watch('status')?.length > 0) {
      count++;
    }

    if (watch('severity')?.length > 0) {
      count++;
    }

    return setFiltersCount(count);
  };

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

  const handleOpenFiltersModal = useCallback(() => {
    setFiltersModal(true);
  }, [setFiltersModal]);

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

  const handleSetMoreClosed = useCallback(() => {
    setMore(() => ({ open: false, view: '' }));
  }, [setMore]);

  const handleCloseShareModal = useCallback(() => {
    setShareModal(false);
  }, [setShareModal]);

  const handleCloseExpandModal = useCallback(() => {
    setExpandModal(false);
  }, [setExpandModal]);

  const handleCloseFiltersModal = useCallback(() => {
    setFiltersModal(false);
  }, [setFiltersModal]);

  const handleResetFilters = useCallback(() => {
    reset({ ...initialFilter });
    setFiltersCount(0);
    setFilters(() => ({ ...initialFilter }));
  }, [reset, initialFilter, setFiltersCount, setFilters]);

  return (
    <div className={`${style.main} ${expanded && style.noBorder}`} ref={componentRef}>
      <div className={style.header}>
        <div className={style.titleClass}>
          <h2>Bugs Status</h2>
        </div>

        <div className={style.filterWrapper}>
          <div className={style.filterBtns}>
            {!modalMode && (
              <Button
                text={`Filters ${filtersCount ? `(${filtersCount})` : ''}`}
                btnClass={filtersCount > 0 ? style.filterBtnActive : style.filterBtn}
                handleClick={handleOpenFiltersModal}
              />
            )}
          </div>
          {!modalMode && (
            <div onClick={handleToggleExpand}>
              <Icon name={'expand'} iconClass={style.icon} />
            </div>
          )}
          <div className={style.invertIcon}>
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
        {isLoading ? (
          <Loader className={style.loaderHeight} />
        ) : (
          <>
            <Chart className={style.chart} type="doughnut" chartOptions={chartOptions} chartData={chartData} />

            {statusData?.allBugs ? (
              <span className={style.totalText}>Total Bugs: {statusData?.allBugs}</span>
            ) : (
              <span className={style.totalText}>No data found</span>
            )}
          </>
        )}
      </div>
      {more?.open && <div className={style.backdropDiv} onClick={handleSetMoreClosed}></div>}

      {shareModal && <ShareModal open={shareModal} setOpen={handleCloseShareModal} />}
      {expandModal && (
        <ExpandModal
          open={expandModal}
          setOpen={handleCloseExpandModal}
          className={style.modal}
          statusData={statusData}
        />
      )}
      {filtersModal && (
        <FiltersModal
          projectId={projectId}
          open={filtersModal}
          setOpen={handleCloseFiltersModal}
          {...{
            control,
            watch,
            setValue,
            reset: handleResetFilters,
          }}
          onFilterApply={onFilterApply}
        />
      )}
    </div>
  );
};

export default BugsStatus;

const chartOptions = {
  cutout: '40%',
  plugins: {
    legend: {
      labels: {
        usePointStyle: true,
        boxWidth: 10, // NOTE: Set the width of the legend item (square)
        boxHeight: 10,
      },
    },
  },
};
