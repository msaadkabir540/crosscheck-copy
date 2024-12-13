import { useState } from 'react';

import { useForm } from 'react-hook-form';

import Permissions from 'components/permissions';
import Button from 'components/button';
import TextField from 'components/text-field';
import { FileInput } from 'components/form-fields';

import { useToaster } from 'hooks/use-toaster';

import { useEditComment } from 'api/v1/bugs/bugs';

import { formattedDate } from 'utils/date-handler';
import { fileCaseHandler } from 'utils/file-handler';

import style from './comment.module.scss';
import Icon from '../../../../../../components/icon/themed-icon';

const Comment = ({
  comment,
  setOpenDelModal,
  index,
  setCommentId,
  editComment,
  setEditComment,
  userDetails,
  bugId,
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
  const { mutateAsync: _editCommentHandler } = useEditComment();
  const formatDate = formattedDate(comment.updatedAt, "dd MMM',' yyyy 'at' hh:mm a");
  const { toastSuccess, toastError } = useToaster();

  const [discardedAttachments, setDiscardedAttachments] = useState([]);

  const deleteHandler = () => {
    setOpenDelModal(true);
    setCommentId(comment._id);
  };

  const editHandler = () => {
    setEditComment(comment._id);
    setValue('editedText', comment?.comment);
    setValue('file', comment?.file);
  };

  const discardEditedComment = () => {
    setEditComment('');
    reset();
  };

  const onSubmit = async (data) => {
    try {
      const body = {
        bugId: bugId,
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

  const handleDeleteAttachment = (e) => {
    if (e.fileKey) {
      setDiscardedAttachments((pre) => [...pre, e]);
    }

    const filteredFiles = watch(`comment.files`)?.filter((file) => {
      return file.fileUrl !== e.fileUrl;
    });

    setValue('comment.files', filteredFiles);
  };

  const FileIcon = ({ type }) => {
    const imageTypes = ['jpeg', 'png', 'gif', 'bmp'];
    const videoTypes = ['mp4', 'mov', 'wmv', 'mkv'];

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
    ];
    const compressedTypes = ['zip', 'rar'];
    const fileExtension = type?.split('/')[1];
    const formattedExtension = fileCaseHandler(fileExtension);

    switch (true) {
      case imageTypes.includes(formattedExtension):
        return <Icon name={'ImageIcon'} />;
      case videoTypes.includes(formattedExtension):
        return <Icon name={'VideoRecorderIcon'} />;
      case documentTypes.includes(formattedExtension):
        return <Icon name={'Document'} />;
      case compressedTypes.includes(formattedExtension):
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
          <img
            alt="createdBy-profilePicture"
            src={comment?.createdBy?.profilePicture}
            className={style.profilePicture}
          />
          <span>{comment?.createdBy?.name}</span>
        </div>

        <div className={style.iconDate}>
          <p className={style.date} data-comment-time={formatDate}>
            {formatDate}
          </p>
          {userDetails?.id === comment?.createdBy._id ? (
            <div className={style.editDeleteIcon}>
              <div onClick={editHandler} data-cy={`edit-comentbugs${index}`}>
                <Icon name={'EditIconGrey'} />
              </div>

              <div onClick={deleteHandler} data-cy={`del-comentbugs${index}`}>
                <Icon name={'DelIcon'} />
              </div>
            </div>
          ) : (
            <Permissions allowedRoles={['Admin']} currentRole={userDetails?.role}>
              <div className={style.editDeleteIcon}>
                <div onClick={deleteHandler} data-cy={`del-adminComentbugs${index}`}>
                  <Icon name={'DelIcon'} />
                </div>
              </div>
            </Permissions>
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
                      <span onClick={() => handleDeleteAttachment(file)}>
                        <Icon name={'CrossAttachment'} />
                      </span>
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
                    ],
                    'images/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp'],
                    'video/*': ['.mp4', '.mov', '.wmv', '.mkv'],
                    'compressed/*': ['.zip', '.rar'],
                    'attachment/*': [],
                  },
                  wrapperClass: style.fullWidth,
                  onChangeHandler: (files) => {
                    changeHandler(files);
                  },
                }}
              >
                <Icon name={'AttachFile'} />
              </FileInput>

              <Button text={'Discard'} btnClass={style.btn} handleClick={discardEditedComment} />
              <Button text={'Save'} type={'submit'} />
            </div>
          </div>
        </form>
      ) : (
        <div className={style.body}>
          <div className={style.attachmentContainer}>
            {comment?.file?.length > 0 &&
              comment?.file?.map((file) => {
                return (
                  <div className={style.attachmentFile} key={file?.fileUrl}>
                    <FileIcon type={file.fileType} />
                    <a href={file?.fileUrl} target="_blank" rel="noreferrer">
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
