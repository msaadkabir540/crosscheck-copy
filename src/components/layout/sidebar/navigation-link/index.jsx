import React, { useCallback } from 'react';

import { isEqual } from 'lodash';
import { Link } from 'react-router-dom';

const NavigationLink = ({ to, onClick, className, children }) => {
  const handleClick = useCallback(() => {
    onClick();
  }, [onClick]);

  return (
    <Link to={to} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
};

export default React.memo(NavigationLink, (prevProps, nextProps) => isEqual(prevProps, nextProps));
