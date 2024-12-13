import { Link } from 'react-router-dom';

import ForgotPasswordForm from 'pages/forgot-password/forgot-password-form';

import AuthFooter from 'components/auth/auth-footer';

import crosscheckLogo from 'assets/cross-check-logo.svg';
import arrow from 'assets/arrow-ticket-white.svg';

import style from './forgot-password.module.scss';

const ForgotPassword = () => {
  return (
    <>
      <div className={style.main}>
        <div className={style.inner}>
          <img className={style.logo} src={crosscheckLogo} alt="cross-check-logo" />
          <div className={style.flex}>
            <div className={style.flexLeft}>
              <h1>Reset Password</h1>
              <p>Please enter email associated to your account and we’ll send you a link to reset password. </p>
            </div>
            <div className={style.flex1}>
              <Link to="/login">
                <div className={style.innerFlex}>
                  <img src={arrow} alt="" />
                  <p>Back </p>
                </div>
              </Link>
              <ForgotPasswordForm />
            </div>
          </div>
        </div>
        <AuthFooter />
      </div>
    </>
  );
};

export default ForgotPassword;
