import { useCallback, useMemo, useState } from 'react';

import { useForm } from 'react-hook-form';

import Switch from 'components/switch';
import Icon from 'components/icon/themed-icon';

import './react-select.css';
import { useActivatePublicLink, useDeactivePublicLink } from 'api/v1/captures/share-with';

import style from './style.module.scss';
import AutoSuggestInput from '../auto-suggest-input';
import SharedUsersComponent from './share-users';
import CaptureRequestedUsers from './requested-users';

const CaptureShareWithComponent = ({ check, refetch, privateMode, setIsModalOpen }) => {
  const { mutateAsync: _requestActivatePublicLink } = useActivatePublicLink();
  const { mutateAsync: _requestDeActivatePublicLink } = useDeactivePublicLink();
  const { control } = useForm();
  const [isPublicLinkActivated, setIsPublicLinkActivated] = useState(check?.publicUrl ? true : false);
  const [isUrlCopied, setIsUrlCopied] = useState(false);
  const [publicLink, setPublicLink] = useState(check?.publicUrl);

  const onSwitchChange = useCallback(
    async (isChecked) => {
      if (isChecked) {
        const res = await _requestActivatePublicLink({ checkId: check?._id });
        setPublicLink(res?.publicUrl);
        navigator.clipboard.writeText(res?.publicUrl);
        setIsPublicLinkActivated(true);
      } else {
        await _requestDeActivatePublicLink({ checkId: check?._id });
        setIsPublicLinkActivated(false);
      }

      refetch();
    },
    [_requestActivatePublicLink, _requestDeActivatePublicLink, check?._id, refetch],
  );

  const handleCopyPrivateUrl = useCallback(() => {
    navigator.clipboard
      .writeText(publicLink)
      .then(() => {
        setIsUrlCopied(true);
        setTimeout(() => {
          setIsUrlCopied(false);
        }, 2000);
      })
      .catch((error) => {
        console.error('Error copying URL:', error);
      });
  }, [publicLink]);

  const requestedUsers = useMemo(() => {
    return check?.sharedWith?.filter((user) => user.status === 'requested');
  }, [check]);

  const handleCloseModal = useCallback(() => setIsModalOpen(false), [setIsModalOpen]);

  return (
    <div className={style.main_container}>
      <div className={style.modal_header}>
        <h4>Share Check</h4>
        <div className={style.cross_icon} onClick={handleCloseModal}>
          <Icon name={'CrossIcon'} />
        </div>
      </div>
      <div className={style.input_container}>
        <AutoSuggestInput privateMode={privateMode} refetch={refetch} />
      </div>
      <div className={style.public_url_container}>
        <h6>Public link</h6>
        <div className={style.toggle_public_link_container}>
          {(check?.publicUrl || isPublicLinkActivated) && (
            <div
              className={`${style.public_link_copy_container} ${!isPublicLinkActivated && style.disabled_container}`}
            >
              <Icon name={'GlobeIcon'} />
              <p onClick={handleCopyPrivateUrl}>{isUrlCopied ? 'Copied!' : 'Copy Public Link'}</p>
            </div>
          )}
          <Switch
            checked={isPublicLinkActivated}
            control={control}
            name={'switch'}
            handleSwitchChange={onSwitchChange}
          />
        </div>
      </div>
      {requestedUsers?.length ? <CaptureRequestedUsers check={check} requestedUsers={requestedUsers} /> : <></>}

      <SharedUsersComponent check={check} />
    </div>
  );
};

export default CaptureShareWithComponent;
