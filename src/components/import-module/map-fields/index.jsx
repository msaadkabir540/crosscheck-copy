import { useCallback, useEffect, useState } from 'react';

import { FileInput } from 'components/form-fields';
import Button from 'components/button';
import FileLabel from 'components/file-label';
import Loader from 'components/loader';

import { useToaster } from 'hooks/use-toaster';

import { keys } from 'utils/lodash';

import {
  checkMissingDataHandler,
  findNonMatchingStrings,
  handleColumnChange,
  mappingValuesHandler,
  valueFetcher,
} from './helper';
import Mapping from './mapping';
import style from './mapFields.module.scss';

const MapFields = ({
  setValue,
  watch,
  control,
  getValues,
  fileChangeHandler,
  setIsFormChanged,
  onSubmit,
  fields,
  options,
  finalDataStructure,
}) => {
  const [crosscheckFields, setCrossCheckFields] = useState([]);
  const [headerOptions, setHeaderOptions] = useState([]);
  const { toastError } = useToaster();
  const [isLoading, setIsLoading] = useState(false);

  const headerMappingHandler = useCallback(() => {
    if (watch('csvData').length) {
      const csvRecords = watch('csvData');
      const csvHeaders = keys(watch('csvData')[0]);
      const valueOptionsMap = new Map();

      const mappingHandlerWithOptionsAndValues = mappingValuesHandler(
        fields,
        csvHeaders,
        options,
        csvRecords,
        valueOptionsMap,
      );

      setCrossCheckFields([...mappingHandlerWithOptionsAndValues]);

      const objHash = {};
      mappingHandlerWithOptionsAndValues.forEach((item) => {
        objHash[item.name] = item;
      });

      setValue('crossCheckFields', objHash);

      setValue('uniqueValuesMap', valueOptionsMap);
      const remainingHeadersOptions = findNonMatchingStrings(csvHeaders, mappingHandlerWithOptionsAndValues);
      setHeaderOptions(remainingHeadersOptions);
    }
  }, [fields, options, setValue, watch]);

  useEffect(() => {
    setCrossCheckFields([]);
    setHeaderOptions([]);
    headerMappingHandler();
    setIsLoading(false);
  }, [headerMappingHandler]);

  const onColumnMapChangeHandler = (e) => {
    const newAssignedValue = e?.selectedOption?.value ?? '';
    const field = e?.field.split('.')[1];

    const csvRecords = watch('csvData');
    const csvHeaders = keys(watch('csvData')[0]);

    const valueOptionsMap = new Map();

    const updatedCrossCheckFields = handleColumnChange(
      crosscheckFields,
      field,
      newAssignedValue,
      csvRecords,
      valueOptionsMap,
    );

    setCrossCheckFields(updatedCrossCheckFields);

    const objHash = {};
    updatedCrossCheckFields.forEach((item) => {
      objHash[item.name] = item;
    });

    setValue('crossCheckFields', objHash);
    setValue('uniqueValuesMap', valueOptionsMap);

    const newHeader = findNonMatchingStrings(csvHeaders, updatedCrossCheckFields);

    setHeaderOptions(newHeader);
    setIsFormChanged(true);
  };

  const onRecordMapChangeHandler = (updatedData, name) => {
    const newCrossCheckField = crosscheckFields.map((crosscheckField) => {
      const { csvValues } = crosscheckField;

      if (crosscheckField.name === name) {
        const updatedCsvValues = csvValues.map((value) => {
          const updatedRecord = updatedData[`csvValue.${name}.${value.label}`] || updatedData[`csvValue.${name}.-`];

          const updatedField = updatedRecord?.field?.split('.')?.[2];

          if ((updatedField && value.label === updatedField) || (value.label === '' && updatedField === '-')) {
            return { ...value, assignedValue: updatedRecord.selectedOption };
          } else {
            return value;
          }
        });

        return { ...crosscheckField, csvValues: updatedCsvValues };
      } else {
        return crosscheckField;
      }
    });

    setCrossCheckFields(newCrossCheckField);

    const objHash = {};
    newCrossCheckField.forEach((item) => {
      objHash[item.name] = item;
    });

    setValue('crossCheckFields', objHash);
  };

  const startImportHandler = useCallback(async () => {
    try {
      const isDataMissing = checkMissingDataHandler(watch('crossCheckFields'), ['milestones', 'features']);

      if (isDataMissing) {
        const body = [...watch('csvData')].map((csvRecord) => {
          const dynamicObject = {};
          Object.keys(finalDataStructure).forEach((key) => {
            dynamicObject[key] = valueFetcher(watch('crossCheckFields'), finalDataStructure[key], csvRecord);
          });

          return dynamicObject;
        });

        const filteredBody = body.map((obj) => {
          const filteredObj = Object.fromEntries(
            Object.entries(obj).filter(([value]) => value !== '' && value !== null),
          );

          return filteredObj;
        });

        onSubmit && (await onSubmit(filteredBody, watch('project')));
      } else {
        toastError({ msg: 'All milestones and respective features should be Mapped' });
      }
    } catch (error) {
      console.error(error);
      toastError(error);
    }
  }, [finalDataStructure, onSubmit, toastError, watch]);

  const fileHandler = useCallback(
    (e) => {
      setIsLoading(true);
      fileChangeHandler(e);
    },
    [fileChangeHandler],
  );

  return (
    <div className={style.main}>
      <FileInput
        wrapperClass={style.uploadClass}
        name={'importFile'}
        control={control}
        setValue={setValue}
        watch={watch}
        onChangeHandler={fileHandler}
        accept={{
          'text/*': ['.csv'],
        }}
        maxSize={10 * 1024 * 1024}
      >
        <FileLabel
          fileName={watch('importFile') && `${watch('importFile')?.name}.csv`}
          iconText={'Change File'}
          btnText={'Uploaded'}
        />
      </FileInput>

      <p>
        You can also download <a href="https://www.google.com">sample file </a> with instructions
      </p>
      <span>Map Fields</span>
      <span className={style.warnText}>
        Note: If you miss a field in column mapping then that column will be dropped and the data for missing field will
        be set.
      </span>
      <div className={style.headings}>
        <div className={style.headingControl}>
          <span>Cross Check Fields</span>
        </div>
        <div className={style.hollowSpace}></div>
        <div className={style.headingControl}>
          <span>CSV Columns</span>
        </div>
        <div className={style.headingControl}>
          <span>Values mapping from CSV</span>
        </div>
      </div>

      <div className={style.mappingFieldsContainer}>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {' '}
            {crosscheckFields?.map((field) => {
              return (
                <Mapping
                  key={field.label}
                  {...{
                    control,
                    setValue,
                    watch,
                    field,
                    name: `headersAssignedOptions.${field.name}`,
                    onChangeHandler: onColumnMapChangeHandler,
                    OnRecordUpdateHandler: onRecordMapChangeHandler,
                    headerOptions: headerOptions.filter((x) => !x.disabled),
                    getValues,
                  }}
                />
              );
            })}
          </>
        )}
      </div>
      <div className={style.importBtn}>
        <Button text={'Start Import'} handleClick={startImportHandler} />
      </div>
    </div>
  );
};

export default MapFields;
