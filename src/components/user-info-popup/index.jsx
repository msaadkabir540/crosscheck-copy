import { useState } from 'react';

import { useToaster } from 'hooks/use-toaster';

import avatar from 'assets/avatar.svg';

import style from './userinfo.module.scss';
import Icon from '../icon/themed-icon';

const UserInfoPopup = ({ data }) => {
  const { toastSuccess } = useToaster();
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = (text) => {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
  };

  const handleCopyEmail = () => {
    const email = data?.user?.email;

    if (email) {
      copyToClipboard(email);
      toastSuccess('Email copied to clipboard');
      setIsCopied(true);
    }
  };

  return (
    <div className={style.main}>
      <div className={style.profileDiv}>
        <img src={data?.user?.profilePicture || avatar} height={60} width={60} alt="" />
        <span className={style.statusOnline}>Online</span>
      </div>
      <div>
        <span className={style.title}>{data?.user?.name}</span>
      </div>
      <div className={style.email} style={{ position: 'relative' }}>
        <Icon name={'MailIcon'} />
        <span>{data?.user?.email}</span>
        <div className={style.copyDiv} onClick={handleCopyEmail}>
          {!isCopied ? <Icon name={'CopyIcon'} /> : <Icon name={'TickIcon'} />}
        </div>
        <p className={style.copyText}>{isCopied && 'copied'}</p>
      </div>
      <div className={style.email}>
        <Icon name={'ActivityIcon'} height={16} width={16} />
        <span>{data?.user?.lastActive}</span>
      </div>
    </div>
  );
};

export default UserInfoPopup;
