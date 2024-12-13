import { useCallback, useMemo } from 'react';

import { parse } from 'flatted';
import JsonView from '@uiw/react-json-view';

import Icon from 'components/icon/themed-icon';

import { formatTime } from 'utils/date-handler';

import style from '../console.module.scss';
import RenderDataValue from './render-data-value';

const ConsoleItemRenderer = ({
  onClickChange,
  item,
  index,
  highlightedIndex,
  showFullTextArray,
  showIndex,
  handleShowFullText,
  renderDataValue,
  toggleShow,
}) => {
  const getStylesAndIcon = useMemo(() => {
    let bgColor, textColor, icon;

    switch (item.type) {
      case 'warns':
        textColor = 'var(--orange)';
        icon = 'AlertCircle';
        break;
      case 'logs':
      case 'infos':
      case 'asserts':
      case 'traces':
        textColor = 'var(--font-a)';
        icon = 'LogsIcon';
        break;
      case 'errors':
      case 'onErrors':
      case 'jsError':
      case 'unhandledPromiseRejection':
        textColor = 'var(--red)';
        icon = 'ErrorIcon';
        break;
      default:
        break;
    }

    return { bgColor, textColor, icon };
  }, [item.type]);

  const handleClickChange = useCallback(() => {
    onClickChange(item?.second);
  }, [onClickChange, item]);

  const showFullTextActionHandler = useCallback(() => {
    handleShowFullText(index);
  }, [handleShowFullText, index]);

  const handleToggleShow = useCallback(() => {
    toggleShow(index);
  }, [toggleShow, index]);

  return (
    <div
      className={`${style.child_container_one} ${index === highlightedIndex && style.rowHoverClass}`}
      onClick={handleClickChange}
      style={{
        backgroundColor: getStylesAndIcon.bgColor ? getStylesAndIcon.bgColor : '',
        color: getStylesAndIcon.textColor ? getStylesAndIcon.textColor : '',
        borderColor: index === highlightedIndex ? 'black' : 'transparent',
      }}
    >
      <div className={style.text_wrapper}>
        <div className={style.text_wrapper_left}>
          <span className={style.time}>{formatTime(Math.round(item.second))}</span>
          <div className={style.icon}>
            <Icon name={getStylesAndIcon.icon} />
          </div>
          {item.data?.length >= 1 && (
            <>
              <div className={style.data_span}>
                <span
                  className={style.inline_block_display}
                  onClick={showFullTextActionHandler}
                  style={{
                    width: showFullTextArray[index] ? '100%' : '300px',
                  }}
                >
                  <div
                    className={style.render_data_container}
                    style={{
                      whiteSpace: showFullTextArray[index] ? 'normal' : 'nowrap',
                    }}
                  >
                    <RenderDataValue data={item.data[0]} renderDataValue={renderDataValue} />
                    {item.data?.length === 2 &&
                      `   ${showIndex !== index ? <RenderDataValue data={item.data[1]} renderDataValue={renderDataValue} /> : ''}`}
                  </div>
                </span>
                <div>
                  {item.data?.length === 5 && (
                    <>
                      <p>
                        <RenderDataValue data={item.data[1]} renderDataValue={renderDataValue} />
                      </p>
                      <p>
                        <RenderDataValue data={item.data[2]} renderDataValue={renderDataValue} />
                      </p>
                      <p>
                        <RenderDataValue data={item.data[3]} renderDataValue={renderDataValue} />
                      </p>
                      <p>
                        <RenderDataValue data={item.data[4]} renderDataValue={renderDataValue} />
                      </p>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        {item.data?.length === 1 && typeof parse(item.data[0]) === 'object' && (
          <div className={style.icon} style={{ rotate: showIndex === index ? '90deg' : '' }} onClick={handleToggleShow}>
            <Icon name={'ArrowDownFilled'} />
          </div>
        )}
        {item.data?.length === 2 && typeof parse(item.data[1]) === 'object' && (
          <div className={style.icon} style={{ rotate: showIndex === index ? '90deg' : '' }} onClick={handleToggleShow}>
            <Icon name={'ArrowDownFilled'} />
          </div>
        )}
      </div>
      {item.data?.length === 1 && parse(item.data[0]) && showIndex === index && (
        <JsonView className={style.object_viewer} value={parse(item.data[0])} {...options} />
      )}
      {item.data?.length === 2 && typeof parse(item.data[1]) === 'object' && showIndex === index && (
        <JsonView className={style.object_viewer} value={parse(item.data[0])} {...options} />
      )}
    </div>
  );
};

const options = {
  collapsed: false,
  enableClipboard: false,
  displayDataTypes: false,
  displayObjectSize: false,
  highlightUpdates: false,
};

export default ConsoleItemRenderer;
