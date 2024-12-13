import React, { useState } from 'react';

import Icon from 'components/icon/themed-icon';

import { useRemoveUserFromCheck } from 'api/v1/captures/share-with';

import DummyUserImage from 'assets/DummyUserImage.svg';

import style from './style.module.scss';

const SharedUsersComponent = ({ check }) => {
  const { mutateAsync: _removeSharedUser } = useRemoveUserFromCheck();
  const [isUrlCopied, setIsUrlCopied] = useState(false);

  const onDelete = async (email) => {
    const body = {
      userEmail: email,
    };

    try {
      const res = await _removeSharedUser({ checkId: check?._id, body });

      if (res) {
        check.sharedWith = check.sharedWith.filter((user) => user.email !== email);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopyPrivateUrl = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setIsUrlCopied(true);
        setTimeout(() => {
          setIsUrlCopied(false);
        }, 2000);
      })
      .catch((error) => {
        console.error('Error copying URL:', error);
      });
  };

  return (
    <div className={style.main_container}>
      <div className={style.shared_with_container}>
        <div className={style.shared_with_header}>
          <h6>Shared With</h6>
          <div className={style.shared_with_icon_container}>
            <Icon name={'CopyLinkIcon'} />
            <p onClick={handleCopyPrivateUrl}>{isUrlCopied ? 'Copied!' : 'Copy Private URL'}</p>
          </div>
        </div>
        <div className={style.shared_with_users_list}>
          {check?.sharedWith ? (
            <>
              {check?.sharedWith?.map((user) => (
                <React.Fragment key={user?._id || Math.random()}>
                  {user?.status === 'granted' ? (
                    <div className={style.shared_with_users_single}>
                      <div className={style.share_with_image_container}>
                        <img
                          src={user?.profilePicture ? user?.profilePicture : DummyUserImage}
                          alt="user_image"
                          height={35}
                          width={35}
                        />
                        <p>
                          {user?.name ? user.name : ''} <span>({user?.email} )</span>
                        </p>
                      </div>
                      <button className={style.remove_shared_user} onClick={() => onDelete(user?.email)}>
                        Remove
                      </button>
                    </div>
                  ) : null}
                </React.Fragment>
              ))}
            </>
          ) : (
            <div className={style.icon_container}>
              <Icon name={'NoDataIcon'} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SharedUsersComponent;
