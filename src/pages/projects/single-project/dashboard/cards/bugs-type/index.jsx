import { useRef, useState } from 'react';

import { useForm } from 'react-hook-form';
// NOTE: comonents
import _ from 'lodash';

import { useAppContext } from 'context/app-context';

import Menu from 'components/menu';
// NOTE: hooks
// NOTE: utils
import ValuePaletteFilters from 'components/value-palette-with-filters';
import Button from 'components/button';
import Loader from 'components/loader';
import Icon from 'components/icon/themed-icon';

import { formattedDate } from 'utils/date-handler';
import { exportAsPDF, exportAsPNG } from 'utils/file-handler';

// NOTE: css
import style from './bugs-type.module.scss';
import ShareModal from './modals/share-modal';
import ExpandModal from './modals/expand-modal';
import FiltersModal from './modals/filters-modal';


const BugsType = ({
  data,
  projectId,
  isLoading,
  expanded,
  handleClose,
  setTypesFilters,
  modalMode,
  initialFilter,
  setBugsTypes,
}) => {
  const componentRef = useRef();
  const { control, reset, watch, setValue } = useForm();
  const { userDetails } = useAppContext();
  const [more, setMore] = useState({ open: false, view: '' });
  const [shareModal, setShareModal] = useState(false);
  const [expandModal, setExpandModal] = useState(false);
  const [filtersCount, setFiltersCount] = useState(0);
  const [filtersModal, setFiltersModal] = useState(false);

  const downloadHandler = (type) => {
    if (type === 'PNG') {
      exportAsPNG(componentRef);
    }

    if (type === 'PDF') {
      exportAsPDF(componentRef);
    }
  };

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

    if (watch('assignedTo')?.length > 0) {
      count++;
    }

    if (watch('testingType')?.length > 0) {
      count++;
    }

    if (watch('issueType')?.length > 0) {
      count++;
    }

    if (watch('developers')?.length > 0) {
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

  const resetHandler = () => {
    setValue('reportedAt', {});
    setValue('milestones', []);
    setValue('features', []);
    setValue('assignedTo', []);
    setValue('testingType', []);
    setValue('issueType', []);
    setValue('developers', []);
    setValue('reportedBy', []);
    setValue('status', []);
    setValue('severity', []);
  };

  // NOTE: onFilter Apply
  const onFilterApply = _.debounce(() => {
    setBugsTypes({});
    setTypesFilters((pre) => ({
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
      ...(watch('status') && { status: watch('status') || [] }),
      ...(watch('reportedBy') && { reportedBy: watch('reportedBy') || [] }),
      ...(watch('severity') && { severity: watch('severity') || [] }),
    }));
    countAppliedFilters();
    setFiltersModal(false);
  }, 1000);

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

  return (
    <div className={`${style.main} ${expanded && style.noBorder}`} ref={componentRef}>
      <div className={style.header}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            position: 'relative',
          }}
        >
          <h2>Bugs Types</h2>
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
            {!modalMode && (
              <Button
                text={`Filters ${filtersCount ? `(${filtersCount})` : ''}`}
                btnClass={filtersCount > 0 ? style.filterBtnActive : style.filterBtn}
                handleClick={() => {
                  setFiltersModal(true);
                }}
              />
            )}
          </div>
          {!modalMode && (
            <div onClick={!expanded ? () => setExpandModal(true) : () => handleClose()}>
              <Icon name={'expand'} iconClass={style.icon} />
            </div>
          )}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div onClick={() => setMore((pre) => ({ ...pre, open: true }))}>
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
        <div style={{ margin: '20px 10px', height: '100%' }}>
          {data?.count?.allBugs > 0 ? (
            <ValuePaletteFilters data={data?.count} percentage={data?.percentage} />
          ) : (
            <span className={style.totalText}>No data found</span>
          )}
        </div>
      )}
      {more?.open && (
        <div className={style.backdropDiv} onClick={() => setMore(() => ({ open: false, view: '' }))}></div>
      )}

      {shareModal && <ShareModal open={shareModal} setOpen={() => setShareModal(false)} />}
      {expandModal && (
        <ExpandModal open={expandModal} setOpen={() => setExpandModal(false)} className={style.modal} data={data} />
      )}
      {filtersModal && (
        <FiltersModal
          projectId={projectId}
          open={filtersModal}
          setOpen={() => setFiltersModal(false)}
          {...{
            control,
            watch,
            setValue,
            reset: () => {
              resetHandler();
              reset({ ...initialFilter });
              setBugsTypes({});
              setFiltersCount(0);
              setTypesFilters(() => ({ ...initialFilter }));
            },
          }}
          onFilterApply={onFilterApply}
        />
      )}
    </div>
  );
};

export default BugsType;
