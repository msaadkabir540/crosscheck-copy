import { useCallback } from 'react';

import IconButton from 'components/icon-button';

import style from '../table.module.scss';

const IconButtonContainer = ({ onIconClick, row, rowIndex, highlightedRowIndex }) => {
  const handleIconClick = useCallback(() => {
    onIconClick(Math.round(row.second));
  }, [onIconClick, row]);

  return (
    <div className={style.padding_five}>
      <IconButton
        onClick={handleIconClick}
        iconName={rowIndex === highlightedRowIndex ? 'play-small-blurred' : 'play-small-none'}
        hoverIconName={'play-small-blurred'}
        height={'16px'}
        width={'16px'}
      />
    </div>
  );
};

export default IconButtonContainer;
