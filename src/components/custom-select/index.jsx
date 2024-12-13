import { useState } from 'react';

import Icon from 'components/icon/themed-icon';

import style from './style.module.scss';

const BaseSelect = ({ selectedValue, onSelect, options = [], label = '1x' }) => {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div className={`${style.menuDiv} ${openMenu ? style.menuIsOpen : ''}`} onClick={() => setOpenMenu(!openMenu)}>
      <span>{label}</span>
      {openMenu && (
        <div className={style.menu}>
          {options.map((ele) => (
            <div
              key={ele.label}
              className={style.menuItems}
              style={{ background: selectedValue === ele?.value ? 'var(--bg-b)' : '' }}
            >
              <span onClick={() => onSelect(ele.value)}>{ele.label}</span>
              <div>{selectedValue === ele.value && <Icon name={'ThickTickIcon'} />}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BaseSelect;
