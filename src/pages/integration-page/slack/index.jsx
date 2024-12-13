import { useCallback, useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';

import MainWrapper from 'components/layout/main-wrapper';
import ThemedIcon from 'components/icon/themed-icon';
import Button from 'components/button';
import MoreMenu from 'components/more-menu';
import Loader from 'components/loader';
import SelectBox from 'components/select-box';

import { useToaster } from 'hooks/use-toaster';

import { formattedDate } from 'utils/date-handler';

import plus from '../../../assets/plus-white.svg';
import edit from '../../../assets/Edit.svg';
import del from '../../../../public/assets/DelRedIcon.svg';
import style from './slack.module.scss';
import {
  useConnectSlack,
  useGetSlackIntegrations,
  useGetSlackWorkflow,
  useDeleteWorkflow,
  useGetSlackChannels,
  useSetSlackNotification,
  useUpdateSlackNotification,
  useDisconnectSlack,
} from '../../../api/v1/settings/user-management';
import { useBugsFiltersOptions, notificationsOptions } from './helper';
import MultiLevelSelect from '../../../components/multi-level-selectbox';

const SlackIntegrationPage = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [mainMenu, setMainMenu] = useState(false);
  const [workspaceMenu, setWorkspaceMenu] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState({});
  const [createNew, setCreateNew] = useState(false);
  const [updateSlackNotification, setUpdateSlackNotification] = useState({ open: false, id: '' });
  const [openRow, setOpenRow] = useState({ open: false, id: '' });
  const [slackIntegrations, setSlackIntegrations] = useState({});
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedRowForEditData, setSelectedRowForEditData] = useState({});
  const { toastSuccess, toastError } = useToaster();
  const location = useLocation();
  const { data = {} } = useBugsFiltersOptions();
  const { projectOptions = [] } = data;

  const { control, handleSubmit, watch, setValue, reset } = useForm();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const codeParam = queryParams.get('code');

    if (codeParam) {
      setCode(codeParam);
    }
  }, [location.search]);

  const handleSlackConnect = useCallback(() => {
    const url = `https://slack.com/oauth/v2/authorize?client_id=7402767450052.7397469116997&scope=channels:history,channels:read,chat:write,channels:join,commands&user_scope=`;
    window.open(url, '_blank');
  }, []);

  const { mutateAsync: _createConnectSlack } = useConnectSlack();
  const { mutateAsync: _getSlackData, isLoading: _isLoading } = useGetSlackIntegrations();
  const { mutateAsync: _setSlackHandler } = useSetSlackNotification();
  const { mutateAsync: _UpdateSlackHandler } = useUpdateSlackNotification();

  const { mutateAsync: _removeWorkflow } = useDeleteWorkflow();
  const { mutateAsync: _disconnectSlack } = useDisconnectSlack();

  const fetchSlackData = useCallback(async () => {
    try {
      const response = await _getSlackData();
      setSlackIntegrations(response?.slackIntegrations);
      setSelectedIntegration(response?.slackIntegrations[0]);
    } catch (error) {
      toastError(error);
    }
  }, [_getSlackData, toastError]);

  const slackConnectHandler = useCallback(
    async (code) => {
      try {
        const res = await _createConnectSlack({ code });
        toastSuccess(res.msg);
        navigate('/integrations/slack');
        fetchSlackData();
      } catch (error) {
        toastError(error);
      }
    },
    [_createConnectSlack, fetchSlackData, navigate, toastError, toastSuccess],
  );

  useEffect(() => {
    if (code) {
      slackConnectHandler(code);
    }
  }, [code, slackConnectHandler]);

  const slackId = selectedIntegration?.slackWorkspaceId;
  const { data: workflowData, refetch, isLoading: workflowLoading } = useGetSlackWorkflow(slackId);

  useEffect(() => {
    if (slackId) {
      refetch();
    }
  }, [slackId, refetch]);

  useEffect(() => {
    fetchSlackData();
  }, [fetchSlackData]);

  const handleNavigateBack = useCallback(() => {
    navigate('/integrations');
  }, [navigate]);

  const handleMenuCLick = useCallback(() => {
    setMainMenu(true);
  }, []);

  const toggleViewIntegrations = useCallback(() => {
    setWorkspaceMenu((prev) => !prev);
  }, []);

  const toggleCreateCLick = useCallback(() => {
    setCreateNew((prev) => !prev);
    reset();
  }, [reset]);

  const discardUpdateCLick = useCallback(() => {
    setUpdateSlackNotification({ open: false, id: '' });
    setSelectedRowForEditData({});
    reset();
  }, [reset]);

  const handleBackdropClickMain = useCallback(() => {
    setMainMenu(false);
  }, []);

  const selectedRowForEdit = useCallback(() => {
    setSelectedRowForEditData(workflowData?.slackNotifications?.filter((e, index) => index === selectedProject));
  }, [selectedProject, workflowData?.slackNotifications]);

  const handleRowEditCLick = useCallback(() => {
    setUpdateSlackNotification({ open: true, id: openRow?.id });
    selectedRowForEdit();
  }, [openRow?.id, selectedRowForEdit]);

  const changeIntegrations = useCallback((e) => {
    setSelectedIntegration(e);
    setWorkspaceMenu(false);
  }, []);

  const removeWorkflow = async () => {
    try {
      const res = await _removeWorkflow(openRow?.id);
      toastSuccess(res?.msg);
      refetch();
    } catch (error) {
      toastError(error);
    }
  };

  const disconnectSlackFunc = async () => {
    try {
      const res = await _disconnectSlack(selectedIntegration?._id);
      toastSuccess(res?.msg);
      fetchSlackData();
    } catch (error) {
      toastError(error);
    }
  };

  const mainItems = [
    {
      title: 'Reconnect',
      click: () => handleSlackConnect(),
    },
    {
      title: 'Disconnect',
      click: () => disconnectSlackFunc(),
    },
  ];

  const workspaceItems =
    workspaceMenu &&
    slackIntegrations?.map((e) => ({
      title: e.slackWorkspaceName,
      click: () => changeIntegrations(e),
    }));

  const items = [
    {
      title: 'Edit',
      img: edit,
      click: () => handleRowEditCLick(),
    },
    {
      title: 'Delete',
      img: del,
      click: () => removeWorkflow(),
    },
  ];

  const addSlackNotificationProps = {
    editMode: false,
    projectOptions,
    control,
    handleSubmit,
    _id: selectedIntegration?._id,
    workspaceId: selectedIntegration?.slackWorkspaceId,
    workspaceName: selectedIntegration?.slackWorkspaceName,
    notificationsOptions,
    toggleCreateCLick,
    addSlackHandler: _setSlackHandler,
    toastSuccess,
    toastError,
    reset,
    refetchSlack: refetch,
    watch,
  };

  const editSlackNotificationProps = {
    setValue,
    projectOptions,
    control,
    handleSubmit,
    _id: selectedIntegration?._id,
    workspaceId: selectedRowForEditData[0]?.slackWorkspaceId,
    workspaceName: selectedRowForEditData[0]?.slackWorkspaceName,
    notificationsOptions,
    onDiscardClick: discardUpdateCLick,
    prevData: selectedRowForEditData[0],
    addSlackHandler: _UpdateSlackHandler,
    toastSuccess,
    toastError,
    reset,
    watch,
    refetchSlack: refetch,
  };

  return (
    <MainWrapper title="Integrations" date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}>
      <div className={style.backButton} onClick={handleNavigateBack}>
        <ThemedIcon name={'ArrowLeft'} height={24} />
        <span>Back</span>
      </div>
      {_isLoading ? (
        <Loader />
      ) : (
        <div className={style.mainDiv}>
          <div className={style.upperSection}>
            <div className={style.leftSection}>
              <div className={style.leftSvg}>
                <ThemedIcon name={'Slack'} height={70} width={70} />
              </div>
              <div className={style.leftText}>
                <h4>Slack</h4>
                <p>Get customized notifications into your slack channel</p>
              </div>
            </div>
            <div className={style.rightSection}>
              <Button
                iconStart={plus}
                text={slackIntegrations?.length > 0 ? 'Add Another Account ' : 'Add Account'}
                handleClick={handleSlackConnect}
              />
            </div>
          </div>
          {slackIntegrations?.length < 1 ? (
            <div className={style.noDataIcon}>
              <ThemedIcon name={'connectToSlack'} height={250} width={250} />
            </div>
          ) : (
            <div className={style.lowerSection}>
              <div className={style.mySlack}>
                <div className={style.rowLeft}>
                  <p
                    className={`${slackIntegrations?.length > 1 && style.multiClass} ${style.integrationName}`}
                    onClick={slackIntegrations?.length > 1 && toggleViewIntegrations}
                  >
                    {selectedIntegration && selectedIntegration?.slackWorkspaceName}
                    {slackIntegrations?.length > 1 && <ThemedIcon name={'ArrowDownIcon'} height={24} />}
                  </p>
                  {workspaceMenu && <MoreMenu menu={workspaceItems} menuClass={style.workspaceMenuClass} />}
                  {workspaceMenu && <div className={style.backdrop} onClick={toggleViewIntegrations} />}
                </div>
                <div className={style.rowRight}>
                  {!createNew && (
                    <Button text={'Create New'} btnClass={style.btnClassStroke} handleClick={toggleCreateCLick} />
                  )}
                  <div className={style.moreIcon} onClick={handleMenuCLick}>
                    <ThemedIcon name={'MoreIcon'} height={24} />
                  </div>
                  {mainMenu && <MoreMenu menu={mainItems} />}
                  {mainMenu && <div className={style.backdrop} onClick={handleBackdropClickMain}></div>}
                </div>
              </div>

              {createNew && <AddSlackNotification {...addSlackNotificationProps} />}

              {workflowLoading ? (
                <Loader />
              ) : (
                <div className={style.workflowTable}>
                  <table className={style.table}>
                    <thead>
                      <tr>
                        <th>Project</th>
                        <th>Channel</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {workflowData?.slackNotifications?.map((e, index) => (
                        <>
                          {updateSlackNotification?.id === e?._id ? (
                            <tr className={style.editRow}>
                              <div className={style.tableEditRow}>
                                <AddSlackNotification editMode {...editSlackNotificationProps} />
                              </div>
                            </tr>
                          ) : (
                            <SlackNotificationRow
                              singleRow={e}
                              items={items}
                              openRow={openRow}
                              setOpenRow={setOpenRow}
                              setSelectedProject={setSelectedProject}
                              index={index}
                            />
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </MainWrapper>
  );
};

export default SlackIntegrationPage;

const SlackNotificationRow = ({ singleRow, setSelectedProject, index, items, openRow, setOpenRow }) => {
  const handleBackdropClick = useCallback(() => {
    setOpenRow({ open: false, id: '' });
  }, [setOpenRow]);

  const handleRowCLick = useCallback(() => {
    setOpenRow({ open: true, id: singleRow?._id });
    setSelectedProject(index);
  }, [index, setOpenRow, setSelectedProject, singleRow?._id]);

  return (
    <tr className={style.tableRow} key={singleRow?._id}>
      <td>{singleRow?.projectId?.name}</td>
      <td># {singleRow?.slackChannelName}</td>
      <td className={style.iconCell}>
        <div className={style.icon} onClick={handleRowCLick}>
          <ThemedIcon name={'MoreIcon'} height={24} />
        </div>
        {openRow?.id === singleRow?._id && <MoreMenu menu={items} menuClass={style.menuClass} />}
        {openRow?.id === singleRow?._id && <div className={style.backdrop} onClick={handleBackdropClick}></div>}
      </td>
    </tr>
  );
};

const AddSlackNotification = ({
  _id,
  reset,
  control,
  editMode,
  setValue,
  refetchSlack,
  watch,
  prevData,
  toastSuccess,
  toastError,
  workspaceId,
  handleSubmit,
  workspaceName,
  onDiscardClick,
  projectOptions,
  addSlackHandler,
  toggleCreateCLick,
  notificationsOptions,
}) => {
  const methods = useForm();
  const { data: channelsData } = useGetSlackChannels(_id);

  const channelsOptions =
    channelsData?.channels?.map((x) => ({
      label: x.name,
      value: x.id,
      checkbox: true,
    })) || [];

  const removeRelatedItems = (array) => {
    return array.filter((item) => !item.includes('related'));
  };

  useEffect(() => {
    if (editMode && prevData) {
      setValue('projectId', prevData.projectId?._id);
      setValue('channel', prevData.slackChannelId);
      methods.setValue('notifications', prevData.notifications);
    }
  }, [editMode, prevData, setValue, methods]);

  const onSubmit = async (data) => {
    try {
      const formData = {
        ...data,
        slackWorkspaceName: workspaceName,
        slackWorkspaceId: workspaceId,
        slackChannelId: data?.channel,
        slackChannelName: channelsOptions.find((channel) => channel.value === data?.channel)?.label,
        notifications: removeRelatedItems(methods.watch('notifications')),
      };

      const res = await addSlackHandler(editMode ? { id: prevData?._id, body: formData } : { body: formData });

      reset();
      editMode ? onDiscardClick() : toggleCreateCLick();
      refetchSlack();
      toastSuccess(res?.msg);
    } catch (error) {
      toastError(error);
      console.error('Submission error:', error);
    }
  };

  const notifications = methods.watch('notifications');
  const projectId = watch('projectId');
  const channel = watch('channel');

  const hasValues = notifications && notifications.length > 0 && !!projectId && !!channel;

  return (
    <FormProvider {...methods}>
      <form className={style.outerDiv} onSubmit={handleSubmit(onSubmit)}>
        <div className={style.upperDiv}>
          <SelectBox
            options={projectOptions}
            label={'Project'}
            name={'projectId'}
            control={control}
            numberBadgeColor={'#39695b'}
            dynamicClass={style.zDynamicState1}
            showNumber
            placeholder="Select"
          />
          <div className={style.arrowDiv}>
            <ThemedIcon name={'ArrowRight'} height={24} width={24} />
          </div>
          <SelectBox
            options={channelsOptions}
            label={'Channels'}
            name={'channel'}
            control={control}
            numberBadgeColor={'#39695b'}
            dynamicClass={style.zDynamicState1}
            showNumber
            placeholder="Select"
          />
        </div>
        <div className={style.lowerDiv}>
          <MultiLevelSelect
            name={'notifications'}
            options={notificationsOptions}
            label={'Activity'}
            placeholder={'Select'}
            control={methods.control}
            setValue={methods.setValue}
          />

          <Button
            text={'Discard'}
            btnClass={style.btnClassStroke}
            handleClick={editMode ? onDiscardClick : toggleCreateCLick}
          />
          <Button text={'Create'} type="submit" disabled={hasValues ? false : true} />
        </div>
      </form>
    </FormProvider>
  );
};
