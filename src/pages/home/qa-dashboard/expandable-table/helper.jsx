import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import Tags from 'components/tags';

import style from './expandable.module.scss';

export const columnsData = ({ type }) => {
  return [
    {
      name: 'Project', // NOTE: table head name
      key: 'projectId', // NOTE: table column unique key
      hidden: false,
      widthAndHeight: { width: '90px', height: '36px' },
      render: ({ value }) => {
        return (
          <div className={`${style.imgDiv} ${style.startDiv}`}>
            <p className={style.name}>{value?.name}</p>
          </div>
        );
      },
    },
    {
      name: 'Bug ID',
      key: 'bugId',
      hidden: false,
      widthAndHeight: { width: '90px', height: '36px' },

      render: ({ value }) => <RenderBugId {...{ value }} />,
    },
    {
      name: 'Feedback',
      key: 'feedback',
      hidden: false,
      widthAndHeight: { width: '250px', height: '36px' },

      render: ({ value }) => (
        <div className={`${style.imgDiv} ${style.startDiv}`}>
          <p className={style.name}>{value?.text}</p>
        </div>
      ),
    },
    {
      name: 'Latest Remarks',
      key: 'latestRemarks',
      hidden: false,
      widthAndHeight: { width: '250px', height: '36px' },

      render: ({ value }) => (
        <div className={`${style.imgDiv} ${style.startDiv}`}>
          <p className={style.name}>{value ? value : '-'}</p>
        </div>
      ),
    },
    {
      name: 'Severity',
      key: 'severity',
      hidden: false,
      widthAndHeight: {
        width: '90px',
        height: '36px',
      },

      render: ({ value }) => (
        <div className={style.imgDiv}>
          <p className={style.name}>
            <Tags
              text={value}
              colorScheme={{
                Low: '#4F4F6E',
                High: '#F96E6E',
                Medium: '#B79C11',
                Critical: ' #F80101',
              }}
            />
          </p>
        </div>
      ),
    },
    {
      name: `${type} From`,
      key:
        type === 'Blocked'
          ? 'blockedFromDays'
          : type === 'Opened'
            ? 'openFromDays'
            : type === 'Reproducible'
              ? 'reproducibleFromDays'
              : 'needToDiscussFromDays',
      hidden: false,
      widthAndHeight: {
        width: type === 'Blocked' ? '90px' : type === 'Opened' ? '90px' : type === 'Reproducible' ? '120px' : '120px',
        height: '36px',
      },

      render: ({ value }) => (
        <div className={style.imgDiv}>
          <p className={style.name}>{value ? <div className={style.orangeDiv}>{value} days</div> : '-'}</p>
        </div>
      ),
    },
  ];
};

const RenderBugId = ({ value }) => {
  const navigate = useNavigate();

  const navigateToQaTesting = useCallback(() => {
    navigate(`/qa-testing?bugId=${value}`);
  }, [value, navigate]);

  return (
    <div className={`${style.imgDiv} ${style.startDiv}`}>
      <p className={`${style.name} ${style.pointerClass}`} onClick={navigateToQaTesting}>
        {value}
      </p>
    </div>
  );
};
