import { useCallback, useEffect, useRef, useState } from 'react';

import { useForm } from 'react-hook-form';
// NOTE: comonents
import _ from 'lodash';

import Menu from 'components/menu';
import Chart from 'components/chart';
// NOTE: hooks
// NOTE: utils
import Loader from 'components/loader';
import Button from 'components/button';
import Icon from 'components/icon/themed-icon';

import { formattedDate } from 'utils/date-handler';
// NOTE: assets
import { exportAsPDF, exportAsPNG } from 'utils/file-handler';

// NOTE: css
import style from './bugs-status.module.scss';
import ExpandModal from './modals/expand-modal';
import FiltersModal from './modals/filters-modal';

const BugsReporter = ({
  name,
  isLoading,
  expanded,
  projectId,
  handleClose,
  modalMode,
  bugsReporter,
  setBugsReporterFilters,
  initialFilter,
  setBugsReporter,
}) => {
  const componentRef = useRef();
  const { control, reset, watch, setValue } = useForm();
  const [more, setMore] = useState({ open: false, view: '' });
  const [expandModal, setExpandModal] = useState(false);
  const [filtersModal, setFiltersModal] = useState(false);
  const [chartData, setChartData] = useState({});
  const [filtersCount, setFiltersCount] = useState(0);

  const downloadHandler = useCallback((type) => {
    if (type === 'PNG') {
      exportAsPNG(componentRef);
    }

    if (type === 'PDF') {
      exportAsPDF(componentRef);
    }
  }, []);

  useEffect(() => {
    const labels = bugsReporter?.map((reporter) => (reporter.developer ? reporter.developer : reporter.reporter));

    const datasets = [
      {
        label: 'Closed',
        backgroundColor: '#34C369',
        borderColor: '#F96E6E00',
        borderWidth: 2,
        data: bugsReporter?.map((reporter) => reporter.closedBugs),
      },
      {
        label: 'Open',
        backgroundColor: '#F96E6E',
        borderColor: '#F96E6E00',
        borderWidth: 2,
        data: bugsReporter?.map((reporter) => reporter.openBugs),
      },

      {
        label: 'Blocked',
        backgroundColor: '#F80101',
        borderColor: '#F96E6E00',
        borderWidth: 2,
        data: bugsReporter?.map((reporter) => reporter.blockedBugs),
      },
      {
        label: 'Reproducible',
        backgroundColor: '#B79C11',
        borderColor: '#F96E6E00',
        borderWidth: 2,
        data: bugsReporter?.map((reporter) => reporter.reproducibleBugs),
      },
      {
        label: 'Need To Discuss',
        backgroundColor: '#11103D',
        borderColor: '#F96E6E00',
        borderWidth: 2,
        data: bugsReporter?.map((reporter) => reporter.needToDiscuss),
      },
    ];

    const data = {
      labels,
      datasets,
    };

    setChartData(data);
  }, [bugsReporter]);

  // NOTE: onFilter Apply
  const onFilterApply = _.debounce(() => {
    setBugsReporter({});
    setBugsReporterFilters((pre) => ({
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
      ...(watch('issueType') && { issueType: watch('issueType') || [] }),
      ...(watch('bugType') && { bugType: watch('bugType') || [] }),
      ...(watch('developers') && { developers: watch('developers') || [] }),
      ...(watch('status') && { status: watch('status') || [] }),
      ...(watch('severity') && { severity: watch('severity') || [] }),
      ...(watch('reportedBy') && { reportedBy: watch('reportedBy') || [] }),
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

    if (watch('issueType')?.length > 0) {
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

  const handleSetMoreViewDownload = useCallback(() => {
    setMore((prev) => ({
      ...prev,
      view: 'Download as',
    }));
  }, [setMore]);

  const handleMoreCloseAndDownload = useCallback(() => {
    setMore(() => ({ open: false, view: '' }));
    _.delay(() => downloadHandler('PDF'), 2000, 'PDF download');
  }, [setMore, downloadHandler]);

  const handleMoreCloseAndDownloadPNG = useCallback(() => {
    setMore(() => ({ open: false, view: '' }));
    _.delay(() => downloadHandler('PNG'), 2000, 'PNG download');
  }, [setMore, downloadHandler]);

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

  const handleExpandModalClose = useCallback(() => {
    setExpandModal(false);
  }, [setExpandModal]);

  const handleCloseFiltersModal = useCallback(() => {
    setFiltersModal(false);
  }, [setFiltersModal]);

  const handleResetFilters = useCallback(() => {
    reset({ ...initialFilter });
    setFiltersCount(0);
    setBugsReporter({});
    setBugsReporterFilters(() => ({ ...initialFilter }));
  }, [reset, initialFilter, setFiltersCount, setBugsReporter, setBugsReporterFilters]);

  const menu2 = [
    {
      title: 'Download as',
      click: handleSetMoreViewDownload,
      subMenu: [
        {
          title: 'PDF',
          click: handleMoreCloseAndDownload,
        },
        {
          title: 'PNG',
          click: handleMoreCloseAndDownloadPNG,
        },
      ],
    },
  ];

  return (
    <div className={`${style.main} ${expanded && style.noBorder}`} ref={componentRef}>
      <div className={style.header}>
        <div className={style.headerH2div}>
          <h2>{name ? name : 'Bugs Reporter'}</h2>
        </div>

        <div className={style.headerBtndivWrap}>
          <div className={style.headerBtndiv}>
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
          <div className={style.headerBtndiv}>
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
          <Chart className={style.chart} type="bar" chartOptions={chartOptions} chartData={chartData} />
        )}
      </div>
      {more?.open && <div className={style.backdropDiv} onClick={handleSetMoreClosed}></div>}

      {expandModal && (
        <ExpandModal
          name={name ? name : 'Bugs Reporter'}
          open={expandModal}
          setOpen={handleExpandModalClose}
          className={style.modal}
          bugsReporter={bugsReporter}
        />
      )}
      {filtersModal && (
        <FiltersModal
          projectId={projectId}
          devType={name === `Developer's Bugs` && true}
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

export default BugsReporter;

const chartOptions = {
  indexAxis: 'y',
  maintainAspectRatio: false,
  aspectRatio: 1,
  plugins: {
    legend: {
      labels: {
        usePointStyle: true,
        boxWidth: 10,
        boxHeight: 10,
      },
    },
  },
  scales: {
    x: {
      stacked: true,

      grid: {
        display: false,
        drawBorder: false,
      },
    },
    y: {
      stacked: true,
      ticks: {},
      grid: {
        display: false,

        drawBorder: false,
      },
    },
  },
};
