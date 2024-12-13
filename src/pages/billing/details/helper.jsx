import { useCallback } from 'react';

import { formattedDate } from 'utils/date-handler';

import style from './style.module.scss';
import Icon from '../../../components/icon/themed-icon';

const TransactionIDCell = ({ row }) => (
  <div className={style.imgDiv}>
    <p className={style.userName}>{row?.invoiceNumber}</p>
  </div>
);

const DescriptionCell = ({ row }) => (
  <div className={style.imgDiv}>
    <p className={style.userName}>{row?.description}</p>
  </div>
);

const TransactionDateCell = ({ row }) => (
  <div className={style.imgDiv}>
    <p className={style.userName}>{formattedDate(row?.date, 'dd MMM, yyyy')}</p>
  </div>
);

const AmountCell = ({ row }) => (
  <div className={style.imgDiv}>
    <p className={style.userName}>{`$${row?.amount}`}</p>
  </div>
);

export const columnsData = () => [
  {
    name: 'Transaction ID',
    key: 'transaction_id',
    hidden: false,
    type: 'text',
    editable: true,
    widthAndHeight: { width: '180px', height: '36px' },
    widthInEditMode: { width: '56px' },
    displayIcon: false,
    render: ({ row }) => <TransactionIDCell row={row} />,
  },
  {
    name: 'Description',
    key: 'description',
    hidden: false,
    type: 'text',
    editable: true,
    widthAndHeight: { width: '180px', height: '36px' },
    widthInEditMode: { width: '56px' },
    displayIcon: false,
    render: ({ row }) => <DescriptionCell row={row} />,
  },
  {
    name: 'Transaction Date',
    key: 'transaction-date',
    hidden: false,
    type: 'text',
    editable: true,
    widthAndHeight: { width: '180px', height: '36px' },
    widthInEditMode: { width: '56px' },
    displayIcon: false,
    render: ({ row }) => <TransactionDateCell row={row} />,
  },
  {
    name: 'Amount',
    key: 'amount',
    hidden: false,
    type: 'text',
    editable: true,
    widthAndHeight: { width: '180px', height: '36px' },
    widthInEditMode: { width: '56px' },
    displayIcon: false,
    render: ({ row }) => <AmountCell row={row} />,
  },
  {
    name: 'Invoice',
    key: 'invoice',
    hidden: false,
    type: 'text',
    editable: true,
    widthAndHeight: { width: '180px', height: '36px' },
    widthInEditMode: { width: '56px' },
    displayIcon: false,
    render: ({ row }) => <InvoiceCell row={row} />,
  },
];

const InvoiceCell = ({ row }) => {
  const handleDownloadClick = useCallback(() => {
    const downloadLink = document.createElement('a');
    downloadLink.href = row.invoiceLink;
    downloadLink.download = 'file.ext'; // NOTE: You can specify the file name here
    downloadLink.click();
  }, [row.invoiceLink]);

  return (
    <div className={style.imgDiv1}>
      <div className={style.img} onClick={handleDownloadClick}>
        <div className={style.invoiceIcon}>
          <Icon name={'InvoiceIcon'} />
        </div>
        <div className={style.tooltip}>
          <p>Invoice</p>
        </div>
      </div>
    </div>
  );
};
