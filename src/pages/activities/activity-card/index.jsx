import { formattedDate } from 'utils/date-handler';

import style from './activity-card.module.scss';

const ActivityCard = ({ title, description, createdAt }) => {
  return (
    <>
      <div className={style.cardWrapper}>
        <div className={style.cardWrapper2} style={{ display: 'flex', flexDirection: 'row' }}>
          <p dangerouslySetInnerHTML={{ __html: title }}></p>{' '}
          <li className={style.time}>
            <span>•</span>
            <span> {formattedDate(createdAt, 'hh:mm a')}</span>
          </li>
        </div>

        {description &&
          description?.split('\n').map((x) => {
            return (
              <div className={style.infoContent} key={Math.random()}>
                <p dangerouslySetInnerHTML={{ __html: x }} />
              </div>
            );
          })}
      </div>
    </>
  );
};

export default ActivityCard;
