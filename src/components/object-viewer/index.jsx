import { memo } from 'react';

import JsonView from 'react18-json-view';

import style from './style.module.scss';

import 'react18-json-view/src/style.css';

const ObjectViewer = ({ data }) => {
  let parsedData;

  try {
    parsedData = typeof data === 'string' ? JSON.parse(data) : data;
  } catch (e) {
    console.error('Invalid JSON:', e);
    parsedData = {};
  }

  return <JsonView className={style.fontSize} src={parsedData} />;
};

export default memo(ObjectViewer);
