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

import { useImportBugs } from 'api/v1/bugs/bugs';

import { formattedDate } from 'utils/date-handler';
import { convertBase64CSVToJson } from 'utils/file-handler';

import { useBugsFiltersOptions } from '../header/helper';
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
  const { data = {} } = useBugsFiltersOptions();
  const { projectOptions = [] } = data;

  const { mutateAsync: _importBugsHandler } = useImportBugs();

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
      bugType: data?.bugTypeOptions ?? [],
      bugSubtype: data?.bugSubtypeOptions ?? [],
      severity: data?.severityOptions ?? [],
      testType: data?.testTypeOptions ?? [],
      developerName: data?.assignedToOptions ?? [],
      testedEnvironment: data?.testedEnvironmentOptions ?? [],
      testedDevice: data?.testedDevicesOptions ?? [],
      status: data?.statusOptions ?? [],
      issueType: data?.issueTypeOptions ?? [],
      reportedBy: data?.reportedByOptions ?? [],
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
    [noHeader, projectId, resetHandler, setValue],
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
        'feedback',
        'idealBehaviour',
        'severity',
        'bugType',
        'bugSubtype',
        'developerId',
        'taskId',
        'testedVersion',
        'testingType',
        'testedDevice',
        'testEvidence',
        'testedEnvironment',
        'reportedAt',
      ];

      try {
        const processedBugs = body?.map((bug) => {
          const processedBug = { ...bug };

          notRequired?.forEach((field) => {
            if (
              processedBug[field] === null ||
              processedBug[field] === undefined ||
              processedBug[field] === '' ||
              processedBug[field] === 'N/A'
            ) {
              delete processedBug[field];
            }
          });

          if (!processedBug.testedVersion) {
            console.warn(`Missing or invalid testedVersion for bug: ${processedBug._id}`);
          }

          return processedBug;
        });

        const payload = {
          id,
          body: { bugs: processedBugs },
        };

        const res = await _importBugsHandler(payload);

        if (res.message) {
          toastSuccess(res.message);
          setIsImportActive(false);
        }
      } catch (error) {
        console.error(error);
        toastError(error);
      }
    },
    [_importBugsHandler, setIsImportActive, toastError, toastSuccess],
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
        title="Bugs Reporting"
        date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}
        stylesBack={noHeader ? { marginTop: '10px' } : {}}
        noHeader={noHeader}
      >
        <div className={style.main}>
          <div className={style.backIcon} onClick={handleDiscard}>
            <span>
              <Icon name={'ArrowLeft'} />
            </span>
            <h2>Import Bugs</h2>
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
                <span>Please Upload CSV file of your bugs here</span>
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
                <a href="https://crosscheck-dev.s3.amazonaws.com/sample-files/Bug+Import+Sample+File.csv">
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
