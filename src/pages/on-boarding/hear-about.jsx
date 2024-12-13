import React from 'react';

import { isEqual } from 'lodash';

import SelectBox from 'components/select-box';

import { hearSelectOptions, hearTags } from './helper';
import style from './boarding.module.scss';
import Tag from './tag';

const WorkspaceHearing = ({ selectedSource, control, setSelectedSource }) => {
  return (
    <>
      <div className={style.workspace}>
        <h3>How did you hear about us?</h3>
        <div className={style.innerFlex}>
          {hearTags?.map((ele) => (
            <Tag
              key={ele?.id}
              ele={ele?.name}
              selected={selectedSource}
              setSelected={setSelectedSource}
              dataCyPrefix={'onboard-workspace-hear-about-us'}
            />
          ))}
        </div>
        <div className={style.small}>
          <SelectBox
            control={control}
            name={'source'}
            isSearchable={false}
            options={hearSelectOptions}
            placeholder="Select"
            isClearable={false}
            dynamicClass={style.zIndexClass}
          />
        </div>
      </div>
    </>
  );
};

export default React.memo(WorkspaceHearing, (prevProps, nextProps) => isEqual(prevProps, nextProps));
