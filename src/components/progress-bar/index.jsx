import style from './progress-bar.module.scss';

const MultiColorProgressBar = ({ readings, className }) => {
  return (
    <div className={`${style.multicolorBar} ${className && className}`}>
      <div className={style.bars}>
        {readings?.map((item) => {
          return (
            item !== 0 && (
              <div
                className={style.bar}
                style={{
                  backgroundColor: item?.color,
                  width: item?.value + '%',
                }}
                key={item?.tooltip}
              >
                {' '}
                {item?.tooltip && (
                  <div className={style.tooltip}>
                    <p>{item?.tooltip}</p>
                  </div>
                )}
              </div>
            )
          );
        })}
      </div>
    </div>
  );
};

export default MultiColorProgressBar;
