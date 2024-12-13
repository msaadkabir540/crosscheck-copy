import { useEffect, useState } from 'react';

import Menu from 'components/menu';

import CrossTag from 'assets/crossTag.svg';
import CrossTagBlack from 'assets/crossTagBlack.svg';

import style from './tags.module.scss';

const Tags = ({
  circular,
  text,
  cross,
  number,
  dateMode,
  trainingWidget,
  isCircularNumber,
  backClass,
  droppable,
  menu,
  borderColor,
  numberCircular,
  isCircular = false,
  colorScheme = {
    Open: '#34C369',
    Passed: '#34C369',
    Closed: '#F96E6E',
    Blocked: '#F96E6E',
    'Not Tested': '#8B909A',
    Failed: '#F96E6E',
  },
}) => {
  const [color, setColor] = useState('#8B909A');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    text && setColor(colorScheme[text]);
  }, [text]);

  const mainMenu =
    droppable && menu
      ? menu?.map((x) => ({
          ...x,
          click: () => {
            setIsOpen(false);
            x.click();
          },
        }))
      : [];

  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      {isCircularNumber ? (
        <>
          <div
            className={`${style.main} ${backClass}`}
            style={{ backgroundColor: color, borderRadius: 32 }}
            onClick={() => {
              droppable && setIsOpen((pre) => !pre);
            }}
          >
            {numberCircular && (
              <div
                className={style.text}
                style={{
                  padding: '3px',
                }}
              >
                <span> {numberCircular}</span> Selected
              </div>
            )}
          </div>
        </>
      ) : (
        <></>
      )}
      {circular ? (
        <div
          className={`${style.main} ${backClass}`}
          style={{
            backgroundColor: color,
            borderRadius: 32,
            border: borderColor ? '1px solid' : null,

            borderColor: borderColor && borderColor,
            display: isCircularNumber ? 'none' : null,
          }}
          onClick={() => {
            droppable && setIsOpen((pre) => !pre);
          }}
        >
          {dateMode ? (
            <div
              className={style.text}
              style={{
                color: borderColor ? borderColor : '#696F7A',
                fontSize: trainingWidget ? '14px' : '12px',
                fontWeight: trainingWidget ? '400' : '600',
              }}
            >
              {text}
            </div>
          ) : (
            <div
              className={style.text}
              style={{
                color: borderColor ? borderColor : '#363636',
                fontSize: trainingWidget ? '14px' : '12px',
                fontWeight: trainingWidget ? '400' : '600',
              }}
            >
              {text}
            </div>
          )}

          {cross ? (
            <img alt="" src={CrossTagBlack} height={6} width={6} onClick={() => alert('closed')} />
          ) : (
            <div></div>
          )}
        </div>
      ) : (
        <div
          className={`${style.main} ${backClass}`}
          style={{
            backgroundColor: color,
            borderRadius: isCircular && 32,
            border: borderColor ? '1px solid' : null,

            borderColor: borderColor && borderColor,
            display: isCircularNumber ? 'none' : null,
          }}
          onClick={() => {
            droppable && setIsOpen((pre) => !pre);
          }}
        >
          {number ? (
            <>
              <div
                className={style.text}
                style={{
                  marginRight: '5px',
                }}
              >
                {number}
              </div>
              <div
                className={style.text}
                style={{
                  padding: '3px',
                }}
              >
                Selected
              </div>
            </>
          ) : (
            <div
              className={style.text}
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                color: borderColor ? borderColor : undefined,
              }}
            >
              {text?.length > 15 ? <p className={style.selectBoxEllipses}>{text}</p> : text}
            </div>
          )}
          {cross ? <img alt="" src={CrossTag} height={6} width={6} onClick={() => alert('closed')} /> : <div></div>}
        </div>
      )}

      {droppable && isOpen && (
        <div className={style.menuDiv}>
          <Menu menu={mainMenu} style={style.active} />
        </div>
      )}

      {droppable && isOpen && <div className={style.backdropDiv} onClick={() => setIsOpen(() => false)}></div>}
    </div>
  );
};

export default Tags;
