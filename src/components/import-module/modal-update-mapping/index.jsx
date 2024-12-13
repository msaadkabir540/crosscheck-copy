import { useCallback, useState } from 'react';

import Modal from 'components/modal';
import Button from 'components/button';
import SelectBox from 'components/select-box';
import FormCloseModal from 'components/form-close-modal';
import TextField from 'components/text-field';
import CreatableSelectComponent from 'components/select-box/creatable-select';

import { useToaster } from 'hooks/use-toaster';

import { useAddFeature } from 'api/v1/feature/feature';
import { useAddMilestone, useMilestonePerProject } from 'api/v1/milestone/milestone';

import { keys as _keys } from 'utils/lodash';

import style from './mappingModal.module.scss';
import Icon from '../../icon/themed-icon';

const UpdateMappingModal = ({
  openUpdateModal,
  setOpenUpdateModal,
  crossCheckField,
  control,
  setValue,
  watch,
  getValues,
  OnRecordUpdateHandler,
}) => {
  const [formIsChanged, setIsFormChanged] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [dataUpdated, setDataUpdated] = useState({});
  const { toastError, toastSuccess } = useToaster();
  const PROJECT_ID = crossCheckField && crossCheckField?.valueOptions[0]?.projectId;

  const { data: _milestones, refetch } = useMilestonePerProject(PROJECT_ID);
  const { mutateAsync: _addFeatureHandler, isLoading: _isAddingFeature } = useAddFeature();
  const { mutateAsync: _addMilestoneHandler, isLoading: _isAddingMilestone } = useAddMilestone();

  const cancelHandler = useCallback(() => {
    if (formIsChanged) {
      setOpenCancelModal(true);
    } else {
      setOpenUpdateModal(false);
    }
  }, [formIsChanged, setOpenUpdateModal]);

  const onSimpleResetHandler = useCallback(() => {
    const valuesToBeReset = _keys(dataUpdated);
    valuesToBeReset?.forEach((x) => {
      setValue(x, {});
    });
    setDataUpdated({});
    setOpenUpdateModal(false);
  }, [dataUpdated, setValue, setOpenUpdateModal]);

  const discardChangesHandler = useCallback(() => {
    onSimpleResetHandler();
  }, [onSimpleResetHandler]);

  const onFieldChangeHandler = useCallback((e) => {
    setDataUpdated((prev) => ({ ...prev, [e.field]: e }));
    setIsFormChanged(true);
  }, []);

  const onRecordChange = useCallback(() => {
    OnRecordUpdateHandler(dataUpdated, crossCheckField.name);
    setOpenUpdateModal(false);
  }, [OnRecordUpdateHandler, dataUpdated, crossCheckField.name, setOpenUpdateModal]);

  //NOTE: creatable start

  const transformMilestones = (_milestones) => {
    return _milestones?.map((milestone) => ({
      _id: milestone?._id,
      name: milestone?.name,
      projectId: milestone?.projectId,
      label: milestone?.name,
      value: milestone?._id,
      checkbox: true,
    }));
  };

  const transformedMilestones = transformMilestones(_milestones?.milestones);

  const optionHandler = (options, label) => {
    const mileName = label.split(' ==> ')[0];
    const data = getValues('crossCheckFields')['milestones'] || {};

    const milestoneAssigned = data?.csvValues.find((x) => x.label === mileName) || {};

    const assignedMilestoneId = milestoneAssigned?.assignedValue?._id || '';

    const filteredOptions = options.filter((x) => x.milestoneId === assignedMilestoneId) || [];

    return filteredOptions;
  };

  //NOTE: to transform newly added feature to map in dataUpdated state
  const transformResponse = (apiResponse, field) => {
    const { feature } = apiResponse;

    const selectedOption = {
      _id: feature?._id,
      name: feature?.name,
      milestoneId: feature?.milestoneId,
      projectId: feature?.projectId,
      label: feature?.name,
      value: feature?._id,
      checkbox: true,
    };

    return {
      selectedOption,
      field,
    };
  };

  //NOTE: to transform newly added feature to map in dataUpdated state
  const transformResponseMilestone = (apiResponse, field) => {
    const { milestone } = apiResponse;

    const selectedOption = {
      _id: milestone?._id,
      name: milestone?.name,
      projectId: milestone?.projectId,
      label: milestone?.name,
      value: milestone?._id,
      checkbox: true,
    };

    return {
      selectedOption,
      field,
    };
  };

  const onAddMilestone = useCallback(
    async (data, field) => {
      try {
        const res = await _addMilestoneHandler({ ...data, projectId: PROJECT_ID });
        refetch();

        if (res) {
          const transformedField = transformResponseMilestone(res, field?.field);

          onFieldChangeHandler(transformedField);
        }

        toastSuccess(res.msg);
      } catch (error) {
        toastError(error);
      }
    },
    [_addMilestoneHandler, PROJECT_ID, refetch, toastSuccess, onFieldChangeHandler, toastError],
  );

  const onAddFeature = useCallback(
    async (data, milestoneAssigned, field) => {
      try {
        const res = await _addFeatureHandler({
          ...data,
          projectId: PROJECT_ID,
          milestoneId: milestoneAssigned,
        });

        if (res) {
          const transformedField = transformResponse(res, field?.field);

          onFieldChangeHandler(transformedField);
        }

        toastSuccess(res.msg);
      } catch (error) {
        toastError(error);
      }
    },
    [PROJECT_ID, _addFeatureHandler, onFieldChangeHandler, toastError, toastSuccess],
  );

  return (
    <>
      <Modal className={style.main} open={openUpdateModal} handleClose={cancelHandler}>
        <div>
          <div className={style.header}>
            <span>{`Update Mapping for ${crossCheckField.label}`}</span>
            <div className={style.crossIcon} onClick={cancelHandler}>
              <Icon name={'CrossIcon'} />
            </div>
          </div>
          <div className={style.mappingFieldsContainer}>
            <div className={style.headings}>
              <div className={style.headingControl}>
                <span>Your CSV value</span>
              </div>
              <div className={style.hollowSpace}></div>
              <div className={style.headingControl2}>
                <span>Cross Check value</span>
              </div>
            </div>
            <div>
              {crossCheckField?.csvValues?.map((csvRecord) => (
                <div className={style.mappingField} key={1}>
                  <div className={style.textFieldControl}>
                    <TextField
                      value={csvRecord.label === '' ? '-' : csvRecord.label ? csvRecord.label : csvRecord}
                      readOnly={true}
                    />
                  </div>
                  <div className={style.arrowIcon}>
                    <Icon name={'ArrowRight'} />
                  </div>
                  <div className={style.selectFieldControl}>
                    {crossCheckField.isCreateAble ? (
                      <div>
                        <CreatableSelectComponent
                          control={control}
                          name={`csvValue.${crossCheckField.name}.${
                            csvRecord.label === '' ? '-' : csvRecord.label ? csvRecord.label : csvRecord
                          }`}
                          defaultOptions={
                            crossCheckField.name === 'milestones'
                              ? transformedMilestones || []
                              : crossCheckField.name === 'features'
                                ? optionHandler(crossCheckField.valueOptions, csvRecord.label) || []
                                : crossCheckField.valueOptions
                          }
                          defaultValue={csvRecord.assignedValue}
                          // eslint-disable-next-line react/jsx-no-bind
                          onChangeHandler={
                            crossCheckField?.name === 'milestones'
                              ? async (selectedOption) => {
                                  if (selectedOption?.selectedOption?._id) {
                                    onFieldChangeHandler(selectedOption);
                                  } else {
                                    const data = {
                                      name: selectedOption?.selectedOption?.value,
                                    };

                                    await onAddMilestone(data, selectedOption);
                                  }
                                }
                              : crossCheckField?.name === 'features'
                                ? async (selectedOption) => {
                                    if (selectedOption?.selectedOption?._id) {
                                      onFieldChangeHandler(selectedOption);
                                    } else {
                                      const data = {
                                        name: selectedOption?.selectedOption?.value,
                                      };

                                      const selectedMilestone = getValues('crossCheckFields')[
                                        'milestones'
                                      ]?.csvValues?.find((x) => x?.label === csvRecord?.label?.split(' ==> ')[0])
                                        ?.assignedValue?._id;

                                      await onAddFeature(data, selectedMilestone, selectedOption);
                                    }
                                  }
                                : (e) => onFieldChangeHandler(e)
                          }
                          placeholder="Select"
                          watch={watch}
                          isClearable={false}
                          dynamicClass={style.dynamicWrapper}
                        />
                      </div>
                    ) : (
                      <div>
                        <SelectBox
                          control={control}
                          name={`csvValue.${crossCheckField.name}.${
                            csvRecord.label === '' ? '-' : csvRecord.label ? csvRecord.label : csvRecord
                          }`}
                          options={
                            crossCheckField.name === 'features'
                              ? optionHandler(crossCheckField.valueOptions, csvRecord.label) || []
                              : crossCheckField.valueOptions
                          }
                          defaultValue={csvRecord.assignedValue}
                          onChange={onFieldChangeHandler}
                          placeholder="Select"
                          watch={watch}
                          isClearable={false}
                          dynamicClass={style.dynamicWrapper}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={style.footer}>
          <div />

          <div className={style.saveBtns}>
            <Button text={'Cancel'} handleClick={cancelHandler} btnClass={style.transparent} />
            <Button
              text={'Save'}
              onClick={onRecordChange}
              btnClass={style.saveBtn}
              disabled={_isAddingFeature || _isAddingMilestone}
            />
          </div>
        </div>
      </Modal>
      {setIsFormChanged && openCancelModal && (
        <FormCloseModal
          modelOpen={openCancelModal}
          setModelOpen={setOpenCancelModal}
          confirmBtnHandler={discardChangesHandler}
          heading={`You have unsaved changes`}
          subHeading={` Are you sure you want to exit? Your unsaved changes will be not be Saved.`}
          confirmBtnText={`Discard Changes`}
          icon={<Icon name={'WarningRedIcon'} height={80} width={80} />}
          cancelBtnText={`Back To Page`}
        />
      )}
    </>
  );
};

export default UpdateMappingModal;
