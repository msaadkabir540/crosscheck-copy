import { useCallback, useEffect, useMemo, useState } from 'react';

import { useParams } from 'react-router-dom';

import Button from 'components/button';
import Menu from 'components/menu';
import Icon from 'components/icon/themed-icon';
import ChartPreview from 'components/chart/indexnew.jsx';
import Loader from 'components/loader';

import { useGetWidgetDetailsByDataId } from 'api/v1/custom-dashboard/single-dashboard';

import { keys as _keys } from 'utils/lodash';

import fullPreviewIcon from 'assets/preview.svg';

import style from './style.module.scss';

const Index = ({ item, setDelete, setEditWidget, setFilterActive, isFiltersActive, filters, isSharedWith }) => {
  const { id } = useParams();
  const [openMenu, setOpenMenu] = useState(false);
  const [widgetData, setWidgetData] = useState(false);
  const [populatedData, setPopulatedData] = useState(false);
  const [filterData, setFilterData] = useState({});

  const { mutateAsync: _getWidgetDetails, isLoading } = useGetWidgetDetailsByDataId();

  const menu = useMemo(() => {
    return [
      {
        title: 'Edit',
        compo: (
          <div className={style.editColor}>
            <Icon name={'EditIconGrey'} />
          </div>
        ),
        click: () => {
          setEditWidget(widgetData?._id);
          setOpenMenu(false);
        },
      },

      {
        title: 'Delete',
        compo: (
          <div className={style.editColor}>
            <Icon name={'DelIcon'} />
          </div>
        ),
        click: () => {
          setDelete({ open: true, id: widgetData?._id });
          setOpenMenu(false);
        },
      },
    ];
  }, [openMenu]);

  const widgetDataHandler = useCallback(async () => {
    try {
      const res = await _getWidgetDetails({ id, widgetId: item?._id, body: { filter: filterData } });

      setWidgetData(res?.widget);
      setPopulatedData(res?.populatedData);

      return res;
    } catch (error) {
      console.error(error);

      return {};
    }
  }, [id, item?._id, filterData]);

  useEffect(() => {
    widgetDataHandler();
  }, [id, item?._id, filterData]);

  useEffect(() => {
    if (isFiltersActive?.id === item?._id) {
      setFilterData(filters);
    }
  }, [filters]);

  const filterCount = useMemo(() => {
    return _keys(filterData).length || 0;
  }, [filterData]);

  return (
    <>
      <div className={style.main}>
        {isLoading ? (
          <Loader />
        ) : (
          <div className={style.widgetPreview}>
            <div className={style.widgetTitle}>
              <p className={style.title}>{widgetData?.widgetName}</p>
              <div className={style.widgetActions}>
                <Button
                  type="button"
                  btnClass={`${style.btn}  ${filterCount && style.btnFiltered}`}
                  text={`Filters ${filterCount ? `(${filterCount})` : ''} `}
                  handleClick={() => {
                    setFilterActive({ open: true, id: widgetData._id, type: widgetData.category });
                  }}
                />
                <img src={fullPreviewIcon} />
                {isSharedWith && (
                  <div className={style.buttons}>
                    <div
                      className={style.img}
                      onClick={() => {
                        setOpenMenu(true);
                      }}
                      role="presentation"
                    >
                      <Icon name={'MoreInvertIcon'} />
                    </div>
                    {openMenu && (
                      <div className={style.menuDiv}>
                        <Menu menu={menu} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className={style.chartPreview}>
              <ChartPreview basicData={widgetData} chartData={typeof populatedData === 'object' ? populatedData : []} />
            </div>
          </div>
        )}
      </div>

      {openMenu && <div className={style.backdropDiv} onClick={() => setOpenMenu(false)}></div>}
    </>
  );
};

export default Index;
