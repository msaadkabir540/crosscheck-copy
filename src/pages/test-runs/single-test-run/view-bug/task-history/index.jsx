import { useRef, useState } from 'react';

import GenericTable from 'components/generic-table';

import { columnsData } from './helper';
import style from './history.module.scss';

const TaskHistory = ({ taskHistory }) => {
  const ref = useRef();
  const [isHoveringName, setIsHoveringName] = useState({});

  return (
    <div className={style.main}>
      <div className={style.tableWidth}>
        <GenericTable
          ref={ref}
          columns={columnsData({ isHoveringName, setIsHoveringName })}
          dataSource={taskHistory || []}
          height={'350px'}
          selectable={true}
          classes={{
            test: style.test,
            table: style.table,
            thead: style.thead,
            th: style.th,
            containerClass: style.checkboxContainer,
            tableBody: style.tableRow,
          }}
        />
      </div>
    </div>
  );
};

export default TaskHistory;
