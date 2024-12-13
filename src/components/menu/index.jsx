import { useState } from 'react';

import style from './menu.module.scss';
import Icon from '../icon/themed-icon';

const Menu = ({ menu, searchable, type, backClass, isDisabled, handleSubmit, handleClear }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMenu = menu?.filter((ele) =>
    ele?.title?.props?.children[type === 'dev' ? 1 : 2]?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleClearFunc = () => {
    handleClear();
    setSearchTerm('');
  };

  return (
    <div className={style.mainDiv}>
      {searchable && (
        <div className={style.search}>
          <Icon name={'SearchIcon'} />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={style.searchInput}
          />
        </div>
      )}
      {searchable && !filteredMenu?.length ? (
        <div className={style.noOption}>No options</div>
      ) : (
        (searchable ? filteredMenu : menu)?.map((ele) => {
          if (!ele) {
            return;
          }

          return (
            <div className={`${style.innerDiv} ${backClass} `} onClick={ele?.click} key={Math.random()}>
              {ele?.img ||
                (ele?.compo && (
                  <div style={{ width: '15px' }}>
                    {ele?.img ? <img src={ele?.img} alt="" /> : ele?.compo ? ele?.compo : ''}
                  </div>
                ))}
              {<p data-cy={ele?.cypressAttr}>{ele?.title}</p>}
            </div>
          );
        })
      )}
      {searchable && (
        <div className={style.btns}>
          <span onClick={handleClearFunc} style={{ color: isDisabled ? 'var(--font-e)' : '' }}>
            Clear
          </span>
          <span
            onClick={(e) => {
              e.stopPropagation();
              handleSubmit();
            }}
          >
            Apply
          </span>
        </div>
      )}
    </div>
  );
};

export default Menu;
