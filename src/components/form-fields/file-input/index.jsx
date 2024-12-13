import { useCallback, useEffect } from 'react';

import { Controller } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';

import { convertBase64Image, fileCaseHandler, isFileSizeAllowed, isFileTypeAccepted } from 'utils/file-handler';

const FileInput = ({
  name,
  control,
  label,
  wrapperClass,
  onChangeHandler,
  labelClass,
  children,
  defaultValue,
  rules,
  dataCy,
  multiple = false,
  accept,
  maxSize = 10 * 1024 * 1024,
}) => {
  const onDrop = useCallback(
    async (acceptedFiles, rejectedFiles) => {
      let filteredRejectedFiles = [];

      for (const file of rejectedFiles) {
        if (file) {
          filteredRejectedFiles.push({ file: file.file, error: file?.errors?.[0]?.message });

          return toast.error(file?.errors?.[0]?.message);
        }
      }

      let filteredAcceptedFiles = [];

      for (const file of acceptedFiles) {
        const base64 = await convertBase64Image(file);
        const type = fileCaseHandler(file.type.split('/')[1]);

        filteredAcceptedFiles.push({
          name: file.name.split('.')[0],
          type: type ? type : (file?.name?.split('.').pop() || '').toLowerCase(),
          size: (file.size / (1024 * 1024))?.toFixed(2),
          attachment: base64,
          file,
        });
      }

      onChangeHandler({ rejectedFiles: filteredRejectedFiles, acceptedFiles: filteredAcceptedFiles });
    },
    [onChangeHandler],
  );

  const onPaste = useCallback(
    async (event) => {
      const acceptedFiles = [];
      const rejectedFiles = [];

      const clipboardItems = event.clipboardData.items;

      for (let i = 0; i < clipboardItems.length; i++) {
        const item = clipboardItems[multiple ? i : 0];

        if (item.kind === 'file') {
          const file = item.getAsFile();

          if (file?.type) {
            const [fileTypeAllowed, fileTypeAllowedError] = isFileTypeAccepted(file, accept);
            const [isFileInSize, isFileInSizeError] = isFileSizeAllowed(file, maxSize);

            if (fileTypeAllowed && isFileInSize) {
              acceptedFiles.push(file);
            } else {
              rejectedFiles.push({ file, errors: [fileTypeAllowedError, isFileInSizeError] });
            }
          }
        }
      }

      onDrop(
        acceptedFiles ? (multiple ? acceptedFiles : [acceptedFiles[0]]) : [],
        rejectedFiles ? (multiple ? rejectedFiles : [rejectedFiles[0]]) : [],
      );
    },
    [accept, maxSize, multiple, onDrop],
  );

  const { getRootProps, getInputProps } = useDropzone({
    maxSize,
    multiple,
    onDrop,
    accept: Object.keys(accept).reduce((acc, mime) => {
      acc[mime] = accept[mime];

      return acc;
    }, {}),
  });

  useEffect(() => {
    document.addEventListener('paste', (e) => {
      onPaste(e);
    });
  }, [onPaste]);

  const handleRender = useCallback(() => {
    return (
      <div className={wrapperClass}>
        <div {...getRootProps()}>
          <input {...getInputProps()} data-cy={dataCy} id={dataCy} />
          {children}
        </div>
      </div>
    );
  }, [children, dataCy, getInputProps, getRootProps, wrapperClass]);

  return (
    <>
      {label && (
        <div className={labelClass}>
          <span>{label}</span>
        </div>
      )}
      <Controller control={control} name={name} defaultValue={defaultValue} rules={rules} render={handleRender} />
    </>
  );
};

export default FileInput;
