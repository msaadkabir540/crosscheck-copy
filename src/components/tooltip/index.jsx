import style from './tooltip.module.scss';

const Tooltip = ({
  tooltip,
  className,
  children,
  tooltipStyle,
  classTooltipStyle,
  position = 'right',
  adjustableWidth,
}) => {
  return (
    <div
      style={{
        width: position === 'left' ? '100%' : '',
        justifyContent: position === 'right' ? 'flex-end' : 'flex-start',
      }}
      className={`${style.button} ${className} ${style.display_flex}`}
    >
      <span style={tooltipStyle} className={`${style.tooltip} ${classTooltipStyle}`}>
        {tooltip}
      </span>
      <span
        className={style.content_style}
        style={{
          width: position === 'right' ? '100%' : 'unset',
        }}
      >
        <div className={`${style.content_container} ${adjustableWidth}`}>{children}</div>
      </span>
    </div>
  );
};

export default Tooltip;
