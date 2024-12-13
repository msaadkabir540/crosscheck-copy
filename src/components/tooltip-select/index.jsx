import classes from './tooltip.module.scss';

const TooltipSelect = ({ id, onClick, options, selectedOption, style, tooltip, className, tooltipStyle }) => {
  return (
    <div style={style} className={`${classes.button} ${className}`}>
      <span style={tooltipStyle} className={classes.tooltip}>
        {tooltip}
      </span>
      <select id={id} className={classes.select} value={selectedOption} onChange={(e) => onClick(e.target.value)}>
        {options.map((option) => (
          <option key={option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TooltipSelect;
