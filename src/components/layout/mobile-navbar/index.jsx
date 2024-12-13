import { useLocation, Link } from 'react-router-dom';

import home from 'assets/homeBlue.svg';
import bag from 'assets/bagBlue.svg';
import testRunLogo from 'assets/testRunLogoBlue.svg';
import setting from 'assets/settingBlue.svg';
import test from 'assets/test-case-blue.svg';
import notification from 'assets/notification.svg';
import captures from 'assets/captures1.svg';

import style from './navbar.module.scss';

const Navbar = ({ pathname }) => {
  const location = useLocation();

  const hideNavbar = location.pathname.includes('captures/');

  if (hideNavbar) {
    return null;
  }

  const routes = [
    {
      icon: home,
      path: '/home',
      noPath: false,
    },
    {
      icon: bag,
      path: '/projects',
      noPath: false,
    },
    {
      icon: setting,
      noPath: false,
      path: '/qa-testing',
    },

    {
      icon: test,
      path: '/test-cases',
      noPath: false,
    },
    {
      icon: testRunLogo,
      noPath: false,
      path: '/test-run',
    },
    {
      icon: captures,
      noPath: false,
      path: '/captures',
    },
    {
      icon: notification,
      noPath: false,
      path: '/activities',
    },
  ];

  return (
    <div className={style.navbar}>
      {' '}
      {routes?.map((ele) =>
        ele?.noPath ? (
          <div
            className={style.routes}
            key={Math.random()}
            style={{
              marginTop: '20px',
              backgroundColor:
                pathname === '/account-setting' ||
                pathname === '/user-management' ||
                pathname === '/activities' ||
                pathname === '/trash' ||
                pathname === '/shortcuts'
                  ? 'var(--active)'
                  : '',
            }}
          >
            <img src={ele.icon} onClick={ele.click && ele.click} alt="" style={{ filter: 'brightness(0) invert(1)' }} />
          </div>
        ) : (
          <div
            className={style.routes}
            key={Math.random()}
            style={{
              backgroundColor: pathname.startsWith(ele.path) && !ele.noPath ? ' rgba(7, 25, 82, 0.1)' : '',
            }}
          >
            <Link to={ele.path}>
              <img src={ele.icon} alt="" onClick={ele.click && ele.click} />
            </Link>
          </div>
        ),
      )}
    </div>
  );
};

export default Navbar;
