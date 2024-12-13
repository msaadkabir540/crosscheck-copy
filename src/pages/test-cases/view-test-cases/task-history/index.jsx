import { useRef, useState } from 'react';

import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

import GenericTable from 'components/generic-table';

import { columnsData } from './helper';
import style from './history.module.scss';

const TaskHistory = ({ data }) => {
  const { control, register, watch } = useForm();
  const ref = useRef();
  const [isHoveringName, setIsHoveringName] = useState({});

  return (
    <div className={style.main}>
      <div className={style.tableWidth}>
        <GenericTable
          ref={ref}
          columns={columnsData({
            control,
            watch,
            register,
            isHoveringName,
            setIsHoveringName,
          })}
          dataSource={data?.taskHistory || []}
          height={'450px'}
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

TaskHistory.propTypes = {
  data: PropTypes.any.isRequired,
};

export default TaskHistory;
