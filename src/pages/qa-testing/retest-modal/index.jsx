import { useCallback, useMemo, useRef } from 'react';

import { useForm } from 'react-hook-form';

import Modal from 'components/modal';
import Button from 'components/button';
import SelectBox from 'components/select-box';
import CreatableSelectComponent from 'components/select-box/creatable-select';
import TextArea from 'components/text-area';
import GenericTable from 'components/generic-table';
import UploadAttachment from 'components/upload-attachments/upload-attachment';

import { useToaster } from 'hooks/use-toaster';

import { useGetBugById, useRetestBug } from 'api/v1/bugs/bugs';
import { useUpdateBugOfRun } from 'api/v1/test-runs/test-runs';
import { useAddTestedVersion } from 'api/v1/tested-version/tested-version';
import { useAddTestedEnvironment } from 'api/v1/tested-environment/tested-environment';

import { columnsData } from './helper';
import style from './retest.module.scss';
import Icon from '../../../components/icon/themed-icon';

const RetestModal = ({
  openRetestModal,
  setOpenRetestModal,
  options,
  refetch,
  testRunId,
  refetchAll,
  moveToNextBug,
  isInViewMode = false,
}) => {
  const { ref } = useRef;

  const { toastError, toastSuccess } = useToaster();

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    setError,
    watch,
  } = useForm();

  const { data: _bugDetails, refetch: _refetchBug } = useGetBugById(openRetestModal?.id);

  const { statusOptions, testedEnvironmentOptions, testedVersionOptions } = useMemo(() => {
    return {
      ...options,
      testedEnvironmentOptions: options?.testedEnvironmentOptions?.filter(
        (x) => x?.projectId === _bugDetails?.bug?.projectId?._id,
      ),
      testedVersionOptions: options?.testedVersionOptions?.filter(
        (x) => x?.projectId === _bugDetails?.bug?.projectId?._id,
      ),
    };
  }, [_bugDetails, options]);

  const { mutateAsync: _retestHandler, isLoading: _isLoading } = useRetestBug();
  const { mutateAsync: _updateBugOfTestRun } = useUpdateBugOfRun();
  const { mutateAsync: _addTestedVersionHandler } = useAddTestedVersion();
  const { mutateAsync: _addTestedEnvironmentHandler } = useAddTestedEnvironment();

  const onSubmit = async (data) => {
    try {
      const formData = {
        ...data,
        reTestVersion: data?.reTestVersion?.value,
        reTestEvidence: data?.reTestEvidence?.base64,
        reTestEnvironment: data?.reTestEnvironment?.value,
        relatedRun: testRunId,
      };

      const res = await _retestHandler({
        id: openRetestModal?.id,
        body: formData,
      });

      if (testRunId && res?.msg === 'Retest bug updated successfully') {
        await _updateBugOfTestRun({
          id: testRunId,
          body: {
            bugStatus: data?.reTestStatus,
            bugId: openRetestModal?.id,
          },
        });
        refetchAll();
        isInViewMode && moveToNextBug();
      }

      toastSuccess(res.msg);
      !testRunId && refetch(openRetestModal?.id, 'edit', res?.bugData);
      await _refetchBug();
      openRetestModal?.refetch && (await openRetestModal?.refetch());
      reset();
      setOpenRetestModal();
    } catch (error) {
      toastError(error, setError);
    }
  };

  const handleRetest = useCallback(() => {
    reset();
    setOpenRetestModal(false);
  }, [reset, setOpenRetestModal]);

  const onTestedEnvironmentChange = useCallback(
    async ({ selectedOption }) => {
      const testedEnvironmentName = selectedOption?.label;

      if (
        testedEnvironmentName &&
        testedEnvironmentOptions?.every(
          (option) => option?.name !== testedEnvironmentName && option?._id !== testedEnvironmentName,
        )
      ) {
        try {
          const res = await _addTestedEnvironmentHandler({
            name: testedEnvironmentName,
            projectId: _bugDetails?.bug?.projectId?._id,
          });
          toastSuccess(res.msg);

          if (res?.testedEnvironment) {
            const newtestedEnvironment = {
              ...res?.testedEnvironment,
              value: res?.testedEnvironment?._id,
              label: res?.testedEnvironment?.name,
            };
            setValue('testedEnvironment', newtestedEnvironment);
            await refetch();
          }
        } catch (error) {
          toastError(error);
        }
      }
    },
    [refetch, setValue, toastError, _bugDetails, toastSuccess, _addTestedEnvironmentHandler, testedEnvironmentOptions],
  );

  const onTestedVersionChange = useCallback(
    async ({ selectedOption }) => {
      const testedVersionName = selectedOption?.name;

      if (
        testedVersionName &&
        testedVersionOptions?.every((option) => option?.name !== testedVersionName && option?._id !== testedVersionName)
      ) {
        try {
          const res = await _addTestedVersionHandler({
            name: testedVersionName,
            projectId: _bugDetails?.bug?.projectId?._id,
          });
          toastSuccess(res.msg);

          if (res?.testedVersion) {
            const newtestedVersion = {
              ...res?.testedVersion,
              value: res?.testedVersion?._id,
              label: res?.testedVersion?.name,
            };
            setValue('testedVersion', newtestedVersion);
            await refetch();
          }
        } catch (error) {
          toastError(error);
        }
      }
    },
    [refetch, setValue, toastError, _bugDetails, toastSuccess, _addTestedVersionHandler, testedVersionOptions],
  );

  const validateBase64Url = useCallback((e) => {
    if (!e.base64) {
      return 'Required';
    }

    try {
      new URL(e.base64);

      return true;
    } catch (err) {
      return 'Not a valid URL';
    }
  }, []);

  const handleInputChange = useCallback(
    (e) => {
      setValue('reTestEvidence', {
        base64: e.target.value,
        url: e.target.value,
      });
    },
    [setValue],
  );

  const registerRemarks = useCallback(() => register('remarks'), [register]);

  const handleResetAndOpenModal = useCallback(() => {
    reset();
    setOpenRetestModal();
  }, [reset, setOpenRetestModal]);

  return (
    <Modal open={!!openRetestModal?.open} handleClose={handleRetest} className={style.mainDiv} backClass={style.modal}>
      <div className={style.crossImg}>
        <span className={style.modalTitle}>Retest Bug </span>
        <div onClick={handleRetest} className={style.hover}>
          <Icon name={'CrossIcon'} />
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={style.grid}>
          <div className={style.input}>
            <SelectBox
              name="reTestStatus"
              control={control}
              badge
              options={statusOptions}
              label={'Status'}
              placeholder={'Select'}
              numberBadgeColor={'#39695b'}
              showNumber
              rules={{ required: { value: true, message: 'Required' } }}
              errorMessage={errors?.reTestStatus?.message}
              id="bugretest-status"
            />
          </div>
          <div className={style.input}>
            <CreatableSelectComponent
              isClearable
              watch={watch}
              control={control}
              className={style.input}
              name={'reTestEnvironment'}
              label={'Tested Environment '}
              placeholder="Select or Create"
              defaultOptions={testedEnvironmentOptions}
              id="reportbug-retestenvironment-dropdown"
              onChangeHandler={onTestedEnvironmentChange}
              errorMessage={errors?.reTestEnvironment?.message}
            />
          </div>
          <div className={style.input}>
            <CreatableSelectComponent
              isClearable
              watch={watch}
              control={control}
              name={'reTestVersion'}
              label={'Tested Version '}
              placeholder="Select or Create"
              id="retestbug-modal-testedversion"
              defaultOptions={testedVersionOptions}
              onChangeHandler={onTestedVersionChange}
              errorMessage={errors?.reTestVersion?.message}
            />
          </div>
          <UploadAttachment
            control={control}
            watch={watch}
            name={'reTestEvidence'}
            rules={{
              required: 'Required',
              validate: validateBase64Url,
            }}
            onTextChange={handleInputChange}
            placeholder="Attach Test Evidence"
            label="Test Evidence"
            setValue={setValue}
            errorMessage={errors?.reTestEvidence?.message}
            id="reTestEvidence"
          />
        </div>
        <div width={'100%'}>
          <TextArea
            register={registerRemarks}
            label={'Notes'}
            name={'remarks'}
            placeholder={'Write your text here'}
            errorMessage={errors?.remarks?.message}
            dataCy={'retest-notes'}
          />
        </div>
        <div className={style.flex}>
          <Icon name={'RetestRevert'} />
          <p>Retest History</p>
        </div>
        <div className={style.tableWidth}>
          <GenericTable
            ref={ref}
            columns={columnsData}
            dataSource={_bugDetails?.bug?.history || []}
            height={'200px'}
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
        <div className={style.innerFlex}>
          <Button
            text="Discard"
            handleClick={handleResetAndOpenModal}
            btnClass={style.discardBtn}
            dataCy="retest-discard-btn"
          />
          <Button
            text="Save"
            type={'submit'}
            disabled={_isLoading}
            btnClass={style.saveBtn}
            data-cy="retest-save-btn"
          />
        </div>
      </form>
    </Modal>
  );
};

export default RetestModal;
