import React from 'react';

import { isEqual } from 'lodash';

import style from '../sidebar.module.scss';

const UserInfo = ({ userDetails }) => {
  return (
    <div className={style.userInfo}>
      {userDetails?.profilePicture ? (
        <img src={userDetails.profilePicture} height={40} width={40} alt="" />
      ) : (
        <span className={style.noNameIcon}>
          {userDetails?.name
            ?.split(' ')
            ?.slice(0, 2)
            ?.map((word) => word[0]?.toUpperCase())
            ?.join('')}
        </span>
      )}
      <span className={style.matchingWSname}>{userDetails?.name}</span>
      {userDetails?.name?.length > 10 && (
        <div className={style.tooltipWs}>
          <p>{userDetails?.name}</p>
        </div>
      )}
    </div>
  );
};

export default React.memo(UserInfo, (prevProps, nextProps) => isEqual(prevProps, nextProps));
