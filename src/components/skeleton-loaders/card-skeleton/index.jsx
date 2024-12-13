import style from './style.module.scss';

const SkeletonCard = ({ count, className, containerClass, wholeBoxClass, buttonClassName }) => {
  const renderSkeletonCards = () => {
    if (count) {
      return Array.from({ length: count }, (_, index) => (
        <div key={index} className={wholeBoxClass && wholeBoxClass}>
          <div key={index} className={`${className} ${style.skeleton_card}`}></div>
          <div key={index} className={`${buttonClassName} ${style.skeleton_card_bottom}`}></div>
        </div>
      ));
    } else {
      return (
        <div>
          <div className={style.skeleton_card}></div>
          <div className={style.skeleton_card_bottom}></div>
        </div>
      );
    }
  };

  return <div className={`${containerClass} ${style.skeleton_card_container}`}>{renderSkeletonCards()}</div>;
};

export default SkeletonCard;
