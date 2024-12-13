import { useMemo, useState } from 'react';

import draftToHtml from 'draftjs-to-html';

import { formattedDate } from 'utils/date-handler';

import tick from 'assets/tick.svg';
import cross from 'assets/cross-red.svg';
import tickActive from 'assets/tick-active.svg';
import crossActive from 'assets/cross-active.svg';
import blocked from 'assets/blocked.svg';
import blockedActive from 'assets/blocked-active.svg';

import style from './drawer.module.scss';
import Icon from '../icon/themed-icon';

const TestCaseCard = ({ data, setBugModal, onStatusChange }) => {
  const [more, setMore] = useState(false);

  const collapse = useMemo(
    () => [
      {
        title: 'Test Objective',
        para: data?.testObjective?.description && draftToHtml(JSON.parse(data?.testObjective?.description)),
      },
      {
        title: 'Pre Conditions',
        para: data?.preConditions?.description && draftToHtml(JSON.parse(data?.preConditions?.description)),
      },
      {
        title: 'Test Steps',
        para: data?.testSteps?.description && draftToHtml(JSON.parse(data?.testSteps?.description)),
      },
      {
        title: 'Expected Results',
        para: data?.expectedResults?.description && draftToHtml(JSON.parse(data?.expectedResults?.description)),
      },
    ],
    [data],
  );

  return (
    <>
      <div className={style.testCasesDiv}>
        <div
          className={style.imgImg}
          style={{
            transform: more ? 'rotate(90deg)' : '',
          }}
          onClick={() => setMore(!more)}
        >
          <Icon name={'RoundArrowRight'} />
        </div>
        {more ? (
          <>
            <div className={style.moreFlex}>
              <h6>{data.testCaseId}</h6>
              <p>{data?.testType}</p>
            </div>
            {collapse?.map((ele) => (
              <div className={style.moreMore} key={ele.title}>
                <h6 className={style.h6}>{ele.title}</h6>
                <p
                  className={style.text}
                  dangerouslySetInnerHTML={{
                    __html: ele.para,
                  }}
                />
              </div>
            ))}
          </>
        ) : (
          <>
            <div className={style.moreFlex}>
              <h6>{data.testCaseId}</h6>
            </div>
            <p
              dangerouslySetInnerHTML={{
                __html: data?.testObjective?.description && draftToHtml(JSON.parse(data?.testObjective?.description)),
              }}
            ></p>
          </>
        )}
        <div className={style.flexInner}>
          <div className={style.moreInner}>
            <div className={style.text}>
              <p>
                <span>Last Tested by : </span>{' '}
                {data?.lastTestedAt &&
                  `${data?.lastTestedBy?.name} on ${formattedDate(data?.lastTestedAt, 'dd MMM, yyyy')}`}
              </p>
            </div>
            <div className={style.moreInnerImages}>
              <div className={style.circle}>
                <p>{data.weightage}</p>
              </div>
              <div className={style.btns}>
                <img
                  src={data?.status === 'Passed' ? tickActive : tick}
                  alt=""
                  onClick={() => data?.status !== 'Passed' && onStatusChange(data?._id, 'Passed')}
                />
                <img
                  src={data?.status === 'Failed' ? crossActive : cross}
                  alt=""
                  onClick={async () => {
                    data?.status !== 'Failed' && setBugModal(data?._id);

                    // NOTE:   modalDismissed &&
                    // NOTE: data?.status !== 'Failed' && setBugModal(true);
                  }}
                />
                <img
                  src={data?.status === 'Blocked' ? blockedActive : blocked}
                  alt=""
                  onClick={() => data?.status !== 'Blocked' && onStatusChange(data?._id, 'Blocked')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestCaseCard;
