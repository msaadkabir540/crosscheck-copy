import { useCallback, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import Icon from 'components/icon/themed-icon';
import DeleteModal from 'components/delete-modal-forever';

import { useCreateCheckTask, useCreateCheckJiraTask } from 'api/v1/captures/tasks';

import { formattedDate, formatTime } from 'utils/date-handler';

import gearAnimation from 'assets/animation/gears.json';

import CaptureMoreOption from './card-more-option';
import style from './capture-card.module.scss';
import AnimationComponent from '../lottie-animation';
import CreateTaskModal from '../create-task-modal';

const CaptureCard = (props) => {
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [hover, setHover] = useState(false);
  const [isUrlCopied, setIsUrlCopied] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  const { mutateAsync: _createCheckTaskHandler, isLoading: _taskCreateLoading } = useCreateCheckTask();
  const { mutateAsync: _createJiraTaskHandler, isLoading: _createJiraTaskIsLoading } = useCreateCheckJiraTask();

  const handleCopyUrl = useCallback(() => {
    navigator.clipboard
      .writeText(`${window.location.href}/${props._id}`)
      .then(() => {
        setIsUrlCopied(true);
        setTimeout(() => {
          setIsUrlCopied(false);
        }, 2000);
      })
      .catch((error) => {
        console.error('Error copying URL:', error);
      });
  }, [props._id]);

  const handleCopyClick = useCallback(
    (e) => {
      e.stopPropagation();
      handleCopyUrl();
    },
    [handleCopyUrl],
  );

  const submitHandlerTask = useCallback(
    async (data) => {
      try {
        const { name, description, clickUpAssignee, taskType, teamId, applicationType, listId, crossCheckAssignee } =
          data;

        const checkIds = [`${props?._id}`];

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
    [_createCheckTaskHandler, props?._id],
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
    [_createJiraTaskHandler],
  );

  const handleReportBug = useCallback(() => {
    props.setOpenBug(true);
    props.setReportingIndex(props?.reportingIndex);
  }, [props]);

  const handleMouseEnter = useCallback(() => {
    setHover(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHover(false);
  }, []);

  const handleCreateTaskOpen = useCallback(() => {
    setIsCreateTaskOpen(false);
  }, []);

  const handleDelete = useCallback((e) => {
    setConfirmDelete(e);
  }, []);

  const clickHandler = useCallback(
    (e) => {
      e.stopPropagation();
      props?.handleDelete();
      setConfirmDelete(false);
    },
    [props],
  );

  const handleNavigate = useCallback(() => {
    navigate(`/captures/${props._id}`);
  }, [navigate, props._id]);

  return (
    <>
      <div className={style.main}>
        <div className={style.image} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {props?.isProcessing ? (
            <div className={style.is_processing_container}>
              <div>
                <AnimationComponent data={gearAnimation} />
                <div>Loading Preivew</div>
              </div>
            </div>
          ) : (
            <img src={props?.thumbnail} className={style.mainImage} alt="thumbnail" />
          )}
          {hover && (
            <div className={style.hover_options}>
              <div className={style.first_hover_options}>
                <div className={style.option} onClick={handleCopyClick}>
                  {isUrlCopied ? 'Copied!' : 'Copy URL'}
                </div>
                <div className={style.option} onClick={handleNavigate}>
                  View Check
                </div>
              </div>
              <div className={style.option} onClick={handleReportBug}>
                Report Bug
              </div>
            </div>
          )}
          {Boolean(props?.type === 'currentTab' || props?.type === 'fullScreen' || props?.type === 'instantReplay') && (
            <div className={style.duration}>
              <Icon name={'playIcon'} />
              {props?.duration ? formatTime(props?.duration) : '--/--'}
            </div>
          )}
        </div>
        <div className={style.lowerSection}>
          <div className={style.userInfo}>
            <p className={style.text}>
              <span>Created At:</span>
              {props?.createdAt ? formattedDate(props?.createdAt, ' d MMMM yyyy') : 'No Date'}
            </p>
          </div>
          <div className={style.date}>
            <div className={style.moreMenu}>
              <CaptureMoreOption
                isOpen={props.isOpen}
                setOpenOptionIndex={props.setOpenOptionIndex}
                toggleOption={props.toggleOption}
                check={props}
                onDelete={handleDelete}
                setIsCreateTaskOpen={setIsCreateTaskOpen}
              />
            </div>
          </div>
        </div>
      </div>
      {confirmDelete && (
        <DeleteModal
          openDelModal={confirmDelete}
          setOpenDelModal={setConfirmDelete}
          name="Delete Capture"
          clickHandler={clickHandler}
          cancelText="No, Keep it"
          isLoading={false}
        />
      )}
      {isCreateTaskOpen && (
        <CreateTaskModal
          type={'Check'}
          checkData={[props]}
          isSubmitting={_taskCreateLoading}
          submitHandlerTask={submitHandlerTask}
          submitHandlerJiraTask={submitHandlerJiraTask}
          isJiraSubmitting={_createJiraTaskIsLoading}
          openDelModal={isCreateTaskOpen}
          setOpenDelModal={handleCreateTaskOpen}
        />
      )}
    </>
  );
};

export default CaptureCard;
