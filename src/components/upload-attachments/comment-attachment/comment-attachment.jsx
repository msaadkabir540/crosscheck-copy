import { FileInput } from 'components/form-fields';
import TextField from 'components/text-field';

import style from './comment-attachment.module.scss';
import Icon from '../../icon/themed-icon';

const CommentAttachment = ({
  name,
  id,
  dataCy,
  control,
  icon,
  className,
  setValue,
  watch,
  isLoading,
  fileCrossHandler,
  accept,
  commentInputClass,
  maxSize,
  showNameField,
}) => {
  const changeHandler = (files) => {
    try {
      const dataFiles = files?.acceptedFiles;

      if (dataFiles && dataFiles?.length > 0) {
        const prevAttachment = watch(`${name}.files`) || [];

        const newData = dataFiles?.map((x) => ({
          fileName: x.name,
          fileUrl: x.attachment,
          fileType: x.type,
        }));

        setValue(`${name}.files`, [...prevAttachment, ...newData]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onTextChangeHandler = (e) => {
    e.preventDefault();
    setValue(`${name}.text`, e.target.value);
  };

  const onFileRemoveHandler = (e) => {
    const filteredFiles = watch(`${name}.files`)?.filter((file) => {
      return file.fileUrl !== e.fileUrl;
    });

    setValue(`${name}.files`, filteredFiles);
    fileCrossHandler && fileCrossHandler(e);
  };

  return (
    <div className={style.inputComment}>
      <div className={`${style.commentInputContainer} ${commentInputClass && commentInputClass}`}>
        {showNameField && (
          <div className={style.nameField_container}>
            <p>Name:</p>
            <input
              name="name"
              placeholder="John Doe"
              onChange={(e) => {
                e.preventDefault();
                setValue(`${name}.name`, e.target.value);
              }}
              value={isLoading ? '' : watch(`${name}.name`)}
            />
          </div>
        )}
        {watch(`${name}.files`)?.length > 0 && (
          <div className={style.attachmentContainer}>
            {watch(`${name}.files`)?.map((file) => {
              return (
                <div className={style.file} key={file.fileUrl}>
                  <Icon height={'16px'} width={'16px'} name={'ImageFileIcon'} />
                  <span>{file?.fileName}</span>
                  <span onClick={() => onFileRemoveHandler(file)}>
                    <Icon height={'16px'} width={'16px'} name={'CrossAttachment'} />
                  </span>
                </div>
              );
            })}
          </div>
        )}
        <div className={`${style.commentInput} ${className}`}>
          <FileInput
            {...{
              name: `${name}.file`,
              control,
              multiple: true,
              accept: accept,
              maxSize,
              wrapperClass: style.fullWidth,
              onChangeHandler: (files) => {
                changeHandler(files);
              },
            }}
            dataCy={id}
          >
            <TextField
              onChange={onTextChangeHandler}
              placeholder={'Write your comment here'}
              value={watch(`${name}.text`)}
              wraperClass={style.commentField}
              beforeIcon={icon}
              data-cy={dataCy}
            />
          </FileInput>
          <button
            className={style.sendBtn}
            type="submit"
            disabled={isLoading}
            style={{ opacity: isLoading ? '0.3' : '1', top: showNameField ? '-25%' : '25%' }}
            data-cy="add-comment-button-viewbug-id"
          >
            <Icon height={24} width={24} name={'ArrowOutlined'} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentAttachment;
