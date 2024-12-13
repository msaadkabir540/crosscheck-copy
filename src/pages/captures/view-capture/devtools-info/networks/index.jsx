import { useCallback, useEffect, useMemo, useState } from 'react';

import { useCaptureContext } from 'context/capture-context';

import FilterTag from 'components/capture-components/filter-tags';
import ResizableTable from 'components/table';

import NoDataIcon from 'assets/no-data-icon';

import style from './style.module.scss';

const Networks = ({ network, onlyShowErrors, checkId, isMobileView }) => {
  const { setClickedPlayedSecond } = useCaptureContext();

  const [activeMultiTag, setActiveMultiTag] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    setClickedPlayedSecond(currentTime);
  }, [currentTime, setClickedPlayedSecond]);

  const createTableData = useCallback(
    (data) => {
      return (
        data
          ?.map((x) => ({
            second: Math.round(x.second * 2) / 2,
            name: x.url ? x.url.split('/')[x.url.split('/').length - 1] : '-',
            status: x?.statusCode ? x?.statusCode : '-',
            method: x?.method ? x?.method : '-',
            type: x?.type ? x?.type : '-',
            initiator: x?.initiator ? x?.initiator : '-',
            size: '29 KB',
            item: x,
          }))
          ?.filter((item) =>
            onlyShowErrors ? String(item.status).startsWith('4') || String(item.status).startsWith('5') : true,
          ) || []
      );
    },
    [onlyShowErrors],
  );

  const specifiedTypes = ['xmlhttprequest', 'document', 'script', 'stylesheet', 'font', 'image', 'web socket', 'media'];

  const otherItems = network?.filter((obj) => !specifiedTypes.includes(obj?.type));

  const handleCurrentTime = useCallback((e) => {
    setCurrentTime(e);
  }, []);

  const multiTagsPages = useMemo(() => {
    if (!network || Object.keys(network).length === 0) {
      return [];
    }

    return [
      {
        id: 0,
        text: 'All',
        content: (
          <div>
            <ResizableTable
              isMobileView={isMobileView}
              checkId={checkId}
              onIconClick={handleCurrentTime}
              customBorderStyle={true}
              columns={columns}
              data={createTableData(network, 'All')}
            />
          </div>
        ),
      },
      {
        id: 1,
        text: 'Fetch/XHR',
        content: (
          <div>
            <ResizableTable
              isMobileView={isMobileView}
              checkId={checkId}
              onIconClick={handleCurrentTime}
              customBorderStyle={true}
              columns={columns}
              data={createTableData(network.filter((obj) => obj.type === 'xmlhttprequest'))}
            />
          </div>
        ),
      },
      {
        id: 2,
        text: 'Doc',
        content: (
          <div>
            <ResizableTable
              isMobileView={isMobileView}
              checkId={checkId}
              onIconClick={handleCurrentTime}
              customBorderStyle={true}
              columns={columns}
              data={createTableData(network.filter((obj) => obj.type === 'document' || obj.type === 'main_frame'))}
            />
          </div>
        ),
      },
      {
        id: 3,
        text: 'JS',
        content: (
          <div>
            <ResizableTable
              isMobileView={isMobileView}
              checkId={checkId}
              onIconClick={handleCurrentTime}
              customBorderStyle={true}
              columns={columns}
              data={createTableData(network.filter((obj) => obj.type === 'script' || obj.type === 'javascript'))}
            />
          </div>
        ),
      },
      {
        id: 4,
        text: 'CSS',
        content: (
          <div>
            <ResizableTable
              isMobileView={isMobileView}
              checkId={checkId}
              onIconClick={handleCurrentTime}
              customBorderStyle={true}
              columns={columns}
              data={createTableData(network.filter((obj) => obj.type === 'stylesheet'))}
            />
          </div>
        ),
      },
      {
        id: 5,
        text: 'Font',
        content: (
          <div>
            <ResizableTable
              isMobileView={isMobileView}
              checkId={checkId}
              onIconClick={handleCurrentTime}
              customBorderStyle={true}
              columns={columns}
              data={createTableData(network.filter((obj) => obj.type === 'font'))}
            />
          </div>
        ),
      },
      {
        id: 6,
        text: 'Img',
        content: (
          <div>
            <ResizableTable
              isMobileView={isMobileView}
              checkId={checkId}
              onIconClick={handleCurrentTime}
              customBorderStyle={true}
              columns={columns}
              data={createTableData(network.filter((obj) => obj.type === 'image'))}
            />
          </div>
        ),
      },
      {
        id: 7,
        text: 'WS',
        content: (
          <div>
            <ResizableTable
              isMobileView={isMobileView}
              checkId={checkId}
              onIconClick={handleCurrentTime}
              customBorderStyle={true}
              columns={columns}
              data={createTableData(network.filter((obj) => obj.type === 'web socket'))}
            />
          </div>
        ),
      },
      {
        id: 8,
        text: 'Other',
        content: (
          <div>
            <ResizableTable
              isMobileView={isMobileView}
              checkId={checkId}
              onIconClick={handleCurrentTime}
              customBorderStyle={true}
              columns={columns}
              data={createTableData(otherItems)}
            />
          </div>
        ),
      },
      {
        id: 9,
        text: 'Media',
        content: (
          <div>
            <ResizableTable
              isMobileView={isMobileView}
              checkId={checkId}
              onIconClick={handleCurrentTime}
              customBorderStyle={true}
              columns={columns}
              data={createTableData(network.filter((obj) => obj.type === 'media'))}
            />
          </div>
        ),
      },
    ];
  }, [network, createTableData, checkId, isMobileView, otherItems, handleCurrentTime]);

  return !network || Object.keys(network).length === 0 ? (
    <div className={style.no_data_icon_container}>
      {' '}
      <NoDataIcon />
    </div>
  ) : (
    <div className={style.filter_tag_container}>
      <FilterTag
        multiMode
        pages={multiTagsPages}
        activeTab={activeMultiTag}
        setActiveTab={setActiveMultiTag}
        icons={undefined}
      />
    </div>
  );
};

export default Networks;

const columns = [
  { id: 'name', title: 'Name' },
  { id: 'status', title: 'Status' },
  { id: 'method', title: 'Method' },
  { id: 'type', title: 'Type' },
  { id: 'initiator', title: 'Initiator' },
];
