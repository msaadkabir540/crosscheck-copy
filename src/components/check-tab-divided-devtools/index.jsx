import { useMemo, useState, useEffect } from 'react';

import { useCaptureContext } from 'context/capture-context';

import DevtoolsInfo from 'pages/captures/view-capture/devtools-info';

import Tabs from '../tabs';

const CheckTabDividedDevtools = ({ check, isMobileView }) => {
  const { playedSecond } = useCaptureContext();
  const [activeTab, setActiveTab] = useState(0);
  const [withinTabTitle, setWithinTabTitle] = useState('');
  const [currentTab, setCurrentTab] = useState([]);
  const [navigateActions, setNavigateActions] = useState([]);
  const [tabTitles, setTabTitles] = useState({});
  const [tabUrls, setTabUrls] = useState({});

  const { devtools } = check;

  useEffect(() => {
    if (devtools) {
      const allNavigateActions = Object.values(devtools)
        .flatMap((tab) => tab?.actions || [])
        .filter((action) => action?.event === 'navigate');

      setNavigateActions(allNavigateActions);
    }
  }, [devtools]);

  useEffect(() => {
    navigateActions.forEach((action) => {
      if (Math.round(action?.second) === Math.round(playedSecond)) {
        const currentTabId = Object.keys(devtools)[activeTab];

        if (currentTabId && action?.tabId === parseInt(currentTabId)) {
          setTabTitles((prevTitles) => ({
            ...prevTitles,
            [currentTabId]: action?.tabTitle || 'no name',
          }));
          setTabUrls((prevTitles) => ({
            ...prevTitles,
            [currentTabId]: action?.tabURL || 'no url',
          }));
        }
      }
    });
  }, [playedSecond, navigateActions, activeTab, devtools]);

  useEffect(() => {
    const collectAllActions = () => {
      const allActions = Object.values(devtools)
        .flatMap((tab) => tab?.actions || [])
        .filter((action) => action?.event === 'tabSwitch' && Math.round(action?.second) === Math.round(playedSecond));

      if (allActions) {
        setCurrentTab(allActions.map((action) => action?.tabId));
      }
    };

    collectAllActions();
  }, [devtools, playedSecond]);

  const commonTabs = useMemo(() => {
    if (!devtools) return [];

    return Object.keys(devtools)?.map((key) => {
      const tabInfo = devtools[key]?.tabInfo;
      const firstTab = tabInfo ? Object.values(tabInfo)[0] : null;

      return {
        id: parseInt(key),
        tabTitle: tabTitles[key] || firstTab?.title || 'no name',
        content: (
          <div key={key}>
            {firstTab && (
              <DevtoolsInfo
                setWithinTabTitle={setWithinTabTitle}
                withinTabTitle={withinTabTitle}
                userInfo={check?.userId}
                isMobileView={isMobileView}
                check={check}
                currentTabUrl={tabUrls[key] ? tabUrls[key] : firstTab?.url || ''}
                consoleData={devtools[key]?.consoles}
                networkData={devtools[key]?.networks}
                actionData={devtools[key]?.actions}
              />
            )}
          </div>
        ),
      };
    });
  }, [check, devtools, isMobileView, withinTabTitle, tabTitles, tabUrls]);

  useEffect(() => {
    if (currentTab?.length > 0) {
      const tabIdToSwitch = parseInt(currentTab[0]);

      const foundIndex = commonTabs?.findIndex((tab) => {
        return tab?.id === tabIdToSwitch;
      });

      if (foundIndex !== -1) {
        setActiveTab(foundIndex);
      }
    }
  }, [currentTab, commonTabs]);

  return (
    <div>
      <Tabs
        searchTerm={undefined}
        setSearchTerm={undefined}
        searchMode={false}
        checkbox={false}
        pages={commonTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        customClass={undefined}
        customActive={undefined}
        hadnleCheckBoxClick={undefined}
        textFieldContainerStyle={true}
        isMobileView={isMobileView}
        styleSecondary={true}
      />
    </div>
  );
};

export default CheckTabDividedDevtools;
