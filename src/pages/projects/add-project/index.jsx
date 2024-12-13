import { useCallback, useEffect } from 'react';

import { useForm } from 'react-hook-form';
import _ from 'lodash';

import { useAppContext } from 'context/app-context';

import Modal from 'components/modal';
import TextField from 'components/text-field';
import SelectBox from 'components/select-box';
import Button from 'components/button';
import Icon from 'components/icon/themed-icon';

import { useGetProjectById } from 'api/v1/projects/projects';

import { generateRandomString, statusOptions } from 'utils/drop-down-options';

import style from './modal.module.scss';
import { useProjectOptions } from './helper';

const AddProject = ({ openAddModal, setOpenAddModal, isLoading, addProject }) => {
  const { data = {} } = useProjectOptions();

  const {
    control,
    formState: { errors },
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    reset,
  } = useForm();

  const { sharedWith = [] } = data;

  const id = typeof openAddModal === 'string' ? openAddModal : null;
  const { userDetails } = useAppContext();

  const { data: _projectData } = useGetProjectById(id);

  useEffect(() => {
    if (_projectData && Object.keys(_projectData).length) {
      let values = _.pick(_projectData, ['_id', 'status', 'name', 'shareWith', 'idSeries']);

      values.shareWith = values.shareWith.map((x) => x._id);

      Object.entries(values).forEach(([key, val]) => {
        setValue(key, val);
      });
    }
  }, [_projectData, setValue]);

  const onSubmit = async (data) => {
    const formData = {
      ...data,
      idSeries: id ? data.idSeries : userDetails?.activePlan === 'Free' ? generateRandomString() : data.idSeries,
      shareWith: data.shareWith ? data.shareWith : [],
    };

    const res = await addProject(id, formData, setError);
    res?.msg && setOpenAddModal(false);
  };

  const handleReset = useCallback(() => {
    setOpenAddModal(false);
    reset();
  }, [reset, setOpenAddModal]);

  const handleRegisterName = useCallback(() => {
    return register('name', {
      required: 'Required',
    });
  }, [register]);

  const handleRegisterIdSeries = useCallback(() => {
    return register('idSeries', {
      required: 'Required',
      pattern: {
        value: /^[A-Z]{3}$/,
        message: 'IdSeries must be three uppercase alphabets (A-Z)',
      },
      onChange: (e) => {
        e.target.value = e.target.value.toUpperCase();
      },
    });
  }, [register]);

  return (
    <Modal open={!!openAddModal} handleClose={handleReset} className={style.mainDiv}>
      <div className={style.crossImg}>
        <span className={style.modalTitle}>{id ? 'Edit' : 'Add'} Project</span>
        <div data-cy="addproject-model-closeicon" onClick={handleReset} className={style.hover}>
          <Icon name={'CrossIcon'} />
          <div className={style.tooltip}>
            <p>Cross</p>
          </div>
        </div>
      </div>
      <form className={style.overflow} onSubmit={handleSubmit(onSubmit)}>
        <TextField
          register={handleRegisterName}
          label="Project Name"
          name="name"
          placeholder="Project Name"
          errorMessage={errors.name && errors.name.message}
          data-cy="allproject-addproject-projectname"
        />
        <div className={style.selectbox_container}>
          <SelectBox
            id={'status-SelectBox'}
            name="status"
            control={control}
            rules={{
              required: 'Required',
            }}
            badge
            options={statusOptions}
            label={'Project Status'}
            placeholder={'Status'}
            numberBadgeColor={'#39695b'}
            showNumber
            backValue={{ padding: '2px 0px' }}
            errorMessage={errors.status && errors.status.message}
          />
        </div>
        <div className={style.shareWith_selectbox_container}>
          <SelectBox
            name="shareWith"
            control={control}
            badge
            options={
              sharedWith?.filter((x) => {
                return x.role !== 'Admin' && x.role !== 'Owner' && x.value !== userDetails?.id;
              }) || []
            }
            label={'Share with'}
            id={'sharewith-SelectBox'}
            isMulti
            placeholder={'Select'}
            numberBadgeColor={'#39695b'}
            showNumber
            errorMessage={errors.shareWith && errors.shareWith.message}
            backValue={{ padding: '2px 0px' }}
          />
          {userDetails?.activePlan !== 'Free' && (
            <div className={style.id_series_textfield}>
              <div className={style.count}>{watch('idSeries') ? watch('idSeries')?.length : 0}/3</div>
              <TextField
                register={handleRegisterIdSeries}
                label="ID Series"
                name="idSeries"
                placeholder="ABC"
                errorMessage={errors.idSeries && errors.idSeries.message}
                maxLength={3}
                data-cy="allproject-addproject-IDseries"
              />
            </div>
          )}
        </div>
        <div className={style.innerFlex}>
          <Button handleClick={handleReset} type="button" text="Cancel" btnClass={style.btn} />

          <Button text="Save" type={'submit'} disabled={isLoading} data-cy="allproject-addproject-save-btn" />
        </div>
      </form>
    </Modal>
  );
};

export default AddProject;
