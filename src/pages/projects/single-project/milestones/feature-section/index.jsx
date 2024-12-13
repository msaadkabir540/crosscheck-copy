import { useCallback, useState } from 'react';

import { useParams } from 'react-router-dom';

import { useAppContext } from 'context/app-context';

import DraggableComponent from 'components/dragable/dragable';
import Permissions from 'components/permissions';
import DeleteModal from 'components/delete-modal';
import Loader from 'components/loader';
import MobileMenu from 'components/mobile-menu';

import { useToaster } from 'hooks/use-toaster';

import {
  useAddFeature,
  useDeleteFeature,
  useEditFeature,
  useFeaturePerMileStone,
  useUpdateOrderFeature,
} from 'api/v1/feature/feature';

import noFoundFeature from 'assets/feature.svg';
import dragIcon from 'assets/white-drag.svg';

import style from '../milestone.module.scss';
import AddFeature from './add-feature';
import Icon from '../../../../../components/icon/themed-icon';

const FeatureSection = ({ selectedMilestone, setSelectedMilestones }) => {
  const { id } = useParams();
  const { data: _features, refetch, isLoading: _isLoading } = useFeaturePerMileStone(selectedMilestone?.id);

  const { mutateAsync: _addFeatureHandler, isLoading: _isAddingFeature } = useAddFeature();
  const { mutateAsync: _editFeatureHandler } = useEditFeature();
  const { mutateAsync: _deleteFeatureHandler, isLoading: _isDeleting } = useDeleteFeature();
  const { mutateAsync: _UpdateOrderFeatureHandler } = useUpdateOrderFeature();

  const { toastError, toastSuccess } = useToaster();
  const [moreFeature, setMoreFeature] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openDelFeatureModal, setOpenDelFeatureModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);

  const { userDetails } = useAppContext();

  const onAddFeature = useCallback(
    async (data, featureId, setError) => {
      try {
        const res = featureId
          ? await _editFeatureHandler({
              id: featureId,
              body: { ...data },
            })
          : await _addFeatureHandler({
              ...data,
              projectId: id,
              milestoneId: selectedMilestone?.id,
            });

        toastSuccess(res.msg);
        setOpenAddModal({ open: false });
        refetch();
      } catch (error) {
        toastError(error, setError);
      }
    },
    [_addFeatureHandler, _editFeatureHandler, id, refetch, selectedMilestone?.id, toastError, toastSuccess],
  );

  const onDeleteFeature = useCallback(async () => {
    try {
      const res = await _deleteFeatureHandler({
        id: openDelFeatureModal?._id,
        body: { name: openDelFeatureModal?.name },
      });

      if (res.msg) {
        toastSuccess(res.msg);
        setOpenDelFeatureModal({ open: false });
        refetch();
      }
    } catch (error) {
      toastError(error);
    }
  }, [openDelFeatureModal, _deleteFeatureHandler, refetch, toastError, toastSuccess]);

  const onOrderUpdate = useCallback(
    async (e) => {
      try {
        const id = _features?.features[e?.source?.index]?._id;

        if (id) {
          const body = {
            newOrder: e?.destination?.index,
          };
          const res = await _UpdateOrderFeatureHandler({ id, body });
          refetch();
          toastSuccess(res.msg);
        }
      } catch (error) {
        toastError(error);
      }
    },
    [_features?.features, _UpdateOrderFeatureHandler, refetch, toastSuccess, toastError],
  );

  const clickSelectedMilestonesHandler = useCallback(() => {
    setSelectedMilestones(false);
  }, [setSelectedMilestones]);

  const handleAddFeatureBtnClick = useCallback(() => {
    if (selectedMilestone.id) {
      setOpenAddModal({ open: true, selectedMilestone });
    } else {
      toastError({ msg: 'Select a Milestone First' });
    }
  }, [selectedMilestone, toastError]);

  const handleMoreFeatureClick = useCallback((index, e) => {
    e.stopPropagation();
    setMoreFeature(index);
    setIsOpen(true);
  }, []);

  const handleRenameClick = useCallback(
    (ele) => {
      setOpenAddModal({
        open: true,
        ...ele,
        selectedMilestone,
      });
      setMoreFeature(false);
    },
    [selectedMilestone],
  );

  const handleDeleteClick = useCallback((ele) => {
    setOpenDelFeatureModal({ open: true, ...ele });
    setMoreFeature(false);
  }, []);

  const handleBackdropClick = useCallback(() => setMoreFeature(false), []);
  const closeDelFeatModalClick = useCallback(() => setOpenDelFeatureModal({ open: false }), []);
  const closeAddModalClick = useCallback(() => setOpenAddModal({ open: false }), []);

  const FeatureMenu = ({
    index,
    ele,
    moreFeature,
    handleMoreFeatureClick,
    handleRenameClick,
    handleDeleteClick,
    isOpen,
    setIsOpen,
    handleBackdropClick,
  }) => {
    const [localMenuOpen, setLocalMenuOpen] = useState(moreFeature === index);

    const toggleMenu = useCallback(() => {
      setLocalMenuOpen((prev) => !prev);

      if (!localMenuOpen) {
        handleMoreFeatureClick(index, null);
      }
    }, [index, localMenuOpen, handleMoreFeatureClick]);

    const handleMenuClick = useCallback(
      (e) => {
        e.stopPropagation();
        toggleMenu();
      },
      [toggleMenu],
    );

    const handleRename = useCallback(() => {
      handleRenameClick(ele);
      setLocalMenuOpen(false);
    }, [ele, handleRenameClick]);

    const handleDelete = useCallback(() => {
      handleDeleteClick(ele);
      setLocalMenuOpen(false);
    }, [ele, handleDeleteClick]);

    return (
      <>
        {userDetails?.role !== 'Developer' && (
          <div data-cy={`features-menu-threedots${index}`} onClick={handleMenuClick}>
            <svg
              className={style.icon}
              width="7"
              height="8"
              viewBox="0 0 2 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 2C1.55228 2 2 1.55228 2 1C2 0.447715 1.55228 0 1 0C0.447715 0 0 0.447715 0 1C0 1.55228 0.447715 2 1 2Z"
                fill="#8B909A"
              />
              <path
                d="M1 5C1.55228 5 2 4.55228 2 4C2 3.44772 1.55228 3 1 3C0.447715 3 0 3.44772 0 4C0 4.55228 0.447715 5 1 5Z"
                fill="#8B909A"
              />
              <path
                d="M1 8C1.55228 8 2 7.55228 2 7C2 6.44772 1.55228 6 1 6C0.447715 6 0 6.44772 0 7C0 7.55228 0.447715 8 1 8Z"
                fill="#8B909A"
              />
            </svg>
          </div>
        )}

        {localMenuOpen && (
          <>
            <div className={`${style.popUp} ${style.popUpAbs}`}>
              <Permissions allowedRoles={['Admin', 'Project Manager', 'QA']} currentRole={userDetails?.role}>
                <p onClick={handleRename} data-cy="rename-feature">
                  Rename
                </p>
              </Permissions>
              <Permissions allowedRoles={['Admin', 'Project Manager', 'QA']} currentRole={userDetails?.role}>
                <p onClick={handleDelete} data-cy="delete-feature">
                  Delete
                </p>
              </Permissions>
            </div>

            <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen}>
              <div className={style.popUpMenu}>
                <Permissions allowedRoles={['Admin', 'Project Manager', 'QA']} currentRole={userDetails?.role}>
                  <p onClick={handleRename} data-cy="">
                    Rename
                  </p>
                </Permissions>
                <Permissions allowedRoles={['Admin']} currentRole={userDetails?.role}>
                  <p onClick={handleDelete}>Delete</p>
                </Permissions>
              </div>
            </MobileMenu>

            <div className={style.backdropDiv} onClick={handleBackdropClick}></div>
          </>
        )}
      </>
    );
  };

  const renderContent = useCallback(
    (ele, index, provided) => (
      <div className={style.flex1} key={index}>
        <div className={style.flex1inner}>
          <img src={dragIcon} alt="" className={style.img} {...provided.dragHandleProps} />
          <p className={style.p}>{ele.name}</p>
        </div>
        <FeatureMenu
          index={index}
          ele={ele}
          moreFeature={moreFeature}
          handleMoreFeatureClick={handleMoreFeatureClick}
          handleRenameClick={handleRenameClick}
          handleDeleteClick={handleDeleteClick}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleBackdropClick={handleBackdropClick}
        />
      </div>
    ),
    [handleMoreFeatureClick, handleRenameClick, handleDeleteClick, isOpen, moreFeature, handleBackdropClick],
  );

  return (
    <>
      <div className={style.left}>
        {_isLoading ? (
          <Loader />
        ) : (
          <>
            <div className={style.flex}>
              <h6 className={style.featureH6}>
                <div onClick={clickSelectedMilestonesHandler}>
                  <Icon name={'ArrowLeft'} height={24} iconClass={style.icon2} />
                </div>
                Features
                {_features?.features?.length > 0 && <span> ({_features?.features?.length})</span>}
              </h6>
              <Permissions allowedRoles={['Admin', 'Project Manager', 'QA']} currentRole={userDetails?.role}>
                <div
                  data-cy="add-feature-btn"
                  className={style.innerFlex}
                  style={{ display: !selectedMilestone.id && 'none' }}
                  onClick={handleAddFeatureBtnClick}
                >
                  <p> + Add Feature</p>
                </div>
              </Permissions>
            </div>

            {_features?.features.length ? (
              <DraggableComponent
                listElements={_features?.features}
                droppableClassName={style.height}
                separateDraggingElement={true}
                onDragEnd={onOrderUpdate}
                renderContent={renderContent}
              />
            ) : (
              <div className={style.center}>
                <img src={noFoundFeature} alt="" />
              </div>
            )}
          </>
        )}
      </div>
      <DeleteModal
        openDelModal={!!openDelFeatureModal?.open}
        setOpenDelModal={closeDelFeatModalClick}
        name={'Feature'}
        secondLine={'All test cases, bugs and test runs of this feature will also be deleted.'}
        clickHandler={onDeleteFeature}
        isLoading={_isDeleting}
      />

      <AddFeature
        openAddModal={!!openAddModal?.open}
        setOpenAddModal={closeAddModalClick}
        id={openAddModal?._id}
        name={openAddModal?.selectedMilestone?.name}
        defaultValue={openAddModal?.name}
        clickHandler={onAddFeature}
        isLoading={_isAddingFeature}
      />
    </>
  );
};

export default FeatureSection;
