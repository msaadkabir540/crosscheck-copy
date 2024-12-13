import { useCallback, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';

import { useAppContext } from 'context/app-context';

import Modal from 'components/modal';
import IconButton from 'components/icon-button';
import CaptureShareWithComponent from 'components/captures-share-with';
import Button from 'components/button';
import Icon from 'components/icon/themed-icon';
import MobileMenu from 'components/mobile-menu';
import DeleteModal from 'components/delete-modal-forever';

import { useCreateCheckTask, useCreateCheckJiraTask } from 'api/v1/captures/tasks';
import { useDeleteCaptureById } from 'api/v1/captures/capture.js';

import StartTestingModal from '../../pages/captures/start-reporting-bugs';
import style from './style.module.scss';
import CreateTaskModal from '../create-task-modal';

const CaptureNavbarOption = ({ check, privatMode, refetch, isMobileView }) => {
  const navigate = useNavigate();
  const { userDetails } = useAppContext();
  const [isUrlCopied, setIsUrlCopied] = useState(false);
  const [isPublicUrlCopied, setIsPublicUrlCopied] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [cofirmDelete, setConfirmDelete] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isReportBug, setIsReportBug] = useState(false);

  const { mutateAsync: _createCheckTaskHandler, isLoading: _taskCreateLoading } = useCreateCheckTask();
  const { mutateAsync: _createJiraTaskHandler, isLoading: _createJiraTaskIsLoading } = useCreateCheckJiraTask();
  const { mutateAsync: _checkDeleteHandler } = useDeleteCaptureById();

  const handleCopyUrl = useCallback(() => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setIsUrlCopied(true);
        setTimeout(() => {
          setIsUrlCopied(false);
        }, 2000);
      })
      .catch((error) => {
        console.error('Error copying URL:', error);
      });
  }, []);

  const handleCopyPublicUrl = useCallback(() => {
    navigator.clipboard
      .writeText(check?.publicUrl)
      .then(() => {
        setIsPublicUrlCopied(true);
        setTimeout(() => {
          setIsPublicUrlCopied(false);
        }, 2000);
      })
      .catch((error) => {
        console.error('Error copying URL:', error);
      });
  }, [check?.publicUrl]);

  const handleDownload = useCallback(() => {
    fetch(check?.source)
      .then((response) => response.blob())
      .then((blob) => {
        const parts = check?.source?.split('/');
        const filename = parts[parts?.length - 1];
        saveAs(blob, filename);
        setShowMoreMenu(false);
      })
      .catch((error) => {
        console.error('Error downloading the image:', error);
      });
  }, [check?.source]);

  const handleDelete = useCallback(async () => {
    try {
      await _checkDeleteHandler(check?._id);
      setConfirmDelete(false);
      navigate('/captures');
    } catch (error) {
      console.error(error);
    }
  }, [_checkDeleteHandler, check?._id, navigate]);

  const checkIds = useMemo(() => [`${check?._id}`], [check?._id]);

  const submitHandlerTask = useCallback(
    async (data) => {
      try {
        const { name, description, clickUpAssignee, taskType, teamId, applicationType, listId, crossCheckAssignee } =
          data;

        const filteredData = {
          name,
          description,
          clickUpAssignee,
          taskType,
          teamId,
          applicationType,
          listId,
          crossCheckAssignee,
          checkIds,
        };
        await _createCheckTaskHandler(filteredData);
        setIsCreateTaskOpen(false);
      } catch (error) {
        console.log('error', error);
      }
    },
    [_createCheckTaskHandler, checkIds],
  );

  const submitHandlerJiraTask = useCallback(
    async (id, body) => {
      const {
        summary,
        description,
        jiraAssignee,
        applicationType,
        taskType,
        crossCheckAssignee,
        issueTypeId,
        jiraProjectId,
      } = body;

      const filteredData = {
        summary,
        description,
        jiraAssignee,
        applicationType,
        taskType,
        checkIds,
        crossCheckAssignee,
        issueTypeId,
        jiraProjectId,
      };

      try {
        await _createJiraTaskHandler({
          id,
          body: filteredData,
        });
        setIsCreateTaskOpen(false);
      } catch (error) {
        console.log('err', error);
      }
    },
    [_createJiraTaskHandler, checkIds],
  );

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleOpenCreateTaskModal = useCallback(() => {
    setIsCreateTaskOpen(true);
  }, []);

  const handleCloseCreateTaskModal = useCallback(() => {
    setIsCreateTaskOpen(false);
  }, []);

  const handleOpenConfirmDelete = useCallback(() => {
    setConfirmDelete(true);
  }, []);

  const toggleModalOpen = useCallback(() => {
    setShowMoreMenu(!showMoreMenu);
  }, [showMoreMenu]);

  const handleNvigateToSignUp = useCallback(() => {
    navigate('/sign-up');
  }, [navigate]);

  const handleNvigateToLogin = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  const handleShowMoreMenuFalse = useCallback(() => {
    setShowMoreMenu(false);
  }, []);

  const handleBugReportBtn = useCallback(() => {
    setIsReportBug(true);
  }, []);

  const handleIsReportBugCloseClick = useCallback(() => {
    setIsReportBug(false);
  }, [setIsReportBug]);

  return (
    <>
      <div className={style.captureNav_RightChild}>
        {privatMode ? (
          <>
            {userDetails?.id === check?.createdBy?._id && (
              <>
                {!isMobileView && (
                  <Button text={'Report Bug'} btnClass={style.copy_url_button} handleClick={handleBugReportBtn} />
                )}
                <Button text={'Share'} handleClick={handleOpenModal} />
              </>
            )}
            <IconButton
              onClick={toggleModalOpen}
              height={'24px'}
              width={'24px'}
              iconName={'MoreIcon'}
              className={style.iconClass}
            />
          </>
        ) : (
          <div className={style.public_mode_container}>
            <Button text={'Sign up for free'} btnClass={style.strokeBtn} handleClick={handleNvigateToSignUp} />
            {!isMobileView && (
              <Button text={'Login'} btnClass={style.strokeBtnTwo} handleClick={handleNvigateToLogin} />
            )}
          </div>
        )}
        <div className={style.moreMenu}>
          {showMoreMenu ? (
            <>
              {isMobileView ? (
                <MobileMenu isOpen={showMoreMenu} setIsOpen={setShowMoreMenu}>
                  <div className={style.mobileMenuDiv}>
                    {userDetails?.id === check?.createdBy?._id && (
                      <>
                        <div
                          style={{
                            cursor: check?.publicUrl ? 'pointer' : 'not-allowed',
                            pointerEvents: check?.publicUrl ? 'all' : 'none',
                            opacity: check?.publicUrl ? 1 : 0.5,
                          }}
                          className={`${style.flexImport} ${style.icon_color}`}
                          onClick={handleCopyPublicUrl}
                        >
                          <Icon name={'GlobeIcon'} />
                          <p className={style.text_color}>{isPublicUrlCopied ? 'Copied!' : 'Copy Public URL'}</p>
                        </div>
                        <div className={`${style.flexImport} ${style.icon_color}`} onClick={handleCopyUrl}>
                          <Icon name={'CopyLinkIcon'} />
                          <p className={style.text_color}>{isUrlCopied ? 'Copied!' : 'Copy Private URL'}</p>
                        </div>
                        <div className={`${style.flexImport} ${style.icon_color}`} onClick={handleOpenCreateTaskModal}>
                          <Icon name={'CreateTask'} />
                          <p className={style.text_color}>Create Task</p>
                        </div>
                      </>
                    )}
                    <>
                      <div onClick={handleDownload} className={`${style.flexImport} ${style.icon_color}`}>
                        <Icon name={'DownloadIcon'} />
                        <p className={style.text_color}>Download</p>
                      </div>
                      {userDetails?.id === check?.createdBy?._id && (
                        <div className={`${style.flexImport}`} onClick={handleOpenConfirmDelete}>
                          <Icon name={'DelRedIcon'} />
                          <p className={style.delete_button}>Delete</p>
                        </div>
                      )}
                    </>
                  </div>
                </MobileMenu>
              ) : (
                <div className={style.modalDiv}>
                  {userDetails?.id === check?.createdBy?._id && (
                    <>
                      <div
                        style={{
                          cursor: check?.publicUrl ? 'pointer' : 'not-allowed',
                          pointerEvents: check?.publicUrl ? 'all' : 'none',
                          opacity: check?.publicUrl ? 1 : 0.5,
                        }}
                        className={`${style.flexImport} ${style.icon_color}`}
                        onClick={handleCopyPublicUrl}
                      >
                        <Icon className={style.icon_color} name={'GlobeIcon'} />
                        <p className={style.text_color}>{isPublicUrlCopied ? 'Copied!' : 'Copy Public URL'}</p>
                      </div>

                      <div className={`${style.flexImport} ${style.icon_color}`} onClick={handleCopyUrl}>
                        <Icon name={'CopyLinkIcon'} />
                        <p className={style.text_color}>{isUrlCopied ? 'Copied!' : 'Copy Private URL'}</p>
                      </div>
                      <div className={`${style.flexImport} ${style.icon_color}`} onClick={handleOpenCreateTaskModal}>
                        <Icon name={'CreateTask'} />
                        <p className={style.text_color}>Create Task</p>
                      </div>
                    </>
                  )}
                  <>
                    <div onClick={handleDownload} className={`${style.flexImport} ${style.icon_color}`}>
                      <Icon name={'DownloadIcon'} />
                      <p className={style.text_color}>Download</p>
                    </div>
                    {userDetails?.id === check?.createdBy?._id && (
                      <div className={style.flexImport} onClick={handleOpenConfirmDelete}>
                        <Icon name={'DelRedIcon'} />
                        <p className={style.delete_button}>Delete</p>
                      </div>
                    )}
                  </>
                </div>
              )}
            </>
          ) : (
            ''
          )}
        </div>
        {cofirmDelete && (
          <DeleteModal
            openDelModal={cofirmDelete}
            setOpenDelModal={setConfirmDelete}
            name="Delete Capture"
            clickHandler={handleDelete}
            cancelText="No, Keep it"
            isLoading={false}
          />
        )}
        {isModalOpen && (
          <Modal open={isModalOpen} handleClose={handleCloseModal}>
            <CaptureShareWithComponent
              setIsModalOpen={setIsModalOpen}
              privateMode={privatMode}
              check={check}
              refetch={refetch}
            />
          </Modal>
        )}
        {isCreateTaskOpen && (
          <CreateTaskModal
            type={'Check'}
            checkData={[check]}
            isSubmitting={_taskCreateLoading}
            submitHandlerTask={submitHandlerTask}
            submitHandlerJiraTask={submitHandlerJiraTask}
            isJiraSubmitting={_createJiraTaskIsLoading}
            openDelModal={isCreateTaskOpen}
            setOpenDelModal={handleCloseCreateTaskModal}
          />
        )}

        {isReportBug && (
          <StartTestingModal open={isReportBug} handleClose={handleIsReportBugCloseClick} source={check?.source} />
        )}
      </div>
      {showMoreMenu && <div className={style.backdrop} onClick={handleShowMoreMenuFalse} />}
    </>
  );
};

export default CaptureNavbarOption;
