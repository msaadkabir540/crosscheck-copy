import { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useAppContext } from 'context/app-context';

import Icon from 'components/icon/themed-icon';
import Button from 'components/button';

import { useRequestAccess } from 'api/v1/captures/share-with';

import LockImage from 'assets/LockIcon.svg';

import style from './style.module.scss';

const RequestAccessCard = () => {
  const { mutateAsync: _requrestCheckAccess, isLoading: _isRequestLoading } = useRequestAccess();
  const [requestStatus, setRequestStatus] = useState('Request Access');
  const { userDetails } = useAppContext();
  const { id } = useParams();
  const navigate = useNavigate();

  const onRequestSubmit = async (email) => {
    const body = {
      email: email,
    };

    try {
      setRequestStatus('Requesting...');
      const res = await _requrestCheckAccess({ checkId: id, body });
      if (res) setRequestStatus('Requested');
    } catch (error) {
      setRequestStatus('Already Requested');
      console.error(error);
    }
  };

  return (
    <div className={style.request_main_container}>
      <div className={style.request_box}>
        <div className={style.captureNav_LeftChild}>
          <div
            className={style.navigate_container}
            onClick={() => {
              navigate('/captures');
            }}
            style={{ cursor: 'pointer' }}
          >
            <Icon name={'BackIcon'} />
          </div>
          <p>Back</p>
        </div>
        <div className={style.icon_container}>
          <img src={LockImage} alt="lock_icon" height={100} width={100} />
        </div>
        <div className={style.request_big_text}>Request access to this check</div>
        <div className={style.request_small_text}>You can view this check once your request is approved</div>
        <div className={style.button_container}>
          <Button
            text={requestStatus || 'Request Access'}
            btnClass={style.reques_access_button}
            handleClick={() => onRequestSubmit(userDetails?.email)}
            disabled={_isRequestLoading || requestStatus !== 'Request Access'}
          />
        </div>
        <div className={style.request_extra_small_text}>You’re logged in as {userDetails?.email}</div>
      </div>
    </div>
  );
};

export default RequestAccessCard;
