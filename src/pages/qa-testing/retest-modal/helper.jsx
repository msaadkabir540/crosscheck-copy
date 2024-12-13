import Tags from 'components/tags';

import { formattedDate } from 'utils/date-handler';

import style from './retest.module.scss';

export const columnsData = [
  {
    name: 'Retest Date',
    key: 'retestDate',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '182px' },
    displayIcon: true,

    render: ({ row }) => {
      return (
        <div className={`${style.imgDiv} ${style.dateClass}`}>
          <p className={style.userName}>{formattedDate(row?.reTestDate, 'dd MMM, yy')}</p>
        </div>
      );
    },
  },
  {
    name: 'Retest Version',
    key: 'retestVersion',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '135px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.reTestVersion?.name}</p>
      </div>
    ),
  },
  {
    name: 'Retest By',
    key: 'retestBy',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '100px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.reTestBy?.name}</p>
      </div>
    ),
  },
  {
    name: 'Retest Status',
    key: 'retestStatus',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '160px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <Tags
          text={row?.reTestStatus}
          colorScheme={{
            Closed: '#34C369',
            Open: '#F96E6E',
            Blocked: '#F80101',
            Reproducible: '#FF9843',
            Reopen: '#DEBB00',
            'Need To Discuss': '#879DFF',
          }}
        />
      </div>
    ),
  },
  {
    name: 'Retest Evidence',
    key: 'retestEvidence',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '150px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>
          <a className={style.evidenceClass} href={row?.reTestEvidence} target="_blank" rel="noreferrer">
            {row.reTestEvidenceKey}
          </a>
        </p>
      </div>
    ),
  },
  {
    name: 'Related Run',
    key: 'relatedRun',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '150px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.relatedRun?.runId}</p>
      </div>
    ),
  },
  {
    name: 'Retest Remarks',
    key: 'retestRemarks',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '150px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.remarks || 'None'}</p>
      </div>
    ),
  },
];

export const rows = [
  {
    retestDate: 'retestDate',
    retestVersion: 'asdasdsad',
    retestBy: 'asdasdasdasdasd',
    retestRemarks: 'New retestDate',
    retestEvidence: 'Functional Testing',
    retestStatus: 'Access Roles',
  },
  {
    retestDate: 'retestDate',
    retestVersion: 'asdasdsad',
    retestBy: 'asdasdasdasdasd',
    retestRemarks: 'New retestDate',
    retestEvidence: 'Functional Testing',
    retestStatus: 'Access Roles',
  },
  {
    retestDate: 'retestDate',
    retestVersion: 'asdasdsad',
    retestBy: 'asdasdasdasdasd',
    retestRemarks: 'New retestDate',
    retestEvidence: 'Functional Testing',
    retestStatus: 'Access Roles',
  },
  {
    retestDate: 'retestDate',
    retestVersion: 'asdasdsad',
    retestBy: 'asdasdasdasdasd',
    retestRemarks: 'New retestDate',
    retestEvidence: 'Functional Testing',
    retestStatus: 'Access Roles',
  },
  {
    retestDate: 'retestDate',
    retestVersion: 'asdasdsad',
    retestBy: 'asdasdasdasdasd',
    retestRemarks: 'New retestDate',
    retestEvidence: 'Functional Testing',
    retestStatus: 'Access Roles',
  },
];
