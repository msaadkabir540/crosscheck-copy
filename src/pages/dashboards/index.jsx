import { useCallback, useMemo, useState } from 'react';

import MainWrapper from 'components/layout/main-wrapper';
import Tabs from 'components/tabs';

import { formattedDate } from 'utils/date-handler';

import DashboardListing from './listing';

const Index = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [count, setCount] = useState(0);

  const pages = useMemo(() => {
    return calculatedPages({ count, setCount });
  }, [count]);

  const handleActiveTab = useCallback((e) => {
    setActiveTab(e);
  }, []);

  return (
    <MainWrapper title="Dashboards" date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}>
      <Tabs pages={pages?.filter((x) => x.tabTitle)} activeTab={activeTab} setActiveTab={handleActiveTab} noStyle />
    </MainWrapper>
  );
};

export default Index;

const calculatedPages = ({ count, setCount }) => {
  return [
    {
      id: 0,
      tabTitle: `All Dashboards ${count ? `(${count})` : ``}`,
      content: <DashboardListing type={'all'} setCount={setCount} />,
    },
    {
      id: 1,
      tabTitle: 'My Dashboards',
      content: <DashboardListing type={'myDashboards'} setCount={setCount} />,
    },
    {
      id: 2,
      tabTitle: 'Shared ',
      content: <DashboardListing type={'sharedDashboard'} setCount={setCount} />,
    },
  ];
};
