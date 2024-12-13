import { useCallback, useEffect, useMemo, useState } from 'react';

import Icon from 'components/icon/themed-icon';
import Tabs from 'components/tabs';
import GenericTable from 'components/generic-table';
import Loader from 'components/loader';

import ExpandModal from './expand-modal';
import { columnsData } from './helper';
import style from './expandable.module.scss';

const ExpandableTable = ({
  data,
  title,
  expanded,
  maxHeight,
  containerRef,
  activeTab,
  setActiveTab,
  setQaAnalyticsPage,
  _isLoading,
}) => {
  const [expandModal, setExpandModal] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const pages = useMemo(() => {
    const pageData = [
      {
        id: 'blocked',
        tabTitle: `Blocked (${data?.blocked?.totalCount || 0})`,
        content: (
          <div className={`${style.tableWidth} ${style.relativeClass}`}>
            <GenericTable
              id={'blocked'}
              ref={containerRef}
              columns={columnsData({ type: 'Blocked' })}
              dataSource={data?.blocked?.bugs || []}
              height={'calc(100vh - 655px)'}
              classes={{
                test: style.test,
                table: style.table,
                thead: style.thead,
                th: style.th,
                containerClass: style.checkboxContainer,
                tableBody: style.tableRow,
              }}
              isEditMode={true}
            />
            {_isLoading && <Loader tableMode />}
          </div>
        ),
      },
      {
        id: 'needToDiscuss',
        tabTitle: `Need to Discuss (${data?.needToDiscuss?.totalCount || 0})`,
        content: (
          <div className={`${style.tableWidth} ${style.relativeClass}`}>
            <GenericTable
              ref={containerRef}
              id={'needToDiscuss'}
              columns={columnsData({ type: 'Need to discuss' })}
              dataSource={data?.needToDiscuss?.bugs || []}
              height={'calc(100vh - 655px)'}
              classes={{
                test: style.test,
                table: style.table,
                thead: style.thead,
                th: style.th,
                containerClass: style.checkboxContainer,
                tableBody: style.tableRow,
              }}
              isEditMode={true}
            />
            {_isLoading && <Loader tableMode />}
          </div>
        ),
      },
      {
        id: 'reproducible',
        tabTitle: `Reproducible (${data?.reproducible?.totalCount || 0})`,
        content: (
          <div className={`${style.tableWidth} ${style.relativeClass}`}>
            <GenericTable
              ref={containerRef}
              id={'reproducible'}
              columns={columnsData({ type: 'Reproducible' })}
              dataSource={data?.reproducible?.bugs || []}
              height={'calc(100vh - 655px)'}
              classes={{
                test: style.test,
                table: style.table,
                thead: style.thead,
                th: style.th,
                containerClass: style.checkboxContainer,
                tableBody: style.tableRow,
              }}
              isEditMode={true}
            />
            {_isLoading && <Loader tableMode />}
          </div>
        ),
      },
      {
        id: 'open',
        tabTitle: `Opened (${data?.open?.totalCount || 0})`,
        content: (
          <div className={`${style.tableWidth} ${style.relativeClass}`}>
            <GenericTable
              ref={containerRef}
              id={'open'}
              columns={columnsData({ type: 'Opened' })}
              dataSource={data?.open?.bugs || []}
              height={'calc(100vh - 655px)'}
              classes={{
                test: style.test,
                table: style.table,
                thead: style.thead,
                th: style.th,
                containerClass: style.checkboxContainer,
                tableBody: style.tableRow,
              }}
              isEditMode={true}
            />
            {_isLoading && <Loader tableMode />}
          </div>
        ),
      },
    ];

    return pageData.map((page, index) => ({
      ...page,
      content: activeTabIndex === index ? page.content : <></>,
    }));
  }, [data, _isLoading, activeTabIndex, containerRef]);

  useEffect(() => {
    if (pages[activeTabIndex]?.id) {
      setActiveTab(pages[activeTabIndex].id);
      setQaAnalyticsPage(1);
    }
  }, [activeTabIndex, pages, setActiveTab, setQaAnalyticsPage]);

  const handleExpandableOpen = useCallback(() => {
    setExpandModal(true);
  }, []);

  const handleOpen = useCallback(() => setExpandModal(false), []);

  return (
    <div className={style.upcomingDiv} style={{ maxHeight: maxHeight || 'initial' }}>
      <div className={style.upcomingHeader}>
        <span>{title}</span>
        {!expanded && (
          <div onClick={handleExpandableOpen} className={style.expandIconClass}>
            <Icon name={'expand'} height={16} width={16} iconClass={style.icon} />
          </div>
        )}
      </div>
      <div className={style.tabDiv}>
        <Tabs pages={pages?.filter((x) => x?.tabTitle)} activeTab={activeTabIndex} setActiveTab={setActiveTabIndex} />
      </div>

      {expandModal && (
        <ExpandModal
          data={data}
          open={expandModal}
          setOpen={handleOpen}
          className={style.modal}
          title={title}
          {...{
            containerRef,
            activeTab,
            setActiveTab,
            setQaAnalyticsPage,
            _isLoading,
          }}
        />
      )}
    </div>
  );
};

export default ExpandableTable;
