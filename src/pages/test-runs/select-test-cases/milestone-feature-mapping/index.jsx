import { useCallback } from 'react';

import Checkbox from 'components/checkbox';
import Icon from 'components/icon/themed-icon';

import { values as _values } from 'utils/lodash';

import style from '../modal.module.scss';

const SingleMiletoneOption = ({ mileStoneEle, state, index, setViewSelected }) => {
  const onClick = useCallback(() => mileStoneEle.onExpand(mileStoneEle._id), [mileStoneEle]);

  const handleShowClick = useCallback(
    (e) => {
      mileStoneEle.onClicked(e, mileStoneEle._id);
      setViewSelected(false);
    },
    [mileStoneEle, setViewSelected],
  );

  return (
    <div key={mileStoneEle._id}>
      <div className={style.filterFlex}>
        <div className={style.filterInner}>
          <div
            className={style.arrowUpDown}
            onClick={onClick}
            style={{ transform: mileStoneEle.expanded ? 'rotate(90deg)' : '' }}
          >
            <Icon name={'ArrowHeadRight'} />
          </div>
          <div
            className={style.checkMiletone}
            style={{
              ...(mileStoneEle.clicked && {
                padding: '5px 0px',
                border: '1px solid #11103D',
                backgroundColor: '#F3F3F3',
              }),
            }}
          >
            <div className={style.filterInner2}>
              <Checkbox
                name="checkbox"
                checked={state.milestoneOptions[mileStoneEle._id].checked}
                partial={state.milestoneOptions[mileStoneEle._id].partial}
                handleChange={state.milestoneOptions[mileStoneEle._id].onChecked}
                data-cy={`testrun-testcasemodal-milestone-checkbox${index}`}
              />
              <span className={style.mileStoneTextWrapper} onClick={handleShowClick}>
                <span className={style.miletsoneCount}>{mileStoneEle.label}</span>
                <span className={style.recordCount}>
                  ({mileStoneEle.selectedCount}/{mileStoneEle.totalCount})
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {mileStoneEle.expanded &&
        _values(mileStoneEle.mileStonesFeaturesOptions)?.map((featureEle) => (
          <SingleFeatureOption {...{ featureEle, mileStoneEle, state, setViewSelected }} key={featureEle?._id} />
        ))}
    </div>
  );
};

const SingleFeatureOption = ({ featureEle, mileStoneEle, state, setViewSelected }) => {
  const featureClickHandler = useCallback(
    (e) => {
      featureEle.onClicked(e, mileStoneEle._id, featureEle._id);
      setViewSelected(false);
    },
    [featureEle, mileStoneEle, setViewSelected],
  );

  return (
    <div
      key={featureEle._id}
      className={`${style.filterFlex} ${style.filterflexExpand}`}
      style={{
        ...(featureEle.clicked && {
          padding: '5px 0px',
          border: '1px solid #11103D',
          backgroundColor: '#F3F3F3',
        }),
      }}
    >
      <div className={style.filterInnerChild}>
        <Checkbox
          name="checkboxChild"
          checked={state.milestoneOptions[mileStoneEle._id].mileStonesFeaturesOptions[featureEle._id].checked}
          partial={state.milestoneOptions[mileStoneEle._id].mileStonesFeaturesOptions[featureEle._id].partial}
          handleChange={state.milestoneOptions[mileStoneEle._id].mileStonesFeaturesOptions[featureEle._id].onChecked}
          data-cy={`testrun-testcasemodal-milestone-checkboxchild${featureEle?._id}`}
        />
        <span className={style.mileStoneTextWrapper} onClick={featureClickHandler}>
          <span className={style.miletsoneCount}>{featureEle.label}</span>
          <span className={style.recordCount}>
            ({featureEle.selectedCount}/{featureEle.totalCount})
          </span>
        </span>
      </div>
    </div>
  );
};

export default SingleMiletoneOption;
