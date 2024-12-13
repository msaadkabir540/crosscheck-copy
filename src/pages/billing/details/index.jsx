import { useCallback, useState } from 'react';

import { useAppContext } from 'context/app-context';

import Button from 'components/button';
import GenericTable from 'components/generic-table';
import Loader from 'components/loader';

import style from './style.module.scss';
import BuyReleaseModal from './buy-release-modal';
import { columnsData } from './helper';
import Icon from '../../../components/icon/themed-icon';

const Index = ({ _billingInfo, refetch, isLoadingBillingInfo }) => {
  const { userDetails } = useAppContext();

  const [isOpen, setIsOpen] = useState({ open: false });

  const handleDownloadClick = useCallback(() => {
    const downloadLink = document.createElement('a');
    downloadLink.href = _billingInfo?.invoiceData?.portalUrl;
    downloadLink.target = '_blank';
    downloadLink.click();
  }, [_billingInfo?.invoiceData?.portalUrl]);

  const handleBuySeats = useCallback(() => {
    setIsOpen(() => ({ open: true, type: 'buy' }));
  }, []);

  const handleRelease = useCallback(() => {
    setIsOpen(() => ({ open: true, type: 'release' }));
  }, []);

  const handleOpen = useCallback(() => {
    setIsOpen({ open: false });
  }, []);

  return (
    <>
      <div className={style.mainWrapper}>
        {_billingInfo?.plan !== 'Free' ? (
          <div className={style.btnSeats}>
            {userDetails.superAdmin && (
              <>
                <Button
                  text={'Buy Seats'}
                  btnClass={style.btn1}
                  className={style.btnText}
                  handleClick={handleBuySeats}
                />
                <Button text={'Release Seats'} handleClick={handleRelease} />
              </>
            )}
          </div>
        ) : (
          <></>
        )}
        {isLoadingBillingInfo ? (
          <Loader />
        ) : (
          <>
            <div className={style.mainDetails}>
              <div className={style.perDetails}>
                <span className={style.title}>Billing Cycle</span>
                <span className={style.subtitle}>{_billingInfo?.planPeriod}</span>
              </div>
              <div className={style.perDetails}>
                <span className={style.title}>Next Billing Date</span>
                <span className={style.subtitle}>{_billingInfo?.invoiceData?.upcomingInvoice?.date}</span>
              </div>
              <div className={style.perDetails}>
                <span className={style.title}>Users</span>
                <span className={style.subtitle}>{`${_billingInfo?.seatsOccupied + _billingInfo?.invitedUsers || ''}/${
                  _billingInfo?.seatsAvailable || ''
                }`}</span>
              </div>
              <div className={style.perDetails}>
                <span className={style.title}>Upcoming Invoice Amount</span>
                <span className={`${style.subtitle} ${style.infoClass}`} onClick={handleDownloadClick}>
                  {`$${_billingInfo?.invoiceData?.upcomingInvoice?.amount || 0.0}`}
                  <Icon name={'InfoIcon2'} />
                </span>
              </div>
            </div>
            <div className={style.tableDetails}>
              <GenericTable
                columns={columnsData({})}
                dataSource={_billingInfo?.invoiceData?.invoiceHistory || []}
                height={'calc(100vh - 330px)'}
                classes={{
                  test: style.test,
                  table: style.table,
                  thead: style.thead,
                  th: style.th,
                  containerClass: style.checkboxContainer,
                  tableBody: style.tableRow,
                }}
              />
            </div>
          </>
        )}
      </div>

      <BuyReleaseModal isOpen={isOpen?.open} setIsOpen={handleOpen} type={isOpen?.type} refetch={refetch} />
    </>
  );
};

export default Index;
