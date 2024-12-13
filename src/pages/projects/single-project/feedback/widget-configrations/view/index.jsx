import { useCallback, useState } from 'react';

import style from './style.module.scss';
import Icon from '../../../../../../components/icon/themed-icon';

const Index = ({ watch }) => {
  const [viewForm, setViewForm] = useState(false);

  const toggleViewForm = useCallback(() => {
    setViewForm((prev) => !prev);
  }, [setViewForm]);

  const closeForm = useCallback(() => {
    setViewForm(false);
  }, [setViewForm]);

  return (
    <div className={style.view}>
      <p>Your Website or Application Page</p>
      <div className={`${style.buttonWrapper} ${style[watch('widgetPosition')]}`}>
        <div
          className={style.button}
          onClick={toggleViewForm}
          style={{
            backgroundColor: watch('widgetButtonColor'),
          }}
        >
          <span style={{ color: watch('textColor') }}>{watch('widgetTitle')}</span>
        </div>
      </div>

      {viewForm && (
        <div className={style.viewForm}>
          <div className={style.form}>
            <div className={style.header}>
              <p> {watch('widgetTitle')}</p>
              <div onClick={closeForm}>
                <Icon name={'CrossIcon'} />
              </div>
            </div>
            <div className={style.body}>
              <p>
                {watch('title')} {watch('titleReq') && <span>*</span>}
              </p>
              <span className={style.span}>Write title here</span>
              <p>
                {' '}
                {watch('feedback')} {watch('feedbackReq') && <span>*</span>}
              </p>
              <span className={style.desc}>Write Feedback here</span>
              <p>
                {' '}
                {watch('attachment')} {watch('attachmentReq') && <span>*</span>}
              </p>
              <span className={style.attachment}>
                Attach your file <Icon name={'AttachPill'} iconClass={style.iconStroke1} />
              </span>

              <button
                className={style.buttonSubmit}
                style={{
                  backgroundColor: watch('widgetButtonColor'),
                  color: watch('textColor'),
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
