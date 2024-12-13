import Fuse from 'fuse.js';

import { convertTextToHtmlAndEditorState } from 'utils/validations';
import { formattedDate } from 'utils/date-handler';

export const calculateSimilarity = (targetString, array, property) => {
  const options = {
    keys: [property],
    includeScore: true,
    shouldSort: true,
    threshold: 0.5,
    caseSensitive: true,
  };

  const fuse = new Fuse(array, options);
  const result = fuse.search(targetString);

  if (result.length) {
    const mostSimilarObject = array.find((item) => item[property] === result[0]?.item[property]);

    return mostSimilarObject;
  } else {
    return null;
  }
};

const fuzzySimilarityCheck = (targetString, array) => {
  const options = {
    includeScore: true,
    shouldSort: true,
    threshold: 0.5,
    caseSensitive: true,
  };

  const fuse = new Fuse(array, options);
  const result = fuse.search(targetString);

  if (result.length > 0 && result[0]?.score < options.threshold) {
    return result[0].item;
  } else {
    return '';
  }
};

export const makeNewArray = ({ oldUploadedArray, updatedHeadersList }) => {
  const replaceKeys = (obj) => {
    const newObj = {};

    for (const header of updatedHeadersList) {
      const oldHeader = header.oldHeader;
      const newHeader = header.newHeader;
      newObj[newHeader] = obj[oldHeader];
    }

    return newObj;
  };

  const newData = oldUploadedArray.map(replaceKeys);

  return newData;
};

const checkAssignedValue = (headers, value) => {
  const matchedValue = headers.find((x) => x === value.label) ?? false;

  if (matchedValue) {
    return matchedValue;
  } else {
    const fuzzySearchItem = fuzzySimilarityCheck(value.label, headers);

    return fuzzySearchItem;
  }
};

function findNonMatchingStrings(headers, crossCheckFields) {
  const assignedValues = {};

  for (const item of crossCheckFields) {
    assignedValues[item.assignedValue] = true;
  }

  const result = headers.map((item) => ({
    label: item.label ? item.label : item,
    value: item.label ? item.label : item,
    disabled: !!assignedValues[item.label ? item.label : item],
  }));

  return result;
}

const mappingValuesHandler = (crossCheckFields, csvHeaders, options, csvRecords, valueOptionsMap) => {
  const newCrosscheckFields = [];

  const newHeaders = csvHeaders;

  for (const crossCheckField of crossCheckFields) {
    const assignedValue = checkAssignedValue(newHeaders, crossCheckField);
    const option = options[crossCheckField.name];

    if (assignedValue) {
      const indexOfHeaderToBeRemoved = newHeaders.indexOf(assignedValue);
      newHeaders.splice(indexOfHeaderToBeRemoved, 1);
    }

    const newCrossCheckField = {
      ...crossCheckField,
      assignedValue,
      ...(assignedValue ? { [assignedValue]: crossCheckField.name } : {}),
      valueOptions: option,
    };

    if (assignedValue && crossCheckField.name !== 'features') {
      csvRecords.forEach((row) => {
        if (!valueOptionsMap.has(assignedValue)) {
          valueOptionsMap.set(assignedValue, new Set());
        }

        valueOptionsMap.get(assignedValue).add(row[assignedValue]);
      });
    } else if (assignedValue && crossCheckField.name === 'features') {
      csvRecords.forEach((row) => {
        if (!valueOptionsMap.has(assignedValue)) {
          valueOptionsMap.set(assignedValue, new Set());
        }

        const mileStoneAssignedValue = newCrosscheckFields?.find((x) => x.name === 'milestones')?.assignedValue || '';
        valueOptionsMap.get(assignedValue).add(`${row[mileStoneAssignedValue]} ==> ${row[assignedValue]}`);
      });
    }

    newCrossCheckField.csvValues = [...(valueOptionsMap.get(assignedValue) || new Set())].map((x) => {
      if (crossCheckField.name === 'features') {
        const milestoneName = x.split(' ==> ')[0];

        const isMilestoneAssignedValue =
          newCrosscheckFields
            .find((x) => x.name === 'milestones')
            ?.csvValues?.find((records) => records.label === milestoneName)?.assignedValue?._id || false;

        return isMilestoneAssignedValue && option
          ? {
              label: x,
              value: x,
              assignedValue:
                calculateSimilarity(
                  newCrossCheckField.name === 'features' ? x?.split(' ==> ')[1] : x,
                  option.filter((x) => x.milestoneId === isMilestoneAssignedValue),
                  'label',
                ) || null,
            }
          : {
              label: x,
              value: x,
            };
      } else {
        return option
          ? {
              label: x,
              value: x,
              assignedValue: newCrossCheckField.isCreateAble
                ? { label: x, value: x }
                : calculateSimilarity(
                    newCrossCheckField.name === 'features' ? x?.split(' ==> ')[1] : x,
                    option,
                    'label',
                  ),
            }
          : x;
      }
    });

    newCrosscheckFields.push(newCrossCheckField);
  }

  return newCrosscheckFields;
};

const countValuesForKey = (array, key = 'assignedValue') => {
  return array.reduce((count, obj) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (value) {
        return count + 1;
      }
    }

    return count;
  }, 0);
};

const handleColumnChange = (crosscheckFields, field, newAssignedValue, csvRecords, valueOptionsMap) => {
  const updatedCrossCheckFields = [];

  for (const crosscheckField of crosscheckFields) {
    if (crosscheckField.name === field && field !== 'features') {
      const updatedField = {
        ...crosscheckField,
        assignedValue: newAssignedValue,
        ...(newAssignedValue && { [newAssignedValue]: field }),
      };

      if (crosscheckField.assignedValue && crosscheckField.assignedValue !== newAssignedValue) {
        delete updatedField[crosscheckField.assignedValue];
      }

      if (newAssignedValue) {
        csvRecords.forEach((row) => {
          if (!valueOptionsMap.has(newAssignedValue)) {
            valueOptionsMap.set(newAssignedValue, new Set());
          }

          valueOptionsMap.get(newAssignedValue).add(row[newAssignedValue]);
        });
        updatedField.csvValues = [...(valueOptionsMap.get(newAssignedValue) || new Set())].map((y) => {
          return crosscheckField.valueOptions
            ? {
                label: y,
                value: y,
                assignedValue: updatedField.isCreateAble
                  ? { label: y, value: y }
                  : calculateSimilarity(y, crosscheckField.valueOptions, 'label'),
              }
            : y;
        });
      } else {
        if (updatedField['csvValues']) delete updatedField['csvValues'];
      }

      updatedCrossCheckFields.push(updatedField);
    } else if (crosscheckField.name === 'features' && field === 'milestones') {
      const updatedField = {
        ...crosscheckField,
      };

      if (crosscheckField.assignedValue) {
        csvRecords.forEach((row) => {
          if (!valueOptionsMap.has(crosscheckField.assignedValue)) {
            valueOptionsMap.set(crosscheckField.assignedValue, new Set());
          }

          valueOptionsMap
            .get(crosscheckField.assignedValue)
            .add(`${row[newAssignedValue]} ==> ${row[crosscheckField.assignedValue]}`);
        });

        updatedField.csvValues = [...(valueOptionsMap.get(crosscheckField.assignedValue) || new Set())].map((y) => {
          const milestoneName = y.split(' ==> ')[0];

          const isMilestoneAssignedValue =
            updatedCrossCheckFields
              .find((x) => x.name === 'milestones')
              ?.csvValues?.find((records) => records.label === milestoneName)?.assignedValue?._id || false;

          return isMilestoneAssignedValue && crosscheckField.valueOptions
            ? {
                label: y,
                value: y,
                assignedValue: calculateSimilarity(
                  y?.split(' ==> ')[1],
                  crosscheckField.valueOptions.filter((x) => {
                    return x.milestoneId === isMilestoneAssignedValue;
                  }),
                  'label',
                ),
              }
            : {
                label: y,
                value: y,
              };
        });
      } else {
        if (updatedField['csvValues']) delete updatedField['csvValues'];
      }

      updatedCrossCheckFields.push(updatedField);
    } else if (crosscheckField.name === field && field === 'features') {
      const updatedField = {
        ...crosscheckField,
        assignedValue: newAssignedValue,
        ...(newAssignedValue && { [newAssignedValue]: field }),
      };

      if (crosscheckField.assignedValue && crosscheckField.assignedValue !== newAssignedValue) {
        delete updatedField[crosscheckField.assignedValue];
      }

      if (newAssignedValue) {
        csvRecords.forEach((row) => {
          if (!valueOptionsMap.has(newAssignedValue)) {
            valueOptionsMap.set(newAssignedValue, new Set());
          }

          const mileStoneAssignedValue =
            updatedCrossCheckFields?.find((x) => x.name === 'milestones')?.assignedValue || '';

          valueOptionsMap.get(newAssignedValue).add(`${row[mileStoneAssignedValue]} ==> ${row[newAssignedValue]}`);
        });
        updatedField.csvValues = [...(valueOptionsMap.get(newAssignedValue) || new Set())].map((y) => {
          const milestoneName = y.split(' ==> ')[0];

          const isMilestoneAssignedValue =
            updatedCrossCheckFields
              .find((x) => x.name === 'milestones')
              ?.csvValues?.find((records) => records.label === milestoneName)?.assignedValue?._id || false;

          return isMilestoneAssignedValue && crosscheckField.valueOptions
            ? {
                label: y,
                value: y,
                assignedValue: calculateSimilarity(
                  y?.split(' ==> ')[1],
                  crosscheckField.valueOptions.filter((x) => {
                    return x.milestoneId === isMilestoneAssignedValue;
                  }),
                  'label',
                ),
              }
            : {
                label: y,
                value: y,
              };
        });
      } else {
        if (updatedField['csvValues']) delete updatedField['csvValues'];
      }

      updatedCrossCheckFields.push(updatedField);
    } else {
      updatedCrossCheckFields.push(crosscheckField);
    }
  }

  return updatedCrossCheckFields;
};

const checkMissingDataHandler = (data, properties) => {
  return properties.every((key) =>
    data[key]?.csvValues?.every(
      (csvValue) =>
        csvValue.assignedValue &&
        (typeof csvValue.assignedValue === 'string' || typeof csvValue.assignedValue === 'object'),
    ),
  );
};

const valueFetcher = (allFields, field, record) => {
  try {
    let returnedValue = '';
    let comparedValue = '';
    let featureMilestone = '';

    if (field === 'features') {
      //NOTE: MileStone Data  Gathering as it need to be Compared
      const milestoneColumn = allFields['milestones'];
      const assignedMileStoneHeader = milestoneColumn.assignedValue ?? '';
      const recordMilestoneToBeCheckedFor = record[assignedMileStoneHeader] ?? {};
      featureMilestone = recordMilestoneToBeCheckedFor;
    }

    const column = allFields[field];
    const assignedHeader = column.assignedValue ?? '';
    const recordToBeCheckedFor = record[assignedHeader] ?? {};
    comparedValue = field === 'features' ? `${featureMilestone} ==> ${recordToBeCheckedFor}` : recordToBeCheckedFor;

    const assignedValue = column.csvValues.find((x) => {
      if (typeof x === 'object') {
        return x.label === comparedValue;
      } else {
        return x === comparedValue;
      }
    });

    //NOTE: check if Assigned Value Has a _id
    if (typeof assignedValue === 'string') {
      returnedValue = assignedValue;
    } else {
      returnedValue = assignedValue?.assignedValue?.value || null;
    }

    return returnedValue
      ? [
          'feedback',
          'stepsToReproduce',
          'idealBehaviour',
          'testObjective',
          'preConditions',
          'testSteps',
          'expectedResult',
        ].includes(field)
        ? convertTextToHtmlAndEditorState(returnedValue) || {}
        : ['reportedDate', 'createdDate'].includes(field)
        ? formattedDate(returnedValue, 'yyyy-MM-dd') || formattedDate(new Date(), 'yyyy-MM-dd')
        : returnedValue
      : assignedHeader
      ? ''
      : null;
  } catch (error) {
    console.error(error);

    return false;
  }
};

export {
  checkMissingDataHandler,
  findNonMatchingStrings,
  handleColumnChange,
  mappingValuesHandler,
  valueFetcher,
  countValuesForKey,
};
