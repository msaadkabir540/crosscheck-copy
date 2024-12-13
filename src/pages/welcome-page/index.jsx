import { useParams, useSearchParams } from 'react-router-dom';

import Button from 'components/button';

import crosscheckLogo from '../../assets/cross-check-logo-white.svg';
import style from './sign.module.scss';

const WelcomePage = () => {
  const { email } = useParams();

  const [searchParams] = useSearchParams();

  const name = searchParams.get('name');
  const signUpType = searchParams.get('signUpType');

  const handleClick = () => {
    const url = `/on-boarding/${email}?name=${name}&&signUpType=${signUpType}`;
    window.location.href = url;
  };

  return (
    <>
      <div className={style.main}>
        <img src={crosscheckLogo} alt="" className={style.icon} />

        <h2>Welcome to Cross Check App</h2>
        <p>Your personal workspace is few steps ahead</p>
        <Button text={'Lets Do It'} handleClick={handleClick} />
      </div>
    </>
  );
};

export default WelcomePage;
