import { useCallback, useEffect, useMemo, useState } from 'react';

import { useCaptureContext } from 'context/capture-context';

import FilterTag from 'components/capture-components/filter-tags';
import ConsoleItem from 'components/capture-components/console';

import style from './style.module.scss';

const ConsolesTab = ({ consoles }) => {
  const { setClickedPlayedSecond } = useCaptureContext();

  const [currentTime, setCurrentTime] = useState(0);
  const [activeTag, setActiveTag] = useState(0);

  const filteredData = useMemo(() => {
    if (consoles?.length) {
      return consoles.reduce((acc, consoleItem) => {
        acc[consoleItem.type] = acc[consoleItem.type] || [];
        acc[consoleItem.type].push({
          createdAt: consoleItem.createdAt,
          data: consoleItem.data,
          type: consoleItem.type,
          second: consoleItem.second ? consoleItem.second : '1',
        });

        return acc;
      }, {});
    }

    return {};
  }, [consoles]);

  const combinedErrors = useMemo(() => {
    const combined = (filteredData.errors || []).concat(
      filteredData.jsError || [],
      filteredData.unhandledPromiseRejection || [],
      filteredData.onErrors || [],
    );

    return combined.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [filteredData.errors, filteredData.jsError, filteredData.onErrors, filteredData.unhandledPromiseRejection]);

  const combinedLogs = useMemo(() => {
    const combined = (filteredData.logs || []).concat(
      filteredData.asserts || [],
      filteredData.infos || [],
      filteredData.traces || [],
    );

    return combined.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [filteredData.logs, filteredData.asserts, filteredData.infos, filteredData.traces]);

  useEffect(() => {
    setClickedPlayedSecond(currentTime);
  }, [currentTime, setClickedPlayedSecond]);

  const handleCurrentTimeChange = useCallback((e) => {
    setCurrentTime(e);
  }, []);

  const tagsPages = useMemo(() => {
    return [
      {
        id: 0,
        text: 'All',
        type: 'All',
        count: consoles ? consoles?.length : 0,
        content: <ConsoleItem data={consoles} onClickChange={handleCurrentTimeChange} />,
      },
      {
        id: 1,
        text: 'Infos',
        type: 'logs',
        count: combinedLogs ? combinedLogs?.length : 0,
        content: (
          <ConsoleItem
            data={combinedLogs ? combinedLogs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) : []}
            onClickChange={handleCurrentTimeChange}
          />
        ),
      },
      {
        id: 2,
        text: 'Warnings',
        type: 'warns',
        count: filteredData.warns ? filteredData?.warns?.length : 0,
        content: (
          <ConsoleItem
            data={
              filteredData.warns ? filteredData.warns.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) : []
            }
            onClickChange={handleCurrentTimeChange}
          />
        ),
      },
      {
        id: 3,
        text: 'Errors',
        type: 'errors',
        count: combinedErrors ? combinedErrors?.length : 0,
        content: (
          <ConsoleItem
            data={combinedErrors ? combinedErrors?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) : []}
            onClickChange={handleCurrentTimeChange}
          />
        ),
      },
      {
        id: 4,
        text: 'Runtime',
        type: 'onErrors',
        count: filteredData.unhandledPromiseRejection ? filteredData.unhandledPromiseRejection?.length : 0,
        content: (
          <ConsoleItem
            data={
              filteredData.unhandledPromiseRejection
                ? filteredData.unhandledPromiseRejection.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                : []
            }
          />
        ),
      },
    ];
  }, [consoles, filteredData, combinedErrors, combinedLogs, handleCurrentTimeChange]);

  return (
    <div className={style.filter_tag_container}>
      <FilterTag icons={true} pages={tagsPages} activeTab={activeTag} setActiveTab={setActiveTag} multiMode={false} />
    </div>
  );
};

export default ConsolesTab;
