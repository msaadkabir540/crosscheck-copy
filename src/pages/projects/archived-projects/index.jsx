import { useState } from 'react';

import { useAppContext } from 'context/app-context';

import Button from 'components/button';
import DeleteModal from 'components/delete-modal';
import ProjectCard from 'components/project-card';
import Permissions from 'components/permissions';
import TextField from 'components/text-field';
import Loader from 'components/loader';

import clearIcon from 'assets/cross.svg';
import searchIcon from 'assets/search.svg';

import style from './archive.module.scss';
import MembersModal from '../members-modal';
import AddProject from '../add-project';

const ArchiveProjects = ({
  archived,
  addProject,
  archiveToggle,
  favoriteToggle,
  loadingArchFav,
  refetch,
  onSearch,
  onClear,
  deleteProject,
  searchedText,
}) => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDelModal, setOpenDelModal] = useState(false);
  const [openAllMembers, setOpenAllMembers] = useState(false);
  const { userDetails } = useAppContext();

  return (
    <div className={style.mainDiv}>
      <div className={style.searchDiv}>
        <TextField
          defaultValue={searchedText}
          searchField
          icon={searchIcon}
          clearIcon={clearIcon}
          placeholder="Type and search..."
          onChange={onSearch}
          onClear={onClear}
          startIconClass={style.startIcon}
        />
        <Permissions allowedRoles={['Admin', 'Project Manager']} currentRole={userDetails?.role}>
          <Button text="Add Project" btnClass={style.btn} handleClick={() => setOpenAddModal(true)} />
        </Permissions>
      </div>
      {loadingArchFav ? (
        <Loader />
      ) : (
        <div className={style.grid}>
          {archived?.map((ele) => {
            return (
              <ProjectCard
                key={ele._id}
                title={ele.title}
                data={ele}
                setOpenAddModal={setOpenAddModal}
                setOpenDelModal={setOpenDelModal}
                favoriteToggle={favoriteToggle}
                archiveToggle={archiveToggle}
                setOpenAllMembers={() =>
                  setOpenAllMembers((pre) => ({
                    ...pre,
                    open: true,
                    id: ele._id,
                    members: ele?.shareWith,
                  }))
                }
                archive
              />
            );
          })}
        </div>
      )}
      {openAllMembers?.open && (
        <MembersModal
          openAllMembers={openAllMembers}
          setOpenAllMembers={() => setOpenAllMembers({ open: false })}
          refetch={refetch}
        />
      )}
      {openAddModal && (
        <AddProject openAddModal={openAddModal} setOpenAddModal={setOpenAddModal} addProject={addProject} />
      )}
      <DeleteModal
        openDelModal={!!openDelModal.id}
        setOpenDelModal={() => setOpenDelModal({})}
        name="Project"
        clickHandler={async () => {
          await deleteProject(openDelModal.id, { name: openDelModal.name });
          setOpenDelModal({});
        }}
      />
    </div>
  );
};

export default ArchiveProjects;
