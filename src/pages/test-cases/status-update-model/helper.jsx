import Tags from 'components/tags';

import { formattedDate } from 'utils/date-handler';

import style from './status.module.scss';

export const columnsData = [
  {
    name: 'Tested Date',
    key: 'testDate',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '100px', height: '36px' },
    widthInEditMode: { width: '182px' },
    displayIcon: true,

    render: ({ row }) => {
      return (
        <div className={`${style.imgDiv} ${style.testedDateClass}`}>
          <p className={style.userName}>{formattedDate(row?.testDate, 'dd MMM, yy')}</p>
        </div>
      );
    },
  },

  {
    name: 'Tested By',
    key: 'testedBy',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '100px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.testedBy?.name}</p>
      </div>
    ),
  },
  {
    name: 'Status',
    key: 'testStatus',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '140px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <Tags
          text={row?.testStatus}
          colorScheme={{
            Blocked: '#F96E6E',
            Passed: '#34C369',
            Failed: '#F96E6E',
            'Not Tested': '#8B909A',
          }}
        />
      </div>
    ),
  },
  {
    name: 'Test Evidence',
    key: 'testEvidence',
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
          <a href={row?.testEvidence} target="_blank" className={style.evidenceClass} rel="noreferrer">
            {row.testEvidence}
          </a>
        </p>
      </div>
    ),
  },

  {
    name: 'Tested Version',
    key: 'testedVersion',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '135px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.testedVersion?.name}</p>
      </div>
    ),
  },
  {
    name: 'Tested Environment',
    key: 'testedEnvironment',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '155px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.testedEnvironment?.name}</p>
      </div>
    ),
  },
  {
    name: 'Tested Device',
    key: 'testedDevice',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '135px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.testedDevice}</p>
      </div>
    ),
  },
  {
    name: 'Related Bug',
    key: 'relatedBug',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '135px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.relatedBug?.bugId}</p>
      </div>
    ),
  },
  {
    name: 'Related Run',
    key: 'relatedRun',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '135px', height: '36px' },
    widthInEditMode: { width: '182px' },

    displayIcon: true,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.relatedRun?.runId}</p>
      </div>
    ),
  },
  {
    name: 'Notes',
    key: '',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '150px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={style.userName}>{row?.notes || 'None'}</p>
      </div>
    ),
  },
];

export const rows = [
  {
    testedDate: 'Dummy Date 1',
    testedVersion: 'Dummy Version 1',
    testedBy: 'Dummy Tester 1',
    notes: 'Dummy Notes 1',
    testEvidence: 'Dummy Evidence 1',
    status: 'Closed',
    testedEnvironment: 'Dummy Environment 1',
    testedDevice: 'Dummy Device 1',
    relatedBug: 'Dummy Bug 1',
    relatedRun: 'Dummy Run 1',
  },
  {
    testedDate: 'Dummy Date 2',
    testedVersion: 'Dummy Version 2',
    testedBy: 'Dummy Tester 2',
    notes: 'Dummy Notes 2',
    testEvidence: 'Dummy Evidence 2',
    status: 'Open',
    testedEnvironment: 'Dummy Environment 2',
    testedDevice: 'Dummy Device 2',
    relatedBug: 'Dummy Bug 2',
    relatedRun: 'Dummy Run 2',
  },
  {
    testedDate: 'Dummy Date 3',
    testedVersion: 'Dummy Version 3',
    testedBy: 'Dummy Tester 3',
    notes: 'Dummy Notes 3',
    testEvidence: 'Dummy Evidence 3',
    status: 'Blocked',
    testedEnvironment: 'Dummy Environment 3',
    testedDevice: 'Dummy Device 3',
    relatedBug: 'Dummy Bug 3',
    relatedRun: 'Dummy Run 3',
  },
];
