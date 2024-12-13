import { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import Modal from 'components/modal';
import FormCloseModal from 'components/form-close-modal';
import Icon from 'components/icon/themed-icon';
import ChartSelection from 'components/chart-selection-module';
import Loader from 'components/loader';

import { useToaster } from 'hooks/use-toaster';

import { useCreateWidget, useGetWidgetDetailsById, useUpdateWidget } from 'api/v1/custom-dashboard/single-dashboard';

import { currentTimeInMilliSeconds } from 'utils/date-handler';
import { isEmpty as _isEmpty, pick as _pick } from 'utils/lodash';

import ChartForm from './form';
import DefaultFilters from './default-filters';
import menu, { createDataGrid, getValidKeyValues, getPreviewValue } from './helper';
import style from './style.module.scss';

const Index = ({ open, setOpen, backClass, maxY, refetch, isEditable, editRecordId, setEditRecord }) => {
  const {
    setValue,
    formState: { isDirty, errors },
    reset,
    getValues,
    ...props
  } = useForm();

  const { id } = useParams();

  const [active, setActive] = useState(0);
  const [filterCount, setFiltersCount] = useState(0);
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);

  const { toastSuccess, toastError } = useToaster();

  const { mutateAsync: _createWidgetHandler, isLoading: _isCreateWidgetLoading } = useCreateWidget();
  const { mutateAsync: _updateWidgetHandler, isLoading: _isUpdateWidgetLoading } = useUpdateWidget();
  const { data: _widgetDetails, isFetching: _isWidgetDetailsFetching } = useGetWidgetDetailsById(id, editRecordId);

  useEffect(() => {
    if (_widgetDetails?.widget && !_isEmpty(_widgetDetails?.widget)) {
      isEditable && setActive(1);
      const baseValues = _pick(_widgetDetails?.widget, ['widgetName', 'category']);

      const values = _pick(_widgetDetails?.widget?.dataSet, [
        'defaultFilter',
        'type',
        'subtype',
        'constant',
        'value',
        'primaryGroupBy',
        'secondaryGroupBy',
      ]);
      const preview = getPreviewValue(values?.type, values?.subtype);

      const obj = {
        'x-axis': values?.constant,
        'y-axis': values?.value,
      };
      delete values.constant;
      delete values.value;
      onApplyFilters(values.defaultFilter);

      const newValuesObject = { ...baseValues, ...values, preview, ...obj };

      Object.entries(newValuesObject).forEach(([key, val]) => {
        setValue(key, val);
      });
    }
  }, [_widgetDetails]);

  const handleDiscard = () => {
    if (isDirty) {
      setIsDiscardOpen(true);
    } else {
      handleCloseForm();
    }
  };

  const handleCloseForm = () => {
    reset();
    setEditRecord && setEditRecord('');
    setOpen(false);
  };

  const onTypeSelection = (props) => {
    Object.entries(props).forEach(([key, val]) => {
      setValue(key, val);
    });
    setActive((pre) => pre + 1);
  };

  const onApplyFilters = (filters) => {
    let count = 0;

    for (const key in filters) {
      if (filters[key] && !_isEmpty(filters[key])) {
        count++;
      }
    }

    setFiltersCount(count);
  };

  const onSubmitForm = async (newWidgetData) => {
    try {
      const otp = Math.floor(Math.random() * 9000) + 1000;
      const time = currentTimeInMilliSeconds();
      const validOtp = otp + time;

      const dataGrid = createDataGrid(validOtp, maxY);
      const filters = getValidKeyValues(newWidgetData?.defaultFilter);

      const body = isEditable
        ? {
            widgetName: newWidgetData.widgetName,
            dataSet: {
              type: newWidgetData.type,
              subtype: newWidgetData.subtype,
              constant: newWidgetData?.['x-axis'],
              value: newWidgetData?.['y-axis'],
              primaryGroupBy: newWidgetData?.primaryGroupBy ? newWidgetData?.primaryGroupBy : '',
              secondaryGroupBy: newWidgetData?.secondaryGroupBy ? newWidgetData?.secondaryGroupBy : '',
              defaultFilter: filters,
            },
          }
        : {
            widget: {
              key: `${newWidgetData.widgetName}-${validOtp}`,
              widgetName: newWidgetData.widgetName,
              category: newWidgetData.category,
              dataGrid,
              dataSet: {
                type: newWidgetData.type,
                subtype: newWidgetData.subtype,
                constant: newWidgetData?.['x-axis'],
                value: newWidgetData?.['y-axis'],
                primaryGroupBy: newWidgetData?.primaryGroupBy ? newWidgetData?.primaryGroupBy : '',
                secondaryGroupBy: newWidgetData?.secondaryGroupBy ? newWidgetData?.secondaryGroupBy : '',
                defaultFilter: {
                  ...filters,
                },
              },
            },
          };

      const res = isEditable
        ? await _updateWidgetHandler({ id, widgetId: editRecordId, body })
        : await _createWidgetHandler({ id, body });

      if (res.msg) {
        toastSuccess(res?.msg);
        refetch && (await refetch());
        setEditRecord && setEditRecord('');
        setOpen(false);
      }
    } catch (error) {
      console.error(error);
      toastError(error);
    }
  };

  return (
    <Modal open={open} handleClose={handleDiscard} className={`${style.mainDiv} `} backClass={backClass} noBackground>
      {isDiscardOpen && (
        <FormCloseModal
          modelOpen={isDiscardOpen}
          setModelOpen={setIsDiscardOpen}
          confirmBtnHandler={handleCloseForm}
          heading={`You have unsaved changes`}
          subHeading={` Are you sure you want to exit? Your unsaved changes will be discarded.`}
          confirmBtnText={`Discard Changes`}
          icon={<Icon name={'WarningIcon'} iconClass={style.iconClass} />}
          cancelBtnText={`Back To Form`}
          noBackground
        />
      )}
      <div className={style.crossImg}>
        <span className={style.modalTitle}>{`${isEditable ? 'Edit' : 'Add'} Widget`}</span>
        <div className={style.hover}>
          <div onClick={handleDiscard}>
            <Icon name={'CrossIcon'} />
          </div>
        </div>
      </div>
      <div className={style.modalBody}>
        {_isWidgetDetailsFetching ? (
          <Loader />
        ) : (
          <>
            {active === 0 && <ChartSelection menu={menu} onClick={onTypeSelection} />}{' '}
            {active === 1 && (
              <ChartForm
                {...{
                  setActive,
                  hookForm: {
                    setValue,
                    getValues,
                    formState: { errors, isDirty },
                    reset,
                    ...props,
                  },
                  onSubmitForm,
                  filterCount,
                  isLoading: _isCreateWidgetLoading || _isUpdateWidgetLoading,
                  isEditable,
                  handleDiscard,
                }}
              />
            )}
            {active === 2 && (
              <DefaultFilters
                {...{
                  setActive,
                  hookForm: {
                    setValue,
                    getValues,
                    formState: { errors, isDirty },
                    reset,
                    ...props,
                  },
                  onApplyFilters,
                }}
              />
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default Index;
