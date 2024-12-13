import { useState } from 'react';

import MobileMenu from 'components/mobile-menu';

import arrow from 'assets/arrow-up.svg';

import style from './tabs.module.scss';

const TabsMobile = ({ pages, activeTab, setActiveTab, drawerMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  const Content = pages?.find((x) => x.id === activeTab)?.content;

  return (
    <div className={style.tabsContainer}>
      <div className={style.tabs}>
        {pages?.slice(0, drawerMode ? 2 : 4).map((page) => (
          <p
            className={`${style.tabTitle} ${activeTab === page.id && !isOpen ? style.active : ''}`}
            key={page?.id}
            onClick={() => handleTabClick(page.id)}
          >
            {page.tabTitle}
          </p>
        ))}

        {pages?.length > (drawerMode ? 2 : 4) && (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <img
              alt=""
              onClick={() => {
                window.innerWidth >= 768 ? setIsOpen2(!isOpen2) : setIsOpen(!isOpen);
              }}
              src={arrow}
              style={{ rotate: '180Deg', marginLeft: '5px', cursor: 'pointer' }}
            />
            {drawerMode && (
              <div className={style.menuDiv}>
                {isOpen2 && (
                  <div className={style.mainDiv}>
                    {pages?.slice(drawerMode ? 2 : 4).map((ele, index) => {
                      return (
                        <div className={`${style.innerDiv} `} key={ele?.id}>
                          <p
                            onClick={() => {
                              handleTabClick(index + (drawerMode ? 2 : 4));
                              setIsOpen2(false);
                            }}
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
            {pages?.slice(drawerMode ? 2 : 4).map((page, index) => (
              <p
                className={style.tabTitleMenu}
                key={page?.id} // NOTE: Adding 4 to avoid key conflicts with the first 4 tabs
                onClick={() => {
                  handleTabClick(index + (drawerMode ? 2 : 4));
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
      <div className="tab-content">{Content}</div>
    </div>
  );
};

export default TabsMobile;
