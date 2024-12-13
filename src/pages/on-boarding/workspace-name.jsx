import React, { useCallback, useEffect } from 'react';

import { useSearchParams } from 'react-router-dom';
import { isEqual } from 'lodash';

import { useAppContext } from 'context/app-context';

import TextField from 'components/text-field';

import style from './boarding.module.scss';

const WorkspaceName = ({ register, setValue }) => {
  const { userDetails } = useAppContext();
  const [searchParams] = useSearchParams();
  let WS_NAME = searchParams.get('name') || '';

  useEffect(() => {
    if (WS_NAME) {
      setValue('name', `${WS_NAME}'s Workspace`);
    } else if (userDetails?.name) {
      setValue('name', `${userDetails?.name}'s Workspace`);
    } else {
      setValue('name', `Workspace`);
    }
  }, [setValue, userDetails.name, WS_NAME]);

  const handleRegisterName = useCallback(() => {
    return register('name', {
      required: 'Required',
    });
  }, [register]);

  return (
    <>
      <div className={style.workspace}>
        <h3>Name your Workspace:</h3>
        <p className={style.p}>You can user your company or organization name</p>
        <TextField
          register={handleRegisterName}
          placeholder="Enter your workspace name here"
          name="name"
          type="text"
          data-cy="onbaording-naming of workspace"
          className={style.nameInput}
        />
      </div>
    </>
  );
};

export default React.memo(WorkspaceName, (prevProps, nextProps) => isEqual(prevProps, nextProps));
