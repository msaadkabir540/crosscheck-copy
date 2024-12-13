import { useEffect } from 'react';

import UserInfoPopup from 'components/user-info-popup';
import Highlighter from 'components/highlighter';

import { useToaster } from 'hooks/use-toaster';

import { useGetUserById } from 'api/v1/settings/user-management';

const UserName = ({ user, isHovering, searchedText }) => {
  const { toastError } = useToaster();

  const { data: _userDataById, isLoading: _isLoadingUser } = useGetUserById(isHovering);

  const getUserDetail = async (id) => {
    try {
      await _userDataById(id);
    } catch (error) {
      toastError(error);
    }
  };

  useEffect(() => {
    if (isHovering) {
      getUserDetail(isHovering);
    }
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <Highlighter search={searchedText}>{user?.name ? user?.name : '-'}</Highlighter>
      <div style={{ position: 'absolute', zIndex: '1000' }}>
        {isHovering && <UserInfoPopup data={_userDataById} isLoading={_isLoadingUser} />}
      </div>
    </div>
  );
};

export default UserName;
