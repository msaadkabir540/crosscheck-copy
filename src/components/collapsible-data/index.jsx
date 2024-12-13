import { useState } from 'react';

import Icon from 'components/icon/themed-icon';
import Tooltip from 'components/tooltip';

import { statusCodes, statusColors } from '../../constants';
import style from './collapsible.module.scss';

const CollapsibleData = ({ data }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyText = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1000);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };

  const [show, setShow] = useState(true);
  const [show2, setShow2] = useState(true);
  const [show3, setShow3] = useState(true);

  return (
    <>
      <div className={style.main}>
        <div className={style.title} onClick={() => setShow(!show)}>
          <div
            style={{
              rotate: show ? '' : ' 270deg',
              background: 'none',
              border: 'none',
            }}
          >
            <Icon name="ArrowDownFilled" />
          </div>
          <span>General</span>
        </div>
        {show && (
          <>
            <div className={style.child}>
              {data.url && (
                <div className={style.row}>
                  <div className={style.left}>Request Url</div>

                  <div className={style.right}>
                    <Tooltip tooltip={isCopied ? 'copied!' : 'copy'} position={'left'}>
                      <p className={style.textSm} style={{ cursor: 'pointer' }} onClick={() => copyText(data?.url)}>
                        {data?.url}
                      </p>
                    </Tooltip>
                  </div>
                </div>
              )}
              {data.method && (
                <div className={style.row}>
                  <div className={style.left}>Request Method:</div>
                  <div className={style.right}>{data.method}</div>
                </div>
              )}
              {data.statusCode && (
                <div className={style.row}>
                  <div className={style.left}>Status Code:</div>
                  <div className={style.right}>
                    <span
                      style={{
                        display: 'inline-block',
                        width: '10px',
                        height: '10px',
                        background: statusColors[data.statusCode],
                        borderRadius: '50%',

                        marginRight: '10px',
                      }}
                    />
                    {`${data.statusCode} ${statusCodes[data.statusCode]}`}
                  </div>
                </div>
              )}
              {data?.ip && (
                <div className={style.row}>
                  <div className={style.left}>Remote Address:</div>
                  <div className={style.right}>{data.ip}</div>
                </div>
              )}
              <div className={style.row}>
                <div className={style.left}>Referrer Policy:</div>
                <div className={style.right}>strict-origin-when-cross-origin</div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className={style.main}>
        <div className={style.title} onClick={() => setShow2(!show2)}>
          <div
            style={{
              rotate: show2 ? '' : ' 270deg',
              background: 'none',
              border: 'none',
            }}
          >
            <Icon name="ArrowDownFilled" />
          </div>

          <span>Response Headers</span>
        </div>
        {show2 && (
          <div className={style.child}>
            {data.responseHeaders && data.responseHeaders?.length ? (
              data?.responseHeaders?.map((x) => (
                <div className={style.row} key={x.name}>
                  <div className={style.left}>{x.name}:</div>
                  <div className={style.right}>{x.value}</div>
                </div>
              ))
            ) : (
              <span style={{ marginLeft: '10px' }}>No Data</span>
            )}
          </div>
        )}
      </div>
      <div className={style.main}>
        <div className={style.title} onClick={() => setShow3(!show3)}>
          <div
            style={{
              rotate: show3 ? '' : ' 270deg',
              background: 'none',
              border: 'none',
            }}
          >
            <Icon name="ArrowDownFilled" />
          </div>

          <span>Request Headers</span>
        </div>
        {show3 && (
          <div className={style.child}>
            <div className={style.row}>
              <div className={style.left}>Accept:</div>
              <div className={style.right}>application/json, text/plain, */*</div>
            </div>
            {data.requestHeaders && data.requestHeaders?.length ? (
              data.requestHeaders.map((x) => (
                <div className={style.row} key={x.name}>
                  <div className={style.left}>{x.name}:</div>
                  <div className={style.right}>{x.value}</div>
                </div>
              ))
            ) : (
              <span style={{ marginLeft: '10px' }}>No Data</span>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CollapsibleData;
