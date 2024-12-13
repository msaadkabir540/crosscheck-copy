import { useCallback, useState, useMemo } from 'react';

import Icon from 'components/icon/themed-icon';
import Tooltip from 'components/tooltip';

import { formatTime } from 'utils/date-handler';

import style from './action.module.scss';

const ActionsText = ({ data, onClickChange, isHighlighted }) => {
  const [isUrlCopied, setIsUrlCopied] = useState(false);

  const handleClickChange = useCallback(() => {
    onClickChange(Math.round(data?.second));
  }, [onClickChange, data]);

  const getUrl = useCallback(() => {
    if (data?.event === 'navigate') {
      return data?.navigateTo;
    }

    if (data?.event === 'tabSwitch') {
      return data?.switchedTo;
    }

    return '';
  }, [data]);

  const handleCopyUrl = useCallback(() => {
    const url = getUrl();
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setIsUrlCopied(true);
        setTimeout(() => {
          setIsUrlCopied(false);
        }, 2000);
      })
      .catch((error) => {
        console.error('Error copying URL:', error);
      });
  }, [getUrl]);

  const eventDetails = useMemo(() => {
    switch (data?.event) {
      case 'click':
        return { text: 'Clicked', icon: <Icon name="ClickNew" /> };
      case 'dblclick':
        return { text: 'Double Clicked', icon: <Icon name="ClickOn" /> };
      case 'keypress':
        return { text: 'Type', icon: <Icon name="Enter" /> };
      case 'navigate':
        return { text: 'Navigated to', icon: <Icon name="NavigateIcon" /> };
      case 'tabSwitch':
        return { text: 'Switched to', icon: <Icon name="NavigateIcon" /> };
      default:
        return { text: null, icon: <Icon name="DotIcon" /> };
    }
  }, [data?.event]);

  return (
    <div
      onClick={handleClickChange}
      className={`${style.mainWrapper} ${isHighlighted && style.rowHoverClass}`}
      style={{ borderColor: isHighlighted ? 'black' : 'transparent' }}
    >
      <div className={style.time}>{formatTime(Math.round(data?.second))}</div>
      <div className={style.time}>{data?.playedAt}</div>
      <div className={style.icon}>{eventDetails.icon}</div>
      <div className={style.desc}>
        <span className={style.span_style}>{eventDetails.text}</span>
        {(data?.event === 'navigate' || data?.event === 'tabSwitch') && (
          <Tooltip
            position="left"
            tooltip={isUrlCopied ? 'copied!' : 'copy'}
            adjustableWidth={style.adjustable_width}
            classTooltipStyle={style.tooltipAdditionStyle}
          >
            <span title={getUrl()} className={style.data_navigated_span} onClick={handleCopyUrl}>
              {getUrl()}
            </span>
          </Tooltip>
        )}
        {data?.event === 'keypress' && <span className={style.data_keypressed_span}>{data?.keyPressed}</span>}
        {data?.event !== 'navigate' && data?.event !== 'tabSwitch' && (
          <span className={style.data_keypressed_span}>
            {`<${data?.tagName?.toLowerCase()} class='${data.classNames}' id='${data.id}'>`}
          </span>
        )}
      </div>
    </div>
  );
};

export default ActionsText;
