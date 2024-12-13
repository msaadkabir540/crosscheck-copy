import Tags from 'components/tags';

import style from './retest.module.scss';

export const columnsData = [
  {
    name: 'Created on',
    key: 'createdOn',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '150px', height: '36px' },
    widthInEditMode: { width: '182px' },
    displayIcon: true,

    render: ({ value }) => {
      return (
        <div className={style.imgDiv}>
          <p className={style.name}>{value}</p>
        </div>
      );
    },
  },
  {
    name: 'Created By',
    key: 'createdBy',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '150px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ value }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{value}</p>
      </div>
    ),
  },
  {
    name: 'Ticket ID',
    key: 'ticketID',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '150px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ value }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{value}</p>
      </div>
    ),
  },
  {
    name: 'Assigned To',
    key: 'assignedTo',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '130px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ value }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{value}</p>
      </div>
    ),
  },
  {
    name: 'Current Status',
    key: 'currentStatus',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '100px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ value }) => (
      <div className={style.imgDiv}>
        <Tags text={value} color="#000" />
      </div>
    ),
  },
];

export const rows = [
  {
    createdOn: 'createdOn',
    createdBy: 'asdasdsad',
    ticketID: 'asdasdasdasdasd',
    retestRemarks: 'New createdOn',
    assignedTo: 'Functional Testing',
    currentStatus: 'Access Roles',
  },
  {
    createdOn: 'createdOn',
    createdBy: 'asdasdsad',
    ticketID: 'asdasdasdasdasd',
    retestRemarks: 'New createdOn',
    assignedTo: 'Functional Testing',
    currentStatus: 'Access Roles',
  },
  {
    createdOn: 'createdOn',
    createdBy: 'asdasdsad',
    ticketID: 'asdasdasdasdasd',
    retestRemarks: 'New createdOn',
    assignedTo: 'Functional Testing',
    currentStatus: 'Access Roles',
  },
  {
    createdOn: 'createdOn',
    createdBy: 'asdasdsad',
    ticketID: 'asdasdasdasdasd',
    retestRemarks: 'New createdOn',
    assignedTo: 'Functional Testing',
    currentStatus: 'Access Roles',
  },
  {
    createdOn: 'createdOn',
    createdBy: 'asdasdsad',
    ticketID: 'asdasdasdasdasd',
    retestRemarks: 'New createdOn',
    assignedTo: 'Functional Testing',
    currentStatus: 'Access Roles',
  },
];

export const locationOptions = [
  {
    value: 'Pipeline',
    label: 'Pipeline',
    checkbox: true,
  },
  {
    value: 'Not Interviewing',
    label: 'Not Interviewing',
    checkbox: true,
  },
  {
    value: 'Interviewing_LI',
    label: 'Interviewing_LI',
    checkbox: true,
  },
  {
    value: 'Interviewing_P',
    label: 'Interviewing_P',
    checkbox: true,
  },
];
