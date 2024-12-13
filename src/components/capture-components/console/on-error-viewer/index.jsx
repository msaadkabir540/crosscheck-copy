import Icon from 'components/icon/themed-icon';

import NoDataIcon from 'assets/no-data-icon';

import style from './style.module.scss';

const OnErrorItem = ({ errors, bgColor, textColor, icon }) => {
  const renderDataValue = (value) => {
    if (typeof value === 'string') {
      return value.replace(/^"(.*)"$/, '$1');
    }

    return value;
  };

  return (
    <div style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div
        className={style.main}
        style={{
          height: '100%',
          paddingBottom: '70vh',
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          overflow: 'auto',
        }}
      >
        {errors &&
          errors.map((item) => (
            <div
              className={style.child_container_one}
              style={{ backgroundColor: bgColor ? `${bgColor}` : '' }}
              key={Math.random()}
            >
              <div className={style.text_wrapper}>
                <div className={style.text_wrapper_left}>
                  <span className={style.time}>{item.createdAt}</span>
                  <Icon name={icon} />
                  <div style={{ color: textColor ? `${textColor}` : '' }}>
                    {item.data.map((error) => (
                      <div style={{ marginTop: '2px' }} key={Math.random()}>{`${renderDataValue(error)} `}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        {!errors && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <NoDataIcon />
          </div>
        )}
      </div>
    </div>
  );
};

export default OnErrorItem;
