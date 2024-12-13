import { useMemo, useState } from 'react';

import MainWrapper from 'components/layout/main-wrapper';
import Tabs from 'components/tabs';

import { formattedDate } from 'utils/date-handler';

import FilteredCaptures from './filtered-captures';
import style from './captures.module.scss';

const Captures = () => {
  const [activeTab, setActiveTab] = useState(0);

  const pages = useMemo(() => {
    const commonTabs = [
      {
        id: 0,
        tabTitle: 'All',
        content: <FilteredCaptures viewBy={'all'} />,
      },
      {
        id: 1,
        tabTitle: 'My Checks',
        content: <FilteredCaptures viewBy={'mine'} />,
      },
      {
        id: 2,
        tabTitle: 'Shared',
        content: <FilteredCaptures viewBy={'shared'} />,
      },
    ];

    return commonTabs;
  }, []);

  return (
    <div className={style.container}>
      <MainWrapper title="Checks" date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}>
        <Tabs
          customClass={style.custom_font_size}
          pages={pages}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          customActive={undefined}
        />
      </MainWrapper>
    </div>
  );
};

export default Captures;
