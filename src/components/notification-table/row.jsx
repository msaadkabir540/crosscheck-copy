import { useForm } from 'react-hook-form';

import Switch from 'components/switch';

import style from './notification-table.module.scss';

const Row = ({
  key,
  prettyAction,
  checked,
  setComingSoonModal,
  parentKey,
  disabled,
  childKey,
  handleChangeValueEvent,
}) => {
  const { control } = useForm();

  const handleSwitchChange = (value, name) => {
    handleChangeValueEvent({ value, name, parentKey, childKey });
  };

  const handleCustomChange = (value, fieldName) => {
    if (fieldName === 'crosscheck' && !disabled) {
      handleSwitchChange(value, fieldName);
    } else if (fieldName !== 'crosscheck') {
      setComingSoonModal(true);
    }
  };

  return (
    <div className={style.tableRow} key={key}>
      <span className={style.rowText}>{mapActionToText(prettyAction)}</span>
      {fieldNames?.map((field) => (
        <div
          className={style.rowText}
          key={field?.name}
          style={{
            opacity: (field?.name !== 'crosscheck' || disabled) && '0.5',
          }}
        >
          <Switch
            checked={checked?.includes(field?.name)}
            control={control}
            name={field?.name}
            onChange={(value) => handleCustomChange(value, field?.name)}
          />
        </div>
      ))}
    </div>
  );
};

export default Row;

const fieldNames = [
  {
    name: 'crosscheck',
  },
  {
    name: 'teams',
  },
  {
    name: 'slack',
  },
  {
    name: 'email',
  },
];

const mapActionToText = (prettyAction) => {
  switch (prettyAction) {
    case 'Archive Project':
      return 'Project Archive / Unarchive';
    case 'Close Test Run':
      return 'Test Run Close';
    case 'Add Comment':
      return 'Bug Comments';
    case 'Update Comment':
      return 'Comment Updated';
    case 'Restore One':
      return 'Restore Deleted Record';
    case 'Permanent Delete One':
      return 'Delete Record Permanently';
    case 'Clear All':
      return 'Clear All Trash';
    case 'Restore All':
      return 'Restore All Trash';

    default:
      return prettyAction;
  }
};
