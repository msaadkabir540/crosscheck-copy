import { useCallback } from 'react';

import _ from 'lodash';

import Button from 'components/button';
import Permissions from 'components/permissions';

import style from './row.module.scss';

const Row = ({ data, role, handleClick, backClass, key, showEmail = true }) => {
  const onHandleClick = useCallback(() => handleClick(data?._id), [handleClick, data]);

  return (
    <div className={`${style.membersRow} ${backClass}`} key={key}>
      <div className={style.imgDiv}>
        {data?.profilePicture ? (
          <img src={data?.profilePicture} alt="" height={35} width={35} />
        ) : (
          <span className={style.initialSpan}>{_.first(data?.name)}</span>
        )}
        <p className={style.name}>{data?.name}</p>
        {showEmail && data?.email && (
          <div className={style.rowText}>
            <p className={style.email}>{data?.email}</p>
            <div className={style.tooltip}>
              <p>{data?.email}</p>
            </div>
          </div>
        )}
      </div>

      <div className={style.removeClass}>
        {!data.notRemove && (
          <Permissions allowedRoles={['Admin', 'Project Manager', 'QA']} currentRole={role}>
            {data?.role !== 'Admin' && (
              <Button text={'Remove'} btnClass={style.btnRemove} handleClick={onHandleClick} />
            )}
          </Permissions>
        )}
      </div>
    </div>
  );
};

export default Row;
