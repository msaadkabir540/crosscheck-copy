import style from './filter-tags.module.scss';
import Icon from '../../icon/themed-icon';

const FilterTag = ({ pages, activeTab, multiMode, icons, setActiveTab }) => {
  const handleTabClick = (tagIndex) => {
    setActiveTab(tagIndex);
  };

  return (
    <div className={style.tabsContainer}>
      <div className={style.tagDiv}>
        {pages?.map((page, index) => (
          <div key={page.id} className={style.innerDiv}>
            <div
              className={`${style.tag} ${
                activeTab === index && !multiMode
                  ? style.active
                  : activeTab === index && multiMode
                    ? style.multiActive
                    : ''
              }`}
              style={{
                background: page?.type === 'error' && !multiMode && 'rgba(226, 94, 62, 0.10)',
                boxShadow:
                  page?.type === 'error' && !multiMode && activeTab === index
                    ? ' 2px 2px 2px 0px rgba(226, 94, 62, 0.25)'
                    : '',
              }}
              onClick={() => handleTabClick(index)}
            >
              {icons &&
                !multiMode &&
                (page?.type === 'warns' ? (
                  <Icon name={'WarningIcon'} />
                ) : page?.type === 'errors' || page?.type === 'onErrors' || page?.type === 'jsError' ? (
                  <Icon name={'ErrorIcon'} />
                ) : page?.type === 'logs' ? (
                  <Icon name={'LogsIcon'} />
                ) : (
                  ''
                ))}

              {!multiMode && <span className={style.tagText}>{page?.count}</span>}
              <span className={style.tagText}>{page?.text}</span>
            </div>
            {index === 0 && multiMode && <div className={style.withLine}></div>}
          </div>
        ))}
      </div>
      <div className="tab-content">{pages[activeTab]?.content}</div>
    </div>
  );
};

export default FilterTag;
