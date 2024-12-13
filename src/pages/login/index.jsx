import { Helmet } from 'react-helmet';

import LoginForm from 'pages/login/login-form';

import AuthFooter from 'components/auth/auth-footer';

import crosscheckLogo from 'assets/cross-check-logo.svg';

import style from './login.module.scss';

const Login = () => {
  return (
    <>
      <Helmet>
        <title>Login - Crosscheck Software Testing Tool</title>
        <meta
          name="description"
          content="Login to Crosscheck, the ultimate software testing tool. Streamline your software testing process, enhance collaboration & manage your projects efficiently."
        />
        <meta name="keywords" content=" Login - Crosscheck Software Testing Tool" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className={style.main}>
        <div className={style.inner}>
          <img className={style.logo} src={crosscheckLogo} alt="cross-check-logo" />
          <div className={style.flex}>
            <div className={style.flexLeft}>
              <h1 className={style.welcome1}>Welcome back to Crosscheck!</h1>
              <h1 className={style.welcome2}>Welcome back</h1>
              <p>Enter your credentials to log into your account </p>
            </div>
            <LoginForm />
          </div>
        </div>
        <AuthFooter />
      </div>
    </>
  );
};

export default Login;
