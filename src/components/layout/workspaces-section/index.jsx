import React, { useCallback } from 'react';

import { isEqual } from 'lodash';

import style from '../layout.module.scss';

const WorkspaceSection = ({ ele, changeWorkspace, setSeletedWorspace, selectedWorkspace, isSubmitting }) => {
  const handleClick = useCallback(() => {
    changeWorkspace(ele?.workSpaceId);
    setSeletedWorspace && setSeletedWorspace(ele?.workSpaceId);
  }, [setSeletedWorspace, changeWorkspace, ele]);

  return (
    <div className={style.userInfo} onClick={handleClick}>
      {isSubmitting === true && selectedWorkspace === ele.workSpaceId ? (
        <div className={style.skeletonLoader} />
      ) : (
        <>
          {ele?.avatar ? (
            <img src={ele?.avatar} height={32} width={32} alt="" className={style.avatar_image} />
          ) : (
            <div className={style.nameLogo}>{ele?.name?.charAt(0)?.toUpperCase()}</div>
          )}
          <span>{ele?.name}</span>
        </>
      )}
    </div>
  );
};

export default React.memo(WorkspaceSection, (prevProps, nextProps) => isEqual(prevProps, nextProps));
