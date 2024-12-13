import { useCallback, useEffect, useRef, useState } from 'react';

import Loader from 'components/loader';
import SkeletonCard from 'components/skeleton-loaders/card-skeleton';
import Icon from 'components/icon/themed-icon';

import style from './captures.module.scss';
import CaptureFilters from '../filter-chips';
import CheckCard from '../card';
import StartTestingModal from '../start-reporting-bugs';

const FilteredCaptures = ({ viewBy }) => {
  const containerRef = useRef();
  const [checks, setChecks] = useState({ checks: [], count: 0 });
  const [loading, setLoading] = useState(false);
  const [isCheckLoading, setIsCheckLoading] = useState(false);
  const [openOptionIndex, setOpenOptionIndex] = useState(null);

  const [reportingIndex, setReportingIndex] = useState(null);
  const [isReportBug, setIsReportBug] = useState(false);

  const CONTAINER_REF_CURRENT = containerRef?.current;

  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight } = CONTAINER_REF_CURRENT;

    if (scrollHeight - Math.ceil(scrollTop) <= clientHeight + 1) {
      if (checks?.count !== checks?.checks?.length && !isCheckLoading) {
        setLoading(true);
        CONTAINER_REF_CURRENT?.removeEventListener('scroll', handleScroll);
      }
    }
  }, [isCheckLoading, checks, CONTAINER_REF_CURRENT]);

  useEffect(() => {
    if (!isCheckLoading) {
      CONTAINER_REF_CURRENT?.addEventListener('scroll', handleScroll);
    } else if (isCheckLoading) {
      CONTAINER_REF_CURRENT?.removeEventListener('scroll', handleScroll);
      setLoading(false);
    }

    return () => {
      CONTAINER_REF_CURRENT?.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef, checks, isCheckLoading, handleScroll, CONTAINER_REF_CURRENT]);

  const handleCheckLoading = useCallback((l) => {
    setIsCheckLoading(l);
  }, []);

  const handleIsReportBugCloseClick = useCallback(() => {
    setIsReportBug(false);
    setReportingIndex(null);
  }, [setIsReportBug]);

  return (
    <>
      <div className={style.mainClass}>
        <div className={style.flexDiv}>
          <h2>Checks ({`${checks?.count || 0}`})</h2>
        </div>
        <div className={style.exportDiv}>
          <CaptureFilters
            viewBy={viewBy}
            setIsCheckLoading={handleCheckLoading}
            loading={loading}
            setChecks={setChecks}
          />
        </div>
      </div>
      {checks?.checks && checks?.checks?.length ? (
        <div ref={containerRef} className={style.contentGrid}>
          {checks?.checks?.map((ele, index) => (
            <CheckCard
              key={ele?._id}
              ele={ele}
              tabIndex={index}
              openOptionIndex={openOptionIndex}
              setOpenOptionIndex={setOpenOptionIndex}
              setOpenBug={setIsReportBug}
              setReportingIndex={setReportingIndex}
              reportingIndex={index}
            />
          ))}
          {isCheckLoading && <Loader tableMode />}
        </div>
      ) : (
        <>
          {!isCheckLoading && checks?.count === 0 ? (
            <div className={style.no_record_found_container}>
              <Icon name={'no-found'} />
            </div>
          ) : (
            <SkeletonCard count={6} />
          )}
        </>
      )}

      {isReportBug && (
        <StartTestingModal
          open={isReportBug}
          handleClose={handleIsReportBugCloseClick}
          source={checks?.checks[reportingIndex]?.source}
        />
      )}
    </>
  );
};

export default FilteredCaptures;
