import { ContentState, convertToRaw, convertFromHTML } from 'draft-js';

import { isEmpty as _isEmpty } from 'utils/lodash';

export const emailValidate = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email) ? true : 'Invalid Email';
};

export const validateDescription = ({ description }) => {
  if (description?.blocks?.some((x) => x.text !== '') || !_isEmpty(description?.entityMap)) {
    return true;
  }

  return 'Required';
};

export const convertTextToHtmlAndEditorState = (text) => {
  const contentState = ContentState.createFromBlockArray(
    convertFromHTML(text).contentBlocks,
    convertFromHTML(text).entityMap,
  );

  const descriptionContentState = ContentState.createFromText(text);
  const description = convertToRaw(descriptionContentState);

  const contentStateToHtml = convertToRaw(contentState);
  const html = contentStateToHtml.blocks.map((block) => `<p>${block.text}</p>`).join('');

  return { text, html, description: JSON.stringify(description) };
};
