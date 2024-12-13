import PropTypes from 'prop-types';
import draftToHtml from 'draftjs-to-html';

import style from './detail.module.scss';

const Detail = ({ data }) => {
  const { testObjective, testSteps, preConditions, expectedResults } = data;

  return (
    <div className={style.main}>
      <div className={style.headings}>
        <span>Objective</span>
      </div>
      <div className={style.content}>
        <p
          dangerouslySetInnerHTML={{
            __html: testObjective?.description && draftToHtml(JSON.parse(testObjective?.description)),
          }}
        ></p>
      </div>
      <div className={style.headings}>
        <span>Pre conditions</span>
      </div>
      <div className={style.content}>
        <p
          dangerouslySetInnerHTML={{
            __html: preConditions?.description && draftToHtml(JSON.parse(preConditions?.description)),
          }}
        ></p>
      </div>
      <div className={style.headings}>
        <span>Test Steps</span>
      </div>
      <div className={style.content}>
        <p
          dangerouslySetInnerHTML={{
            __html: testSteps?.description && draftToHtml(JSON.parse(testSteps?.description)),
          }}
        ></p>
      </div>
      <div className={style.headings}>
        <span>Expected Result</span>
      </div>
      <div className={style.content}>
        <p
          dangerouslySetInnerHTML={{
            __html: expectedResults?.description && draftToHtml(JSON.parse(expectedResults?.description)),
          }}
        ></p>
      </div>
    </div>
  );
};

Detail.propTypes = {
  data: PropTypes.any.isRequired,
};

export default Detail;
