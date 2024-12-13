import { Fragment, useMemo } from 'react';

import { format } from 'date-fns';

import Icon from 'components/icon/themed-icon';
import SelectBox from 'components/select-box';
import DateRange from 'components/date-range';
import Button from 'components/button';
import Loader from 'components/loader';

import { filters, useDropDownOptionsForValues } from '../helper';
import style from './style.module.scss';

const Index = ({ setActive, hookForm, onApplyFilters }) => {
  const {
    getValues,
    setValue,
    control,
    formState: { errors },
    watch,
  } = hookForm;

  const { data: _asyncOptions, isLoading } = useDropDownOptionsForValues();

  const selectedFilters = useMemo(() => {
    const category = getValues('category');
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
  }, [getValues('category'), _asyncOptions]);

  const { milestonesOptions, featuresOptions } = useMemo(() => {
    const milestonesOptions =
      selectedFilters
        .find((x) => x.name === 'milestones')
        .options.filter((x) => getValues('defaultFilter.projects')?.includes(x.projectId)) || [];

    const featuresOptions =
      selectedFilters
        .find((x) => x.name === 'features')
        .options.filter((x) => getValues('defaultFilter.projects')?.includes(x.projectId)) || [];

    return {
      milestonesOptions,
      featuresOptions,
    };
  }, [selectedFilters, watch('defaultFilter.projects')]);

  const handleDiscard = () => {
    selectedFilters.forEach((x) => {
      setValue(`defaultFilters.${x.name}`, undefined);
    });
    setActive((pre) => pre - 1);
  };

  const filtersApplyHandler = () => {
    onApplyFilters && onApplyFilters(watch('defaultFilter'));
    setActive((pre) => pre - 1);
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
    <>
      <div className={style.subHeader}>
        <div className={style.backIcon}>
          <span onClick={handleDiscard}>
            <Icon name={'ArrowLeft'} />
          </span>
          <span>{`Back to Form`}</span>
        </div>
      </div>

      <div className={style.mainWrapper}>
        {isLoading ? (
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
                        name={`defaultFilter.${x.name}`}
                        placeholder="Select"
                        errorMessage={errors?.[`defaultFilter.${x.name}`]?.message}
                        control={control}
                        numberBadgeColor={'#39695b'}
                        showNumber
                        isMulti={x.isMulti}
                      />
                    </div>
                  ) : (
                    <DateRange
                      handleChange={(e) => onChange(`defaultFilter.${x.name}`, e)}
                      startDate={watch(`defaultFilter.${x.name}`)?.start}
                      endDate={watch(`defaultFilter.${x.name}`)?.end}
                      label={x.label}
                      placeholder={'Select'}
                      name={`defaultFilter.${x.name}`}
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
    </>
  );
};

export default Index;
