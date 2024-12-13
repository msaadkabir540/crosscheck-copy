import { useQuery } from 'react-query';
import _ from 'lodash';

import Menu from 'components/menu';
import UserName from 'components/user-name';

import { getUsers } from 'api/v1/settings/user-management';

import { formattedDate } from 'utils/date-handler';

import style from './trash.module.scss';
import Icon from '../../components/icon/themed-icon';

export function useProjectOptions() {
  return useQuery({
    queryKey: ['testRunOptions'],
    queryFn: async () => {
      const { users = [] } = await getUsers({
        sortBy: '',
        sort: '',
        search: '',
      });

      const searchTypeOptions = [
        { label: 'File', value: 'File', checkbox: true },
        { label: 'TestCase', value: 'TestCase', checkbox: true },
        { label: 'TestRun', value: 'TestRun', checkbox: true },
        { label: 'Feature', value: 'Feature', checkbox: true },
        { label: 'Milestone', value: 'Milestone', checkbox: true },
        { label: 'Project', value: 'Project', checkbox: true },
        { label: 'Bug', value: 'Bug', checkbox: true },
      ];

      return {
        searchTypeOptions,
        deletedBy: users.map((x) => ({
          label: x.name,
          ...(x?.profilePicture && { image: x?.profilePicture }),
          ...(!x?.profilePicture && { imagAlt: _.first(x?.name) }),
          value: x._id,
          checkbox: true,
        })),
      };
    },
    refetchOnWindowFocus: false,
  });
}

export const columnsData = ({
  setDelModalForever,
  onRestore,
  menu,
  isHoveringName,
  setIsHoveringName,
  setMenu,
  role,
}) => [
  {
    name: 'Deleted Item',
    key: 'name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '150px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName} style={{ cursor: 'pointer' }}>
          {row?.name || row?.testCaseId || row?.bugId || row?.runId}
        </p>
      </div>
    ),
  },
  {
    name: 'Location',
    key: 'location',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '60px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName} style={{ cursor: 'pointer' }}>
          {row?.path}
        </p>
      </div>
    ),
  },
  {
    name: 'Type',
    key: 'type',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '60px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName} style={{ cursor: 'pointer' }}>
          {row?.type}
        </p>
      </div>
    ),
  },
  {
    name: 'Expire At',
    key: 'expiresAt',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '60px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName} style={{ cursor: 'pointer' }}>
          {formattedDate(row?.expiresAt, 'dd MMM-YYY, hh:mm a')}
        </p>
      </div>
    ),
  },
  {
    name: 'Deleted on',
    key: 'deletedOn',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '60px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName} style={{ cursor: 'pointer' }}>
          {formattedDate(row?.deletedOn, 'dd MMM-YYY, hh:mm a')}
        </p>
      </div>
    ),
  },
  {
    name: 'Deleted By',
    key: 'deletedBy',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '60px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => {
      let hoverTimeout;

      const handleMouseEnter = () => {
        clearTimeout(hoverTimeout);

        hoverTimeout = setTimeout(() => {
          setIsHoveringName({
            userId: row?.deletedBy?._id,
            rowId: row?._id,
          });
        }, 1500);
      };

      const handleMouseLeave = () => {
        clearTimeout(hoverTimeout);
        setIsHoveringName({ userId: null, rowId: null });
      };

      return (
        <div className={style.imgDiv}>
          <p
            className={style.userDiv}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ alignItems: 'center', cursor: 'pointer' }}
          >
            {row?.deletedBy?.profilePicture ? (
              <img
                src={row?.deletedBy?.profilePicture}
                style={{ width: '24px', height: '24px', borderRadius: '80%' }}
                alt="deletedBy-profilePicture"
              />
            ) : (
              <div
                style={{
                  borderRadius: '80%',
                  background: '#11103d',
                  width: '24px',
                  height: '24px',
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {_.first(row?.deletedBy?.name)}
              </div>
            )}
            <UserName
              user={row?.deletedBy}
              isHovering={
                isHoveringName?.userId === row?.deletedBy?._id && isHoveringName?.rowId === row?._id
                  ? isHoveringName?.userId
                  : null
              }
            />
          </p>
        </div>
      );
    },
  },

  {
    name: 'Actions',
    key: 'actions',
    hidden: false,
    type: 'text',
    editable: true,
    widthAndHeight: { width: '40px', height: '36px' },
    widthInEditMode: { width: '56px' },
    displayIcon: false,
    render: ({ row }) => (
      <div
        style={{
          position: 'relative',
        }}
      >
        <div className={style.imgDiv1} onClick={() => setMenu(row?.index)}>
          <Icon name={'MoreInvertIcon'} height={24} width={24} />
        </div>
        {menu === row?.index && (
          <div
            style={{
              width: '150px',
              position: 'absolute',
              right: '40px',
              top: '20px',
              zIndex: 7,
            }}
          >
            <Menu
              active={true}
              backClass={style.menuClass}
              menu={[
                {
                  compo: <Icon name={'RestoreIcon'} height={16} width={16} />,
                  title: 'Restore',
                  click: () => onRestore(row?._id, row?.type),
                },
                role !== 'Developer' && role !== 'QA' && role !== 'Project Manager'
                  ? {
                      compo: <Icon name={'DelIcon'} height={16} width={16} />,
                      title: 'Delete Forever',
                      click: () =>
                        setDelModalForever({
                          open: true,
                          id: row?._id,
                          type: row?.type,
                        }),
                    }
                  : null,
              ]}
            />
          </div>
        )}
        {menu === row?.index && (
          <div
            onClick={() => setMenu(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'transparent',
              zIndex: 5,
            }}
          ></div>
        )}
      </div>
    ),
  },
];
