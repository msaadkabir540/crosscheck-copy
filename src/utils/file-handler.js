import { toast } from 'react-toastify';
import accepts from 'attr-accept';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Papa from 'papaparse';

import { envObject } from '../constants/environmental';

export const convertBase64Image = (file) => {
  if (!file) return '';

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// NOTE: Create a function to fetch the Blob data
async function fetchBlobData(blobUrl) {
  const response = await fetch(blobUrl);
  const blobData = await response.blob();

  return blobData;
}

// NOTE: Create a function to convert Blob data to base64
export async function convertBlobToBase64(blobUrl, mimeType) {
  const blobData = await fetchBlobData(blobUrl);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      resolve(`data:${mimeType};base64,${reader.result.split(',')[1]}`); // NOTE: Extract base64 part from the result
    };

    reader.onerror = reject;
    reader.readAsDataURL(blobData);
  });
}

export const handleFile = async (e, allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i) => {
  const base64 = await convertBase64Image(e.target.files[0]);

  if (!allowedExtensions.exec(e.target.value)) {
    toast.error(`File Must be an image`);

    return false;
  }

  if (e.target.files[0].size / 1024 / 1024 > 5) {
    toast.error(`File size should be equal or less than 5mb`);

    return false;
  }

  return base64;
};

export const fileCaseHandler = (type) => {
  switch (type) {
    case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
      return 'docx';
    case 'vnd.openxmlformats-officedocument.presentationml.presentation':
      return 'pptx';
    case 'vnd.ms-powerpoint':
      return 'ppt';
    case 'vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return 'xlsx';
    case 'vnd.ms-excel':
      return 'xls';
    case 'plain':
      return 'txt';
    case 'x-zip-compressed':
      return 'zip';
    case 'x-matroska':
      return 'mkv';
    case 'x-ms-wmv':
      return 'wmv';
    case 'vnd.rar':
      return 'rar';
    default:
      return type;
  }
};

export const exportAsPNG = (componentRef) => {
  const elementToCapture = componentRef.current;
  if (!elementToCapture) return;

  html2canvas(elementToCapture).then((canvas) => {
    const pngUrl = canvas.toDataURL();
    const a = document.createElement('a');
    a.href = pngUrl;
    a.download = 'Bugs_Report.png';
    a.click();
  });
};

export const exportAsPDF = (componentRef) => {
  const doc = new jsPDF({
    orientation: 'landscape', // NOTE: Set the orientation to landscape
  });

  // NOTE: Reference to the component element you want to export
  const elementToCapture = componentRef.current;
  if (!elementToCapture) return;

  // NOTE: Use html2canvas to convert the component to a PNG
  html2canvas(elementToCapture).then((canvas) => {
    const pngDataUrl = canvas.toDataURL('image/png');

    // NOTE: Calculate the dimensions for the PDF page based on the PNG's size
    const imgWidth = doc.internal.pageSize.getWidth(); // NOTE: Use page width for landscape
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // NOTE: Add the PNG image to the PDF
    doc.addImage(pngDataUrl, 'PNG', 0, 0, imgWidth, imgHeight);

    // NOTE: Save the PDF
    doc.save('Bugs_Report.pdf');
  });
};

export const imageChangeHandler = async (e) => {
  const file = e?.target?.files[0];

  if (file) {
    const blob = new Blob([e?.target?.files[0]], { type: file.type });
    const blobUrl = URL?.createObjectURL(blob);

    const base64 = await convertBase64Image(e?.target?.files[0]);

    return { name: file?.name, url: blobUrl, base64 };
  }
};

export const downloadCSV = (data, filename = 'resultCSV') => {
  const url = URL.createObjectURL(new Blob([data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename}.csv`); // NOTE: Replace with desired filename and extension
  document.body.appendChild(link);
  link.click();
  // NOTE: Cleanup the temporary URL
  window.URL.revokeObjectURL(url);
};

export const convertCSVToJsonData = (csvData) => {
  const lines = csvData.split('\n');
  const headers = lines[0].split(',').map((header) => header.trim().replace(/^"(.*)"$/, '$1'));

  const result = {
    header: headers,
    headerOptions: headers?.map((heading) => {
      return { label: heading, value: heading };
    }),
    records: [],
  };

  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    const currentLine = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

    for (let j = 0; j < headers.length; j++) {
      const key = headers[j];
      const value = currentLine[j]?.trim().replace(/^"(.*)"$/, '$1');
      obj[key] = value;
    }

    result.records.push(obj);
  }

  return result;
};

export const handleCsvToJsonFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const csvData = e.target.result;
      const jsonData = convertCSVToJsonData(csvData);
      resolve(jsonData);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsText(file);
  });
};

export const convertBase64CSVToJson = async (base64DataUri) => {
  return new Promise((resolve, reject) => {
    try {
      const [, base64Data] = base64DataUri.match(/^data:text\/csv;base64,(.*)$/);

      if (!base64Data) {
        throw new Error('Invalid base64 data URI');
      }

      const csvString = atob(base64Data);

      Papa.parse(csvString, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false,
        encoding: 'utf8',
        complete: (result) => {
          const jsonData = result.data.map((row) => {
            if (row.Description) {
              row.Description = row.Description.replace(/__NEWLINE__/g, '\n');
            }

            return row;
          });

          resolve(jsonData);
        },
        error: (error) => {
          reject(error.message || 'Error parsing CSV');
        },
      });
    } catch (error) {
      console.error(error);
      reject('Error converting base64 to CSV', error);
    }
  });
};

export const getInvalidTypeRejectionErr = (accept) => {
  accept = Array.isArray(accept) && accept.length === 1 ? accept[0] : accept;
  const messageSuffix = Array.isArray(accept) ? `one of ${accept.join(', ')}` : accept;

  return {
    code: 'FILE_INVALID_TYPE',
    message: `File type must be ${messageSuffix}`,
  };
};

export const getTooLargeRejectionErr = (maxSize) => {
  return {
    code: 'FILE_TOO_LARGE',
    message: `File is larger than ${maxSize} ${maxSize === 1 ? 'byte' : 'bytes'}`,
  };
};

export const getTooSmallRejectionErr = (minSize) => {
  return {
    code: 'FILE_TOO_SMALL',
    message: `File is smaller than ${minSize} ${minSize === 1 ? 'byte' : 'bytes'}`,
  };
};

export function isMIMEType(v) {
  return v === 'audio/*' || v === 'video/*' || v === 'image/*' || v === 'text/*' || /\w+\/[-+.\w]+/g.test(v);
}

export function isExt(v) {
  return /^.*\.[\w]+$/.test(v);
}

export function acceptPropAsAcceptAttr(accept) {
  if (isDefined(accept)) {
    return (
      Object.entries(accept)
        .reduce((a, [mimeType, ext]) => [...a, mimeType, ...ext], [])
        //NOTE: Silently discard invalid entries as pickerOptionsFromAccept warns about these
        .filter((v) => isMIMEType(v) || isExt(v))
        .join(',')
    );
  }

  return undefined;
}

export function isFileTypeAccepted(file, accept) {
  const acceptAttr = acceptPropAsAcceptAttr(accept);
  const isAcceptable = file.type === 'application/x-moz-file' || accepts(file, acceptAttr);

  return [isAcceptable, isAcceptable ? null : getInvalidTypeRejectionErr(acceptAttr)];
}

export function isFileSizeAllowed(file, maxSize, minSize) {
  if (isDefined(file.size)) {
    if (isDefined(minSize) && isDefined(maxSize)) {
      if (file.size > maxSize) return [false, getTooLargeRejectionErr(maxSize)];
      if (file.size < minSize) return [false, getTooSmallRejectionErr(minSize)];
    } else if (isDefined(minSize) && file.size < minSize) return [false, getTooSmallRejectionErr(minSize)];
    else if (isDefined(maxSize) && file.size > maxSize) return [false, getTooLargeRejectionErr(maxSize)];
  }

  return [true, null];
}

function isDefined(value) {
  return value !== undefined && value !== null;
}

export const generateCURLCommand = (url) => {
  try {
    const headers = {
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      Authorization: localStorage.getItem('accessToken'),
      Connection: 'keep-alive',
      'If-None-Match': 'W/"115a-deaYxtzRtbvIt4e6ZkhhZlJIQSw"',
      Origin: `${envObject.BASE_URL}`,
      Referer: `${envObject.BASE_URL}`,
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site',
      'User-Agent': navigator.userAgent,
      ...(localStorage.getItem('user')
        ? { 'last-accessed-workspace': JSON.parse(localStorage.getItem('user')).lastAccessedWorkspace }
        : {}),
    };

    let curlCommand = `curl -X GET "${url}" \\\n`;

    if (headers) {
      for (let header in headers) {
        curlCommand += `-H '${header}: ${headers[header]}' \\\n`;
      }
    }

    return curlCommand;
  } catch (error) {
    console.error(error);
  }
};
