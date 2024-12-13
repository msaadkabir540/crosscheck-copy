import style from './tabs.module.scss';

const Tabs = ({ pages, activeTab, customClass, customActive, searchMode, setActiveTab }) => {
  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  return (
    <div className={style.tabsContainer}>
      <div className={style.tabs}>
        {pages?.map((page, index) => (
          <p
            className={`${style.tabTitle} ${customClass} ${
              activeTab === index ? `${style.active} ${customActive}` : ''
            }`}
            key={page.id}
            onClick={() => handleTabClick(index)}
          >
            {page?.tabTitle}
          </p>
        ))}
      </div>
      <div className="tab-content" style={{ marginTop: '10px' }}>
        {searchMode && <div>TEXT</div>}
        {pages[activeTab]?.content}
      </div>
    </div>
  );
};

export default Tabs;
