import { useCallback, useState } from 'react';

import Icon from 'components/icon/themed-icon';

import noFound from 'assets/no-found.svg';

import Upcoming from './upcoming';
import style from './expandable.module.scss';
import ExpandModal from './expand-modal';

const ExpandableCard = ({ title, expanded, maxHeight, reportedBy, lastTestedBy, data }) => {
  const [expandModal, setExpandModal] = useState(false);

  const handleOpenExpandable = useCallback(() => {
    setExpandModal(true)
  }, [setExpandModal])

  return (
    <div className={style.upcomingDiv} style={{ maxHeight: maxHeight && maxHeight }}>
      <div className={style.upcomingHeader}>
        <span>{title}</span>
        {!expanded && (
          <div
            onClick={handleOpenExpandable}
            style={{
              height: '16px',
              width: '16px',
            }}
          >
            <Icon name={'expand'} height={16} width={16} iconClass={style.icon} />
          </div>
        )}
      </div>
      <div className={style.upcomingInner}>
        {data && data?.length > 0 ? (
          <>
            {data?.map((item) => {
              return (
                <Upcoming
                  key={item?.bugId}
                  title={item?.bugId}
                  subTitle={item?.feedback?.text}
                  date={item?.reportedAt}
                  reportedBy={reportedBy && item?.reportedBy?.name}
                  lastTestedBy={lastTestedBy && item?.reportedBy?.name}
                  tagText={item?.severity}
                />
              );
            })}
          </>
        ) : (
          <div className={style.noFoundDiv}>
            <img src={noFound} alt="noFound-icon" />
          </div>
        )}
      </div>
      {expandModal && (
        <ExpandModal
          data={data}
          open={expandModal}
          setOpen={() => setExpandModal(false)}
          className={style.modal}
          title={title}
        />
      )}
    </div>
  );
};

export default ExpandableCard;
