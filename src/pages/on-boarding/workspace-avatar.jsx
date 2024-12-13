import React, { useCallback } from 'react';

import { isEqual } from 'lodash';

import ImageUploader from 'components/image-uploader';

import style from './boarding.module.scss';

const WorkspaceAvatar = ({ setValue, watch }) => {
  const firstChar = useCallback(() => {
    return watch('name')?.charAt(0)?.toUpperCase() || '-';
  }, [watch]);

  return (
    <div className={style.workspace}>
      <h3>Choose Workspace’s Avatar:</h3>
      <div className={style.flex}>
        <ImageUploader setValue={setValue} watch={watch} />
        <div className={style.empty}>
          <p>OR</p>
        </div>
        <div className={style.colorCircle}>
          <p>{firstChar()}</p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(WorkspaceAvatar, (prevProps, nextProps) => isEqual(prevProps, nextProps));
