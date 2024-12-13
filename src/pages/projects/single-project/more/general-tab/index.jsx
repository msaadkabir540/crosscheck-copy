import { useCallback } from 'react';

import TextField from 'components/text-field';
import Icon from 'components/icon/themed-icon';
import Permissions from 'components/permissions';
import SelectBox from 'components/select-box';
import Row from 'components/members-row';
import Button from 'components/button';

import style from '../more.module.scss';

const GeneralTab = ({
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
  visibleProfiles,
  _projectDetails,
  _updatingProject,
}) => {
  const handleSetEdit = useCallback(() => setEdit(false), [setEdit]);

  const handleRegisterName = useCallback(() => register('name', { required: 'Required' }), [register]);

  const handleUpdateProjectName = useCallback(() => {
    if (!_updatingProject) {
      updateProject('name');
    }
  }, [_updatingProject, updateProject]);

  const handleSetEditTrue = useCallback(() => {
    setEdit(true);
  }, [setEdit]);

  const handleSetEdit2False = useCallback(() => {
    setEdit2(false);
  }, [setEdit2]);

  const handleUpdateProjectStatus = useCallback(() => {
    if (!_updatingProject) {
      updateProject('status');
    }
  }, [_updatingProject, updateProject]);

  const handleSetEdit2 = useCallback(() => {
    setEdit2(true);
  }, [setEdit2]);

  const idSeriesRegistration = useCallback(
    () =>
      register('idSeries', {
        required: 'Required',
        pattern: {
          value: /^[A-Z]{3}$/,
          message: 'IdSeries must be three uppercase alphabets (A-Z)',
        },
      }),
    [register],
  );

  const handleEdit3Off = useCallback(() => {
    setEdit3(false);
  }, [setEdit3]);

  const handleUpdateProjectIdSeries = useCallback(() => {
    if (!_updatingProject) {
      updateProject('idSeries');
    }
  }, [_updatingProject, updateProject]);

  const handleEdit3On = useCallback(() => {
    setEdit3(true);
  }, [setEdit3]);

  return (
    <>
      <div className={style.headings}>
        <div className={style.blockHead}>Project Information</div>
        <div className={style.dataDetails}>
          <div className={style.headingsDiv}>Project Name</div>
          <div className={style.content}>
            {edit ? (
              <div className={style.editMode}>
                <TextField
                  className={style.inputClass}
                  register={handleRegisterName}
                  defaultValue={_projectDetails?.name}
                  name="name"
                  placeholder="Project Name"
                  errorMessage={errors.name && errors.name.message}
                />
                <div className={style.saveBtn}>
                  <div onClick={handleSetEdit} className={style.cross}>
                    <Icon name={'CrossIcon'} iconClass={style.greyIcon1} />
                  </div>

                  <div onClick={handleUpdateProjectName} className={style.tick}>
                    <Icon name={'TickIcon'} iconClass={style.greyIcon} />
                  </div>
                </div>
              </div>
            ) : (
              <div className={`${style.contentDiv} ${style.editIconClass}`}>
                {_projectDetails?.name}
                <Permissions allowedRoles={['Admin', 'Project Manager']} currentRole={userDetails.role}>
                  <div onClick={handleSetEditTrue}>
                    <Icon name={'EditIconGrey'} iconClass={style.greyIcon} />
                  </div>
                </Permissions>
              </div>
            )}
          </div>
        </div>
        <div className={style.dataDetails}>
          <div className={style.headingsDiv}>Project Status</div>
          <div className={style.content}>
            {edit2 ? (
              <div className={style.editMode}>
                <SelectBox
                  name="status"
                  control={control}
                  rules={{
                    required: 'Required',
                  }}
                  badge
                  defaultValue={_projectDetails?.status || ''}
                  options={statusOptions}
                  placeholder={'Status'}
                  numberBadgeColor={'#39695b'}
                  showNumber
                  errorMessage={errors.status && errors.status.message}
                  dynamicWrapper={style.dynamicWrapper}
                  isClearable={false}
                />

                <div className={style.saveBtn}>
                  <div onClick={handleSetEdit2False} className={style.cross}>
                    <Icon name={'CrossIcon'} iconClass={style.greyIcon1} />
                  </div>
                  <div onClick={handleUpdateProjectStatus} className={style.tick}>
                    <Icon name={'TickIcon'} iconClass={style.greyIcon} />
                  </div>
                </div>
              </div>
            ) : (
              <div className={`${style.contentDiv} ${style.editIconClass}`}>
                {_projectDetails?.status}
                <Permissions allowedRoles={['Admin', 'Project Manager']} currentRole={userDetails.role}>
                  <div onClick={handleSetEdit2}>
                    <Icon name={'EditIconGrey'} iconClass={style.greyIcon} />
                  </div>
                </Permissions>
              </div>
            )}
          </div>
        </div>
        <div className={style.dataDetails}>
          <div className={style.headingsDiv}>ID Series</div>
          <div className={style.content}>
            {edit3 ? (
              <div className={`${style.editMode} ${style.relativeClass}`}>
                <div className={style.count} style={{ marginTop: errors.idSeries && '-65px' }}>
                  {watch('idSeries') ? watch('idSeries')?.length || 3 : 0}/3
                </div>
                <TextField
                  className={style.inputClass}
                  register={idSeriesRegistration}
                  defaultValue={_projectDetails?.idSeries}
                  name="idSeries"
                  placeholder="Id Series"
                  maxLength={3}
                  errorMessage={errors.idSeries && errors.idSeries.message}
                />
                <div className={style.saveBtn}>
                  <div onClick={handleEdit3Off} className={style.cross}>
                    <Icon name={'CrossIcon'} iconClass={style.greyIcon1} />
                  </div>
                  <div onClick={handleUpdateProjectIdSeries} className={style.tick}>
                    <Icon name={'TickIcon'} iconClass={style.greyIcon} />
                  </div>
                </div>
              </div>
            ) : (
              <div className={`${style.contentDiv} ${style.editIconClass}`}>
                {_projectDetails?.idSeries}
                <Permissions allowedRoles={['Admin', 'Project Manager']} currentRole={userDetails.role}>
                  <div onClick={handleEdit3On}>
                    <Icon name={'EditIconGrey'} iconClass={style.greyIcon} />
                  </div>
                </Permissions>
              </div>
            )}
          </div>
        </div>
        <div className={style.dataDetails}>
          <div className={style.headingsDiv}>Created By</div>
          <div className={style.content}>
            <div className={`${style.contentDiv} ${style.imgContentDiv}`}>
              <img src={_projectDetails?.createdBy?.profilePicture} alt="" height={35} width={35} />
              {_projectDetails?.createdBy?.name || ''}
            </div>
          </div>
        </div>
        <div className={style.dataDetails}>
          <div className={style.headingsDiv}>Created At</div>
          <div className={style.content}>
            <div className={style.contentDiv}>
              {formattedDate(_projectDetails?.createdAt, "dd MMM, yyyy 'at' hh:mm a")}
            </div>
          </div>
        </div>
      </div>
      <div className={style.headings}>
        <div className={style.blockHead}>Members</div>
        <div className={`${style.dataDetails} ${style.lastDataDetails}`}>
          <div className={style.contentLast}>
            <div className={style.contentLast}>
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
                    isMulti
                    placeholder={'Search and select members'}
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
              <div className={style.rowContainer}>
                {visibleProfiles?.map((profile, index) => (
                  <VisibleProfileRow
                    key={profile?._id}
                    removeMember={removeMember}
                    profile={profile}
                    userDetails={userDetails}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GeneralTab;

const VisibleProfileRow = ({ removeMember, profile, userDetails }) => {
  const handleRemove = useCallback(() => {
    removeMember(profile?._id);
  }, [profile?._id, removeMember]);

  return (
    <Row key={profile?._id} role={userDetails?.role} showEmail={false} data={profile} handleClick={handleRemove} />
  );
};
