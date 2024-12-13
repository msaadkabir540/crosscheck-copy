import { useCallback, useMemo, useState } from 'react';

import Tooltip from 'components/tooltip';

import { formatedDate, getCurrentTime } from 'utils/date-handler';

import Avatar from 'assets/avatar.svg';

import style from './general.module.scss';

const GeneralInfo = ({ generalInfo, userInfo }) => {
  const [isCopied, setIsCopied] = useState(false);

  const generalInfoData = useMemo(() => {
    return generalInfo;
  }, [generalInfo]);

  const copyText = useCallback(() => {
    navigator.clipboard
      .writeText(generalInfoData?.url)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1000);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  }, [generalInfoData?.url, setIsCopied]);

  return (
    <div className={style.generalDiv}>
      {generalInfo?.createdBy?._id ? (
        <div className={style.userInfo_container}>
          {generalInfo?.createdBy?.name ? (
            <img
              src={generalInfo?.createdBy?.profilePicture ? generalInfo?.createdBy?.profilePicture : Avatar}
              alt="createdBy-profilePicture"
              className={style.logo2}
            />
          ) : (
            <div className={style.alternative_name}>
              {generalInfo?.createdBy?.name
                ?.split(' ')
                ?.slice(0, 2)
                ?.map((word) => word[0]?.toUpperCase())
                ?.join('')}
            </div>
          )}
          <p>{generalInfo?.createdBy?.name}</p>
        </div>
      ) : (
        <div className={style.userInfo_container}>
          {userInfo?.name ? (
            <img
              src={userInfo?.profilePicture ? userInfo?.profilePicture : Avatar}
              alt="profile-user"
              className={style.logo2}
            />
          ) : (
            <div className={style.alternative_name}>
              {userInfo?.name
                ?.split(' ')
                ?.slice(0, 2)
                ?.map((word) => word[0]?.toUpperCase())
                ?.join('')}
            </div>
          )}
          <p>{userInfo?.name}</p>
        </div>
      )}
      <h6>General Info</h6>
      <div className={style.generalInfo}>
        <div className={style.infoFlex}>
          <p className={style.innerP}>URL</p>
          <Tooltip
            adjustableWidth={style.adujstable_width}
            className={style.justify_start}
            tooltip={isCopied ? 'copied!' : 'copy'}
          >
            <p className={`${style.textSm} ${style.cursor_pointer}`} onClick={copyText}>
              {generalInfoData?.url}
            </p>
          </Tooltip>
        </div>
        <div className={style.infoFlex}>
          <p className={style.innerP}>Timestamp</p>
          <p className={style.textSm}>
            {formatedDate(generalInfoData?.createdAt)} {getCurrentTime(generalInfoData?.createdAt)}{' '}
          </p>
        </div>
        <div className={style.infoFlex}>
          <p className={style.innerP}>Device</p>
          <p className={style.textSm}>{generalInfoData?.device}</p>
        </div>
        <div className={style.infoFlex}>
          <p className={style.innerP}>Browser</p>
          <p className={style.textSm}>{generalInfoData?.browser}</p>
        </div>
        <div className={style.infoFlex}>
          <p className={style.innerP}>View-port Size</p>
          <p className={style.textSm}>{generalInfoData?.viewPortSize}</p>
        </div>
        <div className={style.infoFlex}>
          <p className={style.innerP}>Country</p>
          <p className={style.textSm}>{generalInfoData?.country}</p>
        </div>
        <div className={style.infoFlex}>
          <p className={style.innerP}>Network Speed</p>
          <p className={style.textSm}>{generalInfoData?.networkSpeed}</p>
        </div>
      </div>
    </div>
  );
};

export default GeneralInfo;
