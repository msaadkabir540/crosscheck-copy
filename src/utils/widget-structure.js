const CrossIcon = `<svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.18755 10.8334C1.08452 10.8334 0.98381 10.8028 0.898143 10.7456C0.812476 10.6884 0.745705 10.607 0.706277 10.5118C0.666849 10.4167 0.656535 10.3119 0.676639 10.2109C0.696743 10.1098 0.746363 10.017 0.819221 9.94419L10.4441 0.319255C10.5418 0.221567 10.6742 0.166687 10.8124 0.166687C10.9505 0.166687 11.083 0.221567 11.1807 0.319255C11.2784 0.416942 11.3333 0.549435 11.3333 0.687586C11.3333 0.825737 11.2784 0.958229 11.1807 1.05592L1.55588 10.6809C1.50755 10.7293 1.45014 10.7677 1.38693 10.7938C1.32372 10.82 1.25596 10.8334 1.18755 10.8334Z" fill="#696F7A"/>
<path d="M10.8124 10.8334C10.744 10.8334 10.6762 10.82 10.613 10.7938C10.5498 10.7677 10.4924 10.7293 10.444 10.6809L0.819192 1.05592C0.721506 0.958229 0.666626 0.825737 0.666626 0.687586C0.666626 0.549435 0.721506 0.416942 0.819192 0.319255C0.916879 0.221567 1.04937 0.166687 1.18752 0.166687C1.32567 0.166687 1.45816 0.221567 1.55585 0.319255L11.1807 9.94419C11.2536 10.017 11.3032 10.1098 11.3233 10.2109C11.3434 10.3119 11.3331 10.4167 11.2936 10.5118C11.2542 10.607 11.1874 10.6884 11.1018 10.7456C11.0161 10.8028 10.9154 10.8334 10.8124 10.8334Z" fill="#696F7A"/>
</svg>
`;

const AttachIcon = `<svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.2191 5.8311L6.62415 10.4261C6.06125 10.989 5.29776 11.3053 4.50167 11.3053C3.70557 11.3053 2.94209 10.989 2.37917 10.4261C1.81624 9.8632 1.5 9.0997 1.5 8.3036C1.5 7.5075 1.81624 6.74405 2.37917 6.1811L6.97415 1.58611C7.34945 1.21083 7.85845 1 8.38915 1C8.9199 1 9.4289 1.21083 9.80415 1.58611C10.1794 1.96139 10.3903 2.47039 10.3903 3.00111C10.3903 3.53184 10.1794 4.04083 9.80415 4.41611L5.20417 9.0111C5.01653 9.19875 4.76203 9.30415 4.49667 9.30415C4.23131 9.30415 3.97681 9.19875 3.78917 9.0111C3.60153 8.82345 3.49611 8.569 3.49611 8.3036C3.49611 8.03825 3.60153 7.78375 3.78917 7.5961L8.03415 3.35611" stroke="#8B909A" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const widgetPosition = `
justify-content: flex-end !important;
align-items: center !important;`;
const buttonTitle = `Report an Issue`;
const buttonBgColor = `#f96e6e`;
const buttonTextColor = `#E5E5E5`;
const titleText = `Title`;
const isTitleReq = true;
const descriptionLabel = `Feedback`;
const isDescriptionRequired = false;
let attachmentLabel = `Attachment`;
const isAttachmentRequired = false;
let formIsOpen = false;

// NOTE: ------------------------*Widget Button*----------------------------------------
export const createButton = () => {
  // NOTE: NOTE:creating widget Buttons
  const widgetButton = document.createElement(`div`);
  // NOTE: setting Attributes for the widgetButton
  widgetButton.setAttribute(`class`, `widgetButton`);
  widgetButton.setAttribute(`id`, `widgetButton`);
  //NOTE: adding widget buttons styles
  widgetButton.style.cssText = `min-width: 30px;
        pointer-events: all;
        max-width: 40px;
        min-height: 150px;
        max-height: 150px;
        padding: 7px;
        margin: 0;
        cursor: pointer;
        border-radius: 3px;
        background-color: ${buttonBgColor};
        display: flex;
        align-items: center;
        justify-content: center;`;

  const widgetButtonText = createWidgetButtonText({
    buttonTitle,
    buttonTextColor,
  });
  //NOTE:appending child
  widgetButton.appendChild(widgetButtonText);

  return widgetButton;
};

const createWidgetButtonText = ({ buttonTitle, buttonTextColor }) => {
  //NOTE:widgetButton Text
  const widgetButtonText = document.createElement(`span`);
  widgetButtonText.setAttribute(`class`, `widgetButtonText`);
  widgetButtonText.setAttribute(`id`, `widgetButtonText`);
  //NOTE:adding a text
  widgetButtonText.innerHTML = `${buttonTitle}`;
  //NOTE:adding widget button Text Styles
  widgetButtonText.style.cssText = `color: ${buttonTextColor || '#ffffff'}; 
        word-break: break-all;
        transform-origin: center; /* Set the transformation origin to center */
        transform: rotate(180deg);
        writing-mode: vertical-rl; /* Vertical text writing mode */
        text-orientation: mixed; /* This sets the text orientation */
        font-family: Public Sans;
        font-size: 12px;
        font-weight: 400;
        text-align: center;
        letter-spacing: 1px;`;

  return widgetButtonText;
};

// NOTE: ------------------------*Form *----------------------------------------
// NOTE: Form Validation
const setError = (field, parent) => {
  field.style.border = `1px solid red`;
  parent.style.color = `red`;
};

// NOTE: widgetFormHeader
const createWidgetFormHeader = () => {
  const widgetFormHeader = document.createElement(`div`);
  widgetFormHeader.setAttribute(`id`, `widgetFormHeader`);
  widgetFormHeader.setAttribute(`class`, `widgetFormHeader`);

  widgetFormHeader.style.cssText = ` margin-bottom : 10px;
              display: flex;
                justify-content: space-between;
                align-items: center;`;
  // NOTE: widgetFormHeaderText
  const widgetFormHeaderText = document.createElement(`span`);
  widgetFormHeaderText.setAttribute(`id`, `widgetFormHeaderText`);
  widgetFormHeaderText.setAttribute(`class`, `widgetFormHeaderText`);

  // NOTE: adding a text
  widgetFormHeaderText.innerHTML = `${buttonTitle}`;

  widgetFormHeaderText.style.cssText = `
          font-family: Public Sans;
          font-size: 18px;
          font-weight: 500;
          line-height: 16px;
          letter-spacing: 0em;
          text-align: left;
          color: #2d2d32;`;
  // NOTE: widgetFormHeaderIcon
  const widgetFormHeaderIcon = document.createElement(`div`);
  widgetFormHeaderIcon.setAttribute(`id`, `widgetFormHeaderIcon`);
  widgetFormHeaderIcon.setAttribute(`class`, `widgetFormHeaderIcon`);

  // NOTE:  adding a svg
  widgetFormHeaderIcon.style.cssText = `cursor:pointer`;
  widgetFormHeaderIcon.innerHTML = CrossIcon;

  // NOTE:Event Listeners For Header Icon
  widgetFormHeaderIcon.addEventListener(`click`, function () {
    const widgetFormWrapper = document.getElementById('widgetFormWrapper');
    formIsOpen = !formIsOpen;
    if (widgetFormWrapper) widgetFormWrapper.style.display = formIsOpen ? `block` : `none`;
  });

  widgetFormHeader.append(widgetFormHeaderText);
  widgetFormHeader.append(widgetFormHeaderIcon);

  return widgetFormHeader;
};

// NOTE:widgetBody
const createWidgetFormBody = () => {
  let titleValue = ``;
  let descriptionValue = ``;
  let attachmentValue = ``;
  const widgetBody = document.createElement(`div`);
  widgetBody.setAttribute(`id`, `widgetBody`);
  widgetBody.setAttribute(`class`, `widgetBody`);

  widgetBody.style.cssText = ` margin-top: 10px;
                display: flex;
                flex-direction: column;
                gap: 8px;`;

  // NOTE:Form First Field
  const createTitle = () => {
    // NOTE:widgetBodyFieldTitle
    const widgetBodyTitleText = document.createElement(`p`);
    widgetBodyTitleText.setAttribute(`id`, `widgetBodyTitleText`);
    widgetBodyTitleText.setAttribute(`class`, `widgetBodyTitleText`);
    widgetBodyTitleText.innerHTML = `${titleText}`;
    widgetBodyTitleText.style.cssText = `
          margin:3px;
          font-family: Public Sans;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0em;
          text-align: left;`;

    // NOTE:widgetBodyTitleRequired
    const widgetBodyTitleRequired = document.createElement(`span`);
    widgetBodyTitleRequired.setAttribute(`id`, `widgetBodyTitleRequired`);
    widgetBodyTitleRequired.setAttribute(`class`, `widgetBodyTitleRequired`);
    widgetBodyTitleRequired.innerHTML = isTitleReq ? `*` : ``;

    widgetBodyTitleRequired.style.cssText = `
    font-family: Public Sans;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0em;
    text-align: left;`;

    // NOTE:adding textField
    widgetBodyTitleText.appendChild(widgetBodyTitleRequired);

    // NOTE:widgetBodyTitleField
    const widgetBodyTitleField = document.createElement(`input`);
    widgetBodyTitleField.setAttribute(`id`, `widgetBodyTitleField`);
    widgetBodyTitleField.setAttribute(`class`, `widgetBodyTitleField`);
    widgetBodyTitleField.placeholder = `Write Here...`;
    widgetBodyTitleField.style.cssText = `
                  background-color: #ffffff;
                  border: 1px solid #d6d6d6;
                  border-radius: 5px;
                  padding: 7px;
                  color: #000;
                  font-family: Public Sans;
                  font-size: 14px;
                  font-weight: 400;
                  line-height: 12px;
                  letter-spacing: 0em;
                  text-align: left;
                  outline: none;`;
    widgetBodyTitleField.addEventListener(`change`, (e) => {
      widgetBodyTitleField.style.border = `1px solid #d6d6d6`;
      widgetBodyTitleText.style.color = `#000000`;

      titleValue = e?.target?.value;
    });

    return { widgetBodyTitleText, widgetBodyTitleField };
  };

  // NOTE: Form 2nd Field
  const createDescription = () => {
    // NOTE:widgetBodyDescriptionText
    const widgetBodyDescriptionText = document.createElement(`p`);
    widgetBodyDescriptionText.setAttribute(`id`, `widgetBodyDescriptionText`);
    widgetBodyDescriptionText.setAttribute(`class`, `widgetBodyDescriptionText`);
    widgetBodyDescriptionText.innerHTML = `${descriptionLabel}`;
    widgetBodyDescriptionText.style.cssText = `
    margin:3px;
    font-family: Public Sans;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0em;
    text-align: left;`;

    // NOTE:widgetBodyFieldRequired
    const widgetBodyDescriptionRequired = document.createElement(`span`);
    widgetBodyDescriptionRequired.setAttribute(`id`, `widgetBodyDescriptionRequired`);
    widgetBodyDescriptionRequired.setAttribute(`class`, `widgetBodyDescriptionRequired`);
    widgetBodyDescriptionRequired.innerHTML = isDescriptionRequired ? `*` : ``;
    widgetBodyDescriptionRequired.style.cssText = `
    font-family: Public Sans;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0em;
    text-align: left;`;
    widgetBodyDescriptionText.appendChild(widgetBodyDescriptionRequired);

    // NOTE: widgetBodyDescriptionTextArea
    const widgetBodyDescriptionTextArea = document.createElement(`textarea`);
    widgetBodyDescriptionTextArea.setAttribute(`id`, `widgetBodyDescriptionTextArea`);
    widgetBodyDescriptionTextArea.setAttribute(`class`, `widgetBodyDescriptionTextArea`);
    widgetBodyDescriptionTextArea.placeholder = `Write Here...`;
    widgetBodyDescriptionTextArea.rows = 5;
    widgetBodyDescriptionTextArea.style.cssText = `
                  resize:none !important;
                  background-color: #ffffff;
                  border: 1px solid #d6d6d6;
                  border-radius: 5px;
                  padding: 7px;
                  color: #000000;
                  font-family: Public Sans;
                  font-size: 14px;
                  font-weight: 400;
                  outline: none;`;

    widgetBodyDescriptionTextArea.addEventListener(`change`, (e) => {
      widgetBodyDescriptionText.style.color = `#000000`;
      widgetBodyDescriptionTextArea.style.border = `1px solid #d6d6d6`;
      descriptionValue = e.target.value;
    });

    return {
      widgetBodyDescriptionText,
      widgetBodyDescriptionTextArea,
    };
  };

  // NOTE: Form 3rd Field
  const createAttachment = () => {
    // NOTE: widgetBodyAttachmentText
    const widgetBodyAttachmentText = document.createElement(`p`);
    widgetBodyAttachmentText.setAttribute(`id`, `widgetBodyAttachmentText`);
    widgetBodyAttachmentText.setAttribute(`class`, `widgetBodyAttachmentText`);
    widgetBodyAttachmentText.innerHTML = `${attachmentLabel}`;
    widgetBodyAttachmentText.style.cssText = `
          margin:3px;
          font-family: Public Sans;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0em;
          text-align: left;`;

    // NOTE: widgetBodyAttachmentRequired
    const widgetBodyAttachmentRequired = document.createElement(`span`);
    widgetBodyAttachmentRequired.setAttribute(`id`, `widgetBodyAttachmentRequired`);
    widgetBodyAttachmentRequired.setAttribute(`class`, `widgetBodyAttachmentRequired`);
    widgetBodyAttachmentRequired.innerHTML = isAttachmentRequired ? `*` : ``;
    widgetBodyAttachmentRequired.style.cssText = `
    font-family: Public Sans;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0em;
    text-align: left;`;
    widgetBodyAttachmentText.appendChild(widgetBodyAttachmentRequired);

    // NOTE: uploaderAttachment
    const uploaderAttachment = document.createElement(`input`);
    uploaderAttachment.setAttribute(`id`, `uploaderAttachment`);
    uploaderAttachment.setAttribute(`class`, `uploaderAttachment`);
    uploaderAttachment.setAttribute(`type`, `file`);
    uploaderAttachment.style.display = `none`;
    widgetBodyAttachmentText.appendChild(uploaderAttachment);

    // NOTE: widgetBodyAttachmentBox
    const widgetBodyAttachmentBox = document.createElement(`label`);
    widgetBodyAttachmentBox.setAttribute(`id`, `widgetBodyAttachmentBox`);
    widgetBodyAttachmentBox.setAttribute(`class`, `widgetBodyAttachmentBox`);
    widgetBodyAttachmentBox.addEventListener(`click`, () => {
      uploaderAttachment.click();
    });
    const widgetBodyAttachmentFileText = document.createElement(`span`);
    widgetBodyAttachmentFileText.style.cssText = `text-wrap: nowrap;
    overflow-x: hidden;`;
    const widgetBodyAttachmentFileIcon = document.createElement(`span`);
    widgetBodyAttachmentFileText.innerHTML = `Attach your File`;
    widgetBodyAttachmentBox.appendChild(widgetBodyAttachmentFileText);
    widgetBodyAttachmentFileIcon.innerHTML = AttachIcon;
    widgetBodyAttachmentFileIcon.style.cursor = `pointer`;
    widgetBodyAttachmentBox.appendChild(widgetBodyAttachmentFileIcon);
    widgetBodyAttachmentBox.style.cssText = `
                  background-color: #ffffff;
                  border: 1px solid #d6d6d6;
                  border-radius: 5px;
                  padding: 7px;
                  color: #8b909a;
                  font-family: Public Sans;
                  font-size: 14px;
                  font-weight: 400;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;`;

    // NOTE: Event Listeners For Attachment
    uploaderAttachment.addEventListener(`change`, (e) => {
      try {
        const file = e?.target?.files?.[`0`];
        const reader = new FileReader();

        reader.onload = function async() {
          // NOTE: Extract the Base64 data
          const base64String = reader.result;
          // NOTE: Display the Base64 string in the textarea
          attachmentValue = base64String;
          widgetBodyAttachmentFileText.innerHTML = file?.name;
          widgetBodyAttachmentFileText.style.color = '#000000';
          widgetBodyAttachmentFileIcon.innerHTML = CrossIcon;

          widgetBodyAttachmentFileIcon.addEventListener(`click`, (e) => {
            e.stopPropagation();
            attachmentValue = ``;
            widgetBodyAttachmentFileText.innerHTML = `Attach Your File Here`;
            widgetBodyAttachmentFileText.style.color = '#8b909a';
            widgetBodyAttachmentFileIcon.innerHTML = AttachIcon;
          });
          widgetBodyAttachmentText.style.color = `#000000`;
          widgetBodyAttachmentBox.style.border = `1px solid #d6d6d6`;
        };

        // NOTE: Read the selected file as Data URL
        reader.readAsDataURL(file);
      } catch (error) {
        alert(`Error converting to Base64.`);
      }
    });

    return {
      widgetBodyAttachmentText,
      widgetBodyAttachmentBox,
    };
  };

  // NOTE: Form Submit Button Field
  const createSubmitButton = () => {
    const widgetSubmitButton = document.createElement(`button`);
    widgetSubmitButton.setAttribute(`id`, `widgetSubmitButton`);
    widgetSubmitButton.setAttribute(`class`, `widgetSubmitButton`);
    widgetSubmitButton.innerHTML = `Submit`;

    widgetSubmitButton.style.cssText = `
    margin-top: 10px;
    padding: 10px;
    background-color: ${buttonBgColor};
    border-radius: 5px;
    border: none;
    color: ${buttonTextColor};
    font-family: Public Sans;
    font-size: 14px;
    font-weight: 600;
    line-height: 14px;
    letter-spacing: 0em;
    text-align: center;`;

    // NOTE: Event Listeners For Submit Button
    widgetSubmitButton.addEventListener(`click`, async () => {
      try {
        let hasError = false;

        if (isTitleReq && titleValue === ``) {
          setError(widgetBodyTitleField, widgetBodyTitleText);
          hasError = true;
        }

        if (isDescriptionRequired && descriptionValue === ``) {
          setError(widgetBodyDescriptionTextArea, widgetBodyDescriptionText);
          hasError = true;
        }

        if (isAttachmentRequired && attachmentValue === ``) {
          setError(widgetBodyAttachmentBox, widgetBodyAttachmentText);
          hasError = true;
        }

        if (hasError) {
          throw new Error(`Form Validation Failed`);
        } else {
          ('');
        }
      } catch (error) {
        console.error(error);
      }
    });

    return widgetSubmitButton;
  };

  const { widgetBodyTitleText, widgetBodyTitleField } = createTitle();
  const { widgetBodyDescriptionText, widgetBodyDescriptionTextArea } = createDescription();
  const { widgetBodyAttachmentText, widgetBodyAttachmentBox } = createAttachment();

  const widgetFormSubmitButton = createSubmitButton();

  widgetBody.appendChild(widgetBodyTitleText);
  widgetBody.appendChild(widgetBodyTitleField);
  widgetBody.appendChild(widgetBodyDescriptionText);
  widgetBody.appendChild(widgetBodyDescriptionTextArea);
  widgetBody.appendChild(widgetBodyAttachmentText);
  widgetBody.appendChild(widgetBodyAttachmentBox);
  widgetBody.appendChild(widgetFormSubmitButton);

  return widgetBody;
};

export const createForm = () => {
  const widgetFormWrapper = document.createElement(`div`);
  // NOTE: adding widget form  wrapper attributes
  widgetFormWrapper.setAttribute(`id`, `widgetFormWrapper`);
  widgetFormWrapper.setAttribute(`class`, `widgetFormWrapper`);

  // NOTE:   adding widget form  wrapper Styles
  widgetFormWrapper.style.cssText = `position: absolute;
          bottom: 10px;
          right: 10px; 
          display: none;
          `;

  // NOTE:   widgetForm
  const widgetForm = document.createElement(`div`);
  widgetForm.setAttribute(`id`, `widgetForm`);
  widgetForm.setAttribute(`class`, `widgetForm`);

  widgetForm.style.cssText = `min-width: 351px;  max-width: 351px;
            min-height: 350px;
            max-height: 380px;
            overflow: auto;
            background-color: #fff;
            border-radius: 10px;
            border: 1px solid #d6d6d6;
            padding: 10px ;
            pointer-events: all;`;

  widgetForm.append(createWidgetFormHeader());
  widgetForm.append(createWidgetFormBody());

  widgetFormWrapper.append(widgetForm);

  return widgetFormWrapper;
};

// NOTE:   --------------------------*Inserting in Dom *--------------------------------------

function widgetImplementation() {
  // NOTE:    making a mainWrapper
  const mainWrapper = document.createElement(`div`);
  // NOTE:   setting Attributes for the mainWrapper
  mainWrapper.setAttribute(`class`, `mainQMSWidgetWrapper`);
  mainWrapper.setAttribute(`id`, `mainQMSWidgetWrapper`);
  mainWrapper.style.cssText = `width: 100vw;
    height: 100vh;
    display: flex;
    pointer-events: none;
    position:fixed;
    top:0;
    right0;
    z-index: 1000;
    ${
      // NOTE:    widget button adding positioning class
      widgetPosition && widgetPosition
    }
    `;
  // NOTE:      Creating Button element
  const widgetButton = createButton();
  // NOTE:    Creating Form Element
  const widgetFormWrapper = createForm();
  // NOTE:   appending Button and Form to Main Wrapper
  mainWrapper.appendChild(widgetButton);
  mainWrapper.appendChild(widgetFormWrapper);
  // NOTE:   adding event Listeners
  widgetButton.addEventListener(`click`, () => {
    formIsOpen = !formIsOpen;
    widgetFormWrapper.style.display = formIsOpen ? `block` : `none`;
  });
  // NOTE:   appending the Main Wrapper in Body of DOM
  document.body.appendChild(mainWrapper);
}

// NOTE:    Wrap your code in an event listener for DOMContentLoaded
document.addEventListener(`DOMContentLoaded`, function () {
  var body = document.body;
  body.style.margin = '0';
  body.style.overflow = 'hidden';

  // NOTE:    Create a new div element
  var newDiv = document.createElement('div');
  newDiv.setAttribute('id', 'mainBody');
  newDiv.style.cssText = `height: 100vh;
  overflow-y: auto;`;

  // NOTE:    Iterate through all the child nodes of the body
  while (body.firstChild) {
    // NOTE:    Move each child node to the new div
    newDiv.appendChild(body.firstChild);
  }

  // NOTE:    Add the new div immediately after the body
  body.insertBefore(newDiv, body.firstChild);
  widgetImplementation();
});
