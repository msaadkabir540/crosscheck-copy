import { useEffect, useRef } from 'react';

import style from './mobile-menu.module.scss';

const MobileMenu = ({ isOpen, setIsOpen, children, extraPadding }) => {
  const menuRef = useRef(null);

  const closeMenu = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', closeMenu);

    return () => {
      document.removeEventListener('mousedown', closeMenu);
    };
  }, []);

  return (
    <>
      {isOpen && <div className={style.displayHidden} onClick={() => setIsOpen(null)}></div>}

      <div className={`${style.menu} ${isOpen ? style.open : ''}`} ref={menuRef}>
        <div className={style['menu-content']} style={{ paddingBottom: extraPadding ? '60px' : '' }}>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'center',
            }}
          >
            <div className={style.handle} onClick={() => setIsOpen(null)}></div>
          </div>
          {children}
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
