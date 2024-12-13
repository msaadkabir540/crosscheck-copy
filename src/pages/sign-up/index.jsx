import { Helmet } from 'react-helmet';

import SignUpForm from 'pages/sign-up/signup-form';

import AuthFooter from 'components/auth/auth-footer';

import crosscheckLogo from 'assets/cross-check-logo.svg';

import style from './signup.module.scss';

const SignUp = () => {
  return (
    <>
      <Helmet>
        <title> Sign Up - Crosscheck Software Testing Tool</title>
        <meta
          name="description"
          content="Sign up for Crosscheck, the premier software testing tool! Simplify your testing workflow, boost team collaboration, and optimize project management."
        />
        <meta name="keywords" content="Sign Up - Crosscheck Software Testing Tool" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <div className={style.main}>
        <div className={style.flex}>
          <div className={style.flexLeft}>
            <img className={style.logo} src={crosscheckLogo} alt="cross-check-logo" />
            <div>
              <h1 className={style.welcome1}>Get Started Now !</h1>
              <p>Create your account to experience All-in-One test management tool </p>
            </div>
          </div>
          <SignUpForm />
        </div>
        <AuthFooter />
      </div>
    </>
  );
};

export default SignUp;
