import { useCallback, useEffect, useMemo, useState } from 'react';

import { useCaptureContext } from 'context/capture-context';

import GeneralInfo from 'pages/captures/view-capture/general-info';

import Tabs from 'components/tabs';
import Icon from 'components/icon/themed-icon';
import Tooltip from 'components/tooltip';

import { useSearch } from 'hooks/use-search';

import Consoles from './consoles';
import Actions from './actions';
import Networks from './networks';
import Comments from './comments';
import style from './style.module.scss';

const DevtoolsInfo = ({
  consoleData,
  networkData,
  actionData,
  check,
  isMobileView,
  userInfo,
  currentTabUrl,
  withinTabTitle,
}) => {
  const { setChecId, playedSecond } = useCaptureContext();

  const [onlyShowErrors, setOnlyShowErrors] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [scrollToRight, setScrollToRight] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [withinTabCurrentURL, setWithInTabCurrentURL] = useState('');

  useEffect(() => {
    const eventToLog = actionData?.find(
      (action) => action?.event === 'navigate' && Math.round(action?.second) === playedSecond,
    );

    if (eventToLog) {
      setWithInTabCurrentURL(eventToLog?.navigateTo);
    }
  }, [actionData, playedSecond]);

  const copyText = useCallback(() => {
    navigator.clipboard
      .writeText(currentTabUrl)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1000);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  }, [setIsCopied, currentTabUrl]);

  const toggleShowErrors = useCallback(() => {
    setOnlyShowErrors(!onlyShowErrors);
  }, [onlyShowErrors]);

  const tabData = useMemo(() => {
    if (isMobileView) {
      return ['', consoleData || '', networkData || '', actionData || '', ''];
    } else {
      return [consoleData || '', networkData || '', actionData || '', ''];
    }
  }, [isMobileView, consoleData, networkData, actionData]);
  useEffect(() => {
    setChecId(check?._id);
  }, [check, setChecId]);

  const { searchTerm, handleSearch, filteredData } = useSearch(tabData[activeTab]);

  const pages = useMemo(() => {
    const commonTabs = [
      {
        id: 0,
        tabTitle: 'General Info',
        content: <GeneralInfo generalInfo={check} userInfo={userInfo} />,
      },
      {
        id: 1,
        tabTitle: 'Console',
        content: <Consoles consoles={filteredData ? filteredData : consoleData} />,
      },
      {
        id: 2,
        tabTitle: 'Network',
        content: (
          <Networks
            isMobileView={isMobileView}
            checkId={check?._id}
            network={filteredData ? filteredData : networkData}
            onlyShowErrors={onlyShowErrors}
          />
        ),
      },
      {
        id: 3,
        tabTitle: 'Actions',
        content: <Actions actions={filteredData ? filteredData : actionData} />,
      },
      {
        id: 4,
        tabTitle: 'Comments',
        content: <Comments noHeader={'asd'} check={check} />,
      },
    ];

    return isMobileView ? commonTabs : commonTabs?.slice(1);
  }, [filteredData, consoleData, networkData, actionData, onlyShowErrors, isMobileView, check, userInfo]);

  const getSearchMode = () => {
    if (isMobileView) {
      if (activeTab === 0 || activeTab === 4) {
        return false;
      } else {
        return true;
      }
    } else {
      if (activeTab === 3) {
        return false;
      } else {
        return true;
      }
    }
  };

  const handleScrollToRight = useCallback(() => {
    setScrollToRight(true);
  }, [setScrollToRight]);

  return (
    <div>
      <div className={style.devtools_info_outer_container}>
        {currentTabUrl && (
          <div className={style.current_site_url_container}>
            <p className={style.current_site_url_container_heading}>Current Site URL</p>
            <Tooltip
              position={'left'}
              tooltipStyle={{ bottom: '-150%', left: '0%', color: '#fff' }}
              tooltip={isCopied ? 'copied!' : 'copy'}
              adjustableWidth={style.adjustable_width}
            >
              <p className={style.current_site_url_container_content} onClick={copyText}>
                {withinTabCurrentURL ? withinTabCurrentURL : currentTabUrl}
              </p>
            </Tooltip>
          </div>
        )}
        <p>{withinTabTitle}</p>
      </div>
      <div className={style.tabWrapper}>
        <div className={style.relative}>
          <div className={style.scrollRightButton} onClick={handleScrollToRight}>
            <Icon name={'ArrowHeadRight'} />
          </div>
        </div>
        <Tabs
          searchTerm={searchTerm}
          setSearchTerm={handleSearch}
          searchMode={getSearchMode()}
          checkbox={isMobileView ? activeTab === 2 : activeTab === 1}
          pages={pages}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          customClass={style.tab_title_custom}
          customActive={undefined}
          hadnleCheckBoxClick={toggleShowErrors}
          textFieldContainerStyle={true}
          isMobileView={isMobileView}
          scrollToRight={scrollToRight}
          setScrollToRight={setScrollToRight}
        />
      </div>
    </div>
  );
};

export default DevtoolsInfo;
