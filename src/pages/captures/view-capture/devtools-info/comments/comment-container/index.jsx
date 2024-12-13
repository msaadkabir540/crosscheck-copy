import { useCallback, useState } from 'react';

import { useForm } from 'react-hook-form';

import Button from 'components/button';
import TextField from 'components/text-field';
import { FileInput } from 'components/form-fields';
import Icon from 'components/icon/themed-icon';

import { useToaster } from 'hooks/use-toaster';

import { useEditCheckComment } from 'api/v1/captures/comments';

import { formattedDate } from 'utils/date-handler';

import style from './comment.module.scss';

const Comment = ({
  comment,
  checkInfo,
  setOpenDelModal,
  index,
  setCommentId,
  editComment,
  setEditComment,
  userDetails,
  checkId,
  commentsRefetch,
}) => {
  const form = useForm({
    defaultValues: {
      comment: {
        text: comment?.comment,
        files: comment?.file,
      },
    },
  });
  const { register, control, watch, reset, setValue, handleSubmit } = form;
  const { mutateAsync: _editCommentHandler } = useEditCheckComment();
  const formatDate = formattedDate(comment.updatedAt, "dd MMM',' yyyy 'at' hh:mm a");
  const { toastSuccess, toastError } = useToaster();

  const [discardedAttachments, setDiscardedAttachments] = useState([]);

  const deleteHandler = useCallback(() => {
    setOpenDelModal(true);
    setCommentId(comment._id);
  }, [comment._id, setCommentId, setOpenDelModal]);

  const editHandler = useCallback(() => {
    setEditComment(comment._id);
    setValue('editedText', comment?.comment);
    setValue('file', comment?.file);
  }, [comment._id, comment?.comment, comment?.file, setEditComment, setValue]);

  const discardEditedComment = useCallback(() => {
    setEditComment('');
    reset();
  }, [reset, setEditComment]);

  const onSubmit = async (data) => {
    try {
      const body = {
        checkId: checkId,
        comment: data.comment.text,
        file: data.comment?.files ? data.comment?.files : [],
        discardedFiles: discardedAttachments.length > 0 ? discardedAttachments : [],
      };

      setEditComment('');
      const res = await _editCommentHandler({ commentId: comment._id, body });
      await commentsRefetch();
      reset();
      toastSuccess(res?.msg);
    } catch (error) {
      toastError(error);
    }
  };

  const handleDeleteAttachment = useCallback(
    (e) => {
      if (e.fileKey) {
        setDiscardedAttachments((pre) => [...pre, e]);
      }

      const filteredFiles = watch(`comment.files`)?.filter((file) => {
        return file.fileUrl !== e.fileUrl;
      });

      setValue('comment.files', filteredFiles);
    },
    [setValue, watch],
  );

  const FileIcon = ({ type }) => {
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
    const videoTypes = ['mp4', 'mov', 'wmv', 'mkv', 'x-ms-wmv', 'x-matroska', 'quicktime'];

    const documentTypes = [
      'pdf',
      'word',
      'text',
      'doc',
      'docx',
      'xls',
      'xlsx',
      'ppt',
      'pptx',
      'txt',
      'md',
      'rtf',
      'csv',
      'msword',
    ];
    const compressedTypes = ['zip', 'rar'];

    switch (true) {
      case imageTypes.includes(type):
        return <Icon name={'ImageIcon'} />;
      case videoTypes.includes(type):
        return <Icon name={'VideoRecorderIcon'} />;
      case documentTypes.includes(type):
        return <Icon name={'Document'} />;
      case compressedTypes.includes(type):
        return <Icon name={'CompressedFile'} />;
      default:
        return <Icon name={'FileAttachment'} />;
    }
  };

  const changeHandler = (files) => {
    try {
      const dataFiles = files?.acceptedFiles;

      if (dataFiles && dataFiles?.length > 0) {
        const prevAttachment = watch(`comment.files`) || [];

        const newData = dataFiles?.map((x) => ({
          fileName: x.name,
          fileUrl: x.attachment,
          fileType: x.type,
        }));

        setValue('comment.files', [...prevAttachment, ...newData]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={style.main}>
      <div className={style.header}>
        <div className={style.dpName}>
          {comment?.createdBy ? (
            <>
              {comment?.createdBy?.profilePicture ? (
                <img
                  alt="createdby-profile"
                  src={comment?.createdBy?.profilePicture}
                  className={style.profilePicture}
                />
              ) : (
                <div className={style.alternative_name}>
                  {comment?.createdBy?.name
                    ?.split(' ')
                    ?.slice(0, 2)
                    ?.map((word) => word[0]?.toUpperCase())
                    ?.join('')}
                </div>
              )}
            </>
          ) : (
            <div className={style.alternative_name}>
              {comment?.name
                ?.split(' ')
                ?.slice(0, 2)
                ?.map((word) => word[0]?.toUpperCase())
                ?.join('')}
            </div>
          )}

          {comment?.createdBy ? (
            <span className={style.span}>{comment?.createdBy?.name}</span>
          ) : (
            <span className={style.span}>{comment?.name ? comment?.name : 'Anonymous'}</span>
          )}
        </div>

        <div className={style.iconDate}>
          <p className={style.date} data-comment-time={formatDate}>
            {formatDate}
          </p>

          {userDetails?.id &&
            (userDetails?.id === comment?.createdBy?._id || userDetails?.id === checkInfo?.createdBy?._id) && (
              <div className={style.editDeleteIcon}>
                {userDetails?.id === comment?.createdBy?._id && (
                  <div onClick={editHandler} data-cy={`edit-comentbugs${index}`}>
                    <Icon name={'EditIconGrey'} />
                  </div>
                )}
                <div onClick={deleteHandler} data-cy={`del-comentbugs${index}`}>
                  <Icon name={'DelIcon'} />
                </div>
              </div>
            )}
        </div>
      </div>
      {editComment === comment._id ? (
        <form onSubmit={handleSubmit(onSubmit)} className={style.editForm}>
          <div className={style.attachmentContainer}>
            <div className={style.file}>
              {watch('comment.files')?.length > 0 &&
                watch('comment.files')?.map((file) => {
                  return (
                    <div className={style.file} key={file?.fileKey}>
                      <FileIcon type={file.fileType} />
                      <a href={file?.fileUrl} target="_blank" rel="noreferrer">
                        {file?.fileName}
                      </a>
                      <DeleteAttachmentIcon file={file} handleDeleteAttachment={handleDeleteAttachment} />
                    </div>
                  );
                })}
            </div>
          </div>
          <TextField
            register={register}
            control={control}
            autoFocus
            name={`comment.text`}
            className={style.editField}
            data-cy={`bug-comments-edit-text-field`}
          />
          <div className={style.editModeFooter}>
            <div className={style.editModebtns}>
              <FileInput
                {...{
                  name: 'comment.files',
                  control,
                  multiple: true,
                  accept: {
                    'text/*': [
                      '.pdf',
                      '.doc',
                      '.docx',
                      '.xls',
                      '.xlsx',
                      '.ppt',
                      '.pptx',
                      '.txt',
                      '.csv',
                      '.md',
                      '.rtf',
                      '.txt',
                    ],
                    'images/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp'],
                    'video/*': ['.mp4', '.mov', '.wmv', '.mkv', '.x-ms-wmv', '.x-matroska', '.quicktime'],
                    'compressed/*': ['.zip', '.rar'],
                    'attachment/*': [],
                  },
                  wrapperClass: style.fullWidth,
                  onChangeHandler: (files) => {
                    changeHandler(files);
                  },
                }}
                dataCy="edit-attachment"
              >
                <Icon name={'AttachFile'} iconClass={style.attachIcon} />
              </FileInput>

              <Button
                text={'Discard'}
                btnClass={style.btn}
                handleClick={discardEditedComment}
                data-cy="discard-btn-bug-comment"
              />
              <Button text={'Save'} type={'submit'} data-cy="submit-btn-bug-comment" />
            </div>
          </div>
        </form>
      ) : (
        <div className={style.body}>
          <div className={style.attachmentContainer1}>
            {comment?.file?.length > 0 &&
              comment?.file?.map((file) => {
                return (
                  <div className={style.attachmentFile1} key={`${file?.fileUrl}${file?.fileName}`}>
                    <FileIcon type={file.fileType} />
                    <a className={style.a} href={file?.fileUrl} target="_blank" rel="noreferrer">
                      {file?.fileName}
                    </a>
                  </div>
                );
              })}
          </div>
          <p>{comment?.comment}</p>
        </div>
      )}
    </div>
  );
};

export default Comment;

const DeleteAttachmentIcon = ({ handleDeleteAttachment, file }) => {
  const handleDelete = useCallback(() => {
    handleDeleteAttachment(file);
  }, [handleDeleteAttachment, file]);

  return (
    <span onClick={handleDelete}>
      <Icon name={'CrossAttachment'} />
    </span>
  );
};
