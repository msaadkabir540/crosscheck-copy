import { useCallback, useEffect, useRef, useState, Suspense, lazy, useTransition } from 'react';

import TextField from 'components/text-field';
import CheckBox from 'components/checkbox';
import Icon from 'components/icon/themed-icon';

import { generateCURLCommand } from 'utils/file-handler';

import clearIcon from 'assets/cross.svg';
import SearchIcon from 'assets/search.svg';

import style from './tabs.module.scss';
import TabTitle from './tab-tile';
import Loader from '../loader';

const ObjectViewerContent = lazy(() => import('./object-content-viewer'));

const Tabs = ({
  pages,
  innerRun,
  activeTab,
  customClass,
  customActive,
  searchMode,
  setActiveTab,
  setActiveGeneralTab,
  setOpenGeneralInfo,
  cross,
  backBg,
  backBorder,
  searchTerm,
  setSearchTerm,
  checkbox,
  hadnleCheckBoxClick,
  height,
  textFieldContainerStyle,
  noStyle,
  isMobileView,
  styleSecondary = false,
  checkId,
  scrollToRight = false,
  setScrollToRight,
  curlURL,
}) => {
  const tabsContainerRef = useRef(null);
  const [isUrlCopied, setIsUrlCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [currentTab, setCurrentTab] = useState(activeTab);

  useEffect(() => {
    const handleScrollRight = () => {
      if (tabsContainerRef && tabsContainerRef.current) {
        tabsContainerRef.current.scrollLeft += 100;
      }

      setScrollToRight(false);
    };

    if (scrollToRight) {
      handleScrollRight();
    }
  }, [scrollToRight, setScrollToRight]);

  const handleCopyAscURL = useCallback(() => {
    const curlCommand = generateCURLCommand(curlURL?.url);

    navigator.clipboard
      .writeText(`${curlCommand}`)
      .then(() => {
        setIsUrlCopied(true);
        setTimeout(() => {
          setIsUrlCopied(false);
        }, 2000);
      })
      .catch((error) => {
        console.error('Error copying CURL:', error);
      });
  }, [curlURL?.url]);

  const handleCLoseAction = useCallback(() => {
    setOpenGeneralInfo({ open: false, data: {} });
    setActiveGeneralTab(0);
  }, [setOpenGeneralInfo, setActiveGeneralTab]);

  const handleSearchChange = useCallback(
    (e) => {
      setSearchTerm(e?.target?.value);
    },
    [setSearchTerm],
  );

  const handleTabClick = useCallback(
    (index) => {
      startTransition(() => {
        setCurrentTab(index);
        setActiveTab(index);
      });
    },
    [startTransition, setCurrentTab, setActiveTab],
  );

  return (
    <div className={styleSecondary ? ` ${style.tabsContainerTwo}` : `${style.tabsContainer}`}>
      <div
        className={`${styleSecondary ? style.tabs2 : style.tabs} ${style.addition_tab_style}`}
        style={{
          borderBottom: backBorder,
          backgroundColor: backBg ? backBg : '',
        }}
        ref={tabsContainerRef}
      >
        {cross && (
          <div onClick={handleCLoseAction} className={style.dark_cross_icon_container}>
            <Icon height={16} width={16} name={'darkCross'} />
          </div>
        )}
        {pages?.map((page, index) => (
          <TabTitle
            innerRun={innerRun}
            key={page?.tabTitle}
            customClass={customClass}
            activeTab={currentTab}
            index={index}
            styleSecondary={styleSecondary}
            customActive={customActive}
            tabTitle={page?.tabTitle}
            setActiveTab={handleTabClick}
          />
        ))}
        {checkId && (
          <div className={style.curl_copy_button}>
            <button onClick={handleCopyAscURL}>{isUrlCopied ? 'Copied!' : 'Copy as Curl'}</button>
          </div>
        )}
      </div>

      <div className={!noStyle && style.tabContent} style={{ height: `${height}` }}>
        <div className={style.search_parent_container}>
          <div className={style.width_100} style={{ marginTop: textFieldContainerStyle ? '10px' : '0px' }}>
            {searchMode && (
              <TextField
                wraperClass={style.inputClass}
                searchField={true}
                placeholder="Search..."
                beforeIcon={<img src={SearchIcon} alt="searchIcon" />}
                value={searchTerm}
                onChange={handleSearchChange}
                clearIcon={clearIcon}
              />
            )}
          </div>
          <div className={style.margin_top_10} style={{ width: checkbox ? '140px' : '' }}>
            {checkbox && (
              <CheckBox
                labelStyles={{ paddingLeft: '20px', fontSize: '12px', fontWeight: '600' }}
                label={'Errors Only'}
                handleChange={hadnleCheckBoxClick}
              />
            )}
          </div>
        </div>
        {isPending ? (
          <Loader className={style.loader_style} />
        ) : pages[currentTab]?.content ? (
          <>{pages[currentTab]?.content}</>
        ) : (
          <Suspense fallback={<Loader className={style.loader_style} />}>
            <ObjectViewerContent component={pages[currentTab]} isMobileView={isMobileView} />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default Tabs;
