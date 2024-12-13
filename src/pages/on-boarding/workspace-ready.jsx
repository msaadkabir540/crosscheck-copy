import React, { useCallback } from 'react';

import { useSearchParams } from 'react-router-dom';

import Button from 'components/button';
import Icon from 'components/icon/themed-icon';

import style from './boarding.module.scss';

const WorkspaceReady = ({ freeAvailed }) => {
  const [searchParams] = useSearchParams();
  const signUpType = searchParams.get('signUpType');

  const jumpToDashboard = useCallback(() => {
    const url = signUpType === 'Extension' ? '/captures' : !freeAvailed ? `/home?initialLogin=true` : '/home';
    window.location.href = url;
  }, [freeAvailed, signUpType]);

  return (
    <>
      <div className={style.ready}>
        <Icon name={'rocket'} iconClass={style.svg} />
        <p>Your new workspace is ready to empower quality excellence!</p>
        <p>{`Together, we'll create a world-class product. Happy testing!`}</p>
        <Button type={'button'} text={'Let’s Jump into App'} handleClick={jumpToDashboard} />
      </div>
    </>
  );
};

export default React.memo(WorkspaceReady);
