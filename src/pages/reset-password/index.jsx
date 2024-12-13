import ResetPasswordForm from 'pages/reset-password/reset-password-form';

import AuthFooter from 'components/auth/auth-footer';

import crosscheckLogo from 'assets/cross-check-logo.svg';

import style from './reset-password.module.scss';

const ResetPassword = () => {
  return (
    <>
      <div className={style.main}>
        <div className={style.inner}>
          <img src={crosscheckLogo} alt="" className={style.logo} />
          <div className={style.flex}>
            <div className={style.flexLeft}>
              <h1>Create Password</h1>
              <p>Create a strong password </p>
            </div>
            <ResetPasswordForm />
          </div>
        </div>
        <AuthFooter />
      </div>
    </>
  );
};

export default ResetPassword;
