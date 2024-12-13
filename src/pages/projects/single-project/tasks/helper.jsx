import { useCallback, useRef } from 'react';

import UserName from 'components/user-name';
import Icon from 'components/icon/themed-icon';
import Highlighter from 'components/highlighter';

import style from './tasks.module.scss';

export const initialFilter = {
  applicationType: [],
  taskType: [],
  createdBy: [],
  crossCheckAssignee: [],
  page: 1,
  perPage: 25,
};

const TaskIdCell = ({ row, searchedText }) => {
  const onClick = useCallback(() => window.open(row?.url, '_blank'), [row]);

  return (
    <div className={`${style.imgDiv} ${style.imgDivStart}`}>
      <p className={`${style.userName} ${style.userNamePointer} ${style.clickable}`} onClick={onClick}>
        <Highlighter search={searchedText}>{row?.id ? row?.id : '-'}</Highlighter>
      </p>
    </div>
  );
};

const CustomTaskIdCell = ({ row, searchedText }) => {
  const onClick = useCallback(() => window.open(row?.url, '_blank'), [row]);

  return (
    <div className={style.imgDiv}>
      <p className={`${style.userName} ${style.userNamePointer}`} onClick={onClick}>
        <Highlighter search={searchedText}>{row?.customId ? row?.customId : '-'}</Highlighter>
      </p>
    </div>
  );
};

const BugsTestCasesCell = ({ row, searchedText }) => (
  <div className={style.userNamePointer}>
    <div className={style.imgDivTooltip}>
      {row?.bugIds &&
        row?.bugIds.map((ele) => (
          <p key={ele?.bugId}>
            <Highlighter search={searchedText}>{ele?.bugId},</Highlighter>
          </p>
        ))}
      {row?.testCaseIds &&
        row?.testCaseIds.map((ele) => (
          <p key={ele?.testCaseId}>
            <Highlighter search={searchedText}>{ele?.testCaseId}, </Highlighter>
          </p>
        ))}
      {row?.bugIds?.length + row?.testCaseIds?.length > 8 && (
        <div className={style.tooltip}>
          {row?.bugIds &&
            row?.bugIds.map((ele) => (
              <p key={ele?.bugId}>
                <Highlighter search={searchedText}>{ele?.bugId}</Highlighter>,{' '}
              </p>
            ))}
          {row?.testCaseIds &&
            row?.testCaseIds.map((ele) => (
              <p key={ele?.testCaseId}>
                <Highlighter search={searchedText}>{ele?.testCaseId}</Highlighter>,{' '}
              </p>
            ))}
        </div>
      )}
    </div>
  </div>
);

const ApplicationCell = ({ row, searchedText }) => (
  <div className={style.imgDiv}>
    <p className={style.userName}>
      <Highlighter search={searchedText}>{row.applicationType}</Highlighter>
    </p>
  </div>
);

const TaskTypeCell = ({ row, searchedText }) => (
  <div className={style.imgDiv}>
    <p className={style.userName}>
      <Highlighter search={searchedText}>{row?.taskType}</Highlighter>
    </p>
  </div>
);

const AssigneeCell = ({ row, isHoveringName, setIsHoveringName }) => {
  const hoverTimeoutRef = useRef(null);

  const handleMouseEnter = useCallback(() => {
    clearTimeout(hoverTimeoutRef.current);

    hoverTimeoutRef.current = setTimeout(() => {
      setIsHoveringName({
        userId: row?.crossCheckAssignee?._id,
        rowId: row?._id,
      });
    }, 1500);

    return () => {
      clearTimeout(hoverTimeoutRef.current);
    };
  }, [row, setIsHoveringName]);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(hoverTimeoutRef.current);
    setIsHoveringName({ userId: null, rowId: null });
  }, [setIsHoveringName]);

  return (
    <div className={style.imgDiv}>
      <p
        className={`${style.userName} ${style.userNamePointer}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <UserName
          user={row?.crossCheckAssignee}
          isHovering={
            isHoveringName?.userId === row?.crossCheckAssignee?._id && isHoveringName?.rowId === row?._id
              ? isHoveringName?.userId
              : null
          }
        />
      </p>
    </div>
  );
};

const ActionsCell = ({ row, setEditRecord, setOpenDelModal }) => {
  const onEditIcon = useCallback(
    () =>
      setEditRecord({
        open: true,
        id: row?._id,
      }),
    [setEditRecord, row],
  );

  const onDelIcon = useCallback(
    () =>
      setOpenDelModal({
        open: true,
        id: row?._id,
      }),
    [setOpenDelModal, row],
  );

  return (
    <>
      <>
        <div className={style.imgDiv1}>
          <div className={style.img}>
            <div className={style.imgDel} onClick={onEditIcon}>
              <Icon name={'EditIconGrey'} />
            </div>

            <div className={style.tooltip}>
              <p>Edit</p>
            </div>
          </div>
          <div className={style.img}>
            <div className={style.imgDel} onClick={onDelIcon}>
              <Icon name={'DelIcon'} />
            </div>

            <div className={style.tooltip}>
              <p>Delete</p>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export const columnsData = ({ isHoveringName, searchedText, setOpenDelModal, setIsHoveringName, setEditRecord }) => [
  {
    name: 'Task ID',
    key: 'id',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '182px' },
    displayIcon: true,
    render: (props) => <TaskIdCell {...props} searchedText={searchedText} />,
  },
  {
    name: 'Custom Task ID',
    key: 'customId',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '140px', height: '36px' },
    widthInEditMode: { width: '182px' },
    displayIcon: true,
    render: (props) => <CustomTaskIdCell {...props} searchedText={searchedText} />,
  },
  {
    name: 'Bugs/Test cases',
    key: 'bug_testcase_id',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '200px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,
    render: (props) => <BugsTestCasesCell {...props} searchedText={searchedText} />,
  },
  {
    name: 'Application',
    key: 'applicationType',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '80px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,
    render: (props) => <ApplicationCell {...props} searchedText={searchedText} />,
  },
  {
    name: 'Task Type',
    key: 'taskType',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,
    render: (props) => <TaskTypeCell {...props} searchedText={searchedText} />,
  },
  {
    name: 'Assignee',
    key: 'crossCheckAssigneeName',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '70px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,
    render: (props) => (
      <AssigneeCell {...props} isHoveringName={isHoveringName} setIsHoveringName={setIsHoveringName} />
    ),
  },
  {
    name: 'Actions',
    key: 'actions',
    hidden: false,
    type: 'text',
    editable: true,
    widthAndHeight: { width: '180px', height: '36px' },
    widthInEditMode: { width: '56px' },
    displayIcon: false,
    render: (props) => <ActionsCell {...props} setEditRecord={setEditRecord} setOpenDelModal={setOpenDelModal} />,
  },
];
