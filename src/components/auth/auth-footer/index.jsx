import React from 'react';

import style from './style.module.scss';

const AuthFooter = () => {
  return (
    <div className={style.footerClass}>
      <div className={style.left}>
        <a href="https://www.crosscheck.cloud/terms" target="_blank" rel="noopener noreferrer">
          <span> Terms</span>
        </a>
        <a href="https://www.crosscheck.cloud/privacy" target="_blank" rel="noopener noreferrer">
          <span> Privacy</span>
        </a>
        <a href="https://www.crosscheck.cloud/security" target="_blank" rel="noopener noreferrer">
          <span> Security</span>
        </a>
      </div>
      <div className={style.right}>
        <p>
          Need help?{' '}
          <a href="https://www.crosscheck.cloud/contact-us" target="_blank" rel="noopener noreferrer">
            <span> Contact Us</span>
          </a>
        </p>
      </div>
    </div>
  );
};

export default React.memo(AuthFooter);
