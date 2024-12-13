import { useState, useRef, useCallback } from 'react';

import { useAppContext } from 'context/app-context';

import Icon from 'components/icon/themed-icon';

import style from './style.module.scss';
import { handleDownloadCheck } from '../../../utils/downlaod-file-handler';

const CaptureMoreOption = ({ isOpen, toggleOption, check, onDelete, setIsCreateTaskOpen, setOpenOptionIndex }) => {
  const { userDetails } = useAppContext();
  const [isUrlCopied, setIsUrlCopied] = useState(false);
  const [isPublicUrlCopied, setIsPublicUrlCopied] = useState(false);

  const menuRef = useRef(null);

  const handleCopyUrl = useCallback(
    (e) => {
      e.stopPropagation();
      navigator.clipboard
        .writeText(`${window.location.href}/${check._id}`)
        .then(() => {
          setIsUrlCopied(true);
          setOpenOptionIndex(null);
          setTimeout(() => {
            setIsUrlCopied(false);
          }, 2000);
        })
        .catch((error) => {
          console.error('Error copying URL:', error);
        });
    },
    [check?._id, setOpenOptionIndex],
  );

  const handleCopyPublicUrl = useCallback(
    (e) => {
      e.stopPropagation();

      if (!check?.publicUrl) {
        return;
      }

      navigator.clipboard
        .writeText(`${check?.publicUrl}`)
        .then(() => {
          setIsPublicUrlCopied(true);
          setOpenOptionIndex(null);
          setTimeout(() => {
            setIsPublicUrlCopied(false);
          }, 2000);
        })
        .catch((error) => {
          console.error('Error copying URL:', error);
        });
    },
    [check?.publicUrl, setOpenOptionIndex],
  );

  const handleOpenTaskModal = useCallback(() => {
    setIsCreateTaskOpen(true);
    setOpenOptionIndex(null);
  }, [setIsCreateTaskOpen, setOpenOptionIndex]);

  const handleDelete = useCallback(() => {
    if (userDetails?.id !== check?.createdBy?._id) {
      return;
    }

    onDelete(true);
    setOpenOptionIndex(null);
  }, [check?.createdBy?._id, userDetails?.id, onDelete, setOpenOptionIndex]);

  const handleDownloadAction = useCallback(
    (e) => {
      if (check?.isProcessing) {
        return;
      } else {
        e.stopPropagation();
        handleDownloadCheck(
          check?.type === 'fullPageScreenshot' ||
            check?.type === 'visibleScreenshot' ||
            check?.type === 'selectedAreaScreenshot'
            ? check?.thumbnail
            : check?.source,
        );
        setOpenOptionIndex(null);
      }
    },
    [check?.isProcessing, check?.type, check?.thumbnail, check?.source, setOpenOptionIndex],
  );

  return (
    <div className={style.captureNav_RightChild}>
      <div onClick={toggleOption} className={style.more_icon}>
        <Icon name={'MoreIconSmall'} />
      </div>

      <div className={style.moreMenu} ref={menuRef}>
        {isOpen ? (
          <div className={style.modalDiv}>
            <div
              onClick={handleCopyPublicUrl}
              disabled={true}
              className={check?.publicUrl ? `${style.flexImport}` : `${style.DisableFlexImport}`}
            >
              <Icon height={'16px'} width={'16px'} name={'GlobeIcon'} iconClass={style.icon} />
              <p>{isPublicUrlCopied ? 'Copied!' : 'Copy Public URL'}</p>
            </div>

            <div onClick={handleCopyUrl} className={style.flexImport}>
              <Icon height={'16px'} width={'16px'} name={'CopyLinkIcon'} iconClass={style.icon} />
              <p>{isUrlCopied ? 'Copied!' : 'Copy Private URL'}</p>
            </div>
            <div className={`${style.flexImport} ${style.create_task_icon_style}`} onClick={handleOpenTaskModal}>
              <Icon height={'16px'} width={'16px'} name={'CreateTask'} />
              <p>Create asdsad</p>
            </div>
            <div
              className={`${style.flexImport} ${check?.isProcessing ? style.disabled : ''}`}
              onClick={handleDownloadAction}
            >
              <Icon height={'16px'} width={'16px'} name={'DownloadIcon'} iconClass={style.icon} />
              <p>Download</p>
            </div>

            <div
              className={
                userDetails?.id === check?.createdBy?._id ? `${style.flexImport}` : `${style.DisableFlexImport}`
              }
              onClick={handleDelete}
              disabled={!(userDetails?.id === check?.createdBy?._id)}
            >
              <Icon height={'16px'} width={'16px'} name={'DelIcon'} iconClass={style.delIcon} />
              <p className={style.red_color}>Delete</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CaptureMoreOption;
