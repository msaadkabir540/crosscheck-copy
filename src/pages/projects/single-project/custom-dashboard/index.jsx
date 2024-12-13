import { useMemo } from 'react';

import GridLayout from 'components/grid-layout';

const Index = () => {
  const layout = useMemo(() => {
    return [
      {
        key: 'project-bugs',
        dataGrid: { w: 8, h: 9, x: 0, y: 0, minH: 2, minW: 2 },
        type: '',
      },
      {
        key: 'count-bugs',
        dataGrid: { w: 2, h: 5, x: 8, y: 0, minH: 2, minW: 2 },
        type: '',
      },
      {
        key: 'per-features-bugs',
        dataGrid: { w: 5, h: 8, x: 7, y: 9, minH: 2, minW: 2 },
        type: '',
      },
      {
        key: 'milestone-bugs',
        dataGrid: { w: 2, h: 4, x: 8, y: 5, minH: 2, minW: 2 },
        type: '',
      },
      {
        key: 'project-test-cases',
        dataGrid: { w: 2, h: 8, x: 5, y: 9, minH: 2, minW: 2 },
        type: '',
      },
      {
        key: 'milestone-test-cases',
        dataGrid: { w: 2, h: 4, x: 10, y: 5, minH: 2, minW: 2 },
        type: '',
      },
      {
        key: 'feature-test-cases',
        dataGrid: { w: 2, h: 5, x: 10, y: 0, minH: 2, minW: 2 },
        type: '',
      },
      {
        key: 'activities',
        dataGrid: { w: 2, h: 8, x: 3, y: 9, minH: 2, minW: 2 },
        type: '',
      },
      {
        key: 'test-run',
        dataGrid: { w: 3, h: 8, x: 0, y: 9, minH: 2, minW: 2 },
        type: '',
      },
      {
        key: 'developers-bugs',
        dataGrid: { w: 12, h: 3, x: 0, y: 17, minH: 2, minW: 2 },
        type: '',
      },
    ];
  }, []);

  return (
    <div>
      <GridLayout layout={layout} isAllowEditing isAddNewWidget />
    </div>
  );
};

export default Index;
