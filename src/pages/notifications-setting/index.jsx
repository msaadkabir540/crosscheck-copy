import { useEffect, useState } from 'react';

import MainWrapper from 'components/layout/main-wrapper';
import Button from 'components/button';
import GenericModal from 'components/generic-modal';
import ComingSoonPopUp from 'components/coming-soon-pop-up';
import NotificationTable from 'components/notification-table';
import Loader from 'components/loader';

import { useToaster } from 'hooks/use-toaster';

import { formattedDate } from 'utils/date-handler';

import { useGetNotifications, useUpdateNotificationsSetting } from '../../api/v1/settings/notifications';
import style from './notifications-settings.module.scss';
import Icon from '../../components/icon/themed-icon';

const NotificationsSetting = () => {
  const [openTeamsModal, setOpenTeamsModal] = useState(false);
  const [openSlackModal, setOpenSlackModal] = useState(false);
  const [comingSoonModal, setComingSoonModal] = useState(false);
  const { toastSuccess, toastError } = useToaster();
  const [notifications, setNotifications] = useState({});
  const [listMap, setListMap] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  const { mutateAsync: _getAllNotifications } = useGetNotifications();
  const { mutateAsync: _updateHandler, isLoading: _isUpdatingNotificationsLoading } = useUpdateNotificationsSetting();

  const fetchNotifications = async () => {
    const response = await _getAllNotifications();
    const obj = response?.userNotificationSettings || {};

    const arrayOfObjects = Object?.entries(obj)?.map(([entity, actions]) => ({
      [entity]: actions,
    }));

    const mapValue = arrayOfObjects?.reduce((acc, curr, currIndex) => {
      const key = Object?.keys(curr);
      acc[key] = currIndex;

      return acc;
    }, {});

    setListMap(mapValue);
    setNotifications(arrayOfObjects);
    setIsDirty(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onUpdate = async () => {
    try {
      const fetchedObject = {
        notificationSettings: notifications?.reduce((acc, curr) => {
          const key = Object?.keys(curr)[0];
          acc[key] = curr[key];

          return acc;
        }, {}),
      };

      const transformedData = {
        notificationSettings: Object.keys(fetchedObject?.notificationSettings).reduce((acc, key) => {
          acc[key] = Object.keys(fetchedObject?.notificationSettings[key]).reduce((innerAcc, innerKey) => {
            innerAcc[innerKey] = fetchedObject?.notificationSettings[key][innerKey].notifyOn;

            return innerAcc;
          }, {});

          return acc;
        }, {}),
      };

      const res = await _updateHandler({
        body: transformedData,
      });
      toastSuccess(res.msg);
      setIsDirty(false);
      await fetchNotifications();
    } catch (error) {
      toastError(error);
    }
  };

  const handleChangeValueEvent = ({ value, name, parentKey, childKey }) => {
    let _list = [...notifications];
    const findIndex = listMap[parentKey];
    let updatedData = _list[findIndex];
    const parentList = updatedData[parentKey];
    const childList = parentList[childKey]?.notifyOn || [];

    let updateChildListValue =
      value && !childList?.includes(name) ? [...childList, name] : childList?.filter((x) => x !== name);

    _list[findIndex] = {
      [parentKey]: {
        ...parentList,
        [childKey]: {
          notifyOn: updateChildListValue,
        },
      },
    };
    setNotifications(_list);
    setIsDirty(true);
  };

  return (
    <MainWrapper title="Notifications Settings" date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}>
      {notifications?.length > 0 ? (
        <div>
          <span className={style.topText}>
            Notifications settings will be update for current workspace only. If you want to sync this settings for all
            workspace <span>click here.</span>
          </span>
          <div className={style.tableWrapper}>
            <NotificationTable
              array={notifications}
              handleChangeValueEvent={handleChangeValueEvent}
              setComingSoonModal={setComingSoonModal}
            />
          </div>

          <div className={style.btnDiv}>
            {isDirty && (
              <>
                <Button
                  text={'Discard'}
                  type={'button'}
                  btnClass={style.btn2}
                  className={style.btnText}
                  handleClick={() => {
                    fetchNotifications();
                  }}
                />
                <Button
                  text={'Save Changes'}
                  handleClick={() => {
                    onUpdate();
                  }}
                  disabled={_isUpdatingNotificationsLoading}
                />
              </>
            )}
          </div>
        </div>
      ) : (
        <Loader />
      )}
      <GenericModal
        setOpenModal={setOpenTeamsModal}
        openModal={openTeamsModal}
        mainIcon={<Icon name={'TeamsCrosscheck'} />}
        modalTitle={'Connect your account with Microsoft Teams '}
        modalSubtitle={'Your account is not connected with teams right now.'}
        cancelText={'Discard'}
        saveText={'Connect with Teams'}
        modalClass={style.modalClass}
        btnDivClass={style.btnDivClass}
      />
      <GenericModal
        setOpenModal={setOpenSlackModal}
        openModal={openSlackModal}
        mainIcon={<Icon name={'SlackCrosscheckIcon'} />}
        modalTitle={'Connect your account with Slack '}
        modalSubtitle={'Your account is not connected with slack right now.'}
        cancelText={'Discard'}
        saveText={'Connect with Slack'}
        modalClass={style.modalClass}
        btnDivClass={style.btnDivClass}
      />
      <ComingSoonPopUp setOpen={setComingSoonModal} open={comingSoonModal} />
    </MainWrapper>
  );
};

export default NotificationsSetting;
