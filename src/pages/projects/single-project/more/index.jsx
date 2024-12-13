import { useCallback, useState } from 'react';

import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import _ from 'lodash';

import { useAppContext } from 'context/app-context';

import Button from 'components/button';
import Permissions from 'components/permissions';
import SelectBox from 'components/select-box';
import Loader from 'components/loader';

import { useToaster } from 'hooks/use-toaster';

import {
  useAddMembers,
  useDeleteMembers,
  useGetProjectById,
  useUpdateProject,
  useProjectBugsFormConfiguration,
  useProjectTestCasesFormConfiguration,
} from 'api/v1/projects/projects';

import { formattedDate } from 'utils/date-handler';
import { statusOptions, useUsersOptions } from 'utils/drop-down-options';

import ConfigurationModal from './configuration-modal';
import style from './more.module.scss';
import GeneralTab from './general-tab';
import VersionTab from './versions-tab';
import EnvironmentTab from './environment-tab';

const More = () => {
  const { id } = useParams();

  const { data: _projectDetails, refetch, isLoading: _isLoading } = useGetProjectById(id);

  const { mutateAsync: _bugsFormConfigurationHandler, isLoading: _isBugConfigLoading } =
    useProjectBugsFormConfiguration();

  const { mutateAsync: _testCasesFormConfigurationHandler, isLoading: _isTestCaseConfigLoading } =
    useProjectTestCasesFormConfiguration();

  const { toastSuccess, toastError } = useToaster();

  const { data: _usersOptions } = useUsersOptions();

  const {
    control,
    formState: { errors },
    setError,
    register,
    reset,
    watch,
  } = useForm();
  const [showAllProfiles, setShowAllProfiles] = useState(false);

  const [edit, setEdit] = useState(false);
  const [edit2, setEdit2] = useState(false);
  const [edit3, setEdit3] = useState(false);
  const [acitveSideTab, setAcitveSideTab] = useState(0);
  const { userDetails } = useAppContext();
  const { mutateAsync: _updateProjectHandler, isLoading: _updatingProject } = useUpdateProject();

  const updateProject = useCallback(
    async (type) => {
      try {
        const body = {
          ..._projectDetails,
          name: edit ? watch('name') : _projectDetails.name,
          status: edit2 ? watch('status') : _projectDetails.status,
          idSeries: edit3 ? watch('idSeries') : _projectDetails.idSeries,
          shareWith: _projectDetails?.shareWith?.map((x) => x._id),
        };

        const res = await _updateProjectHandler({
          id,
          body,
        });
        toastSuccess(res.msg);
        refetch();
        if (type === 'name') setEdit(false);
        if (type === 'status') setEdit2(false);
        if (type === 'idSeries') setEdit3(false);
      } catch (error) {
        toastError(error, setError);
      }
    },
    [
      _projectDetails,
      edit,
      watch,
      edit2,
      edit3,
      _updateProjectHandler,
      id,
      refetch,
      setEdit,
      setEdit2,
      setEdit3,
      toastSuccess,
      toastError,
      setError,
    ],
  );

  const { mutateAsync: _addMemberHandler, isLoading: _addingMember } = useAddMembers();

  const addMember = useCallback(async () => {
    try {
      if (watch('shareWith') && !_.isEmpty(watch('shareWith'))) {
        const res = await _addMemberHandler({
          id,
          body: { shareWith: watch('shareWith') },
        });
        toastSuccess(res.msg);
        reset();
        refetch();
      }
    } catch (error) {
      toastError(error, setError);
    }
  }, [_addMemberHandler, id, watch, reset, refetch, toastSuccess, toastError, setError]);

  const { mutateAsync: _removeMemberHandler, isLoading: _removingMember } = useDeleteMembers();

  const removeMember = useCallback(
    async (memberID) => {
      try {
        const res = await _removeMemberHandler({
          id,
          body: { memberToDelete: memberID },
        });
        toastSuccess(res.msg);
        refetch();
      } catch (error) {
        toastError(error, setError);
      }
    },
    [_removeMemberHandler, id, refetch, setError, toastSuccess, toastError],
  );

  const handleViewAllClick = useCallback(() => {
    setShowAllProfiles((prevShowAllProfiles) => !prevShowAllProfiles);
  }, [setShowAllProfiles]);

  const onConfigurationSubmit = useCallback(
    async (data, type) => {
      try {
        let body = {};

        if (type === 'Bug') {
          body = { bugFormConfig: { ...data } };
        } else {
          body = { testCaseFormConfig: { ...data } };
        }

        const res =
          type === 'Bug'
            ? await _bugsFormConfigurationHandler({ id, body })
            : await _testCasesFormConfigurationHandler({ id, body });

        if (res?.msg) {
          toastSuccess(res.msg);
        }
      } catch (error) {
        toastError(error);
      }
    },
    [id, _bugsFormConfigurationHandler, _testCasesFormConfigurationHandler, toastError, toastSuccess],
  );

  return (
    <>
      {_isLoading ? (
        <Loader />
      ) : (
        <>
          {/* TODO: Convert this Code for mobile as Well */}
          <div className={style.wrapper}>
            <div className={style.sideBar}>
              <div className={style.sideBarInner}>
                <div className={style.sideBarHeadClass}>Settings</div>
                {sideBarTabs?.map(({ title }, index) => {
                  return <SingleSideBarTab {...{ title, index, acitveSideTab, setAcitveSideTab }} key={title} />;
                })}
              </div>
            </div>
            {acitveSideTab === 0 && (
              <div className={style.projectInfo}>
                <GeneralTab
                  {...{
                    edit,
                    edit2,
                    watch,
                    edit3,
                    errors,
                    setEdit,
                    control,
                    register,
                    setEdit3,
                    setEdit2,
                    addMember,
                    userDetails,
                    removeMember,
                    updateProject,
                    _addingMember,
                    formattedDate,
                    _usersOptions,
                    statusOptions,
                    visibleProfiles: _projectDetails?.shareWith,
                    _projectDetails,
                    _updatingProject,
                  }}
                />
              </div>
            )}

            {acitveSideTab === 3 && (
              <div className={style.projectInfo}>
                <EnvironmentTab />
              </div>
            )}

            {acitveSideTab === 4 && (
              <div className={style.projectInfo}>
                <VersionTab />
              </div>
            )}

            {acitveSideTab === 7 && (
              <div className={`${style.projectInfo} ${style.configDiv}`}>
                <ConfigurationModal
                  type={'Bug'}
                  id={id}
                  onSubmit={onConfigurationSubmit}
                  isLoading={_isBugConfigLoading || _isTestCaseConfigLoading}
                />
                <ConfigurationModal
                  type={'Test Case'}
                  id={id}
                  onSubmit={onConfigurationSubmit}
                  isLoading={_isBugConfigLoading || _isTestCaseConfigLoading}
                />
              </div>
            )}
          </div>

          <div className={style.contentLastMobile}>
            <Permissions allowedRoles={['Admin', 'Project Manager', 'QA']} currentRole={userDetails?.role}>
              <div className={style.selectDiv}>
                <SelectBox
                  dynamicWrapper={style.noLabel}
                  name="shareWith"
                  control={control}
                  rules={{
                    required: 'Required',
                  }}
                  badge
                  options={
                    _usersOptions?.usersOptions?.filter((x) => {
                      return !_projectDetails?.shareWith.some((profile) => profile._id === x.value);
                    }) || []
                  }
                  label={'Share with'}
                  isMulti
                  placeholder={'Select'}
                  numberBadgeColor={'#39695b'}
                  showNumber
                  errorMessage={errors.shareWith && errors.shareWith.message}
                />

                <Button
                  className={style.btnClass}
                  text={'Add Member'}
                  onClick={addMember}
                  disabled={_addingMember}
                  btnClass={style.buttonClass}
                />
              </div>
            </Permissions>
            {_removingMember ? (
              <Loader />
            ) : (
              <div className={style.rowContainer}>
                {_projectDetails?.shareWith?.map((profile) => (
                  <div className={style.membersRow} key={profile._id}>
                    <div className={style.imgDiv}>
                      {profile?.profilePicture ? (
                        <img src={profile?.profilePicture} alt="" height={35} width={35} />
                      ) : (
                        <span className={`${style.initialSpan} ${style.extendInitialSpan}`}>
                          {_.first(profile?.name)}
                        </span>
                      )}
                    </div>
                    <div className={style.profileClass}>
                      <p className={style.name}>{profile?.name}</p>
                      <p>{profile?.email}</p>
                    </div>
                    <Permissions allowedRoles={['Admin', 'Project Manager', 'QA']} currentRole={userDetails?.role}>
                      <RemoveButton profileId={profile?._id} removeMember={removeMember} />
                    </Permissions>
                  </div>
                ))}
              </div>
            )}
            {!showAllProfiles && _projectDetails?.shareWith?.length > 5 && (
              <div className={style.viewAll}>
                <p className={style.pointerClass} onClick={handleViewAllClick}>
                  View All
                </p>
              </div>
            )}
            {showAllProfiles && (
              <div className={style.viewAll}>
                <p className={style.pointerClass} onClick={handleViewAllClick}>
                  See Less
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default More;

const sideBarTabs = [
  { title: 'General' },
  { title: 'Milestone' },
  { title: 'Features' },
  { title: 'Environments' },
  { title: 'Versions' },
  { title: 'Tags' },
  { title: 'Devices' },
  { title: 'Configurations' },
];

const RemoveButton = ({ removeMember, profileId }) => {
  const handleRemove = useCallback(() => {
    removeMember(profileId);
  }, [profileId, removeMember]);

  return <Button text={'Remove'} btnClass={style.btnRemove} handleClick={handleRemove} />;
};

const SingleSideBarTab = ({ title, index, acitveSideTab, setAcitveSideTab }) => {
  const handleSideBarTabs = useCallback(() => setAcitveSideTab(index), [index, setAcitveSideTab]);

  return (
    <div
      key={title}
      onClick={handleSideBarTabs}
      className={style.sideBarTabs}
      style={{
        borderRadius: acitveSideTab === index && '5px',
        background: acitveSideTab === index && '#F3F3F3',
      }}
    >
      {title}
    </div>
  );
};
