import React, { useRef, useCallback, useEffect, useState } from 'react';

import { isEqual } from 'lodash';

import { handleFile } from 'utils/file-handler';

import icon from 'assets/export-browse.png';

import style from './style.module.scss';

const ImageUploader = ({ setValue, watch }) => {
  const fileInputRef = useRef(null);
  const [avatar, setAvatar] = useState(watch('avatar'));

  const fileUpload = useCallback(
    async (event) => {
      const base64 = await handleFile(event, /(\.jpg|\.jpeg|\.svg|\.png|\.gif)$/i);
      setValue('avatar', base64);
      setAvatar(base64);
    },
    [setValue],
  );

  useEffect(() => {
    const subscription = watch((value) => setAvatar(value.avatar));

    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <label className={style.camDiv} data-cy="onboard-workspace-profile-input" htmlFor="file">
      {avatar ? <img src={avatar} alt="avatar" /> : <img src={icon} alt="avatar-icon" />}
      <input
        type="file"
        id="file"
        name="image"
        ref={fileInputRef}
        onChange={fileUpload}
        data-cy="onboard-workspace-profile-input"
      />
    </label>
  );
};

export default React.memo(ImageUploader, (prevProps, nextProps) => isEqual(prevProps, nextProps));
