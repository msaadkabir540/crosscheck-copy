import { useState, useEffect, useCallback } from 'react';

import { useAppContext } from 'context/app-context';

import Button from 'components/button';

import { useToaster } from 'hooks/use-toaster';

import { useCancelSubscription, useUpdateSubscription } from 'api/v1/payment/payment';

import ConfirmationModal from './buy-release-modal';
import style from './style.module.scss';
import Icon from '../../../components/icon/themed-icon';

const Index = ({ _billingInfo, refetch }) => {
  const { userDetails } = useAppContext();
  const { toastError, toastSuccess } = useToaster();
  const { setUserDetails } = useAppContext();
  const [isOpen, setIsOpen] = useState({ open: false, type: '', clickHandler: () => {} });

  const [subscription, setSubscription] = useState({
    planPeriod: 'Monthly',
  });

  const { mutateAsync: _updateSubscriptionHandler, isLoading } = useUpdateSubscription();
  const { mutateAsync: _cancelSubscriptionHandler, isLoading: _isCancelLoading } = useCancelSubscription();

  const onSubmit = async (name, seatsOccupied, invitedUsers) => {
    try {
      const res = await _updateSubscriptionHandler({
        plan: name,
        seatsCount: +seatsOccupied + invitedUsers,
        planPeriod: subscription?.planPeriod,
      });
      setIsOpen({ open: false });

      if (res?.url) {
        window.location.href = res?.url;
      }

      if (res?.msg) {
        toastSuccess(res?.msg);
        setTimeout(async () => {
          await refetch();
        }, 2000);
      }
    } catch (err) {
      toastError(err);
    }
  };

  useEffect(() => {
    const data = userDetails;

    if (data) {
      data.activePlan = _billingInfo?.plan;
      localStorage.setItem('user', JSON.stringify(data));
      setUserDetails((pre) => ({ ...pre, activePlan: _billingInfo?.plan }));
    }
  }, [_billingInfo]);

  const onCancelSubscription = async () => {
    try {
      const res = await _cancelSubscriptionHandler();
      setIsOpen({ open: false });

      if (res?.msg) {
        toastSuccess(res?.msg);
        setTimeout(() => {
          refetch();
        }, 2000);
      }
    } catch (error) {
      toastError(error);
    }
  };

  const handleSetSubscription = useCallback(() => {
    setSubscription((prev) => ({ ...prev, planPeriod: 'Monthly' }));
  }, [setSubscription]);

  const handleSetSubscriptionYearly = useCallback(() => {
    setSubscription((prev) => ({ ...prev, planPeriod: 'Yearly' }));
  }, []);

  const openCancelDialog = useCallback(() => {
    setIsOpen(() => ({
      open: true,
      type: 'cancel',
      clickHandler: onCancelSubscription,
    }));
  }, [setIsOpen, onCancelSubscription]);

  return (
    <>
      <div>
        <div className={style.planPeriod}>
          <div className={style.packages}>
            <p
              className={`${style.btn} ${subscription?.planPeriod === 'Monthly' ? style.btnColor : ''}`}
              onClick={handleSetSubscription}
            >
              Monthly
            </p>
            <p
              className={`${style.btn} ${subscription?.planPeriod === 'Yearly' ? style.btnColor : ''}`}
              onClick={handleSetSubscriptionYearly}
            >
              Yearly
            </p>
          </div>
          {_billingInfo?.plan !== 'Free' && userDetails.superAdmin && (
            <div className={style.cancelBtn} onClick={openCancelDialog}>
              Cancel Subscription
            </div>
          )}
        </div>
        <div className={style.planWrapper}>
          {plans.map((x) => {
            return (
              <div className={style.card} key={x.name}>
                <div className={`${style.cardTitle} ${x.name !== 'Basic' ? style.cardTitleColor2 : ''} `}>{x.name}</div>
                <span>{x?.subtitle}</span>
                <div className={style.pricing}>
                  <h2>${subscription?.planPeriod === 'Monthly' ? x?.price : x?.priceYearly || 0}</h2>
                  <span>per member/month</span>
                  <hr></hr>
                </div>

                <div className={style.features}>
                  <h5> {x?.name} includes:</h5>
                  {x?.description.map((y) => {
                    return <p key={y}>{y}</p>;
                  })}
                </div>

                <div className={style.submit}>
                  {userDetails.superAdmin && (
                    <Button
                      text={
                        _billingInfo?.plan === x.name && _billingInfo?.planPeriod === subscription?.planPeriod
                          ? 'Active Plan'
                          : 'Get started'
                      }
                      btnClass={`${style.btn} ${
                        _billingInfo?.plan === x.name && _billingInfo?.planPeriod === subscription?.planPeriod
                          ? style.btnActive
                          : x.name !== 'Basic'
                            ? style.btn2
                            : style.btn1
                      }`}
                      className={style.title}
                      disabled={isLoading}
                      handleClick={() => {
                        if (!(_billingInfo?.plan === x.name && _billingInfo?.planPeriod === subscription?.planPeriod)) {
                          setIsOpen(() => ({
                            open: true,
                            type: 'update',
                            clickHandler: () => {
                              onSubmit(x.name, _billingInfo?.seatsOccupied, _billingInfo?.invitedUsers);
                            },
                          }));
                        }
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <p className={style.extra}>
          Compare Plans or View Details <Icon name={'ArrowRight'} />
        </p>
      </div>
      <ConfirmationModal
        isLoading={isLoading || _isCancelLoading}
        isOpen={isOpen?.open}
        setIsOpen={() => setIsOpen({ open: false })}
        type={isOpen?.type}
        onSubmitHandler={isOpen.clickHandler}
      />
    </>
  );
};

export default Index;

const plans = [
  {
    name: 'Basic',
    subtitle: 'Best for small size teams',
    price: 8,
    priceYearly: 6,
    description: [
      `+ 5 Free Guest Seats Per Member`,
      `5 Projects`,
      `3,000 Bug Forms & Test Cases Per Project`,
      `1,000 Test Runs Per Project`,
      `Checks`,
      `QA Report & Feedback Widget`,
      `Clickup & Jira Intergations      `,
      `Activity / Audit Log & Trash`,
      `And More`,
    ],
  },
  {
    name: 'Premium',
    subtitle: 'Best for medium size teams',
    price: 16,
    priceYearly: 12,
    description: [
      `+ 5 Free Developer Role Seats per paid seat`,
      `Unlimited Projects`,
      `Unlimited Bug Forms & Test Cases`,
      `Unlimited Test Runs`,
      `Checks`,
      `QA Report & Feedback Widget`,
      `Clickup & Jira Intergations`,
      `Activity / Audit Log & Trash`,
      `And More`,
    ],
  },
];
