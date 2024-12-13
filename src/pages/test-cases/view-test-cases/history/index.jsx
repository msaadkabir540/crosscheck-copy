import { useRef, useState } from 'react';

import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

import GenericTable from 'components/generic-table';

import style from './history.module.scss';
import { columnsData } from './helper';

const History = ({ data }) => {
  const { control, register, watch } = useForm();
  const ref = useRef();
  const [isHoveringName, setIsHoveringName] = useState({});

  return (
    <div className={style.main}>
      <div className={`${style.tableWidth} ${style.tableScroll}`}>
        <GenericTable
          ref={ref}
          columns={columnsData({
            control,
            watch,
            isHoveringName,
            setIsHoveringName,
            register,
          })}
          dataSource={data?.history || []}
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

History.propTypes = {
  data: PropTypes.any.isRequired,
};
export default History;
