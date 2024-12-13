import { useState, useEffect, useCallback } from 'react';

import { useForm } from 'react-hook-form';

import { useCaptureContext } from 'context/capture-context';

import Button from 'components/button';
import Icon from 'components/icon/themed-icon';

import { getUsers } from 'api/v1/settings/user-management';
import { useInviteUsers } from 'api/v1/captures/share-with';

import style from './auto-suggest.module.scss';

const CustomAutoSuggest = ({ refetch, privateMode }) => {
  const { checkId } = useCaptureContext();
  const { handleSubmit } = useForm();
  const { mutateAsync: _inviteUsersHandler } = useInviteUsers();

  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {}, [inputValue]);
  useEffect(() => {
    async function fetchUsers() {
      try {
        const { users = [] } = await getUsers({
          sortBy: '',
          sort: '',
          search: '',
        });
        setAllUsers(users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }

    if (privateMode) {
      fetchUsers();
    }
  }, [privateMode]);

  const getSuggestions = useCallback(
    (inputValue) => {
      return allUsers
        ?.filter(
          (user) =>
            user.name.toLowerCase().includes(inputValue.toLowerCase()) ||
            user?.email?.toLowerCase().includes(inputValue.toLowerCase()),
        )
        ?.filter((user) => !selectedUsers?.some((selectedUser) => selectedUser?.email === user?.email));
    },
    [allUsers, selectedUsers],
  );

  const onChange = useCallback(
    (event) => {
      setInputValue(event.target.value);
      setSuggestions(getSuggestions(event.target.value));
    },
    [getSuggestions],
  );

  const onUserSelect = useCallback(
    (user) => {
      setSelectedUsers([...selectedUsers, user]);
      setInputValue('');
      setSuggestions([]);
    },
    [selectedUsers],
  );

  const onRemoveUser = useCallback(
    (user) => {
      setSelectedUsers(selectedUsers?.filter((u) => u !== user));
    },
    [selectedUsers],
  );

  const onKeyDownContainer = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();

        if (inputValue.trim() !== '') {
          const newUser = { id: Date.now(), name: inputValue.trim(), email: inputValue.trim() };
          setSelectedUsers([...selectedUsers, newUser]);
          setSuggestions([...suggestions, newUser]);
          setInputValue('');
        }
      }
    },
    [inputValue, selectedUsers, suggestions],
  );

  const onSubmit = async () => {
    const selectedUserEmails = selectedUsers.map((user) => user.email);
    const body = { invitedUsers: selectedUserEmails };

    try {
      const res = await _inviteUsersHandler({ checkId: checkId, body });

      if (res) {
        setInputValue('');
        setSelectedUsers([]);
        setSuggestions([]);
        refetch && refetch();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className={style.formWrapper} onKeyDown={onKeyDownContainer}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={style.main_container}>
          <div className={style.auto_suggest_container}>
            <div className={style.input_and_selected}>
              {selectedUsers.map((user) => (
                <UsersSelected key={user?._id} user={user} onRemoveUser={onRemoveUser} />
              ))}
              <div className={style.inputDiv}>
                <input type="text" placeholder="Type a user name" value={inputValue} onChange={onChange} />
              </div>
            </div>
            {inputValue && (
              <div className={style.suggestions}>
                {suggestions.map((user) => (
                  <Suggestions key={user?._id} user={user} onUserSelect={onUserSelect} />
                ))}
              </div>
            )}
          </div>
          <Button text={'Share'} btnClass={style.share_button} type="submit" />
        </div>
      </form>
    </div>
  );
};

export default CustomAutoSuggest;

const Suggestions = ({ user, onUserSelect }) => {
  const handleUserSelect = useCallback(() => {
    onUserSelect(user);
  }, [onUserSelect, user]);

  return (
    <div className={style.suggested_name} key={user.id} onClick={handleUserSelect}>
      <span>{user.name}</span>
    </div>
  );
};

const UsersSelected = ({ user, onRemoveUser }) => {
  const handleRemoveUser = useCallback(() => {
    onRemoveUser(user);
  }, [onRemoveUser, user]);

  return (
    <div key={user.id} className={style.selected_user}>
      {user.name}
      <div onClick={handleRemoveUser} className={style.icon_container}>
        <Icon name={'CrossIcon'} />
      </div>
    </div>
  );
};
