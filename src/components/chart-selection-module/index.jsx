import { useState, useMemo, Fragment } from 'react';

import ThemedIcon from 'components/icon/themed-icon';

import ChartPreviewCard from './chart-preview-cards';
import style from './style.module.scss';

const Index = ({ menu, onClick }) => {
  const [active, setActive] = useState(0);

  const content = useMemo(() => {
    return menu?.[active]?.subtypes;
  }, [active]);

  const onClickHandler = (subtype, preview) => {
    const type = menu?.[active]?.title;
    const body = { type, subtype, preview };
    onClick && onClick(body);
  };

  return (
    <div className={style.main}>
      <div className={style.tabs}>
        {menu?.map((x, index) => {
          return (
            <div
              key={x.title}
              className={`${style.tab} ${active === index && style.tabActive}`}
              onClick={() => setActive(index)}
            >
              <ThemedIcon name={x.icon} width={22} height={22} />

              <p>{x.title}</p>
            </div>
          );
        })}
      </div>

      <div className={style.tabsContent}>
        {content?.map((x) => {
          return (
            <Fragment key={x.title}>
              <ChartPreviewCard
                {...{
                  onClickHandler: () => {
                    onClickHandler(x.title, x?.preview);
                  },
                  title: x?.title,
                  preview: x?.preview,
                }}
              />
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Index;
