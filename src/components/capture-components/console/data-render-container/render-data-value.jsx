import React from 'react';

import { parse } from 'flatted';

const RenderDataValue = ({ data, renderDataValue }) => {
  return renderDataValue(parse(data));
};

export default React.memo(RenderDataValue);
