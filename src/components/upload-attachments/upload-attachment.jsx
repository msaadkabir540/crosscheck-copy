import { useCallback, useEffect, useState } from 'react';

import { useReactMediaRecorder } from 'react-media-recorder';
import { Controller } from 'react-hook-form';

import { FileInput } from 'components/form-fields';
import TextField from 'components/text-field';

import { useToaster } from 'hooks/use-toaster';

import { convertBlobToBase64 } from 'utils/file-handler';
import types from 'constants/file-types';

import style from './style.module.scss';
import Icon from '../icon/themed-icon';

const UploadAttachment = ({
  name,
  id,
  control,
  wraperClass,
  label,
  watch,
  errorClass,
  placeholder,
  errorMessage,
  delIconClass,
  setValue,
  rules,
  isDisable,
  onTextChange,
}) => {
  const { toastError } = useToaster();
  const [isMicrophonePermissionGranted, setIsMicrophonePermissionGranted] = useState(true);
  const userAgent = navigator.userAgent;

  useEffect(() => {
    navigator?.permissions?.query({ name: 'microphone' })?.then((result) => {
      if (result?.state === 'granted') {
        setIsMicrophonePermissionGranted(true);
      } else {
        setIsMicrophonePermissionGranted(false);
      }
    });
  }, []);

  const screenRecordHandler = async (blobUrl) => {
    try {
      const base64 = await convertBlobToBase64(blobUrl, 'video/x-matroska');
      setValue(name, { url: blobUrl, base64 });
      clearBlobUrl();
    } catch (error) {
      clearBlobUrl();
      toastError({ msg: 'Failed to make base64' });
    }
  };

  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);

  const { status, startRecording, stopRecording, clearBlobUrl } = useReactMediaRecorder({
    screen: !isMobile,
    video: !isMobile,
    audio: isMicrophonePermissionGranted && !isMobile,
    onStop: screenRecordHandler,
    stopStreamsOnStop: true,
  });

  const imageChangeHandler = useCallback(
    async (e) => {
      const file = e.file;

      if (file) {
        const blob = new Blob([file], { type: file.type });
        const blobUrl = URL?.createObjectURL(blob);

        setValue(name, { url: blobUrl, base64: e.attachment });
      }
    },
    [name, setValue],
  );

  const onClear = useCallback(
    (e) => {
      e.stopPropagation();
      setValue(name, {});
    },
    [setValue, name],
  );

  const onChangeHandler = useCallback(
    async (files) => {
      if (files?.acceptedFiles?.length > 0) {
        await imageChangeHandler(files?.acceptedFiles[0]);
      }
    },
    [imageChangeHandler],
  );

  const handleTextFieldClick = useCallback((e) => e.stopPropagation(), []);

  const onVideoIcon = useCallback(
    (e) => {
      e.stopPropagation();
      status === 'recording' ? stopRecording() : startRecording();
    },
    [status, startRecording, stopRecording],
  );

  const handleRender = useCallback(() => {
    return (
      <FileInput
        name={name}
        control={control}
        accept={types.images}
        multiple={false}
        onChangeHandler={onChangeHandler}
        dataCy={id}
      >
        <div className={style.controller}>
          <div className={style.container} onClick={handleTextFieldClick}>
            <TextField
              onChange={onTextChange}
              placeholder={placeholder}
              isDisable={isDisable}
              value={watch(name)?.url || ''}
              backCompo={watch(name)?.url && <Icon name={'DelIcon'} iconClass={delIconClass} />}
              errorMessage={!!errorMessage}
              onClick={onClear}
            />
          </div>
          <div className={style.imgDiv}>
            <Icon name={'UploadIconThin'} />
          </div>
          {!isMobile && (
            <div onClick={onVideoIcon} className={style.imgDiv}>
              <div className={style.pointerClass}>
                <Icon name={'VideoIcon'} />
              </div>
            </div>
          )}
        </div>
      </FileInput>
    );
  }, [
    id,
    name,
    watch,
    control,
    onClear,
    isMobile,
    isDisable,
    onVideoIcon,
    placeholder,
    delIconClass,
    errorMessage,
    onTextChange,
    onChangeHandler,
    handleTextFieldClick,
  ]);

  return (
    <div className={`${style.inputContainer} ${wraperClass} `}>
      {label && <label>{label}</label>}

      <Controller control={control} name={name} rules={rules} render={handleRender} />
      {errorMessage && <span className={`${style.errorMessage} ${errorClass}`}>{errorMessage}</span>}
    </div>
  );
};

export default UploadAttachment;
