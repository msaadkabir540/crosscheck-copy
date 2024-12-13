import { useState } from 'react';

import { useForm } from 'react-hook-form';

import { useAppContext } from 'context/app-context';

import DeleteModal from 'components/delete-modal';
import CommentAttachment from 'components/upload-attachments/comment-attachment/comment-attachment';

import { useToaster } from 'hooks/use-toaster';

import { useAddComment, useDeleteComment, useGetComments } from 'api/v1/bugs/bugs';

import style from './comments.module.scss';
import Comment from './comment-container';
import Icon from '../../../../../components/icon/themed-icon';

const Comments = ({ bugId }) => {
  const { data: _commentsData, refetch: commentsRefetch } = useGetComments(bugId);
  const { userDetails } = useAppContext();
  const { toastSuccess, toastError } = useToaster();
  const { mutateAsync: _deleteCommentHandler } = useDeleteComment();
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

  const deleteHandler = async () => {
    if (commentId) {
      try {
        setOpenDelModal(false);
        const res = await _deleteCommentHandler({ commentId });
        await commentsRefetch();
        toastSuccess(res?.msg);
      } catch (error) {
        toastError(error);
      }
    }
  };

  const { mutateAsync: _addCommentHandler, isLoading: isAddingComment } = useAddComment();

  const onSubmit = async (data) => {
    try {
      if ((data.comment.text || data?.comment.files) && !isAddingComment) {
        const body = {
          bugId,
          comment: data.comment.text,
          file: data?.comment?.files?.length ? data?.comment?.files : [],
        };
        const res = await _addCommentHandler({ body });
        commentsRefetch();
        toastSuccess(res?.msg);
        reset();
      }
    } catch (error) {
      toastError(error);
    }
  };

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
        {_commentsData?.comments.map((comment, i) => {
          return (
            <Comment
              key={comment._id}
              index={i}
              comment={comment}
              editComment={editComment}
              setEditComment={setEditComment}
              setOpenDelModal={setOpenDelModal}
              setCommentId={setCommentId}
              userDetails={userDetails}
              bugId={bugId}
              commentsRefetch={commentsRefetch}
              data-cy="comments-bugview"
            />
          );
        })}
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={style.inputField}>
          <CommentAttachment
            {...{
              name: 'comment',
              control,
              icon: <Icon name={'AttachFile'} />,
              className: style.attachment,
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
              isLoading: isAddingComment,
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default Comments;