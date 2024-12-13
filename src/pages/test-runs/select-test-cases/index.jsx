import { useState, useMemo, useEffect, useReducer, useCallback } from 'react';

import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

import Modal from 'components/modal';
import TextField from 'components/text-field';
import SelectBox from 'components/select-box';
import Loader from 'components/loader';
import Button from 'components/button';
import GenericTable from 'components/generic-table/virtulized-generic-table';
import FormCloseModal from 'components/form-close-modal';

import { useToaster } from 'hooks/use-toaster';

import { useGetBugsByFilter } from 'api/v1/bugs/bugs';
import { useGetTestCasesByFilter } from 'api/v1/test-cases/test-cases';

import { values as _values, isEqual as _isEqual, debounce as _debounce } from 'utils/lodash';

import search from 'assets/search.svg';
import clearIcon from 'assets/cross.svg';

import {
  columnsData,
  initialFilter,
  initialFiltersBugs,
  testCaseSelectionHandler,
  checkedHandler,
  initialValueFilters,
  resetHandler,
  onExpand,
  unClickedAll,
  filteredTestCasesHandler,
  updateCountHandler,
  filteredBugsHandler,
  updateBugsCountHandler,
  columnsBugsData,
  bugsSelectionHandler,
  checkedBugsHandler,
} from './helper';
import style from './modal.module.scss';
import Icon from '../../../components/icon/themed-icon';
import SingleMiletoneOption from './milestone-feature-mapping';

const SelectTestCases = ({
  openAddModal,
  setOpenAddModal,
  projectId,
  onSubmit,
  editRecords,
  options,
  addNew,
  isAddingNew,
  type,
  onDiscard,
  tasks = false,
}) => {
  const { control, setValue, watch } = useForm();
  const { toastError } = useToaster();
  const WATCH_PROJECT_ID = watch('projectId');

  const [isChanged, setIsChanged] = useState(false);
  const [viewSelected, setViewSelected] = useState(false);
  const [filters, setFilters] = useState(type === 'Bugs' ? initialFiltersBugs : initialFilter);
  const { projectOptions = [], featuresOptions = [], mileStonesOptions = [] } = options;

  const [openFormCloseModal, setOpenFormCloseModal] = useState(false);
  const [currentFilters, setCurrentFilters] = useState(type === 'Bugs' ? initialFiltersBugs : initialFilter);

  const initializeTestCase = useCallback(
    ({ state, data }) => {
      const newTestCases = {
        ...state,
        totalCount: data.count,
        filteredTestCases: data.testcases || [],
        allTestCases: data.testcases.reduce((accumulator, x) => {
          accumulator[x._id] = {
            checked: false,
            milestoneId: x.milestoneId._id,
            featureId: x.featureId._id,
            item: x,
          };

          return accumulator;
        }, {}),
      };

      let dataState = updateCountHandler({
        state: newTestCases,
        data: { ...data, subType: 'initialCount' },
      });

      if (editRecords?.length > 0) {
        setViewSelected(true);
        dataState = testCaseSelectionHandler({
          state: dataState,
          data: { testCases: editRecords, event: { target: { checked: true } } },
        });
      }

      return dataState;
    },
    [editRecords],
  );

  //NOTE: Bugs
  const initializeBugs = useCallback(
    ({ state, data }) => {
      const newBugs = {
        ...state,
        totalCount: data.count,
        filteredBugs: data.bugs || [],
        allBugs: data.bugs.reduce((accumulator, x) => {
          accumulator[x._id] = {
            checked: false,
            milestoneId: x.milestoneId._id,
            featureId: x.featureId._id,
            item: x,
          };

          return accumulator;
        }, {}),
      };

      let dataState = updateBugsCountHandler({
        state: newBugs,
        data: { ...data, subType: 'initialCount' },
      });

      if (editRecords?.length > 0) {
        setViewSelected(true);
        dataState = bugsSelectionHandler({
          state: dataState,
          data: { bugs: editRecords, event: { target: { checked: true } } },
        });
      }

      return dataState;
    },
    [editRecords],
  );

  const filteredMilestoneOptions = useCallback(
    ({ state }) => {
      const milestones = mileStonesOptions?.filter((x) => x.projectId === WATCH_PROJECT_ID) || [];

      const milestoneTree = milestones.reduce((accumulator, milestone) => {
        const milestoneId = milestone._id;

        accumulator[milestoneId] = {
          onClicked: (e, id) => {
            e.preventDefault();
            e.stopPropagation();
            dispatch({ type: 'clicked', data: { milestoneId: id, type: 'milestone' } });
          },
          onExpand: (id) => {
            dispatch({ type: 'milestoneExpand', data: id });
          },
          onChecked: (e) => {
            tasks && setIsChanged(true);
            dispatch({
              type: type === 'Bugs' ? 'checkedBugsHandler' : 'checkedHandler',
              data: { id: milestoneId, type: 'milestone', e },
            });
          },
          totalCount: 0,
          selectedCount: 0,

          checked: false,
          expanded: false,
          partial: false,
          clicked: false,
          _id: milestone._id,
          label: milestone.label,
        };

        accumulator[milestoneId].mileStonesFeaturesOptions = featuresOptions
          ?.filter((feature) => feature.milestoneId === milestone._id)
          .reduce((featureAccumulator, feature) => {
            const featureId = feature._id;

            featureAccumulator[featureId] = {
              _id: feature._id,
              label: feature.label,
              checked: false,
              clicked: false,
              partial: false,
              totalCount: 0,
              selectedCount: 0,
              onClicked: (e, id, featureId) => {
                e.preventDefault();
                e.stopPropagation();
                dispatch({
                  type: 'clicked',
                  data: { milestoneId: id, featureId, type: 'feature' },
                });
              },
              onChecked: (e) => {
                tasks && setIsChanged(true);

                dispatch({
                  type: type === 'Bugs' ? 'checkedBugsHandler' : 'checkedHandler',
                  data: { id: featureId, type: 'feature', e },
                });
              },
            };

            return featureAccumulator;
          }, {});

        return accumulator;
      }, {});

      return {
        ...state,
        milestoneOptions: milestoneTree,
        selection: { project: projectOptions.find((x) => x.value === WATCH_PROJECT_ID)?.label },
      };
    },
    [WATCH_PROJECT_ID, projectOptions, featuresOptions, mileStonesOptions, tasks, type],
  );

  const onClicked = useCallback(({ state, data }) => {
    unClickedAll({ state, data });

    if (data.type === 'milestone') {
      state.milestoneOptions[data.milestoneId].expanded = true;
      state.milestoneOptions[data.milestoneId].clicked = true;
      state.selection = {
        ...state.selection,
        mileStone: state.milestoneOptions[data.milestoneId].label,
        feature: null,
      };

      setFilters((pre) => ({ ...pre, milestones: [data.milestoneId], features: [] }));
    } else if (data.type === 'feature') {
      state.milestoneOptions[data.milestoneId].mileStonesFeaturesOptions[data.featureId].clicked = true;
      state.selection = {
        ...state.selection,
        mileStone: state.milestoneOptions[data.milestoneId].label,
        feature: state.milestoneOptions[data.milestoneId].mileStonesFeaturesOptions[data.featureId].label,
      };

      setFilters((pre) => ({
        ...pre,
        milestones: [data.milestoneId],
        features: [data.featureId],
      }));
    }

    return { ...state };
  }, []);

  const testCaseReducer = (state, action) => {
    switch (action.type) {
      case 'initializeTestCase':
        return initializeTestCase({ state, data: action.data });
      case 'milestoneOptions':
        return filteredMilestoneOptions({ state });
      case 'milestoneExpand':
        return onExpand({ state, data: { id: action.data, type: 'milestone' } });
      case 'clicked':
        return onClicked({ state, data: { ...action.data } });
      case 'filteredTestCases':
        return filteredTestCasesHandler({ state, data: { ...action.data } });
      case 'resetHandler':
        return resetHandler({ state, data: { ...action.data } });
      case 'testCaseCheckHandler':
        return testCaseSelectionHandler({ state, data: { ...action.data } });
      case 'checkedHandler':
        return checkedHandler({ state, data: { ...action.data } });

      //NOTE: Bugs
      case 'initializeBugs':
        return initializeBugs({ state, data: action.data });
      case 'filteredBugs':
        return filteredBugsHandler({ state, data: { ...action.data } });
      case 'bugsCheckHandler':
        return bugsSelectionHandler({ state, data: { ...action.data } });
      case 'checkedBugsHandler':
        return checkedBugsHandler({ state, data: { ...action.data } });

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(testCaseReducer, initialValueFilters);

  // NOTE: fetching TextCases
  const { mutateAsync: _getAllTestCases, isLoading } = useGetTestCasesByFilter();

  const fetchTestCases = useCallback(
    async (filters) => {
      try {
        const filtersChanged = !_isEqual(currentFilters, filters);

        if (filtersChanged) {
          setCurrentFilters(filters);
          const response = await _getAllTestCases(filters);

          if (_values(state.allTestCases).length) {
            dispatch({ type: 'filteredTestCases', data: response });
          } else {
            dispatch({ type: 'initializeTestCase', data: response });
          }
        }
      } catch (error) {
        toastError(error);
      }
    },
    [_getAllTestCases, state.allTestCases, currentFilters, toastError],
  );

  // NOTE: fetching Bugs
  const { mutateAsync: _getAllBugs, isLoading: _isBugsLoading } = useGetBugsByFilter();

  const fetchBugs = useCallback(
    async (filters) => {
      try {
        const filtersChanged = !_isEqual(currentFilters, filters);

        if (filtersChanged) {
          setCurrentFilters(filters);
          const response = await _getAllBugs(filters);

          if (_values(state.allBugs).length) {
            dispatch({ type: 'filteredBugs', data: response });
          } else {
            dispatch({ type: 'initializeBugs', data: response });
          }
        }
      } catch (error) {
        toastError(error);
      }
    },
    [_getAllBugs, state.allBugs, toastError, currentFilters],
  );

  useEffect(() => {
    if (WATCH_PROJECT_ID) {
      type === 'Bugs' ? fetchBugs(filters) : fetchTestCases(filters);
    }
  }, [filters, WATCH_PROJECT_ID, fetchBugs, fetchTestCases, type]);

  useEffect(() => {
    dispatch({ type: 'resetHandler' });

    if (WATCH_PROJECT_ID) {
      dispatch({ type: 'milestoneOptions' });
      setFilters((pre) => ({ ...pre, projects: [WATCH_PROJECT_ID] }));
    }
  }, [WATCH_PROJECT_ID, type]);

  useEffect(() => {
    if (projectId) {
      setValue('projectId', projectId);
    }
  }, [projectId, setValue]);

  const columnsCalculatedData = useMemo(() => {
    const data =
      type === 'Bugs'
        ? columnsBugsData({
            allPartialChecked: state.isFilteredBugsArePartialChecked && !state.isFilteredBugsAreChecked,
            allChecked: state.isFilteredBugsArePartialChecked || state.isFilteredBugsAreChecked,
            allBugs: state.allBugs,
            allFilteredBugs: state.filteredBugs,
            viewSelected,
            bugsChecked: (e, bugs) => {
              tasks && setIsChanged(true);

              dispatch({ type: 'bugsCheckHandler', data: { bugs, event: e } });
            },
          })
        : columnsData({
            allPartialChecked: state.isFilteredTestCasesArePartialChecked && !state.isFilteredTestCasesAreChecked,
            allChecked: state.isFilteredTestCasesArePartialChecked || state.isFilteredTestCasesAreChecked,
            allTestCases: state.allTestCases,
            allFilteredTestCases: state.filteredTestCases,
            viewSelected,
            testCaseChecked: (e, testCases) => {
              tasks && setIsChanged(true);

              dispatch({ type: 'testCaseCheckHandler', data: { testCases, event: e } });
            },
          });

    return data;
  }, [state, viewSelected, tasks, type]);

  const closeForm = useCallback(() => {
    setOpenAddModal(false);
    setOpenFormCloseModal(false);
  }, [setOpenAddModal]);

  const handleDiscard = useCallback(() => {
    if (tasks && isChanged) {
      setOpenFormCloseModal(true);
    } else {
      _values(type === 'Bugs ' ? state.selectedBugs : state.selectedTestCases).length
        ? setOpenFormCloseModal(true)
        : closeForm();
    }
  }, [closeForm, isChanged, state, tasks, type]);

  const confirmBtnHandler = useCallback(() => {
    if (type) {
      closeForm();
    } else {
      dispatch({ type: 'resetHandler' });
      onDiscard && onDiscard();
      closeForm();
    }
  }, [closeForm, onDiscard, type]);

  const onClickViewAll = useCallback(() => setViewSelected((pre) => !pre), []);

  const HandleClickSaveBtn = useCallback(() => {
    let records = {};

    if (type === 'Bugs') {
      records = state.selectedBugs;
    } else {
      records = state.selectedTestCases;
    }

    onSubmit(_values(records), watch('projectId'));
    !addNew && setOpenAddModal(false);
  }, [addNew, onSubmit, setOpenAddModal, state, type, watch]);

  return (
    <div>
      <Modal open={!!openAddModal} handleClose={handleDiscard} className={style.mainDiv} noBackground>
        {openFormCloseModal && (
          <FormCloseModal
            modelOpen={openFormCloseModal}
            setModelOpen={setOpenFormCloseModal}
            confirmBtnHandler={confirmBtnHandler}
            heading={`You have unsaved changes`}
            subHeading={` Are you sure you want to exit? Your unsaved changes will be discarded.`}
            confirmBtnText={`Discard Changes`}
            icon={<Icon name={'WarningRedIcon'} height={80} width={80} />}
            cancelBtnText={`Back To Form`}
          />
        )}
        <div className={style.crossImg}>
          <span className={style.modalTitle}>
            {tasks ? 'Add' : 'Select'} {type}
          </span>
          <div alt="" onClick={handleDiscard} className={style.hover}>
            <Icon name={'CrossIcon'} />
            <div className={style.tooltip}>
              <p>Close</p>
            </div>
          </div>
        </div>
        <div className={style.inner}>
          <div className={style.left}>
            {!viewSelected && (
              <div className={style.search}>
                <TextField
                  searchField={true}
                  icon={search}
                  clearIcon={clearIcon}
                  placeholder={'Search...'}
                  onClear={_debounce(() => {
                    setFilters((pre) => ({ ...pre, search: '' }));
                  }, 1000)}
                  onChange={_debounce((e) => {
                    setFilters((pre) => ({ ...pre, search: e.target.value }));
                  }, 1000)}
                  data-cy="testrun-testcasemodal-searchbar"
                />
              </div>
            )}
            {!tasks && !projectId && (
              <SelectBox
                control={control}
                label={'Project'}
                name={'projectId'}
                disabled={!!projectId}
                options={projectOptions}
                id="testrun-testcasemodal-project"
              />
            )}
            <div className={style.filterClass}>
              <p
                className={style.view}
                // NOTE: #todo:  what should happen to select ALL
                onClick={onClickViewAll}
                data-cy="viewalltestcases-testrun-btn"
              >
                View All
                {!viewSelected ? ` Selected ${type} (${state.selectionCount})` : ` ${type}`}
              </p>

              <div className={style.milestoneOptions}>
                {_values(state?.milestoneOptions)?.map((mileStoneEle, index) => {
                  return (
                    <SingleMiletoneOption {...{ mileStoneEle, state, index, setViewSelected }} key={mileStoneEle._id} />
                  );
                })}
              </div>
            </div>
          </div>
          <div className={style.right}>
            <div className={style.path}>
              {viewSelected
                ? `Selected ${type}`
                : `${state.selection.project || ''} ${
                    state.selection.mileStone ? ` > ${state.selection.mileStone}` : ''
                  } ${state.selection.feature ? ` > ${state.selection.feature}` : ''} ${
                    state.selection.project ? `(${state.totalCount})` : ''
                  }`}
            </div>
            <div className={style.tableWidth}>
              {isLoading || _isBugsLoading ? (
                <div className={style.loaderClass}>
                  <Loader />
                </div>
              ) : (
                <div className={style.tableWrapper}>
                  <GenericTable
                    columns={columnsCalculatedData}
                    dataSource={
                      viewSelected
                        ? (type === 'Bugs' ? _values(state.selectedBugs) : _values(state.selectedTestCases)) || []
                        : (type === 'Bugs' ? state.filteredBugs : state.filteredTestCases) || []
                    }
                    height={'630px'}
                    noFoundHeight={'630px'}
                    paddingTop={'30px'}
                    width={type === 'Bugs' ? '3850px' : '2700px'}
                    classes={{
                      test: style.test,
                      table: style.table,
                      thead: style.thead,
                      th: style.th,
                      containerClass: style.checkboxContainer,
                      tableBody: style.tableRow,
                    }}
                  />
                </div>
              )}
            </div>
            <div className={style.btns}>
              <Button
                text={'Discard'}
                type={'button'}
                btnClass={style.btn}
                handleClick={handleDiscard}
                data-cy="testrun-testcasemodal-discard-btn"
              />
              <Button
                text={`${addNew ? 'Add' : 'Select'} (${state.selectionCount})`}
                handleClick={HandleClickSaveBtn}
                disabled={!state.selectionCount || isAddingNew ? true : false}
                data-cy="testrun-testcasemodal-save-btn"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

SelectTestCases.propTypes = {
  openAddModal: PropTypes.func.isRequired,
  setOpenAddModal: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  editRecords: PropTypes.array.isRequired,
  options: PropTypes.shape({
    projectOptions: PropTypes.array.isRequired,
    featuresOptions: PropTypes.array.isRequired,
    mileStonesOptions: PropTypes.array.isRequired,
  }).isRequired,
};

export default SelectTestCases;
