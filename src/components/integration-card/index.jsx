import { useEffect, useMemo } from 'react';

import { useSearchParams } from 'react-router-dom';

import Button from 'components/button';
import Icon from 'components/icon/themed-icon';

import { useToaster } from 'hooks/use-toaster';

import { useConnectGoogleDriveUserLevel } from 'api/v1/settings/user-management';

import { envObject } from 'constants/environmental';

import style from './style.module.scss';

const IntegrationCard = ({ type, refetch, connected }) => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_SETTING_URI } = envObject;

  const { toastSuccess, toastError } = useToaster();

  const { mutateAsync: _connectToGoogleDrive, isLoading } = useConnectGoogleDriveUserLevel();

  const IntegrationHandler = async (code) => {
    try {
      const res = await _connectToGoogleDrive({ code });

      if (res?.msg) {
        toastSuccess(res.msg);
        refetch && (await refetch());
      }
    } catch (error) {
      toastError(error);
    }
  };

  useEffect(() => {
    if (code && type === 'google-drive') {
      IntegrationHandler(code);
    }
  }, [code]);

  const handleGoogleDriveConnect = () => {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/drive%20https://www.googleapis.com/auth/drive.file%20https://www.googleapis.com/auth/drive.appdata&access_type=offline&prompt=consent&include_granted_scopes=true&response_type=code&state=state_parameter_passthrough_value&redirect_uri=${GOOGLE_REDIRECT_SETTING_URI}&client_id=${GOOGLE_CLIENT_ID}`;
    window.open(url);
  };

  const cardType = useMemo(() => {
    return cardsData[type];
  }, [type]);

  return (
    <div className={style.main}>
      <div className={style.iconBox}>
        <Icon name={cardType.icon} width={24} height={24} />
      </div>
      <div className={style.textBox}>
        <h4>Connect to {cardType.name}</h4>
        <div className={style.description}>
          <span>{cardType.description}</span>
          <div className={style.tooltip}>
            <span className={style.tooltipText}> Your data will no longer be back up at crosscheck</span>

            <Icon name={'InfoIcon'} width={24} height={24} iconClass={style.iconClass} />
          </div>
        </div>
      </div>
      <div className={style.buttonBox}>
        <Button
          text={connected ? 'Reconnect' : 'Connect'}
          type="button"
          disable={isLoading}
          handleClick={handleGoogleDriveConnect}
        />
      </div>
    </div>
  );
};

export default IntegrationCard;

const cardsData = {
  'google-drive': {
    icon: 'GoogleDrive',
    name: 'Google Drive',
    description:
      'Connect your google drive to store  data of your checks (images and videos) to your personal google drive',
  },
};
