import { useCallback, useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

// NOTE: comonents
import Menu from 'components/menu';
import Icon from 'components/icon/themed-icon';

import { useProfileTestCasesSummaryMilleStoneWise, useTestCasesSummaryMilleStoneWise } from 'api/v1/projects/dashboard';

import TestCasesStatus from './test-case-stats';
// NOTE: css
import style from './testcase.module.scss';

const TestCaseSummary = ({ filters }) => {
  const { id } = useParams();
  const [more, setMore] = useState({ open: false, view: 'table' });

  const [type, setType] = useState({ open: false, view: 'Percentage' });
  const [feature, setFeature] = useState('');
  const [selectedMilestone, setselectedMilestone] = useState('');

  const handleTypeViewPercentage = useCallback(() => {
    setType((prev) => ({ ...prev, view: 'Percentage', open: false }));
  }, [setType]);

  const handleTypeViewWeightage = useCallback(() => {
    setType((prev) => ({ ...prev, view: 'Weightage', open: false }));
  }, [setType]);

  const handleTypeViewCount = useCallback(() => {
    setType((prev) => ({ ...prev, view: 'Count', open: false }));
  }, [setType]);

  const menu = [
    {
      title: 'Percentage',
      click: handleTypeViewPercentage,
    },
    {
      title: 'Weightage',
      click: handleTypeViewWeightage,
    },
    {
      title: 'Count',
      click: handleTypeViewCount,
    },
  ];

  const handleMoreViewChart = useCallback(() => {
    setMore((prev) => ({ ...prev, view: 'chart', open: false }));
  }, [setMore]);

  const handleMoreViewTable = useCallback(() => {
    setMore((prev) => ({ ...prev, view: 'table', open: false }));
  }, [setMore]);

  const menu2 = [
    {
      title: 'Chart View',
      click: handleMoreViewChart,
    },
    {
      title: 'Table View',
      click: handleMoreViewTable,
    },
  ];

  const {
    refetch,
    isLoading,
    data: _mileStoneWiseData,
  } = useTestCasesSummaryMilleStoneWise({
    id,
    filters: {
      ...(filters?.testedVersion && { testedVersion: filters?.testedVersion }),
      ...(filters?.testedEnvironment && { testedEnvironment: filters?.testedEnvironment }),
    },
  });
  const { data: _featureWiseData, isLoading: _isFeatureLoading } = useProfileTestCasesSummaryMilleStoneWise(feature);

  const handleClearFeatureAndMilestone = useCallback(() => {
    setFeature('');
    setselectedMilestone('');
  }, [setFeature, setselectedMilestone]);

  const handleOpenType = useCallback(() => {
    setType((prev) => ({ ...prev, open: true }));
  }, [setType]);

  const handleOpenMore = useCallback(() => {
    setMore((prev) => ({ ...prev, open: true }));
  }, [setMore]);

  const handleCloseType = useCallback(() => {
    setType((prev) => ({ ...prev, open: false }));
  }, [setType]);

  const handleCloseMore = useCallback(() => {
    setMore((prev) => ({ ...prev, open: false }));
  }, [setMore]);

  useEffect(() => {
    refetch();
  }, [refetch, filters, id]);

  return (
    <div className={style.main}>
      <div className={style.header}>
        <div className={style.titleClass}>
          <h2>
            {feature ? (
              <div className={style.arrowLeft}>
                <div onClick={handleClearFeatureAndMilestone}>
                  <Icon name={'ArrowLeft'} iconClass={style.icon2} />
                </div>

                <p> {selectedMilestone} Test Cases Summary </p>
              </div>
            ) : (
              'Test Cases Summary'
            )}
          </h2>
        </div>
        <div className={style.content}>
          <div className={style.typeClass}>
            <div className={style.day} onClick={handleOpenType}>
              {type?.view}
            </div>

            {type?.open && (
              <div className={style.menuDiv}>
                <Menu menu={menu} active={style.active} />
              </div>
            )}
          </div>
          <div className={style.typeClass}>
            <div onClick={handleOpenMore}>
              <Icon name={'expand'} iconClass={style.icon} />
            </div>
            <div onClick={handleOpenMore}>
              <Icon name={'MoreInvertIcon'} iconClass={style.icon1} />
            </div>

            {more?.open && (
              <div className={style.menuDiv}>
                <Menu menu={menu2} active={style.active} />
              </div>
            )}
          </div>
        </div>
      </div>
      {feature ? (
        <TestCasesStatus
          view={more?.view}
          type={type?.view}
          data={_featureWiseData?.featureTestCasesCount || []}
          totalData={_featureWiseData?.totalCombined || {}}
          isLoading={_isFeatureLoading}
          feature={feature}
        />
      ) : (
        <TestCasesStatus
          view={more?.view}
          type={type?.view}
          data={_mileStoneWiseData?.milestoneTestCasesCount || []}
          totalData={_mileStoneWiseData?.totalCombined || {}}
          isLoading={isLoading}
          setFeature={setFeature}
          setselectedMilestone={setselectedMilestone}
          feature={feature}
        />
      )}

      {type?.open && <div className={style.backdropDiv} onClick={handleCloseType}></div>}
      {more?.open && <div className={style.backdropDiv} onClick={handleCloseMore}></div>}
    </div>
  );
};

export default TestCaseSummary;
