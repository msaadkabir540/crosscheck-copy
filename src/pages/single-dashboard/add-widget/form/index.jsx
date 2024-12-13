import { useMemo } from 'react';

import Icon from 'components/icon/themed-icon';
import TextField from 'components/text-field';
import SelectBox from 'components/select-box';
import Button from 'components/button';

import fullPreviewIcon from 'assets/preview.svg';

import { options } from '../helper';
import style from './style.module.scss';

const Index = ({ setActive, hookForm, filterCount, onSubmitForm, isLoading, isEditable, handleDiscard }) => {
  const {
    getValues,
    control,
    formState: { errors },
    register,
    handleSubmit,
    watch,
  } = hookForm;

  const { xAxisOptions, yAxisOptions } = useMemo(() => {
    const xAxisOptions = options?.category?.find((x) => x.value === getValues('category'))?.['x-axis'] || [];
    const yAxisOptions = options?.category?.find((x) => x.value === getValues('category'))?.['y-axis'] || [];

    return { xAxisOptions, yAxisOptions };
  }, [watch('category')]);

  const submitHandler = async (data) => {
    try {
      onSubmitForm && (await onSubmitForm(data));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {!isEditable && (
        <div className={style.subHeader}>
          <div className={style.backIcon}>
            <span
              onClick={() => {
                setActive((pre) => pre - 1);
              }}
            >
              <Icon name={'ArrowLeft'} />
            </span>
            <span>{`${getValues('subtype')} ${getValues('type')}`}</span>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className={style.main}>
          <div className={style.tabs}>
            <TextField
              label={'Widget Title'}
              placeholder={'Write Widget Title'}
              name={'widgetName'}
              register={() =>
                register('widgetName', {
                  required: 'Required',
                })
              }
              errorMessage={errors?.widgetName?.message}
            />

            <div>
              <SelectBox
                options={options?.['category']}
                name={'category'}
                label={'Category'}
                placeholder="Select Category"
                rules={{ required: 'Required' }}
                control={control}
                numberBadgeColor={'#39695b'}
                showNumber
                errorMessage={errors?.category?.message}
                disabled={isEditable}
              />
            </div>
            <div>
              <SelectBox
                options={xAxisOptions}
                name={'x-axis'}
                label={'X-Axis'}
                placeholder={getValues('category') ? 'Select x-axis' : 'Select Category First'}
                rules={{ required: 'Required' }}
                control={control}
                numberBadgeColor={'#39695b'}
                showNumber
                errorMessage={errors?.['x-axis']?.message}
              />
            </div>
            <div>
              <SelectBox
                options={yAxisOptions}
                name={'y-axis'}
                label={'Y-axis'}
                placeholder={getValues('category') ? 'Select x-axis' : 'Select Category First'}
                rules={{ required: 'Required' }}
                control={control}
                numberBadgeColor={'#39695b'}
                showNumber
                errorMessage={errors?.['y-axis']?.message}
              />
            </div>
            <div>
              <SelectBox
                options={xAxisOptions}
                name={'primaryGroupBy'}
                label={'Primary Group By'}
                placeholder={getValues('category') ? 'Select Primary Group By' : 'Select Category First'}
                control={control}
                numberBadgeColor={'#39695b'}
                showNumber
                errorMessage={errors?.primaryGroupBy?.message}
              />
            </div>
            <div>
              <SelectBox
                options={xAxisOptions}
                name={'secondaryGroupBy'}
                label={'Secondary Group By'}
                placeholder={getValues('category') ? 'Select Secondary Group By' : 'Select Category First'}
                control={control}
                numberBadgeColor={'#39695b'}
                showNumber
                errorMessage={errors?.secondaryGroupBy?.message}
              />
            </div>
            <div className={style.btnDiv}>
              {getValues('category') && (
                <Button
                  text={`Default Filters ${filterCount ? `(${filterCount})` : ''}`}
                  type={'button'}
                  btnClass={`${style.btn} ${filterCount && style.filteredBtn}`}
                  handleClick={(e) => {
                    e.preventDefault();
                    setActive((pre) => pre + 1);
                  }}
                />
              )}
            </div>
          </div>

          <div className={style.tabsContent}>
            <p>Preview</p>
            <div className={style.widgetPreview}>
              <div className={style.widgetTitle}>
                <p>{watch('widgetName') || 'Widget Title'}</p>
                <div className={style.widgetActions}>
                  <Button type="button" btnClass={`${style.btn} `} text="Filters" />
                  <img src={fullPreviewIcon} alt="fullPreviewIcon" />
                  <div className={style.img}>
                    <Icon name={'MoreInvertIcon'} />
                  </div>
                </div>
              </div>
              <Icon name={getValues('preview')} iconClass={style.previewDiv} />
            </div>
          </div>
        </div>
        <div className={style.btnDiv}>
          <Button text="Discard" type={'button'} btnClass={style.btn} handleClick={handleDiscard} />
          <Button text={isEditable ? 'Update' : 'Create'} type={'submit'} isDisable={isLoading} />
        </div>
      </form>
    </>
  );
};

export default Index;
