import { useCallback, useMemo, useState } from 'react';

import _ from 'lodash';

import { useAppContext } from 'context/app-context';

import Button from 'components/button';
import ProjectCard from 'components/project-card';
import DeleteModal from 'components/delete-modal';
import Permissions from 'components/permissions';
import TextField from 'components/text-field';
import MobileMenu from 'components/mobile-menu';
import Loader from 'components/loader';

import { useToaster } from 'hooks/use-toaster';

import { useDeleteMembers } from 'api/v1/projects/projects';
import { useGetUsers } from 'api/v1/settings/user-management';

import clearIcon from 'assets/cross.svg';

import style from './project.module.scss';
import AddProject from '../add-project';
import MembersModal from '../members-modal';
import AddProjectMMobile from '../add-project-mobile';

const AllProjects = ({
  projects,
  favoriteToggle,
  addProject,
  onSearch,
  onClear,
  isLoading,
  archiveToggle,
  refetch,
  searchedText,
  favProjects,
  deleteProject,
  loadingArchFav,
}) => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDelModal, setOpenDelModal] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openAllMembers, setOpenAllMembers] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { userDetails } = useAppContext();

  const { data: _res } = useGetUsers({
    sortBy: '',
    sort: '',
    search: '',
  });

  const allMembers = useMemo(() => {
    const admins =
      _res?.users
        ?.filter((x) => x.role === 'Admin' || x.role === 'Owner' || x._id === userDetails?.id)
        .map((x) => ({ ...x, notRemove: true })) || [];
    const members = openAllMembers?.members || [];

    // NOTE: Combine admins and members, then map them to a common format
    const combinedMembers = [...admins, ...members].map((x) => ({
      name: x.name,
      email: x.email,
      profilePicture: x.profilePicture,
      _id: x._id,
      notRemove: x.notRemove,
    }));

    // NOTE: Use _.uniqBy to remove duplicates based on the _id property
    const uniqueMembers = _.uniqBy(combinedMembers, '_id');

    return uniqueMembers;
  }, [_res, openAllMembers, userDetails]);

  const handleAddProjectBtn = useCallback(() => {
    setOpenAddModal(true);
    setOpenMenu(true);
  }, []);

  const handleOpenAllMembers = useCallback(() => {
    setOpenAllMembers({ open: false });
  }, []);

  const handleCloseDelModal = useCallback(() => {
    setOpenDelModal({});
  }, []);

  const handleDelProject = useCallback(async () => {
    await deleteProject(openDelModal.id, { name: openDelModal.name });
    setOpenDelModal({});
  }, [deleteProject, openDelModal.id, openDelModal.name]);

  return (
    <div className={style.mainDiv}>
      <div className={style.searchDiv}>
        <TextField
          defaultValue={searchedText}
          searchField
          searchIcon={true}
          clearIcon={clearIcon}
          startIconClass={style.startIcon}
          placeholder="Type and search..."
          onChange={onSearch}
          onClear={onClear}
        />
        <Permissions allowedRoles={['Admin', 'Project Manager']} currentRole={userDetails?.role}>
          <Button
            text="Add Project"
            btnClass={style.btn}
            handleClick={handleAddProjectBtn}
            data-cy="allproject-addproject-btn"
          />
        </Permissions>
      </div>
      {loadingArchFav ? (
        <Loader />
      ) : (
        <div className={style.grid}>
          {projects?.map((ele, index) => {
            return (
              <ProjectCardWrapper
                favProjects={favProjects}
                searchedText={searchedText}
                index={index}
                key={ele?._id}
                ele={ele}
                setOpenAddModal={setOpenAddModal}
                setOpenMenu={setOpenMenu}
                setOpenDelModal={setOpenDelModal}
                favoriteToggle={favoriteToggle}
                archiveToggle={archiveToggle}
                setOpenAllMembers={setOpenAllMembers}
                setIsOpen={setIsOpen}
              />
            );
          })}
        </div>
      )}
      <div className={style.modalDiv}>
        {openAllMembers?.open && (
          <MembersModal
            openAllMembers={openAllMembers}
            setOpenAllMembers={handleOpenAllMembers}
            refetch={refetch}
            data={_res}
          />
        )}
      </div>
      <div className={style.modalDivMobile}>
        <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen}>
          <div className={style.crossImg}>
            <span className={style.modalTitle}>Members ({allMembers?.length})</span>
          </div>
          <div>
            {allMembers?.map((profile) => (
              <div className={style.membersRow} key={profile?._id}>
                <div className={style.imgDiv}>
                  {profile?.profilePicture ? (
                    <img src={profile?.profilePicture} alt="profilePicture-icon" height={35} width={35} />
                  ) : (
                    <span>{_.first(profile?.name)}</span>
                  )}
                </div>
                <div className={style.memberInfo}>
                  <p className={style.name}>{profile?.name}</p>
                  <p>{profile?.email}</p>
                </div>
                {!profile.notRemove && (
                  <RoleBasedButton
                    allowedRoles={['Admin', 'Project Manager', 'QA']}
                    currentRole={userDetails?.role}
                    buttonText="Remove"
                    buttonClass={style.btnRemove}
                    profileId={profile?._id}
                    openAllMembersId={openAllMembers?.id}
                    setOpenAllMembers={setOpenAllMembers}
                    refetch={refetch}
                  />
                )}
              </div>
            ))}
          </div>
        </MobileMenu>
      </div>
      <div className={style.addModal}>
        {openAddModal && (
          <AddProject
            isLoading={isLoading}
            openAddModal={openAddModal}
            setOpenAddModal={setOpenAddModal}
            addProject={addProject}
          />
        )}
      </div>

      <div className={style.addModalMobile}>
        <MobileMenu isOpen={openMenu} setIsOpen={setOpenMenu}>
          {openMenu && (
            <AddProjectMMobile openAddModal={openMenu} setOpenAddModalMobile={setOpenMenu} addProject={addProject} />
          )}
        </MobileMenu>
      </div>
      <DeleteModal
        isLoading={isLoading}
        openDelModal={!!openDelModal.id}
        setOpenDelModal={handleCloseDelModal}
        name={'Project'}
        secondLine={
          'All milestones, features, test cases, bugs, test runs and files of this project will also be deleted.'
        }
        clickHandler={handleDelProject}
      />
    </div>
  );
};

export default AllProjects;

const RoleBasedButton = ({
  profileId,
  setOpenAllMembers,
  refetch,
  allowedRoles,
  currentRole,
  buttonText,
  buttonClass,
  openAllMembersId,
}) => {
  const { toastSuccess, toastError } = useToaster();

  const { mutateAsync: _deleteMemberHandler } = useDeleteMembers();

  const onRemoveMember = useCallback(async () => {
    try {
      const res = await _deleteMemberHandler({
        id: openAllMembersId,
        body: {
          memberToDelete: profileId,
        },
      });
      refetch();
      toastSuccess(res?.msg);
      setOpenAllMembers(false);
    } catch (error) {
      toastError(error);
    }
  }, [_deleteMemberHandler, openAllMembersId, profileId, refetch, setOpenAllMembers, toastError, toastSuccess]);

  return (
    <Permissions allowedRoles={allowedRoles} currentRole={currentRole}>
      <Button text={buttonText} btnClass={buttonClass} handleClick={onRemoveMember} />
    </Permissions>
  );
};

const ProjectCardWrapper = ({
  favProjects,
  searchedText,
  index,
  ele,
  setOpenAddModal,
  setOpenMenu,
  setOpenDelModal,
  favoriteToggle,
  archiveToggle,
  setOpenAllMembers,
  setIsOpen,
}) => {
  const handleOpenAllMembers = useCallback(() => {
    setOpenAllMembers((prev) => ({
      ...prev,
      open: true,
      id: ele._id,
      members: ele?.shareWith,
    }));
    setIsOpen(true);
  }, [ele._id, ele?.shareWith, setIsOpen, setOpenAllMembers]);

  return (
    <ProjectCard
      favProjects={favProjects}
      key={ele._id}
      searchedText={searchedText}
      index={index}
      title={ele.title}
      data={ele}
      favoriteData={ele.favorites}
      setOpenAddModal={setOpenAddModal}
      setOpenMenu={setOpenMenu}
      setOpenDelModal={setOpenDelModal}
      favoriteToggle={favoriteToggle}
      archiveToggle={archiveToggle}
      setOpenAllMembers={handleOpenAllMembers}
    />
  );
};
