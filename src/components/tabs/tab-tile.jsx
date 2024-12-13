import { useCallback, useEffect } from 'react';

import { useSearchParams } from 'react-router-dom';

import style from './tabs.module.scss';

const TabTitle = ({
  customClass,
  innerRun,
  activeTab,
  index,
  styleSecondary,
  customActive,
  tabTitle,
  setActiveTab,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleClickAction = useCallback(() => {
    setActiveTab(index);

    if (innerRun) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams?.set('activeTab', index);
      setSearchParams(newSearchParams);
    }
  }, [setActiveTab, index, innerRun, searchParams, setSearchParams]);

  useEffect(() => {
    if (innerRun) {
      const activeTabParam = searchParams?.get('activeTab');

      if (activeTabParam !== null) {
        setActiveTab(parseInt(activeTabParam, 10));
      }
    }
  }, [searchParams, setActiveTab, innerRun]);

  return (
    <p
      className={`${style.tabTitle} ${customClass} ${
        activeTab === index ? `${styleSecondary ? style.activeTwo : style.active} ${customActive}` : ''
      }`}
      onClick={handleClickAction}
    >
      {tabTitle}
    </p>
  );
};

export default TabTitle;
