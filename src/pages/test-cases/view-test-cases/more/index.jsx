import PropTypes from 'prop-types';

import { formattedDate } from 'utils/date-handler';

import style from './more.module.scss';

const More = ({ data }) => {
  return (
    <div className={style.main}>
      <div className={style.innerLeft}>
        <span>Created by</span>
        <span>Created at</span>
      </div>
      <div className={style.innerRight}>
        <span>{data?.createdBy?.name}</span>
        <span>{formattedDate(data?.createdAt, 'dd MMM, yy')}</span>
      </div>
    </div>
  );
};

More.propTypes = {
  data: PropTypes.any.isRequired,
};
export default More;
