import { useCallback } from 'react';

import { Link } from 'react-router-dom';

import Highlighter from 'components/highlighter';

import { formattedDate } from 'utils/date-handler';
import { handleDownload } from 'utils/downlaod-file-handler';

import style from './file.module.scss';
import Icon from '../../../../components/icon/themed-icon';

export const columnsData = ({ setOpenRenameModal, yourStyleObject, setOpenDelModal, searchedText }) => [
  {
    name: 'Title',
    key: 'name',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '380px', height: '36px' },
    widthInEditMode: { width: '182px' },
    displayIcon: true,

    render: ({ row }) => {
      return <FileNameLink row={row} searchedText={searchedText} />;
    },
  },

  {
    name: 'File Type',
    key: 'type',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => (
      <div className={style.imgDiv}>
        <p className={`${style.userName} ${style.high}`}>
          <Highlighter search={searchedText}>{row?.type ? row?.type : '-'}</Highlighter>
        </p>
      </div>
    ),
  },
  {
    name: 'File Size',
    key: 'size',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '120px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => <FileSizeInfo row={row} searchedText={searchedText} />,
  },
  {
    name: 'Uploaded by',
    key: 'uploadedBy',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '250px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => <UploadedByInfo row={row} searchedText={searchedText} />,
  },

  {
    name: 'Uploaded Date',
    key: 'uploadDate',
    type: 'text',
    editable: true,
    hidden: false,
    widthAndHeight: { width: '150px', height: '36px' },
    widthInEditMode: { width: '210px' },
    displayIcon: true,
    showToolTipOnUnEditableField: false,

    render: ({ row }) => <UploadDate row={row} formattedDate={formattedDate} searchedText={searchedText} />,
  },

  {
    name: 'Actions',
    key: 'actions',
    hidden: false,
    type: 'text',
    editable: true,
    widthAndHeight: { width: '110px', height: '36px' },
    widthInEditMode: { width: '56px' },
    displayIcon: false,
    render: ({ row }) => (
      <FileActions
        row={row}
        setOpenRenameModal={setOpenRenameModal}
        handleDownload={handleDownload}
        setOpenDelModal={setOpenDelModal}
        style={yourStyleObject}
      />
    ),
  },
];

export const rows = [
  {
    title: 'Project Initial Scope',
    fileType: 'PDF',
    fileSize: '10 MB',
    uploadedBy: 'John Doe (johndoe@gmail.com',
    uploadedDate: '25 Nov, 2023',
  },
  {
    title: 'Project Initial Scope',
    fileType: 'PDF',
    fileSize: '10 MB',
    uploadedBy: 'John Doe (johndoe@gmail.com',
    uploadedDate: '25 Nov, 2023',
  },
  {
    title: 'Project Initial Scope',
    fileType: 'PDF',
    fileSize: '10 MB',
    uploadedBy: 'John Doe (johndoe@gmail.com',
    uploadedDate: '25 Nov, 2023',
  },
  {
    title: 'Project Initial Scope',
    fileType: 'PDF',
    fileSize: '10 MB',
    uploadedBy: 'John Doe (johndoe@gmail.com',
    uploadedDate: '25 Nov, 2023',
  },
  {
    title: 'Project Initial Scope',
    fileType: 'PDF',
    fileSize: '10 MB',
    uploadedBy: 'John Doe (johndoe@gmail.com',
    uploadedDate: '25 Nov, 2023',
  },
  {
    title: 'Project Initial Scope',
    fileType: 'PDF',
    fileSize: '10 MB',
    uploadedBy: 'John Doe (johndoe@gmail.com',
    uploadedDate: '25 Nov, 2023',
  },
  {
    title: 'Project Initial Scope',
    fileType: 'PDF',
    fileSize: '10 MB',
    uploadedBy: 'John Doe (johndoe@gmail.com',
    uploadedDate: '25 Nov, 2023',
  },
];

const FileActions = ({ row, setOpenRenameModal, handleDownload, setOpenDelModal }) => {
  const handleOpenRenameModal = useCallback(() => {
    setOpenRenameModal(row);
  }, [setOpenRenameModal, row]);

  const handleDownloadClick = useCallback(() => {
    handleDownload(row?.location, row?.name);
  }, [handleDownload, row]);

  const hadnleOpenDelModal = useCallback(() => {
    setOpenDelModal(row);
  }, [setOpenDelModal, row]);

  return (
    <div className={style.imgDiv1}>
      <div className={style.img} onClick={handleOpenRenameModal}>
        <Icon name={'FileEdit'} iconClass={style.iconStroke1} />
        <div className={style.tooltip}>
          <p>Rename</p>
        </div>
      </div>
      <div className={style.img} onClick={handleDownloadClick}>
        <Icon name={'DownloadIcon'} iconClass={style.iconStroke} />
        <div className={style.tooltip}>
          <p>Download</p>
        </div>
      </div>
      <div className={style.img} onClick={hadnleOpenDelModal}>
        <div className={style.imgDel}>
          <Icon name={'DelIcon'} iconClass={style.iconStroke} />
        </div>
        <div className={style.tooltip}>
          <p>Delete</p>
        </div>
      </div>
    </div>
  );
};

const UploadDate = ({ row, formattedDate, searchedText }) => {
  return (
    <div className={style.imgDiv}>
      <p className={style.userName}>
        <Highlighter search={searchedText}>
          {row?.uploadDate ? formattedDate(row?.uploadDate, 'dd MMM, yyyy') : '-'}
        </Highlighter>
      </p>
    </div>
  );
};

const UploadedByInfo = ({ row, searchedText }) => {
  const uploadedBy = row?.uploadedBy;
  const userInfo = uploadedBy?.name || uploadedBy?.email ? `${uploadedBy?.name || ''} ${uploadedBy?.email || ''}` : '-';

  return (
    <div className={style.imgDiv}>
      <p className={style.userName}>
        <Highlighter search={searchedText}>{userInfo}</Highlighter>
      </p>
    </div>
  );
};

const FileSizeInfo = ({ row, searchedText }) => {
  const fileSize = row?.size ? `${row.size || 0} MB` : '-';

  return (
    <div className={style.imgDiv}>
      <p className={style.userName}>
        <Highlighter search={searchedText}>{fileSize}</Highlighter>
      </p>
    </div>
  );
};

const FileNameLink = ({ row, searchedText }) => {
  return (
    <div className={`${style.imgDiv} ${style.leftImgDiv}`}>
      <p className={`${style.userName} ${style.userNamePointer} ${style.clickable}`}>
        <Link to={row?.location || '#'} target="_blank" className={style.linkLocation}>
          <Highlighter search={searchedText}>{row?.name ? row?.name : '-'}</Highlighter>
        </Link>
      </p>
    </div>
  );
};
