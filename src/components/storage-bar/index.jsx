import { useMemo } from 'react';

import style from './storage-bar.module.scss';

const StorageBar = ({ totalStorageInGb, usedStorage }) => {
  const calculatePercentage = useMemo(() => {
    return (usedStorage?.totalSizeInBytes / (totalStorageInGb * 1024 * 1024 * 1024)) * 100;
  }, [usedStorage, totalStorageInGb]);

  const usagePercentage = calculatePercentage;
  const unusedPercentage = 100 - usagePercentage;

  let formattedSize;

  if (usedStorage.totalSizeInGb >= 1) {
    formattedSize = `${usedStorage?.totalSizeInGb.toFixed(1)} GB`;
  } else if (usedStorage?.totalSizeInMb >= 1) {
    formattedSize = `${usedStorage?.totalSizeInMb.toFixed(1)} MB`;
  } else if (usedStorage?.totalSizeInKb >= 1) {
    formattedSize = `${usedStorage?.totalSizeInKb.toFixed(1)} KB`;
  } else {
    formattedSize = `${usedStorage?.totalSizeInBytes} Bytes`;
  }

  return (
    <>
      <div className={style.value}>
        <span>{formattedSize}</span>
        <span>{totalStorageInGb} GB</span>
      </div>
      <div className={style.storageBar}>
        <div className={style.usage} style={{ width: `${usagePercentage}%` }} />
        <div className={style.unused} style={{ width: `${unusedPercentage}%` }} />
      </div>
    </>
  );
};

export default StorageBar;
