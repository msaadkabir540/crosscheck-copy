import React, { useCallback, useState } from 'react';

import { isEqual } from 'lodash';

import { useAppContext } from 'context/app-context';

import Icon from 'components/icon/themed-icon';

import { useToaster } from 'hooks/use-toaster';

import { useChangeWorkspace } from 'api/v1/settings/user-management';

import style from '../sidebar.module.scss';
import WorkspacesSection from '../../workspaces-section';

const Workspace = ({
  open,
  open2,
  setOpen,
  setOpen2,
  myWorkspaces,
  handleAddWorkSpaceClick,
  handleChangeWorkSpaceClick,
}) => {
  const [selectedWorkspace, setSeletedWorkspace] = useState('');

  const { setUserDetails, userDetails } = useAppContext();
  const { toastSuccess, toastError } = useToaster();
  const { mutateAsync: _changeWorkspaceHandler, isLoading: isSubmitting } = useChangeWorkspace();

  const changeWorkspace = useCallback(
    async (id) => {
      try {
        const newWorkspace = myWorkspaces?.find((x) => x.workSpaceId === id);
        const res = await _changeWorkspaceHandler(id);
        toastSuccess(res.msg);
        setUserDetails({
          ...userDetails,
          plan: newWorkspace?.plan,
          role: newWorkspace.role,
          lastAccessedWorkspace: id,
          lastAccessedWorkspaceName: newWorkspace?.name,
          activePlan: newWorkspace.plan,
        });

        localStorage.setItem(
          'user',
          JSON.stringify({
            ...userDetails,
            plan: newWorkspace?.plan,
            role: newWorkspace.role,
            lastAccessedWorkspace: id,
            lastAccessedWorkspaceName: newWorkspace?.name,
            activePlan: newWorkspace.plan,
          }),
        );
        setOpen(false);
        setOpen2(false);
        handleChangeWorkSpaceClick();
      } catch (error) {
        toastError(error);
      }
    },
    [
      setOpen,
      setOpen2,
      toastError,
      toastSuccess,
      handleChangeWorkSpaceClick,
      _changeWorkspaceHandler,
      userDetails,
      setUserDetails,
      myWorkspaces,
    ],
  );

  const handleTerminateAllOpens = useCallback(() => {
    setOpen(false);
    setOpen2(false);
  }, [setOpen, setOpen2]);

  return (
    <>
      {open2 && (
        <div className={style.position2}>
          <div
            onClick={handleAddWorkSpaceClick}
            className={`${style.addWorkSpace} ${myWorkspaces?.length > 1 ? style.border_with_width : style.border_with_no_width}`}
            data-cy="sidebar-my settings-add-workspace-btn"
          >
            <Icon name={'PlusIcon'} height={24} width={24} />
            <span>Add Workspace</span>
          </div>
          <div className={style.workspaceDiv}>
            {myWorkspaces?.length &&
              myWorkspaces
                ?.filter((ele) => ele?.workSpaceId !== userDetails?.lastAccessedWorkspace)
                ?.map((ele) => (
                  <WorkspacesSection
                    key={ele.workSpaceId}
                    ele={ele}
                    selectedWorkspace={selectedWorkspace}
                    setSelectedWorkspace={setSeletedWorkspace}
                    isSubmitting={isSubmitting}
                    changeWorkspace={changeWorkspace}
                  />
                ))}
          </div>
        </div>
      )}
      {open && <div className={style.backdropDiv} onClick={handleTerminateAllOpens}></div>}
    </>
  );
};

export default React.memo(Workspace, (prevProps, nextProps) => isEqual(prevProps, nextProps));
