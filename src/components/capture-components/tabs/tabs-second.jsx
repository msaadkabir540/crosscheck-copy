import style from './tabs.module.scss';

const Tabs = ({ pages, activeTab, setActiveTab }) => {
  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  const Content = pages?.find((x) => x.id === activeTab).content;

  return (
    <div className={style.tabsContainer}>
      <div className={style.tabs}>
        {pages?.map((page) => (
          <p
            className={`${style.tabTitle} ${activeTab === page.id ? style.active : ''}`}
            key={page.id}
            onClick={() => handleTabClick(page.id)}
          >
            {page.tabTitle}
          </p>
        ))}
      </div>
      <div className="tab-content">{Content}</div>
    </div>
  );
};

export default Tabs;
