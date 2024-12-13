import { useState } from 'react';

import Icon from 'components/icon/themed-icon';

import classes from './icon-button.module.scss';

const IconButton = ({ onClick, iconName, hoverIconName, tooltip, className, name, tooltipStyle, height, width }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className={`${classes.button} ${className}`}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ height: height, width: width }}
    >
      <Icon
        name={isHovered && hoverIconName ? hoverIconName : iconName}
        height={height ? height : '24px'}
        width={width ? width : '24px'}
      />
      <span style={tooltipStyle} className={classes.tooltip}>
        {tooltip}
      </span>
      {name}
    </div>
  );
};

export default IconButton;
