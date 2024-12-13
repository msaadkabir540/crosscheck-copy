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
    title: 'Bugs Subtype',
    para: data.bugSubType,
  },
  {
    id: 3,
    title: 'Related Test Case',
    para: data?.relatedTestCases[0]?.testCaseId,
  },
  {
    id: 4,
    title: 'Related Test Run',
    para: (data?.relatedTestRuns || [])?.length,
  },
  {
    id: 5,
    title: 'Reported by',
    para: data?.reportedBy?.name,
  },
  {
    id: 6,
    title: 'Reported at',
    para: formattedDate(data?.reportedAt, 'dd MMM, yy'),
  },
];
