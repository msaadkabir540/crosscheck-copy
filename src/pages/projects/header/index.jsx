import { useCallback, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import threeDots from 'assets/threeDots.svg';

import style from './header.module.scss';
import Icon from '../../../components/icon/themed-icon';

const HeaderSection = ({ favorites, favoriteToggle }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null); // NOTE: Use null as the initial value

  const navigateToProjects = useCallback(
    (ele) => {
      navigate(`/projects/${ele?._id}`);
    },
    [navigate],
  );

  const handleClose = useCallback(() => {
    setOpen(null);
  }, [setOpen]);

  return (
    <div className={style.main}>
      <div className={style.flex}>
        <Icon name={'StarIcon'} /> <p>Favorites</p>
      </div>
      <div className={style.innerFlex}>
        <div className={style.moreInner}>
          {favorites?.length ? (
            favorites?.map((ele, index) => {
              return (
                <ProjectComp
                  key={ele._id}
                  ele={ele}
                  index={index}
                  open={open}
                  setOpen={setOpen}
                  navigateToProjects={navigateToProjects}
                  favoriteToggle={favoriteToggle}
                  threeDots={threeDots}
                />
              );
            })
          ) : (
            <span className={style.nothingText}>Nothing in Favourites</span>
          )}
        </div>
      </div>
      {open !== null && <div className={style.backdropDiv} onClick={handleClose}></div>}
    </div>
  );
};

export default HeaderSection;

const ProjectComp = ({ ele, index, open, setOpen, navigateToProjects, favoriteToggle, threeDots }) => {
  const handleCardClick = () => {
    navigateToProjects(ele);
  };

  const handleThreeDotsClick = useCallback(
    (e) => {
      setOpen(index);
      e.stopPropagation();
    },
    [index, setOpen],
  );

  const handleFavoriteToggle = useCallback(
    (e) => {
      favoriteToggle(e, ele._id);
      setOpen(null);
      e.stopPropagation();
    },
    [favoriteToggle, ele._id, setOpen],
  );

  const initials = ele.name
    .split(' ')
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('');

  return (
    <div key={index} className={style.project} style={{ cursor: 'pointer' }} onClick={handleCardClick}>
      <span>{initials}</span>
      <p>{ele.name}</p>
      <div onClick={handleThreeDotsClick} className={style.threeDots} src={threeDots} alt="">
        <Icon name={'MoreInvertIcon'} />
      </div>

      <div
        className={style.tooltip}
        style={{
          display: open === index ? 'block' : 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
          }}
          onClick={handleFavoriteToggle}
        >
          <Icon name={'Unfavorite'} /> Unfavorite
        </div>
      </div>
    </div>
  );
};
