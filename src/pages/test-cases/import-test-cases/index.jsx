import { useCallback, useMemo, useState } from 'react';

import { useForm } from 'react-hook-form';

import FormCloseModal from 'components/form-close-modal';
import { FileInput } from 'components/form-fields';
import Button from 'components/button';
import DragDrop from 'components/drag-drop';
import MainWrapper from 'components/layout/main-wrapper';
import FileLabel from 'components/file-label';
import { MapFields } from 'components/import-module';
import SelectBox from 'components/select-box';

import { useToaster } from 'hooks/use-toaster';

import { useImportTestCase } from 'api/v1/test-cases/test-cases';

import { formattedDate } from 'utils/date-handler';
import { convertBase64CSVToJson } from 'utils/file-handler';

import { useProjectOptions as useTestCasesHelper } from '../helper';
import style from './import.module.scss';
import { crossCheckFields, finalMapping } from './helper';
import Icon from '../../../components/icon/themed-icon';

const ImportModule = ({ noHeader, projectId, setIsImportActive }) => {
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [showDiscardModal, setDiscardModal] = useState(false);

  const { toastSuccess, toastError } = useToaster();

  const { control, register, reset, setValue, watch, getValues } = useForm();
  const [mapFieldsPage, setMapFieldsPage] = useState();
  const [files, setFiles] = useState({});
  const { data = {} } = useTestCasesHelper();
  const { projectOptions = [] } = data;

  const { mutateAsync: _importTestCaseHandler } = useImportTestCase();

  const removeImportHandler = useCallback(() => {
    setFiles({});
  }, []);

  const proceedMappingHandler = useCallback(() => {
    setMapFieldsPage(true);
  }, []);

  const projectWatch = watch('project');

  const options = useMemo(() => {
    return {
      milestones: data?.mileStonesOptions?.filter((x) => x.projectId === projectWatch) ?? [],
      features: data?.featuresOptions?.filter((x) => x.projectId === projectWatch) ?? [],
      testType: data?.testTypeOptions ?? [],
      weightage: data?.weighageOptions ?? [],
      status: data?.statusOptions ?? [],
      state: data?.stateOptions ?? [],
      createdBy: data?.createdByOptions ?? [],
    };
  }, [data, projectWatch]);

  const backPageHandler = useCallback(() => {
    setMapFieldsPage(false);
    setDiscardModal(false);
    setIsImportActive(false);
  }, [setIsImportActive]);

  const resetHandler = useCallback(() => {
    setValue('crossCheckFields', {});
    setValue('csvData', []);
    setValue('csvValue', {});
    setValue('headersAssignedOptions', {});
    setValue('uniqueValuesMap', {});
  }, [setValue]);

  const fileChangeHandler = useCallback(
    async (e) => {
      resetHandler();
      setFiles(e);
      const acceptedFiles = e?.acceptedFiles?.[0] || {};

      if (acceptedFiles.attachment) {
        const data = await convertBase64CSVToJson(acceptedFiles.attachment);

        if (data.length > 0) {
          setValue('importFile', acceptedFiles);
          setValue('csvData', data);
          noHeader && setValue('project', projectId);
        }
      }
    },
    [resetHandler, setFiles, setValue, noHeader, projectId],
  );

  const handleDiscard = useCallback(() => {
    if (isFormChanged || watch('project') || files?.acceptedFiles?.length > 0) {
      setDiscardModal(true);
    } else {
      backPageHandler();
    }
  }, [backPageHandler, files?.acceptedFiles?.length, isFormChanged, watch]);
  //TODO: Discard Scenario for Single Project Tabs

  const onSubmit = useCallback(
    async (body, id) => {
      const notRequired = [
        'testObjective',
        'preConditions',
        'testSteps',
        'expectedResults',
        'createdAt',
        'weightage',
        'status',
        'state',
      ];

      try {
        const processedTestCases = body?.map((testCase) => {
          const processedTestCase = { ...testCase };

          notRequired?.forEach((field) => {
            if (
              processedTestCase[field] === null ||
              processedTestCase[field] === undefined ||
              processedTestCase[field] === '' ||
              processedTestCase[field] === 'N/A'
            ) {
              delete processedTestCase[field];
            }
          });

          return processedTestCase;
        });

        const payload = {
          id,
          body: { testCases: processedTestCases },
        };

        const res = await _importTestCaseHandler(payload);

        if (res.message) {
          toastSuccess(res.message);
          setIsImportActive(false);
        }
      } catch (error) {
        console.error(error);
        toastError(error);
      }
    },
    [_importTestCaseHandler, toastSuccess, setIsImportActive, toastError],
  );

  return (
    <>
      {(isFormChanged || watch('project') || files?.acceptedFiles?.length > 0) && showDiscardModal && (
        <FormCloseModal
          modelOpen={showDiscardModal}
          setModelOpen={setDiscardModal}
          confirmBtnHandler={backPageHandler}
          heading={`You have unsaved changes`}
          subHeading={` Are you sure you want to exit? Your unsaved changes will be not be Saved.`}
          confirmBtnText={`Discard Changes`}
          icon={<Icon name={'WarningRedIcon'} height={80} width={80} />}
          cancelBtnText={`Back To Page`}
        />
      )}
      <MainWrapper
        title="Test Cases"
        date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}
        stylesBack={noHeader ? { marginTop: '10px' } : {}}
        noHeader={noHeader}
      >
        <div className={style.main}>
          <div className={style.backIcon} onClick={handleDiscard}>
            <span>
              <Icon name={'ArrowLeft'} />
            </span>
            <h2>Import TestCases</h2>
          </div>

          {!mapFieldsPage ? (
            <>
              {!noHeader && (
                <div className={style.selectProject}>
                  <span>Project</span>
                  <SelectBox
                    control={control}
                    name={'project'}
                    options={projectOptions}
                    placeholder="Select"
                    defaultValue=""
                  />
                </div>
              )}
              <div className={style.selectFile}>
                <span>Please Upload CSV file of your test Cases here</span>
                <span className={style.warnText}>
                  Note: Your date format must be (MM/DD/YYYY) if you are using slashed date format
                </span>

                {files?.acceptedFiles?.length > 0 ? (
                  <FileLabel
                    fileName={files?.acceptedFiles[0]?.name || 'Please attach a CSV file First'}
                    handleClick={removeImportHandler}
                    iconText={'Remove'}
                    Icon={<Icon name={'CrossCircle'} />}
                  />
                ) : (
                  <FileInput
                    name={'importFile'}
                    control={control}
                    setValue={setValue}
                    watch={watch}
                    onChangeHandler={fileChangeHandler}
                    accept={{
                      'text/*': ['.csv'],
                    }}
                    maxSize={1000 * 1024 * 1024}
                  >
                    <DragDrop files={files} type="file" btnText="Remove Photo" isImport={true} />
                  </FileInput>
                )}
              </div>

              <p>
                You can also download{' '}
                <a href="https://crosscheck-dev.s3.amazonaws.com/sample-files/TestCases+Export+File+Sample.csv">
                  sample file
                </a>{' '}
                with instructions
              </p>
              {files?.acceptedFiles?.length > 0 && watch('project') && (
                <div className={style.proceedBtn}>
                  <Button text={'Proceed Mapping'} handleClick={proceedMappingHandler} />
                </div>
              )}
            </>
          ) : (
            <MapFields
              register={register}
              setValue={setValue}
              watch={watch}
              control={control}
              getValues={getValues}
              reset={reset}
              fileChangeHandler={fileChangeHandler}
              setIsFormChanged={setIsFormChanged}
              setIsImportActive={setIsImportActive}
              fields={crossCheckFields}
              onSubmit={onSubmit}
              options={options}
              finalDataStructure={finalMapping}
            />
          )}
        </div>
      </MainWrapper>
    </>
  );
};

export default ImportModule;
