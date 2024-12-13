import React, { useCallback, useEffect } from 'react';

import { useForm } from 'react-hook-form';
import _ from 'lodash';

import { useAppContext } from 'context/app-context';

import TextField from 'components/text-field';
import SelectBox from 'components/select-box';
import Button from 'components/button';

import { useGetProjectById } from 'api/v1/projects/projects';

import { statusOptions } from 'utils/drop-down-options';

import style from './modal.module.scss';
import { useProjectOptions } from './helper';

const AddProjectMMobile = ({ openAddModal, setOpenAddModalMobile, addProject }) => {
  const { userDetails } = useAppContext();
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

  const { data: _projectData } = useGetProjectById(id);

  React.useEffect(() => {
    if (_projectData && Object.keys(_projectData).length) {
      let values = _.pick(_projectData, ['_id', 'status', 'name', 'shareWith', 'idSeries']);

      values.shareWith = values.shareWith.map((x) => x._id);

      Object.entries(values).forEach(([key, val]) => {
        setValue(key, val);
      });
    }
  }, [_projectData]);

  const onSubmit = async (data) => {
    const formData = {
      ...data,
      shareWith: _.uniq([
        ...data.shareWith,
        ...sharedWith.reduce((acc, user) => {
          if (user.role === 'Admin') {
            acc.push(user.value);
          }

          return acc;
        }, []),
        userDetails?.id,
      ]),
    };

    const res = await addProject(id, formData, setError);
    res?.msg && setOpenAddModalMobile(null);
  };

  useEffect(() => {
    if (openAddModal === null) {
      reset();
    }
  }, [openAddModal]);

  const handleRegisterName = useCallback(() => {
    register('name', {
      required: 'Required',
    })
  }, [register])

  const handleRegisterIds = useCallback(() => {
    register('idSeries', {
      required: 'Required',
      pattern: {
        value: /^[A-Z]{3}$/,
        message: 'IdSeries must be three uppercase alphabets (A-Z)',
      },
    })
  }, [register])

  const handleReset = useCallback(() => {
    setOpenAddModalMobile(null);
    reset();
  }, [setOpenAddModalMobile, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        register={handleRegisterName}
        label="Project Name"
        required
        name="name"
        placeholder="Project Name"
        errorMessage={errors.name && errors.name.message}
      />
      <div
        style={{
          marginTop: '10px',
        }}
      >
        <SelectBox
          name="status"
          control={control}
          rules={{
            required: 'Required',
          }}
          badge
          required
          options={statusOptions}
          label={'Project Status'}
          placeholder={'Status'}
          numberBadgeColor={'#39695b'}
          showNumber
          backValue={{ padding: '2px 0px' }}
          errorMessage={errors.status && errors.status.message}
        />
      </div>
      <div
        style={{
          margin: '10px 0px 30px 0px',
        }}
      >
        <SelectBox
          name="shareWith"
          control={control}
          rules={{
            required: 'Required',
          }}
          badge
          options={sharedWith}
          required
          label={'Share with'}
          isMulti
          placeholder={'Select'}
          numberBadgeColor={'#39695b'}
          showNumber
          errorMessage={errors.shareWith && errors.shareWith.message}
          backValue={{ padding: '2px 0px' }}
        />
        <div
          style={{
            margin: '10px 0px 0px 0px',
            position: 'relative',
          }}
        >
          <div className={style.count}>{watch('idSeries') ? watch('idSeries')?.length : 0}/3</div>
          <TextField
            register={handleRegisterIds}
            required
            label="IdSeries"
            name="idSeries"
            placeholder="idSeries"
            errorMessage={errors.idSeries && errors.idSeries.message}
            maxLength={3}
          />
        </div>
      </div>
      <div className={style.innerFlex}>
        <p
          onClick={handleReset}
        >
          Cancel
        </p>
        <Button text="Save" type={'submit'} />
      </div>
    </form>
  );
};

export default AddProjectMMobile;
