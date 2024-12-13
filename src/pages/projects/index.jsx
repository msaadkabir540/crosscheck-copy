import { useCallback, useEffect, useState } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';
import _ from 'lodash';

import { useAppContext } from 'context/app-context';

import Menu from 'components/menu';
import MainWrapper from 'components/layout/main-wrapper';
import Loader from 'components/loader';
import MobileMenu from 'components/mobile-menu';

import { useToaster } from 'hooks/use-toaster';

import {
  useArchiveToggle,
  useCreateProject,
  useDeleteProject,
  useFavoritesToggle,
  useGetProjects,
  useUpdateProject,
} from 'api/v1/projects/projects';

import { formattedDate } from 'utils/date-handler';

import HeaderSection from './header';
import AllProjects from './all-projects';
import ArchivedProjects from './archived-projects';
import style from './projects.module.scss';
import Icon from '../../components/icon/themed-icon';

const Projects = () => {
  const navigate = useNavigate();
  const { userDetails } = useAppContext();
  const [filter, setFilter] = useState({ search: '' });
  const { toastSuccess, toastError } = useToaster();
  const { data: _allProjects, refetch, isLoading: _isLoading, isFetching } = useGetProjects(filter);
  const { mutateAsync: _favoriteToggleHandler, isLoading: _favLoadingProject } = useFavoritesToggle();
  const { mutateAsync: _archiveToggleHandler, isLoading: _archLoadingProject } = useArchiveToggle();
  const { mutateAsync: _createProjectHandler, isLoading: _addingProject } = useCreateProject();
  const { mutateAsync: _updateProjectHandler, isLoading: _updatingProject } = useUpdateProject();
  const { mutateAsync: _deleteProjectHandler, isLoading: _deletingProject } = useDeleteProject();

  const [active, setActive] = useState(0);
  const [searchParams] = useSearchParams();
  const activeItem = searchParams.get('active');

  useEffect(() => {
    setActive(+activeItem);
  }, [activeItem]);

  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const allowedRoles = ['Admin', 'Project Manager'];
  const userRole = userDetails?.role;

  const canSeeButton = allowedRoles.includes(userRole);

  const menu = [
    {
      cypressAttr: 'project-allproject',
      title: 'All Projects',
      compo: active === 0 && (
        <div data-cy="project-menue-allproject1">
          <Icon name={'TickIcon'} iconClass={style.iconColor} />
        </div>
      ),
      click: () => {
        setActive(0);
        setOpen(false);
        setIsOpen(false);
      },
    },
    ...(canSeeButton
      ? [
          {
            cypressAttr: 'project-allarchived',
            title: 'Archived Projects',
            compo: active === 1 && (
              <div data-cy="project-menue-allproject2">
                <Icon name={'TickIcon'} iconClass={style.iconColor} />
              </div>
            ),
            click: () => {
              setActive(1);
              setOpen(false);
              setIsOpen(false);
            },
          },
        ]
      : []),
  ];

  const onFavoriteToggle = useCallback(
    async (e, id) => {
      e.stopPropagation();

      try {
        const res = await _favoriteToggleHandler(id);

        toastSuccess(res.msg);

        refetch();
      } catch (error) {
        toastError(error);
      }
    },
    [_favoriteToggleHandler, refetch, toastError, toastSuccess],
  );

  const onArchiveToggle = useCallback(
    async (e, id) => {
      e.stopPropagation();

      try {
        const res = await _archiveToggleHandler(id);
        toastSuccess(res.msg);
        refetch();
      } catch (error) {
        toastError(error);
      }
    },
    [_archiveToggleHandler, refetch, toastError, toastSuccess],
  );

  const onAddProject = useCallback(
    async (id, body, setError) => {
      try {
        const res = id ? await _updateProjectHandler({ id, body }) : await _createProjectHandler({ body });
        toastSuccess(res.msg);
        await refetch();

        if (res?.msg && !id) {
          navigate(`/projects/${res?.newProject?._id}`);
        }

        return res;
      } catch (error) {
        toastError(error, setError);
      }
    },
    [_updateProjectHandler, _createProjectHandler, toastSuccess, refetch, navigate, toastError],
  );

  const onDeleteProject = useCallback(
    async (id, body) => {
      try {
        const res = await _deleteProjectHandler({ id, body });
        toastSuccess(res.msg);
        await refetch();
      } catch (error) {
        toastError(error);
      }
    },
    [_deleteProjectHandler, refetch, toastError, toastSuccess],
  );

  const debouncedSearch = _.debounce((value) => {
    setFilter((prevFilter) => ({ ...prevFilter, search: value }));
  }, 1000);

  const debouncedClear = _.debounce(() => {
    setFilter((prevFilter) => ({ ...prevFilter, search: '' }));
  }, 1000);

  const handleSearch = useCallback(
    (e) => {
      const inputValue = e?.target?.value;
      debouncedSearch(inputValue);
    },
    [debouncedSearch],
  );

  const handleClear = useCallback(() => {
    debouncedClear();
  }, [debouncedClear]);

  const handleOpens = useCallback(() => {
    setOpen(true);
    setIsOpen(true);
  }, [setIsOpen, setOpen]);

  const handleActiveToOne = useCallback(() => {
    setActive(1);
  }, [setActive]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <MainWrapper title="Projects" date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}>
      {_isLoading || isFetching ? (
        <Loader />
      ) : (
        <div>
          <HeaderSection favorites={_allProjects?.favProjects} favoriteToggle={onFavoriteToggle} />
          <div className={style.header}>
            <p>{active === 0 ? 'All Projects' : ' Archived Projects '}</p>
            <div onClick={handleOpens} className={style.menuIcon}>
              <Icon name={'MenuIcon'} />
            </div>

            {open && (
              <div className={style.menuDiv}>
                <Menu menu={menu} active={active} />
              </div>
            )}

            <div id="showArchiveBtn" onClick={handleActiveToOne} className={style.displaynone} />
          </div>
          <div className={style.menuDivMobile}>
            <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen}>
              {menu?.map((ele) => {
                return (
                  <div className={style.innerDiv} onClick={ele.click} key={ele?.title}>
                    {<p>{ele?.title}</p>}
                  </div>
                );
              })}
            </MobileMenu>
          </div>
          <div className={style.mainLower}>
            {active === 0 && (
              <AllProjects
                onSearch={handleSearch}
                onClear={handleClear}
                data-cy="project-menue-allproject"
                searchedText={filter?.search}
                projects={_allProjects?.allProjects}
                favoriteToggle={onFavoriteToggle}
                favProjects={_allProjects?.favProjects}
                addProject={onAddProject}
                archiveToggle={onArchiveToggle}
                refetch={refetch}
                deleteProject={onDeleteProject}
                isLoading={_addingProject || _updatingProject || _deletingProject}
                loadingArchFav={_favLoadingProject || _archLoadingProject}
              />
            )}
            {active === 1 && (
              <ArchivedProjects
                onSearch={handleSearch}
                onClear={handleClear}
                archived={_allProjects?.archiveProjects}
                favoriteToggle={onFavoriteToggle}
                addProject={onAddProject}
                archiveToggle={onArchiveToggle}
                refetch={refetch}
                deleteProject={onDeleteProject}
                loadingArchFav={_favLoadingProject || _archLoadingProject}
                data-cy="project-menue-allproject"
              />
            )}
          </div>
          {open && <div className={style.backdropDiv} onClick={handleClose}></div>}
        </div>
      )}
    </MainWrapper>
  );
};

export default Projects;
