import Icon from 'components/icon/themed-icon';

import { useGrantCheckAccess, useRejectAccess } from 'api/v1/captures/share-with';

import style from './style.module.scss';

const CaptureRequestedUsers = ({ check, requestedUsers }) => {
  const { mutateAsync: _grantAccessToUser } = useGrantCheckAccess();
  const { mutateAsync: _rejectAccessToUser } = useRejectAccess();

  const onApproveRequest = async (user) => {
    try {
      const body = {};

      if (user.userId) {
        body.userId = user.userId;
      } else {
        body.email = user.email;
      }

      const res = await _grantAccessToUser({ checkId: check?._id, body });

      if (res) {
        check.sharedWith = check.sharedWith.filter((u) => u.email !== user.email);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onDenyRequest = async (user) => {
    try {
      const body = {};

      if (user.userId) {
        body.userId = user.userId;
      } else {
        body.email = user.email;
      }

      const res = await _rejectAccessToUser({ checkId: check?._id, body });

      if (res) {
        check.sharedWith = check.sharedWith.filter((u) => u.email !== user.email);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={style.access_request_container}>
      <h6>Access Request</h6>
      {requestedUsers && requestedUsers.length > 0 ? (
        requestedUsers.map((user) => (
          <div key={user?._id || Math.random()} className={style.requests_portion}>
            <p>
              {user.name || ''} <span>({user.email || ''})</span>
            </p>
            <div className={style.requests_portion_button_continer}>
              <button className={style.reject_button} onClick={() => onDenyRequest(user)}>
                Reject
              </button>
              <button className={style.approve_button} onClick={() => onApproveRequest(user)}>
                Approve
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className={style.icon_container}>
          <Icon name={'NoDataIcon'} />
        </div>
      )}
    </div>
  );
};

export default CaptureRequestedUsers;
