import React from 'react';

import { isEqual } from 'lodash';

import SelectBox from 'components/select-box';

import { workingPeopleData, workingPeopleOptions } from './helper';
import style from './boarding.module.scss';
import Tag from './tag';

const WorkspaceWorking = ({ selectedPeople, setSelectedPeople, control }) => {
  return (
    <>
      <div className={style.workspace}>
        <h3>How many people will you be working with?</h3>
        <div className={style.innerFlex}>
          {workingPeopleData?.map((ele) => (
            <Tag
              key={ele?.id}
              ele={ele.range}
              selected={selectedPeople}
              setSelected={setSelectedPeople}
              dataCyPrefix={'onboard-workspace-avatar-ranges'}
            />
          ))}
        </div>
        <div className={style.small}>
          <SelectBox
            control={control}
            name={'peopleWorking'}
            options={workingPeopleOptions}
            placeholder="Select"
            isClearable={false}
            isSearchable={false}
            dynamicClass={style.btnZindex}
          />
        </div>
      </div>
    </>
  );
};

export default React.memo(WorkspaceWorking, (prevProps, nextProps) => isEqual(prevProps, nextProps));
