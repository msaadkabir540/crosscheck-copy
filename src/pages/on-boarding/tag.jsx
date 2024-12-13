import React, { useCallback } from 'react';

import { isEqual } from 'lodash';

import style from './boarding.module.scss';

const Tag = ({ ele, selected, index, setSelected, dataCyPrefix }) => {
  const handleClick = useCallback(() => {
    setSelected(ele);
  }, [setSelected, ele]);

  return (
    <div
      className={`${style.tag} ${ele === selected ? style.selectedPeople : ''}`}
      onClick={handleClick}
      data-cy={`${dataCyPrefix}${index}`}
    >
      <p>{ele}</p>
    </div>
  );
};

export default React.memo(Tag, (prevProps, nextProps) => isEqual(prevProps, nextProps));
