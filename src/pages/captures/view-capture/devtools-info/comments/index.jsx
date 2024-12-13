import { useCallback, useEffect, useRef, useState } from 'react';

import { useForm } from 'react-hook-form';

import { useAppContext } from 'context/app-context';
import { useCaptureContext } from 'context/capture-context';

import DeleteModal from 'components/delete-modal';
import CommentAttachment from 'components/upload-attachments/comment-attachment/comment-attachment';
import Icon from 'components/icon/themed-icon';

import { useToaster } from 'hooks/use-toaster';

import style from './comments.module.scss';
import Comment from './comment-container';
import {
  useAddUserCheckComment,
  useAddAnonymousCheckComment,
  useDeleteCheckComment,
  useGetCheckComments,
  useGetAnonymousCheckComments,
} from '../../../../../api/v1/captures/comments';

const Comments = ({ check }) => {
  const { checkId } = useCaptureContext();

  const { userDetails } = useAppContext();
  const { data: _commentsData, refetch: commentsRefetch } = useGetCheckComments(checkId, userDetails?.id);

  const { data: _commentsAnonymousData, refetch: commentsAnonymousRefetch } = useGetAnonymousCheckComments(
    checkId,
    userDetails?.id,
  );
  const { toastSuccess, toastError } = useToaster();
  const { mutateAsync: _deleteCommentHandler } = useDeleteCheckComment();
  const [openDelModal, setOpenDelModal] = useState(false);
  const [commentId, setCommentId] = useState('');
  const [editComment, setEditComment] = useState('');

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      comment: {
        text: '',
        files: [],
      },
    },
  });

  const deleteHandler = useCallback(async () => {
    if (commentId) {
      try {
        setOpenDelModal(false);
        const res = await _deleteCommentHandler({ commentId });
        userDetails?.id ? await commentsRefetch() : commentsAnonymousRefetch();
        toastSuccess(res?.msg);
      } catch (error) {
        toastError(error);
      }
    }
  }, [
    _deleteCommentHandler,
    commentId,
    commentsAnonymousRefetch,
    commentsRefetch,
    toastError,
    toastSuccess,
    userDetails?.id,
  ]);

  const { mutateAsync: _addCommentHandler, isLoading: isAddingComment } = useAddUserCheckComment();

  const { mutateAsync: _addAnonymousCommentHandler, isLoading: isAddingAnonymousComment } =
    useAddAnonymousCheckComment();

  const onSubmit = async (data) => {
    try {
      if (((data.comment.text || data?.comment.files) && !isAddingComment) || isAddingAnonymousComment) {
        const body = {
          checkId: checkId,
          comment: data.comment.text,
          file: data?.comment?.files?.length ? data?.comment?.files : [],
          name: data?.comment?.name,
        };

        if (!userDetails.id) {
          body.name = data.comment.name;
        }

        const res = userDetails.id ? await _addCommentHandler({ body }) : await _addAnonymousCommentHandler({ body });

        userDetails?.id ? commentsRefetch() : commentsAnonymousRefetch();
        toastSuccess(res?.msg);
        reset();
      }
    } catch (error) {
      toastError(error);
    }
  };

  const endOfCommentsRef = useRef(null);

  useEffect(() => {
    const commentsContainer = document.getElementById('comments-container');
    const scrollPosition = commentsContainer.scrollHeight - commentsContainer.clientHeight - 70;
    commentsContainer.scrollTo({ top: scrollPosition, behavior: 'smooth' });
  }, [_commentsAnonymousData, _commentsData]);

  return (
    <div className={style.mainComments}>
      {openDelModal && (
        <DeleteModal
          openDelModal={openDelModal}
          setOpenDelModal={setOpenDelModal}
          clickHandler={deleteHandler}
          name={'comment'}
        />
      )}

      <div className={style.comments} id="comments-container">
        {_commentsAnonymousData?.comments.map((comment, i) => {
          return (
            <>
              <Comment
                checkInfo={check}
                key={comment._id}
                index={i}
                comment={comment}
                editComment={editComment}
                setEditComment={setEditComment}
                setOpenDelModal={setOpenDelModal}
                setCommentId={setCommentId}
                userDetails={userDetails}
                checkId={checkId}
                commentsRefetch={userDetails?.id ? commentsRefetch : commentsAnonymousRefetch}
              />
            </>
          );
        })}
      </div>
      <div ref={endOfCommentsRef} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={style.inputField}>
          <CommentAttachment
            {...{
              name: 'comment',
              control,
              icon: <Icon name={'AttachFile'} />,
              className: style.attachment,
              commentInputClass: style.commentInputClass,
              setValue,
              register,
              watch,
              errors,
              maxSize: 10 * 1024 * 1024,
              accept: {
                'text/*': ['.txt', '.md'],
                'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp'],
                'application/*': [
                  '.pdf',
                  '.docx',
                  '.xls',
                  '.xlsx',
                  '.ppt',
                  '.pptx',
                  '.rtf',
                  '.vnd.ms-powerpoint',
                  '.msword',
                  '.vnd.ms-excel',
                  '.x-compressed',
                  '.x-zip-compressed',
                  '.vnd.openxmlformats-officedocument.wordprocessingml.document',
                  '.vnd.openxmlformats-officedocument.presentationml.presentation',
                  '.vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                ],
                'video/*': ['.mp4', '.mov', '.wmv', '.mkv', '.x-ms-wmv', '.x-matroska', '.quicktime'],
                'compressed/*': ['.zip', '.rar'],
              },
              isLoading: isAddingComment || isAddingAnonymousComment,
            }}
            id="attachment"
            dataCy={'comments-bugview-inputfield'}
            showNameField={!userDetails?.id}
          />
        </div>
      </form>
    </div>
  );
};

export default Comments;
