import { useCallback, useRef, useState } from 'react';

import { useForm } from 'react-hook-form';
// NOTE: comonents
import _ from 'lodash';

import { useAppContext } from 'context/app-context';

import Menu from 'components/menu';
import ValueChart from 'components/value-chart';
import Loader from 'components/loader';
import Button from 'components/button';
import Icon from 'components/icon/themed-icon';

import { formattedDate } from 'utils/date-handler';
import { exportAsPDF, exportAsPNG } from 'utils/file-handler';

// NOTE: css
import style from './bugs-severity.module.scss';
import ShareModal from './modals/share-modal';
import ExpandModal from './modals/expand-modal';
import FiltersModal from './modals/filters-modal';

const BugsSeverity = ({
  isLoading,
  data,
  projectId,
  expanded,
  handleClose,
  setBugsSeverity,
  modalMode,
  setSeverityFilters,
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

  const downloadHandler = useCallback((type) => {
    if (type === 'PNG') {
      exportAsPNG(componentRef);
    }

    if (type === 'PDF') {
      exportAsPDF(componentRef);
    }
  }, []);

  // NOTE: onFilter Apply
  const onFilterApply = _.debounce(() => {
    setBugsSeverity({});
    setSeverityFilters((pre) => ({
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
      ...(watch('developers') && { developers: watch('developers') || [] }),
      ...(watch('bugType') && { bugType: watch('bugType') || [] }),
      ...(watch('status') && { status: watch('status') || [] }),
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

  const handleOpenShareModal = useCallback(() => {
    setShareModal(true);
    setMore((prev) => ({
      ...prev,
      open: false,
      view: 'Shareable Link',
    }));
  }, [setShareModal, setMore]);

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
    setBugsSeverity({});
    setSeverityFilters(() => ({ ...initialFilter }));
  }, [reset, initialFilter, setBugsSeverity, setSeverityFilters]);

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

    userDetails?.activePlan !== 'Free' &&
      !modalMode && {
        title: 'Shareable Link',
        click: handleOpenShareModal,
      },
  ];

  return (
    <div className={`${style.main} ${expanded && style.noBorder}`} ref={componentRef}>
      <div className={style.header}>
        <div className={style.flexH2}>
          <h2>Bugs Severity</h2>
        </div>

        <div className={style.flexWrap}>
          <div className={style.flexInner}>
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
          <div className={style.flexInner}>
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
      {isLoading ? (
        <Loader className={style.loaderHeight} />
      ) : (
        <div className={style.noLoading}>
          {data?.count?.allBugs > 0 ? (
            <ValueChart data={data?.count} percentage={data?.percentage} />
          ) : (
            <span className={style.totalText}>No data found</span>
          )}
        </div>
      )}
      {more?.open && <div className={style.backdropDiv} onClick={handleSetMoreClosed}></div>}

      {shareModal && <ShareModal open={shareModal} setOpen={handleCloseShareModal} />}
      {expandModal && (
        <ExpandModal open={expandModal} setOpen={handleCloseExpandModal} className={style.modal} data={data} />
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

export default BugsSeverity;
