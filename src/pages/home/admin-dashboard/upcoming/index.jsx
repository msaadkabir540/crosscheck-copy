import { useCallback, useState } from 'react';

import _ from 'lodash';
import { useNavigate } from 'react-router-dom';

import MultiColorProgressBar from 'components/progress-bar';

import { useToaster } from 'hooks/use-toaster';

import avatar from 'assets/avatar.svg';

import style from './upcoming.module.scss';
import Icon from '../../../../components/icon/themed-icon';

const Upcoming = ({ id, testedCount = 0, notTestedCount = 0, title, subTitle, date, daysPassed, data, img, name }) => {
  const navigate = useNavigate();
  const { toastSuccess } = useToaster();
  const [isHoveringName, setIsHoveringName] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  let hoverTimeout;

  const handleMouseEnter = () => {
    clearTimeout(hoverTimeout);

    hoverTimeout = setTimeout(() => {
      setIsHoveringName(true);
    }, 1500);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout);
    setIsHoveringName(false);
  };

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

  const navigateToTestRun = useCallback(() => {
    navigate(`/test-run/${id}`)
  }, [id])

  return (
    <div className={style.wrapper} style={{ cursor: 'pointer' }} onClick={navigateToTestRun}>
      <div
        style={{
          background: '#E25E3E',
          height: '100%',
          width: '3%',
          borderRadius: ' 3px 0px 0px 3px',
        }}
      />
      <div className={style.inner}>
        <p className={style.title}>{title}</p>
        <p className={style.subTitle}>{subTitle}</p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            gap: '10px',
          }}
        >
          <MultiColorProgressBar
            readings={
              !testedCount && !notTestedCount
                ? [
                  {
                    name: 'No Test Case',
                    value: 100,
                    color: '#D6D6D6',
                    tooltip: 'No Test Case',
                  },
                ]
                : [
                  testedCount && {
                    name: 'testedCount',
                    value: (testedCount / (testedCount + notTestedCount)) * 100,
                    color: '#34C369',
                    tooltip: 'Tested',
                  },
                  notTestedCount && {
                    name: 'notTestedCount',
                    value: (notTestedCount / (testedCount + notTestedCount)) * 100,
                    color: '#D6D6D6',
                    tooltip: 'Not Tested',
                  },
                ]
            }
            className={style.progressBar}
          />
          {<p className={style.dateScss}>{`${testedCount}/${testedCount + notTestedCount}`}</p>}
        </div>
        <div className={style.imgSection}>
          <span>
            {date && `Due Date: ${date}`} <span className={style.daysPassed}>{daysPassed} Days</span>
          </span>
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ display: 'flex', position: 'relative', alignItems: 'center', gap: '5px' }}
          >
            {img ? (
              <img alt="image" src={img} style={{ width: '24px', height: '24px', borderRadius: '80%' }} />
            ) : (
              <div
                style={{
                  borderRadius: '80%',
                  background: 'var(--bg-g)',
                  width: '24px',
                  height: '24px',
                  color: 'var(--font-b)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {_.first(name)}
              </div>
            )}
            <div style={{ position: 'absolute', zIndex: '1000', top: '25', right: '0' }}>
              {isHoveringName && (
                <div className={style.main}>
                  <div className={style.profileDiv}>
                    <img alt="avatar" src={img || avatar} height={60} width={60} />
                    <span className={style.statusOnline}>Online</span>
                  </div>
                  <div>
                    <span className={style.title}>{name}</span>
                  </div>
                  <div className={style.email} style={{ position: 'relative' }}>
                    <Icon name={'MailIcon'} />
                    <span>{data?.assignee?.email}</span>
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
              )}
            </div>
            <span>{name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upcoming;
