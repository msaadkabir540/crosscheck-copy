import React, { useCallback, useState } from 'react';

import { useForm } from 'react-hook-form';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { isEqual } from 'lodash';

import { useAppContext } from 'context/app-context';

import WorkspaceName from 'pages/on-boarding/workspace-name';
import WorkspaceAvatar from 'pages/on-boarding/workspace-avatar';
import WorkspaceWorking from 'pages/on-boarding/people-working';
import WorkspaceHearing from 'pages/on-boarding/hear-about';
import WorkspacePlan from 'pages/on-boarding/workspace-plan';
import WorkspaceReady from 'pages/on-boarding/workspace-ready';

import Icon from 'components/icon/themed-icon';

import { useToaster } from 'hooks/use-toaster';

import { useOnboarding } from 'api/v1/auth';
import { useUpdateSubscription } from 'api/v1/payment/payment';
import { useGetMyWorkspaces, useChangeWorkspace } from 'api/v1/settings/user-management';

import style from './boarding.module.scss';
import TabContent from './tab-content';
import { hasFreePlanWorkspace, hasNoPlanWorkspace } from './helper';

const OnBoarding = () => {
  const { userDetails } = useAppContext();
  const { email } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { toastSuccess, toastError } = useToaster();
  const { register, setValue, watch, handleSubmit, getValues, control } = useForm();
  const { setUserDetails } = useAppContext();
  const { mutateAsync: onBoardingHandler, isLoading: isSubmitting } = useOnboarding();
  const { mutateAsync: _updateSubscriptionHandler } = useUpdateSubscription();
  const { data: _getAllWorkspaces, isLoading: workspacesLoading } = useGetMyWorkspaces(userDetails?.signUpType);
  const { mutateAsync: _changeWorkspaceHandler } = useChangeWorkspace();

  const PAGE_ACTIVE = new URLSearchParams(location.search).get('active');
  const HAS_FREE_PLAN_ALREADY = hasFreePlanWorkspace(_getAllWorkspaces?.workspaces);
  const HAS_CURRENT_WORKSPACE_OF_NO_PLAN = hasNoPlanWorkspace(_getAllWorkspaces?.workspaces);
  const TABS_COUNT = 5;

  const [active, setActive] = useState(PAGE_ACTIVE ? PAGE_ACTIVE : 0);
  const [color, setColor] = useState('#333333');
  const [selectedPeople, setSelectedPeople] = useState('Just Me');
  const [selectedSource, setSelectedSource] = useState('Search Engine');
  const [planPeriod, setPlanPeriod] = useState('Monthly');
  const [activePlan, setActivePlan] = useState('Free');

  const tabs = [
    { component: <WorkspaceName register={register} setValue={setValue} />, key: 'workspaceName' },
    {
      component: <WorkspaceAvatar watch={watch} setValue={setValue} color={color} setColor={setColor} />,
      key: 'workspaceAvatar',
    },
    {
      component: (
        <WorkspaceWorking selectedPeople={selectedPeople} setSelectedPeople={setSelectedPeople} control={control} />
      ),
      key: 'workspaceWorking',
    },
    {
      component: (
        <WorkspaceHearing selectedSource={selectedSource} setSelectedSource={setSelectedSource} control={control} />
      ),
      key: 'workspaceHearing',
    },
    {
      component: (
        <WorkspacePlan
          excludeFreePlan={HAS_FREE_PLAN_ALREADY}
          planPeriod={planPeriod}
          setPlanPeriod={setPlanPeriod}
          activePlan={activePlan}
          setActivePlan={setActivePlan}
          isLoading={isSubmitting}
          watch={watch}
          register={register}
          workspaceName={PAGE_ACTIVE ? userDetails?.lastAccessedWorkspaceName : getValues()?.name}
        />
      ),
      key: 'workspacePlan',
    },

    { component: <WorkspaceReady freeAvailed={HAS_FREE_PLAN_ALREADY} />, key: 'workspaceReady' },
  ];

  const handleActiveIncrement = useCallback((event) => {
    event.preventDefault();
    setActive((prev) => prev + 1);
  }, []);

  const handleActiveDecrement = useCallback((event) => {
    event.preventDefault();
    setActive((prev) => prev - 1);
  }, []);

  const handleOnSubmit = useCallback(
    async (data, onSkip = false) => {
      const isFinalStep = active === 4 || onSkip;

      if (!isFinalStep) return;

      const formData = {
        ...data,
        email,
        workSpaceName: data?.name || `${userDetails?.name}'s Workspace`,
        orgSize: watch('peopleWorking') || selectedPeople,
        source: watch('source') || selectedSource,
        plan: activePlan,
        planPeriod,
        seatsCount: activePlan === 'Free' ? 1 : data.seatsCount ? +data.seatsCount : 1,
      };

      try {
        if (PAGE_ACTIVE === '4') {
          const res = await _updateSubscriptionHandler(formData);

          if (res?.url) {
            window.location.href = res?.url;
          } else {
            window.location.href = '/home';
          }

          if (res?.msg) {
            toastSuccess(res?.msg);
          }
        } else {
          const res = await onBoardingHandler(formData);
          const updatedWorkspaces = res?.data?.data?.workspaces;
          const lastWorkspace = updatedWorkspaces[updatedWorkspaces?.length - 1];

          const updatedUserDetails = {
            ...userDetails,
            plan: lastWorkspace?.plan,
            role: lastWorkspace?.role,
            superAdmin: res?.data?.data?.superAdmin,
            lastAccessedWorkspace: lastWorkspace?.workSpaceId,
            lastAccessedWorkspaceName: lastWorkspace?.name,
            activePlan: lastWorkspace?.plan,
          };

          localStorage.setItem('user', JSON.stringify(updatedUserDetails));
          setUserDetails(updatedUserDetails);
          toastSuccess(res?.data?.msg, { autoClose: 500 });

          if (res?.data?.stripeCheckoutUrl) {
            window.location.href = res?.data?.stripeCheckoutUrl;
          } else {
            setActive(TABS_COUNT);
          }
        }
      } catch (error) {
        toastError(error);
      }
    },
    [
      active,
      activePlan,
      email,
      onBoardingHandler,
      _updateSubscriptionHandler,
      PAGE_ACTIVE,
      planPeriod,
      selectedPeople,
      selectedSource,
      setUserDetails,
      toastError,
      toastSuccess,
      userDetails,
      watch,
    ],
  );

  const handleSkip = useCallback(async () => {
    const data = {
      email,
      name: getValues('name'),
      orgSize: selectedPeople,
      plan: activePlan,
      planPeriod,
      seatsCount: 1,
      source: selectedSource,
    };

    await handleOnSubmit(data, true);
  }, [activePlan, email, getValues, handleOnSubmit, planPeriod, selectedPeople, selectedSource]);

  const changeWorkspace = useCallback(
    async (id) => {
      try {
        const newWorkspace = _getAllWorkspaces?.workspaces?.find((x) => x.workSpaceId === id);
        const res = await _changeWorkspaceHandler(id);
        toastSuccess(res.msg);
        setUserDetails({
          ...userDetails,
          role: newWorkspace.role,
          lastAccessedWorkspace: id,
          activePlan: newWorkspace.plan,
        });
        localStorage.setItem(
          'user',
          JSON.stringify({
            ...userDetails,
            role: newWorkspace.role,
            lastAccessedWorkspace: id,
            activePlan: newWorkspace.plan,
          }),
        );
        navigate(`/dashboard`);
      } catch (error) {
        toastError(error);
      }
    },
    [
      _getAllWorkspaces?.workspaces,
      toastError,
      navigate,
      toastSuccess,
      _changeWorkspaceHandler,
      userDetails,
      setUserDetails,
    ],
  );

  const handleCrossAction = useCallback(() => {
    if (_getAllWorkspaces?.workspaces) {
      if (HAS_CURRENT_WORKSPACE_OF_NO_PLAN) {
        changeWorkspace(_getAllWorkspaces?.workspaces?.[1]?.workSpaceId);
      } else {
        navigate('/home');
      }
    }
  }, [navigate, HAS_CURRENT_WORKSPACE_OF_NO_PLAN, _getAllWorkspaces?.workspaces, changeWorkspace]);

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)}>
      <div className={style.main}>
        <div className={style.left}>
          <p>{`"Quality in a service or product is not what you put into it. It is what the customer gets out of it."`}</p>
        </div>
        <div className={style.right}>
          <div className={style.frame}>
            <div className={style.textWrapper}>
              <Icon name={'crossCheckLogo'} iconClass={style.img1} />
              {_getAllWorkspaces?.workspaces?.length >= 1 &&
                _getAllWorkspaces?.workspaces?.some((workspace) => workspace?.plan !== 'No Plan') && (
                  <div onClick={handleCrossAction}>
                    <Icon name={'crossTagBlack'} iconClass={style.img} />
                  </div>
                )}
            </div>
            {active < TABS_COUNT && (
              <div className={style.div}>
                <div className={style.div2}>
                  {tabs.map((tab, index) => {
                    const tabClassName = index === parseInt(active) ? style.activeTab : style.inactiveTab;

                    return (
                      <div
                        className={`${style.rectangle} ${tabClassName}       
                          ${
                            index === parseInt(active)
                              ? style.greyColor
                              : index < parseInt(active)
                                ? style.greyColor
                                : index === parseInt(active) + 1
                                  ? style.normalColor
                                  : style.normalColor
                          }
                          
                          `}
                        key={tab?.key}
                      />
                    );
                  })}
                </div>
                <div className={style.text2}>
                  {PAGE_ACTIVE ? parseInt(PAGE_ACTIVE) : parseInt(active) + 1} of {TABS_COUNT}
                </div>
              </div>
            )}
          </div>
          <div className={style.wrapper}>
            <TabContent
              active={parseInt(active)}
              tabs={tabs}
              isSubmitting={isSubmitting}
              handleActiveIncrement={handleActiveIncrement}
              handleActiveDecrement={handleActiveDecrement}
              handleSkip={handleSkip}
              activePlan={activePlan}
              register={register}
              isBackDisabled={PAGE_ACTIVE && PAGE_ACTIVE === '4'}
              workspaces={_getAllWorkspaces?.workspaces}
              workspacesLoading={workspacesLoading}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default React.memo(OnBoarding, (prevProps, nextProps) => isEqual(prevProps, nextProps));
