import draftToHtml from 'draftjs-to-html';

import style from './detail.module.scss';

const Detail = ({
  feedback,
  reproduceSteps,
  idealBehaviour,
  testEvidence,
  testEvidenceKey,
  testedVersion,
  testedDevice,
  testedEnvironment,
  history,
}) => {
  return (
    <div className={style.main}>
      <div className={style.headings}>
        <span>Feedback</span>
      </div>
      <div className={style.content}>
        <p
          dangerouslySetInnerHTML={{
            __html: feedback?.description && draftToHtml(JSON.parse(feedback?.description)),
          }}
        ></p>
      </div>
      <div className={style.headings}>
        <span>Steps to Reproduce</span>
      </div>
      <div className={style.content}>
        <p
          dangerouslySetInnerHTML={{
            __html: reproduceSteps?.description && draftToHtml(JSON.parse(reproduceSteps?.description)),
          }}
        ></p>
      </div>
      <div className={style.headings}>
        <span>Ideal Behaviour</span>
      </div>
      <div className={style.content}>
        <p
          dangerouslySetInnerHTML={{
            __html: idealBehaviour?.description && draftToHtml(JSON.parse(idealBehaviour?.description)),
          }}
        ></p>
      </div>
      <div className={style.headings}>
        <span>Test Evidence</span>
      </div>
      <div className={style.content}>
        <p>
          <a className={style.evidenceKeyClass} href={testEvidence} target="_blank" rel="noreferrer">
            {testEvidenceKey}
          </a>
        </p>
      </div>
      <div className={style.headings}>
        <span>Tested Version</span>
      </div>
      <div className={style.content}>
        <p>{testedVersion}</p>
      </div>
      <div className={style.headings}>
        <span>Tested Device</span>
      </div>
      <div className={style.content}>
        <p>{testedDevice}</p>
      </div>
      <div className={style.headings}>
        <span>Tested Environment</span>
      </div>
      <div className={style.content}>
        <p>{testedEnvironment}</p>
      </div>
      <div className={style.headings}>
        <span>Latest Test Evidence</span>
      </div>
      <div className={style.content}>
        <p>
          <a
            href={history[0]?.reTestEvidence || testEvidence}
            target="_blank"
            className={style.evidenceKeyClass}
            rel="noreferrer"
          >
            {history[0]?.reTestEvidenceKey || testEvidenceKey}
          </a>
        </p>
      </div>
      <div className={style.headings}>
        <span>Latest Tested Version</span>
      </div>
      <div className={style.content}>
        <p>{history[0]?.reTestVersion?.name || testedVersion}</p>
      </div>
    </div>
  );
};

export default Detail;
