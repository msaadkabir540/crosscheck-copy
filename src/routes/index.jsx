import { useMemo, useEffect } from 'react';

import { Route, Navigate, Routes, useLocation } from 'react-router-dom';

import { useAppContext } from 'context/app-context';

import { getToken, sendTokenToChromeExtension } from 'utils/token';

import { getExtensionToken, publicRoute, routes } from './helper';

const Router = () => {
  const { userDetails } = useAppContext();
  const location = useLocation();
  const token = getToken();

  const privateRoutes = useMemo(() => {
    return routes(userDetails?.role, userDetails?.activePlan, userDetails?.signUpType);
  }, [userDetails]);

  useEffect(() => {
    const extensionToken = async () => {
      if (token) {
        const extensionToken = await getExtensionToken(token);

        extensionToken && sendTokenToChromeExtension(extensionToken);
      }
    };

    extensionToken();
  }, [token]);

  const pathname = useMemo(() => {
    const isExist = privateRoutes.some((route) => location.pathname.includes(route.path)) || false;

    if (isExist) {
      return location.pathname;
    } else {
      return '';
    }
  }, [location.pathname, privateRoutes]);

  return (
    <Routes>
      {/* NOTE: Public routes */}
      {!token && publicRoute?.map(({ path, element }) => <Route key={path} path={path} element={element} />)}

      {/* NOTE: Private routes */}
      {privateRoutes?.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={token ? element : <Navigate to={`/login${pathname ? `?redirectPath=${pathname}` : ''}`} />}
        />
      ))}
      {/* NOTE: all AccessAble routes */}
    </Routes>
  );
};

export default Router;
