import { useState, useEffect } from 'react';

import { useForm } from 'react-hook-form';
import _ from 'lodash';

// NOTE: components
import TextField from 'components/text-field';
import SelectBox from 'components/select-box';
import ColorPicker from 'components/color-picker';
import Checkbox from 'components/checkbox';
import Tabs from 'components/tabs';
import Button from 'components/button';

import { useToaster } from 'hooks/use-toaster';

import { useAddWidgetConfig, useEditWidgetConfig } from 'api/v1/projects/widget';

import View from './view';
import Code from './code';
// NOTE: assets
// NOTE: styles
import style from './style.module.scss';

const WidgetConfig = ({ refetch, _widgetConfig, setWidget, projectId, copyToClipboard }) => {
  const { toastError, toastSuccess } = useToaster();
  const [active, setActive] = useState(0);

  const { control, register, watch, setValue, handleSubmit } = useForm({
    defaultValues: {
      // NOTE: Set your default values here
      widgetTitle: 'Report An Issue',
      widgetPosition: 'rightCenter',
      widgetButtonColor: '#f96e6e',
      textColor: '#e5e5e5',
      title: 'Title',
      titleReq: true,
      Feedback: 'Feedback',
      feedbackReq: false,
      attachment: 'Attachment',
      attachmentReq: false,
    },
  });

  const tabs = [
    {
      tabTitle: 'Preview',
      content: <View watch={watch} />,
    },
    {
      tabTitle: 'Code',
      content: <Code watch={watch} link={_widgetConfig?.widgetFound?.widgetLink} copyToClipboard={copyToClipboard} />,
    },
  ];

  useEffect(() => {
    if (_widgetConfig?.widgetFound && !_.isEmpty(_widgetConfig?.widgetFound)) {
      let values = _.pick(_widgetConfig?.widgetFound, [
        'attachmentLabel',
        'descriptionLabel',
        'isAttachmentRequired',
        'isDescriptionRequired',
        'isTitleReq',
        'textColor',
        'titleLabel',
        'widgetButtonColor',
        'widgetPosition',
        'widgetTitle',
      ]);

      Object.entries(values).forEach(([key, val]) => {
        setValue(key, val);
      });
    }
  }, [_widgetConfig]);

  const { mutateAsync: _addHandler, isLoading } = useAddWidgetConfig();
  const { mutateAsync: _editHandler, isLoading: _isEditLoading } = useEditWidgetConfig();

  const onSubmit = async (data) => {
    try {
      const formData = {
        ...data,
        projectId,
      };

      const res = _widgetConfig?.widgetFound?._id
        ? await _editHandler({ id: _widgetConfig?.widgetFound?._id, body: formData })
        : await _addHandler(formData);
      toastSuccess(res.msg);
      refetch();
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <div className={style.main}>
      <h4 className={style.h4}>Feedback Widget</h4>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={style.widgetPanel}>
          <div className={style.form}>
            <div className={style.formField}>
              <TextField
                name={'widgetTitle'}
                label={'Widget Title'}
                placeholder={'Write Title here'}
                register={() =>
                  register('widgetTitle', {
                    required: 'Required',
                  })
                }
              />
            </div>
            <div className={style.formField}>
              <SelectBox
                control={control}
                rules={{ required: 'Required' }}
                name={'widgetPosition'}
                label={'Widget Position'}
                options={[
                  { label: 'Left Side Top ', value: 'leftTop' },
                  { label: 'Left Side Center ', value: 'leftCenter' },
                  { label: 'Left Side Bottom ', value: 'leftBottom' },
                  { label: 'Right Side Top ', value: 'rightTop' },
                  { label: 'Right Side Center ', value: 'rightCenter' },
                  { label: 'Right Side Bottom ', value: 'rightBottom' },
                ]}
                placeholder={'Write Title here'}
                defaultValue={'Report An Issue'}
              />
            </div>
            <div className={style.formField}>
              <ColorPicker
                control={control}
                name={'widgetButtonColor'}
                label={'Widget & Button Color'}
                rules={{ required: 'Required' }}
              />
            </div>
            <div className={style.formField}>
              <ColorPicker control={control} name={'textColor'} label={'Text Color'} rules={{ required: 'Required' }} />
            </div>

            <h4 className={style.heading}>Configure Feedback Form Fields</h4>
            <div className={style.formField1}>
              <div className={style.formField}>
                <TextField
                  name={'titleLabel'}
                  placeholder={'Title'}
                  defaultValue={'Title'}
                  register={() =>
                    register('titleLabel', {
                      required: 'Required',
                    })
                  }
                />
              </div>
              <Checkbox
                register={register}
                name={'isTitleReq'}
                label={'Required'}
                containerClass={style.containerClass}
              />
            </div>
            <div className={style.formField1}>
              <div className={style.formField}>
                <TextField
                  name={'descriptionLabel'}
                  placeholder={'Description'}
                  defaultValue={'Feedback'}
                  register={() =>
                    register('descriptionLabel', {
                      required: 'Required',
                    })
                  }
                />
              </div>
              <Checkbox
                register={register}
                name={'isDescriptionRequired'}
                label={'Required'}
                containerClass={style.containerClass}
              />
            </div>
            <div className={style.formField1}>
              <div className={style.formField}>
                <TextField
                  name={'attachmentLabel'}
                  placeholder={'Attachment'}
                  defaultValue={'Attachment'}
                  register={() =>
                    register('attachmentLabel', {
                      required: 'Required',
                    })
                  }
                />
              </div>
              <Checkbox
                register={register}
                name={'isAttachmentRequired'}
                label={'Required'}
                containerClass={style.containerClass}
              />
            </div>
          </div>

          <div className={style.viewWrapper}>
            <Tabs pages={tabs} activeTab={active} setActiveTab={setActive} />
          </div>
        </div>
        <div className={style.infoWrapper}>
          <p className={style.p}>Please copy this code and insert into your source code file.</p>
          <div className={style.submitWrapper}>
            <Button
              className={style.cancelText}
              btnClass={style.cancel}
              text={'Cancel'}
              handleClick={() => {
                setWidget(false);
              }}
            />
            <Button text={'Save '} type={'Submit'} disabled={isLoading || _isEditLoading} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default WidgetConfig;
