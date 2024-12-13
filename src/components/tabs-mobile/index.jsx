import { useState } from 'react';

import MobileMenu from 'components/mobile-menu';

import arrow from 'assets/arrow-up.svg';

import style from './tabs.module.scss';

const TabsMobile = ({ pages, activeTab, setActiveTab, drawerMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [selectedTabName, setSelectedTabName] = useState(pages[activeTab]?.tabTitle);

  const handleTabClick = (tabIndex, tabTitle) => {
    setActiveTab(tabIndex);
    setSelectedTabName(tabTitle);
  };

  return (
    <div className={style.tabsContainer}>
      <div className={style.tabs}>
        {pages?.slice(0, drawerMode ? 3 : 4).map((page, index) => (
          <p
            className={`${style.tabTitle} ${activeTab === index && !isOpen ? style.active : ''}`}
            key={page?.id}
            onClick={() => handleTabClick(index, page.tabTitle)}
            data-cy={`bug-view-comments${index}`}
          >
            {page.tabTitle}
          </p>
        ))}

        {pages?.length > (drawerMode ? 3 : 4) && (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            {drawerMode && activeTab > 2 ? (
              <span className={`${style.tabTitle} ${selectedTabName ? style.active : ''}`}>{selectedTabName}</span>
            ) : null}
            <img
              alt=""
              onClick={() => {
                window.innerWidth >= 768 ? setIsOpen2(!isOpen2) : setIsOpen(!isOpen);
              }}
              src={arrow}
              style={{ rotate: isOpen2 ? '0Deg' : '180deg', marginLeft: '5px', cursor: 'pointer' }}
              data-cy="comments-dropdown-icon"
            />
            {drawerMode && (
              <div className={style.menuDiv}>
                {isOpen2 && (
                  <div className={style.mainDiv}>
                    {pages?.slice(drawerMode ? 3 : 4).map((ele, index) => {
                      return (
                        <div className={`${style.innerDiv} `} key={ele?.id}>
                          <p
                            onClick={() => {
                              handleTabClick(index + (drawerMode ? 3 : 4), ele.tabTitle);
                              setIsOpen2(false);
                            }}
                            data-cy={`comments-dropdown-options${index}`}
                          >
                            {ele?.tabTitle}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        <div className={style.menuDivMobile}>
          <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} extraPadding>
            {pages?.slice(drawerMode ? 3 : 4).map((page, index) => (
              <p
                className={style.tabTitleMenu}
                key={page?.id} // NOTE: Adding 4 to avoid key conflicts with the first 4 tabs
                onClick={() => {
                  handleTabClick(index + (drawerMode ? 3 : 4), page.tabTitle);
                  setIsOpen(false);
                }}
              >
                {page.tabTitle}
              </p>
            ))}
          </MobileMenu>
        </div>
      </div>
      {isOpen2 && <div className={style.backdropDiv} onClick={() => setIsOpen2(false)} />}
      <div className="tab-content">{pages[activeTab].content}</div>
    </div>
  );
};

export default TabsMobile;
