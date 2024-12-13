import { forwardRef } from 'react';

import style from './style.module.scss';

const DevtoolsLayout = forwardRef(({ children }, ref) => {
  return (
    <div className={style.dev_layout_parent_container}>
      <div id="something" ref={ref} className={style.dev_layout_child_container}>
        {children}
      </div>
    </div>
  );
});

DevtoolsLayout.displayName = 'DevtoolsLayout';
export default DevtoolsLayout;
