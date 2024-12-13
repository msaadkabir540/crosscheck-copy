import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useForm } from 'react-hook-form';

import Modal from 'components/modal';
import Button from 'components/button';
import SelectBox from 'components/select-box';
import CreatableSelectComponent from 'components/select-box/creatable-select';
import TextArea from 'components/text-area';
import GenericTable from 'components/generic-table';
import UploadAttachment from 'components/upload-attachments/upload-attachment';
import Loader from 'components/loader';

import { useToaster } from 'hooks/use-toaster';

import { useGetTestCaseById } from 'api/v1/test-cases/test-cases';
import { useAddTestedVersion } from 'api/v1/tested-version/tested-version';
import { useAddTestedEnvironment } from 'api/v1/tested-environment/tested-environment';

import { columnsData } from './helper';
import style from './status.module.scss';
import { useProjectOptions } from '../helper';
import Icon from '../../../components/icon/themed-icon';

const StatusUpdateModel = ({
  statusUpdateTestCaseId,
  setStatusUpdateTestCaseId,
  isLoading,
  evidenceRequired,
  handleClick,
  setBugModalData,
}) => {
  const { ref } = useRef;

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    watch,
    setError,
  } = useForm({
    defaultValues: {
      testStatus: '',
      testEvidence: {},
      notes: '',
      testedDevice: '',
      testedVersion: '',
      testedEnvironment: '',
    },
  });
  const [isModalAlreadyClosed, setIsModalAlreadyClosed] = useState(false);
  const { toastSuccess, toastError } = useToaster();
  const { data: _testCaseData = {}, isLoading: isFetching } = useGetTestCaseById(statusUpdateTestCaseId);
  const { data: projectOptions = {}, refetch: refetchData } = useProjectOptions();
  const { mutateAsync: _addTestedVersionHandler } = useAddTestedVersion();
  const { mutateAsync: _addTestedEnvironmentHandler } = useAddTestedEnvironment();

  const { testedDevicesOptions, testedEnvironmentOptions, testedVersionOptions, statusOptions } = useMemo(() => {
    return {
      ...projectOptions,
      testedEnvironmentOptions: projectOptions?.testedEnvironmentOptions?.filter(
        (envOption) => envOption?.projectId === _testCaseData?.testCase?.projectId?._id,
      ),
      testedVersionOptions: projectOptions?.testedVersionOptions?.filter(
        (verOption) => verOption?.projectId === _testCaseData?.testCase?.projectId?._id,
      ),
    };
  }, [projectOptions, _testCaseData]);

  const onTestedEnvironmentChange = useCallback(
    async ({ selectedOption }) => {
      const testedEnvironmentName = selectedOption?.label;

      if (
        testedEnvironmentName &&
        testedEnvironmentOptions?.every(
          (option) => option?.label !== testedEnvironmentName && option?.value !== testedEnvironmentName,
        )
      ) {
        try {
          const res = await _addTestedEnvironmentHandler({
            name: testedEnvironmentName,
            projectId: _testCaseData?.testCase?.projectId?._id,
          });
          toastSuccess(res.msg);

          if (res?.testedEnvironment) {
            const newtestedEnvironment = {
              ...res?.testedEnvironment,
              value: res?.testedEnvironment?._id,
              label: res?.testedEnvironment?.name,
            };
            setValue('testedEnvironment', newtestedEnvironment);
            await refetchData();
          }
        } catch (error) {
          toastError(error);
        }
      }
    },
    [
      setValue,
      toastError,
      refetchData,
      toastSuccess,
      _testCaseData,
      testedEnvironmentOptions,
      _addTestedEnvironmentHandler,
    ],
  );

  const onTestedVersionChange = useCallback(
    async ({ selectedOption }) => {
      const testedVersionName = selectedOption?.label;

      if (
        testedVersionName &&
        testedVersionOptions?.every(
          (option) => option?.label !== testedVersionName && option?.value !== testedVersionName,
        )
      ) {
        try {
          const res = await _addTestedVersionHandler({
            name: testedVersionName,
            projectId: _testCaseData?.testCase?.projectId?._id,
          });
          toastSuccess(res.msg);

          if (res?.testedVersion) {
            const newtestedVersion = {
              ...res?.testedVersion,
              value: res?.testedVersion?._id,
              label: res?.testedVersion?.name,
            };
            setValue('testedVersion', newtestedVersion);
            await refetchData();
          }
        } catch (error) {
          toastError(error);
        }
      }
    },
    [setValue, toastError, refetchData, toastSuccess, _testCaseData, testedVersionOptions, _addTestedVersionHandler],
  );

  useEffect(() => {
    setValue('testStatus', _testCaseData?.testCase?.status);
  }, [_testCaseData, setValue]);

  const onSubmit = async (data) => {
    const formatttedData = {
      ...data,
      testedDevice: data?.testedDevice?.value,
      testedVersion: data?.testedVersion?.value,
      testedEnvironment: data?.testedEnvironment?.value,
    };

    if (data.status === 'failed' && isModalAlreadyClosed) {
      setIsModalAlreadyClosed(true);

      return setBugModalData(true);
    } else {
      handleClick(formatttedData, setError);
    }
  };

  const handleClose = useCallback(() => {
    reset();
    setStatusUpdateTestCaseId('');
  }, [reset, setStatusUpdateTestCaseId]);

  const onTestEvidenceChange = useCallback(
    (e) => {
      setValue('testEvidence', {
        base64: e.target.value,
        url: e.target.value,
      });
    },
    [setValue],
  );

  const onRegisterNotes = useCallback(() => register('notes'), [register]);

  return (
    <Modal open={true} handleClose={handleClose} className={style.mainDiv}>
      <div className={style.crossImg}>
        <span className={style.modalTitle}>Test a Test Case</span>
        <div onClick={handleClose} className={style.hover}>
          <Icon name={'CrossIcon'} height={24} width={24} />
        </div>
      </div>

      <div>
        <div className={style.grid}>
          <div className={style.input}>
            <SelectBox
              name="testStatus"
              control={control}
              badge
              label={'Status'}
              placeholder={'Select'}
              options={statusOptions}
              numberBadgeColor={'#39695b'}
              showNumber
              rules={{ required: { value: true, message: 'Required' } }}
              id="testStatus"
              errorMessage={errors?.testStatus?.message}
            />
          </div>

          <div className={style.evidence}>
            <UploadAttachment
              control={control}
              watch={watch}
              name={'testEvidence'}
              errorClass={style.evidenceError}
              delIconClass={style.delIconClass}
              rules={
                evidenceRequired
                  ? {
                      required: 'Required',
                      validate: (e) => {
                        if (!e.base64) {
                          return 'Required';
                        }

                        try {
                          new URL(e.base64);

                          return true;
                        } catch (err) {
                          return 'Not a valid URL';
                        }
                      },
                    }
                  : ''
              }
              onTextChange={onTestEvidenceChange}
              placeholder="Attach test evidence or paste evidence URL here"
              label="Test Evidence"
              setValue={setValue}
              errorMessage={errors?.testEvidence?.message}
              id="test-evidence-testcse-status-modal"
            />
          </div>
        </div>

        <div className={style.grid}>
          <div className={style.input}>
            <CreatableSelectComponent
              isClearable
              watch={watch}
              control={control}
              name={'testedEnvironment'}
              label={'Tested Environment '}
              placeholder="Select or Create"
              id="tested-env-status-testcase"
              defaultOptions={testedEnvironmentOptions}
              onChangeHandler={onTestedEnvironmentChange}
              errorMessage={errors?.testedEnvironment?.message}
            />
          </div>
          <div className={style.input}>
            <CreatableSelectComponent
              isClearable
              watch={watch}
              control={control}
              name={'testedVersion'}
              label={'Tested Version '}
              id="tested-version-status-testcase"
              defaultOptions={testedVersionOptions}
              onChangeHandler={onTestedVersionChange}
              placeholder="Select or Create (e.g: 1.1)"
              errorMessage={errors?.testedVersion?.message}
            />
          </div>

          <div className={style.input}>
            <CreatableSelectComponent
              defaultOptions={testedDevicesOptions}
              label={'Tested Device'}
              name={'testedDevice'}
              placeholder="Select or Create"
              control={control}
              isClearable
              watch={watch}
              errorMessage={errors?.testedDevice?.message}
              id="tested-device-status-testcase"
            />
          </div>
        </div>

        <TextArea
          register={onRegisterNotes}
          label={'Notes'}
          name={'notes'}
          placeholder={'Type any note related to testing'}
          errorMessage={errors?.remarks?.message}
          id="notes"
          dataCy="notes-status-testcase"
        />

        <div className={style.flex}>
          <Icon name={'RetestRevert'} />
          <p>Testing History</p>
        </div>
        <div className={style.tableWidth}>
          {isFetching ? (
            <div className={style.loaderWrapper}>
              <Loader tableMode={true} className={style.loaderWrapper} />
            </div>
          ) : (
            <GenericTable
              ref={ref}
              columns={columnsData}
              dataSource={_testCaseData?.testCase?.history || []}
              height={'28vh'}
              classes={{
                test: style.test,
                table: style.table,
                thead: style.thead,
                th: style.th,
                containerClass: style.checkboxContainer,
                tableBody: style.tableRow,
              }}
              id="historyTable"
            />
          )}
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={style.innerFlex}>
            <Button text="Discard" handleClick={handleClose} btnClass={style.discardBtn} data-cy="discardBtn" />
            <Button
              text="Save"
              type={'submit'}
              btnClass={style.saveBtn}
              disabled={isLoading}
              data-cy="save-test-fail-testcase-Btn"
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default StatusUpdateModel;
