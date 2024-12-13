import { toast } from 'react-toastify';

import { envObject } from 'constants/environmental';

const baseUrl = `${envObject?.BASE_URL}/test-cases`;

const copyTestCaseToClipboard = async (data) => {
  try {
    const textArea = document.createElement('textarea');

    const formattedText = `
     Test Case ID: ${data.testCaseId} ${baseUrl}?testCaseId=${data.testCaseId}
     Status: ${data.status}
     State: ${data.state}
     Test Objective:
      ${data.testObjective.text}
     Preconditions:
      ${data.preConditions.text}
     Test Steps: 
     ${data.testSteps.text}
     Expected Result:
      ${data.expectedResults.text}
     Created By:
      ${data.createdBy.name}`;

    textArea.value = formattedText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    toast.success('Copied');
  } catch (error) {
    console.error('Error copying Test Case data to clipboard:', error);
  }
};

export { copyTestCaseToClipboard };
