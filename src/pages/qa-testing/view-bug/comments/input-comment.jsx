import { useForm } from 'react-hook-form';

import Icon from 'components/icons/themed-icon';

import { useAddComment } from 'api/v1/bugs/bugs';

import TextField from '../../../../components/text-field';
import CommentAttachment from '../../../../components/upload-attachments/comment-attachment/comment-attachment.jsx';
import { useToaster } from '../../../../hooks/use-toaster.jsx';
import style from './comments.module.scss';

const inputComment = ({ bugId, commentsRefetch }) => {
  const form = useForm({
    defaultValues: {
      commentText: '',
      attachment: {},
    },
  });

  const { mutateAsync: _addCommentHandler } = useAddComment();
  const { toastSuccess, toastError } = useToaster();
  const { register, control, handleSubmit, setValue, reset, watch } = form;

  const onSubmit = async (data) => {
    if (data?.commentText) {
      try {
        const body = {
          bugId: bugId,
          comment: data?.commentText,
          file: data?.attachment?.base64 ? [data?.attachment?.base64] : [],
        };
        const res = await _addCommentHandler({ body });
        commentsRefetch();
        toastSuccess(res?.msg);
        reset();
      } catch (error) {
        toastError(error);
      }
    }
  };

  const handleDeleteAttachment = () => {
    setValue('attachment', {});
  };

  return (
    <div className={style.mainInputCommment}>
      <form className={style.commentInput} onSubmit={handleSubmit(onSubmit)} noValidate>
        <CommentAttachment
          icon={<Icon name={'AttachFile'} iconClass={style.attachIcon} />}
          control={control}
          setValue={setValue}
          defaultValue={{}}
          name="attachment"
          className={style.attachment}
        />

        <TextField
          wraperClass={style.commentField}
          placeholder={'Write your comment here'}
          register={() => register('commentText')}
        />

        <button className={style.sendBtn} type="submit">
          <Icon height={24} width={24} name={'ArrowOutlined'} />
        </button>
      </form>

      {watch('attachment')?.name && (
        <div className={style.attachmentFile}>
          <span>{watch('attachment')?.name}</span>
          <span onClick={handleDeleteAttachment}>
            <Icon name={'DelIcon'} />
          </span>
        </div>
      )}
    </div>
  );
};

export default inputComment;
