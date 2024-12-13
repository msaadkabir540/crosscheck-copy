import { formattedDate } from 'utils/date-handler';

import style from './more.module.scss';

const More = ({ data }) => {
  return (
    <>
      {bugData(data)?.map((ele) => (
        <div className={style.main} key={ele?.id}>
          <div className={style.innerLeft}>
            <span>{ele.title}</span>
          </div>
          <div className={style.innerRight}>
            <span>{ele.para}</span>
          </div>
        </div>
      ))}
    </>
  );
};

export default More;

const bugData = (data) => [
  {
    id: 1,
    title: 'Testing Type',
    para: data?.testingType,
  },
  {
    id: 2,
    title: 'Issue Type',
    para: `${data.issueType} (${data.issueType === 'Reopened Bug' ? data?.reOpenId?.bugId : ''})`,
  },
  {
    id: 3,
    title: 'Bugs Subtype',
    para: data.bugSubType,
  },
  {
    id: 4,
    title: 'Related Test Case',
    para: data?.relatedTestCases[0]?.testCaseId,
  },
  {
    id: 5,
    title: 'Related Test Run',
    para: (data?.relatedTestRuns || [])?.length,
  },
  {
    id: 6,
    title: 'Reported by',
    para: data?.reportedBy?.name,
  },
  {
    id: 7,
    title: 'Reported at',
    para: formattedDate(data?.reportedAt, 'dd MMM, yy'),
  },
];
