import { useState, useRef, useEffect, useCallback } from 'react';

import { Controller } from 'react-hook-form';

import Loader from 'components/loader';
import TextField from 'components/text-field';

import { useToaster } from 'hooks/use-toaster';

import { useGetTags, useRenameTag, useCreateTag, useDeleteTag } from 'api/v1/custom-tags/custom-tags';

import style from './custom-tags.module.scss';
import Icon from '../icon/themed-icon';

const CustomTags = ({ control, errorMessage, rules, openUp, name, setValue, watch, label, projectId }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [rename, setRename] = useState('');
  const [renameInput, setRenameInput] = useState('');
  const [showRowMenu, setShowRowMenu] = useState('');
  const { toastError, toastSuccess } = useToaster();

  const preSelectedTagIds = watch('tags');
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState('');

  // NOTE: Get Tags
  const { data: _tagsData, refetch } = useGetTags({
    id: projectId,
  });

  // NOTE: Create Tag
  const { mutateAsync: _createTagHandler, isLoading: _isLoading } = useCreateTag();

  const addTagFunc = useCallback(
    async (data) => {
      const formData = {
        name: data.name,
        projectId: projectId,
      };

      try {
        const res = await _createTagHandler(formData);
        toastSuccess(res.msg);
        await refetch();
      } catch (error) {
        toastError(error);
      }
    },
    [_createTagHandler, projectId, refetch, toastError, toastSuccess],
  );

  // NOTE: Rename Tag
  const { mutateAsync: _renameTagHandler } = useRenameTag();

  const renameTagFunc = useCallback(
    async (id, data) => {
      const formData = {
        name: data.name,
      };

      try {
        const res = await _renameTagHandler({ id: id, body: formData });
        toastSuccess(res.msg);
        await refetch();
      } catch (error) {
        toastError(error);
      }
    },
    [_renameTagHandler, refetch, toastError, toastSuccess],
  );

  // NOTE: Delete Tag
  const { mutateAsync: _deleteTag } = useDeleteTag();

  const delTagFunc = useCallback(
    async (id) => {
      try {
        const res = await _deleteTag(id);
        toastSuccess(res.msg);
        await refetch();
      } catch (error) {
        toastError(error);
      }
    },
    [_deleteTag, refetch, toastError, toastSuccess],
  );

  const handleRenameChange = (e) => {
    setRenameInput(e.target.value);
  };

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && inputValue.trim() !== '') {
        e.preventDefault();
        addTagFunc({ name: inputValue.trim() });
        setInputValue('');
      }
    },
    [addTagFunc, inputValue],
  );

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const getDisplayValue = useCallback(() => {
    const selectedTagNames = selectedTags?.map((tag) => tag?.name);

    if (selectedTagNames?.length === 1) {
      return selectedTagNames[0];
    } else if (selectedTagNames?.length > 1) {
      return `${selectedTagNames?.length} selected`;
    } else {
      return inputValue;
    }
  }, [selectedTags, inputValue]);

  useEffect(() => {
    // NOTE: Check if there are pre-existing tag IDs
    if (preSelectedTagIds && preSelectedTagIds?.length > 0) {
      // NOTE:Fetch the corresponding tags based on the IDs
      const preSelectedTags = _tagsData?.tags?.filter((tag) => preSelectedTagIds?.includes(tag?._id));
      //NOTE: Update the selectedTags state
      setSelectedTags(preSelectedTags);
    }
  }, [preSelectedTagIds, _tagsData]);

  const handleClearClick = useCallback(() => {
    setInputValue('');
    setSelectedTags([]);
    setValue('tags', []);
  }, [setValue]);

  const handleInputClick = () => {
    setShowMenu(true);
  };

  const handleTagClick = useCallback(
    (tag, field) => {
      const updatedSelectedTags = [...selectedTags];
      const index = updatedSelectedTags?.findIndex((selectedTag) => selectedTag._id === tag._id);

      if (index === -1) {
        updatedSelectedTags?.push(tag);
      } else {
        updatedSelectedTags?.splice(index, 1);
      }

      setSelectedTags(updatedSelectedTags);

      const tagIds = updatedSelectedTags?.map((selectedTag) => selectedTag._id);
      field.onChange(tagIds);
    },
    [selectedTags],
  );

  const handleCheckboxChange = useCallback(
    (tag, field) => {
      const updatedSelectedTags = [...selectedTags];
      const index = updatedSelectedTags?.findIndex((selectedTag) => selectedTag._id === tag._id);

      if (index === -1) {
        updatedSelectedTags?.push(tag);
      } else {
        updatedSelectedTags?.splice(index, 1);
      }

      setSelectedTags(updatedSelectedTags);

      const tagIds = updatedSelectedTags?.map((selectedTag) => selectedTag._id);
      field.onChange(tagIds);
    },
    [selectedTags],
  );

  const handleClossMenu = useCallback(() => setShowMenu(false), []);

  const onClossRowMenu = useCallback(() => setShowRowMenu(''), []);

  const handleRender = useCallback(
    ({ field }) => {
      return (
        <RenderCustomTags
          {...{
            label,
            inputRef,
            errorMessage,
            handleInputClick,
            handleKeyDown,
            handleInputChange,
            field,
            handleTagClick,
            getDisplayValue,
            projectId,
            handleClearClick,
            _isLoading,
            showMenu,
            openUp,
            inputValue,
            _tagsData,
            rename,
            setRename,
            delTagFunc,
            renameInput,
            showRowMenu,
            selectedTags,
            renameTagFunc,
            setShowRowMenu,
            setSelectedTags,
            handleRenameChange,
            handleCheckboxChange,
          }}
        />
      );
    },
    [
      _isLoading,
      _tagsData,
      delTagFunc,
      errorMessage,
      handleTagClick,
      getDisplayValue,
      handleCheckboxChange,
      handleClearClick,
      handleKeyDown,
      inputValue,
      label,
      openUp,
      projectId,
      rename,
      renameInput,
      renameTagFunc,
      selectedTags,
      showMenu,
      showRowMenu,
    ],
  );

  return (
    <>
      <Controller control={control} name={name} rules={rules} defaultValue={[]} render={handleRender} />
      {showMenu && <div className={style.backdropDiv} onClick={handleClossMenu}></div>}
      {showRowMenu !== '' && <div className={style.backdropDiv} onClick={onClossRowMenu}></div>}
    </>
  );
};

export default CustomTags;

const RenderCustomTags = ({
  label,
  inputRef,
  errorMessage,
  handleInputClick,
  handleKeyDown,
  handleInputChange,
  field,
  getDisplayValue,
  projectId,
  handleTagClick,
  handleClearClick,
  _isLoading,
  showMenu,
  openUp,
  inputValue,
  _tagsData,
  rename,
  setRename,
  delTagFunc,
  renameInput,
  showRowMenu,
  selectedTags,
  renameTagFunc,
  setShowRowMenu,
  setSelectedTags,
  handleRenameChange,
  handleCheckboxChange,
}) => {
  const onInputChange = useCallback(
    (e) => {
      handleInputChange(e);
      field.onChange(e);
    },
    [field, handleInputChange],
  );

  return (
    <div className={style.main}>
      {label && <label className={style.label}>{label}</label>}
      <div className={style.inputContainer}>
        <input
          type="text"
          ref={inputRef}
          placeholder="Select or Create"
          style={{
            border: errorMessage ? '1px solid #ff5050' : '',
          }}
          onClick={handleInputClick}
          onKeyDown={handleKeyDown}
          onChange={onInputChange}
          value={getDisplayValue()}
          name={name}
          className={style.customTagInput}
          disabled={!projectId}
          autoComplete="off"
        />
        {getDisplayValue() && (
          <div className={style.clearButton} onClick={handleClearClick}>
            <Icon name={'CrossIcon'} />
          </div>
        )}
        {_isLoading && (
          <div className={style.loader} onClick={handleClearClick}>
            <Loader tableMode />
          </div>
        )}
        {errorMessage && <span className={style.errorMessage}>{errorMessage}</span>}
      </div>
      {showMenu && (
        <div className={style.menu} style={{ bottom: openUp ? '40px' : '' }}>
          {inputValue.length ? (
            <div className={style.ul}>{`Create "${inputValue}" Tag`}</div>
          ) : _tagsData?.tags?.length > 0 ? (
            _tagsData?.tags?.map((tag) => (
              <SingleTag
                {...{
                  tag,
                  field,
                  rename,
                  setRename,
                  delTagFunc,
                  renameInput,
                  showRowMenu,
                  selectedTags,
                  renameTagFunc,
                  handleTagClick,
                  setShowRowMenu,
                  setSelectedTags,
                  handleRenameChange,
                  handleCheckboxChange,
                }}
                key={tag?._id}
              />
            ))
          ) : (
            <div className={style.noOption}>No options</div>
          )}
        </div>
      )}
    </div>
  );
};

const SingleTag = ({
  tag,
  field,
  rename,
  setRename,
  delTagFunc,
  renameInput,
  showRowMenu,
  selectedTags,
  renameTagFunc,
  handleTagClick,
  setShowRowMenu,
  setSelectedTags,
  handleRenameChange,
  handleCheckboxChange,
}) => {
  const onHandleTagClick = useCallback(() => handleTagClick(tag, field), [tag, field, handleTagClick]);

  const onCrossIcon = useCallback(
    (e) => {
      e.stopPropagation();
      setRename('');
    },
    [setRename],
  );

  const onTickIcon = useCallback(
    (e) => {
      e.stopPropagation();
      renameTagFunc(tag?._id, { name: renameInput });
      setRename('');
    },
    [renameInput, renameTagFunc, setRename, tag],
  );

  const onHandleCheckboxChange = useCallback(
    () => handleCheckboxChange(tag, field),
    [handleCheckboxChange, tag, field],
  );

  const onInvertIcon = useCallback(
    (e) => {
      e.stopPropagation();
      setShowRowMenu(tag?._id);
    },
    [setShowRowMenu, tag],
  );

  const onEditIcon = useCallback(
    (e) => {
      e.stopPropagation();
      setRename(tag?._id);
      setSelectedTags([]);
      setShowRowMenu('');
    },
    [setSelectedTags, setRename, setShowRowMenu, tag],
  );

  const onDelIcon = useCallback(
    (e) => {
      e.stopPropagation();
      delTagFunc(tag?._id);
      setShowRowMenu('');
    },
    [delTagFunc, setShowRowMenu, tag],
  );

  return (
    <div className={style.ul} key={tag?._id} onClick={onHandleTagClick}>
      {rename === tag?._id ? (
        <div className={style.renameInput}>
          <TextField
            name="tagName"
            placeholder={tag?.name}
            onChange={handleRenameChange}
            defaultValue={tag?.name}
            errorMessage={!renameInput && !tag?.name && true}
          />

          <div onClick={onCrossIcon}>
            <Icon name={'CrossIcon'} />
          </div>
          {renameInput && (
            <div className={style.tick} onClick={onTickIcon}>
              <Icon name={'TickIcon'} />
            </div>
          )}
        </div>
      ) : (
        <>
          <div className={style.innerLeft}>
            <input
              type="checkbox"
              checked={selectedTags?.some((selectedTag) => selectedTag?._id === tag?._id)}
              onChange={onHandleCheckboxChange}
              className={style.checkbox}
            />
            <Icon name={'TagIcon'} />
            {tag?.name}
          </div>
          <div onClick={onInvertIcon}>
            <Icon name={'MoreInvertIcon'} />
          </div>
        </>
      )}
      {showRowMenu === tag?._id && (
        <div className={style.optionMenu}>
          <div className={style.options} onClick={onEditIcon}>
            <Icon name={'EditIconGrey'} /> Rename
          </div>
          <div className={style.options} onClick={onDelIcon}>
            <Icon name={'DelIcon'} /> Delete
          </div>
        </div>
      )}
    </div>
  );
};
