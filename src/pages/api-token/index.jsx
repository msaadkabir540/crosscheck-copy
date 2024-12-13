import { useCallback, useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';

import { useAppContext } from 'context/app-context';

import Button from 'components/button';
import TextField from 'components/text-field';
import MainWrapper from 'components/layout/main-wrapper';

import { useToaster } from 'hooks/use-toaster';

import { useCreateApiToken, useGetUserApiTokens } from 'api/v1/api-token/api-token';

import { formattedDate } from 'utils/date-handler';

import eye from 'assets/eye.svg';

import style from './token.module.scss';

const UserManagement = () => {
  const [apiToken, setApiToken] = useState('');
  const [showToken, setShowToken] = useState(false);

  const {
    formState: { errors },
  } = useForm();

  const { toastError, toastSuccess } = useToaster();
  const { userDetails } = useAppContext();

  const { mutateAsync: _createApiTokenHandler } = useCreateApiToken();
  const { mutateAsync: _getUserApiTokens } = useGetUserApiTokens();

  const fetchUserTokens = useCallback(async () => {
    try {
      const response = await _getUserApiTokens();

      const accessKeyFound = response?.accessKeys?.find(
        (ak) => ak?.workSpaceId == userDetails?.lastAccessedWorkspace && ak?.accessKey,
      );

      if (accessKeyFound) {
        setApiToken(accessKeyFound?.accessKey);
      }
    } catch (error) {
      toastError(error);
    }
  }, [_getUserApiTokens, toastError, userDetails]);

  useEffect(() => {
    fetchUserTokens();
  }, [fetchUserTokens]);

  const handleCreate = useCallback(async () => {
    try {
      const res = await _createApiTokenHandler();

      if (res) {
        setApiToken(res?.secretKey);
        toastSuccess(res.msg);
      }
    } catch (error) {
      toastError(error);
    }
  }, [_createApiTokenHandler, toastError, toastSuccess]);

  const onEyeClick = useCallback(() => setShowToken((prev) => !prev), []);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard
      .writeText(apiToken)
      .then(() => {
        toastSuccess('Token copied to clipboard');
        console.log('Token copied to clipboard:', apiToken);
      })
      .catch((error) => {
        toastError('Token copied to clipboard');

        console.error('Copy to clipboard failed:', error);
      });
  }, [apiToken, toastError, toastSuccess]);

  return (
    <MainWrapper title="API Token" date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}>
      <div className={style.userMain}>
        <div className={style.createWrapper}>
          <p>
            Use this token to connect your automation tool with crosscheck. Read <span>instructions</span> to get
            started
          </p>
          <Button
            type={'button'}
            btnClass={style.btn}
            disabled={!!apiToken}
            text="Create API Token"
            id="create-api-token-btn"
            handleClick={handleCreate}
          />
        </div>
        <div>
          <TextField
            disabled
            icon={eye}
            label="Token"
            placeholder=""
            name="apiToken"
            value={apiToken}
            onClick={onEyeClick}
            wraperClass={style.label}
            type={showToken ? 'text' : 'password'}
            errorMessage={errors.password && errors.password.message}
          />
        </div>
        <div className={style.buttonDiv}>
          <Button
            type={'button'}
            text="Copy Token"
            btnClass={style.copyBtn}
            id="create-api-token-btn"
            handleClick={copyToClipboard}
            iconStart={'/assets/Duplicate.svg'}
          />
          <Button type={'button'} text="Regenerate" handleClick={handleCreate} id="create-api-token-btn" />
        </div>
      </div>
    </MainWrapper>
  );
};

export default UserManagement;
