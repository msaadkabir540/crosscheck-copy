import { useState } from 'react';

import MilestoneSection from './milestone-section';
import FeatureSection from './feature-section';
import style from './milestone.module.scss';

const Milestone = () => {
  const [selectedMilestone, setSelectedMilestones] = useState('');

  return (
    <>
      <div className={style.main}>
        <div
          className={` ${selectedMilestone ? style.grid : style.grid1} ${selectedMilestone ? style.animatedGrid : ''}`}
        >
          <div className={style.milestoneDiv}>
            <MilestoneSection selectedMilestone={selectedMilestone} setSelectedMilestones={setSelectedMilestones} />
          </div>
          <div
            className={style.animatedGrid}
            style={{
              width: selectedMilestone ? '100%' : '0px',
            }}
          >
            {!!selectedMilestone && (
              <FeatureSection selectedMilestone={selectedMilestone} setSelectedMilestones={setSelectedMilestones} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Milestone;
