import { Fragment, useMemo } from 'react';

import { format } from 'date-fns';
import { useForm } from 'react-hook-form';

import Modal from 'components/modal';
import ThemedIcon from 'components/icon/themed-icon';
import Loader from 'components/loader';
import SelectBox from 'components/select-box';
import DateRange from 'components/date-range';
import Button from 'components/button';

import { filters, useDropDownOptionsForValues, getValidKeyValues } from '../add-widget/helper';
import style from './style.module.scss';

const Filters = ({ open, setOpen, type, onApplyFilters }) => {
  const {
    getValues,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const { data: _asyncOptions, isFetching } = useDropDownOptionsForValues();

  const selectedFilters = useMemo(() => {
    const category = type;
    const categoryFilters = filters?.[category];
    if (!categoryFilters) return [];

    const updatedOptions = categoryFilters.map((filter) => {
      if (filter?.options && !filter?.options?.length && _asyncOptions?.[filter.name]) {
        const newOptions = _asyncOptions?.[filter.name];

        return { ...filter, options: newOptions };
      } else {
        return filter;
      }
    });

    return updatedOptions;
  }, [type, _asyncOptions]);

  const { milestonesOptions, featuresOptions } = useMemo(() => {
    const milestonesOptions =
      selectedFilters
        ?.find((x) => x.name === 'milestones')
        ?.options.filter((x) => getValues('filters.projects')?.includes(x.projectId)) || [];

    const featuresOptions =
      selectedFilters
        ?.find((x) => x.name === 'features')
        ?.options.filter((x) => getValues('filters.projects')?.includes(x.projectId)) || [];

    return {
      milestonesOptions,
      featuresOptions,
    };
  }, [selectedFilters, watch('filters.projects')]);

  const handleDiscard = () => {
    setOpen(false);
  };

  const filtersApplyHandler = () => {
    onApplyFilters && onApplyFilters(getValidKeyValues(watch('filters')));
  };

  const onChange = (name, dates) => {
    const [start, end] = dates;
    const startDate = start && format(start, 'yyyy-MM-dd');
    const endDate = end && format(end, 'yyyy-MM-dd');

    setValue(name, {
      start,
      end,
      startDate,
      endDate,
    });
  };

  return (
    <Modal open={open} handleClose={handleDiscard} className={`${style.mainDiv}`} backClass={style.main}>
      <div className={style.crossImg}>
        <span className={style.modalTitle}>{`Filters`}</span>
        <div className={style.hover}>
          <div onClick={handleDiscard}>
            <ThemedIcon name={'CrossIcon'} />
          </div>
        </div>
      </div>

      <div className={style.mainWrapper}>
        {isFetching ? (
          <Loader />
        ) : (
          <div className={style.main}>
            {selectedFilters.map((x) => {
              return (
                <Fragment key={x.name}>
                  {x.fieldType === 'select' ? (
                    <div>
                      <SelectBox
                        options={
                          x.name === 'milestones'
                            ? milestonesOptions
                            : x.name === 'features'
                              ? featuresOptions
                              : x.options || []
                        }
                        label={x.label}
                        name={`filters.${x.name}`}
                        placeholder="Select"
                        errorMessage={errors?.[`filters.${x.name}`]?.message}
                        control={control}
                        numberBadgeColor={'#39695b'}
                        showNumber
                        isMulti={x.isMulti}
                      />
                    </div>
                  ) : (
                    <DateRange
                      handleChange={(e) => onChange(`filters.${x.name}`, e)}
                      startDate={watch(`filters.${x.name}`)?.start}
                      endDate={watch(`filters.${x.name}`)?.end}
                      label={x.label}
                      placeholder={'Select'}
                      name={`filters.${x.name}`}
                      control={control}
                    />
                  )}
                </Fragment>
              );
            })}
          </div>
        )}
      </div>

      <div className={style.btnDiv}>
        <Button
          text="Back"
          type={'button'}
          btnClass={style.btn}
          handleClick={(e) => {
            e.preventDefault();
            handleDiscard();
          }}
        />
        <Button text="Apply" type={'submit'} handleClick={filtersApplyHandler} />
      </div>
    </Modal>
  );
};

export default Filters;
