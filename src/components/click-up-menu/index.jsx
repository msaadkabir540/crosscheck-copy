import { useCallback, useState } from 'react';

import { Link, useLocation } from 'react-router-dom';

import { useAppContext } from 'context/app-context';
import { useMode } from 'context/dark-mode';

import { useToaster } from 'hooks/use-toaster';

import tick from 'assets/tick-black.svg';

import style from './menu.module.scss';
import Icon from '../icon/themed-icon';

const ClickUpMenu = ({
  menuData,
  atMostRight,
  noHeader,
  setOpenRow = () => {},
  rightClickedRow,
  setMenuOpen = () => {},
  setRightClickedRecord = () => {},
}) => {
  const { toastSuccess, toastError } = useToaster();
  const [moreClick, setMoreClick] = useState(false);
  const { isDarkMode } = useMode();
  const { userDetails } = useAppContext();
  const location = useLocation();
  const pageUrl = window.location.href;
  const urlObject = new URL(pageUrl);
  const baseUrl = `${urlObject.protocol}//${urlObject.host}`;
  const activeValue = new URLSearchParams(location.search).get('active');
  const testCaseSide = new URLSearchParams(location.search).get('testCaseId');
  const bugSide = new URLSearchParams(location.search).get('bugId');

  // NOTE: Generate links based on the current path
  let newTab;

  switch (location.pathname) {
    case '/test-cases':
      newTab = `${location.pathname}?testCaseId=${rightClickedRow.testCaseId}`;
      break;
    case '/qa-testing':
      newTab = `${location.pathname}?bugId=${rightClickedRow.bugId}`;
      break;
    case '/test-run':
    case '/projects':
      newTab = `${location.pathname}/${rightClickedRow._id}`;
      break;
    default:
      if (noHeader) {
        if (testCaseSide) {
          newTab = `${baseUrl}/test-cases?testCaseId=${rightClickedRow.testCaseId}`;
        } else if (bugSide) {
          newTab = `${baseUrl}/qa-testing?bugId=${rightClickedRow.bugId}`;
        } else {
          switch (activeValue) {
            case '1':
              newTab = `${baseUrl}/test-cases?testCaseId=${rightClickedRow.testCaseId}`;
              break;
            case '2':
              newTab = `${baseUrl}/qa-testing?bugId=${rightClickedRow.bugId}`;
              break;
            case '3':
              newTab = `${baseUrl}/test-run/${rightClickedRow._id}`;
              break;
            default:
              newTab = '/';
              break;
          }
        }
      } else if (!noHeader) {
        if (testCaseSide) {
          newTab = `${baseUrl}/test-cases?testCaseId=${rightClickedRow.testCaseId}`;
        } else if (bugSide) {
          newTab = `${baseUrl}/qa-testing?bugId=${rightClickedRow.bugId}`;
        }
      } else {
        newTab = '/';
      }

      break;
  }

  // NOTE: Generate text based on the current path
  let idText;

  switch (location.pathname) {
    case '/test-cases':
      idText = rightClickedRow.testCaseId;
      break;
    case '/qa-testing':
      idText = rightClickedRow.bugId;
      break;
    case '/test-run':
      idText = rightClickedRow.runId;
      break;
    case '/projects':
      idText = rightClickedRow.idSeries;
      break;
    default:
      if (noHeader) {
        if (testCaseSide) {
          idText = rightClickedRow.testCaseId;
        } else if (bugSide) {
          idText = rightClickedRow.bugId;
        } else {
          switch (activeValue) {
            case '1':
              idText = rightClickedRow.testCaseId;
              break;
            case '2':
              idText = rightClickedRow.bugId;
              break;
            case '3':
              idText = rightClickedRow.runId;
              break;
            default:
              idText = '/';
              break;
          }
        }
      } else if (!noHeader) {
        if (testCaseSide) {
          idText = rightClickedRow.testCaseId;
        } else if (bugSide) {
          idText = rightClickedRow.bugId;
        }
      } else {
        // NOTE: Handle other paths if needed
        idText = '/';
      }

      break;
  }

  // NOTE: Generate links based on the current path
  let linkText;

  switch (location.pathname) {
    case '/test-cases':
      linkText = `${pageUrl}?testCaseId=${rightClickedRow.testCaseId}`;
      break;
    case '/qa-testing':
      linkText = `${baseUrl}/qa-testing?bugId=${rightClickedRow.bugId}`;
      break;
    case '/test-run':
    case '/projects':
      linkText = `${pageUrl}/${rightClickedRow._id}`;
      break;
    default:
      if (noHeader) {
        if (testCaseSide) {
          linkText = `${baseUrl}/test-cases?testCaseId=${rightClickedRow.testCaseId}`;
        } else if (bugSide) {
          linkText = `${baseUrl}/qa-testing?bugId=${rightClickedRow.bugId}`;
        } else {
          switch (activeValue) {
            case '1':
              linkText = `${baseUrl}/test-cases?testCaseId=${rightClickedRow.testCaseId}`;
              break;
            case '2':
              linkText = `${baseUrl}/qa-testing?bugId=${rightClickedRow.bugId}`;
              break;
            case '3':
              linkText = `${baseUrl}/test-run/${rightClickedRow._id}`;
              break;
            default:
              linkText = '/';
              break;
          }
        }
      } else if (!noHeader) {
        if (testCaseSide) {
          linkText = `${baseUrl}/test-cases?testCaseId=${rightClickedRow.testCaseId}`;
        } else if (bugSide) {
          linkText = `${baseUrl}/qa-testing?bugId=${rightClickedRow.bugId}`;
        }
      } else {
        linkText = '/';
      }

      break;
  }

  const copyToClipboard = useCallback(
    (copyType) => {
      let textToCopy = '';

      if (copyType === 'id') {
        textToCopy = idText;
      } else if (copyType === 'link') {
        textToCopy = linkText;
      }

      if (textToCopy) {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();

        try {
          document.execCommand('copy');
          toastSuccess('Copied');
        } catch (err) {
          toastError('Unable to copy to clipboard', err);
        } finally {
          document.body.removeChild(textarea);
        }
      }
    },
    [idText, linkText, toastError, toastSuccess],
  );

  const handleClose = useCallback(() => {
    setRightClickedRecord && setRightClickedRecord({});
    setOpenRow({});
    setMenuOpen(false);
    setMoreClick(false);
  }, [setMenuOpen, setOpenRow, setRightClickedRecord]);

  const handleSetMoreClickTrue = useCallback(() => {
    setMoreClick(true);
  }, []);

  const handleCopyId = useCallback(() => {
    copyToClipboard('id');
    handleClose();
  }, [copyToClipboard, handleClose]);

  const handleCopyLink = useCallback(() => {
    copyToClipboard('link');
    handleClose();
  }, [copyToClipboard, handleClose]);

  return (
    <>
      <div className={`${style.menu} ${userDetails?.darkMode && style.darkMode}`}>
        <div className={style.headerDiv}>
          <p onClick={handleCopyId} className={`${style.pClassBorderLeft} ${style.pClass}`}>
            Copy ID
          </p>
          <p onClick={handleCopyLink}>Copy Link</p>
          <Link to={newTab} target="_blank">
            <p onClick={handleClose} className={`${style.pClassBorderRight} ${style.pClass}`}>
              New Tab
            </p>
          </Link>
        </div>

        {menuData?.map((ele) => (
          <div
            className={style.body}
            style={{
              borderBottom: ele.border,
              paddingBottom: ele.border ? '5px' : '',
            }}
            key={Math.random()}
          >
            {ele?.bodyData?.map((el) => (
              <div
                className={`${style.hover}`}
                key={Math.random}
                style={{
                  pointerEvents: el?.isDisabled && 'none',
                  opacity: el?.isDisabled && '0.5',
                }}
                onClick={el.click}
              >
                <div
                  className={`${style.spaceBtwClass} ${style.inner}`}
                  onClick={el.text !== 'Change Status' ? handleClose : handleSetMoreClickTrue}
                >
                  <div
                    className={`${el.text === 'Delete' && style.redICon} ${isDarkMode && style.innerIconInvert} ${style.inner}`}
                  >
                    {el.icon}
                    <p
                      className={style.p}
                      style={{
                        color: el.text === 'Delete' ? '#F80101' : '',
                      }}
                    >
                      {el.text}
                    </p>
                  </div>
                  {el.text === 'Change Status' && <Icon name={'ArrowHeadRightGrey'} iconClass={style.editColor} />}
                  {el.text === 'Change Status' && moreClick && (
                    <div
                      className={style.menuMain}
                      style={{
                        left: atMostRight ? '-58%' : '101%',
                      }}
                    >
                      {el.text === 'Change Status' &&
                        el?.moreOptions?.map((options) => (
                          <div onClick={handleClose} key={Math.random()}>
                            <p
                              className={`${
                                rightClickedRow?.status === options?.subText ? style.pSelected : style.pInner
                              }`}
                              style={{
                                height: el.text === 'Change Status' && '30px',
                              }}
                              onClick={options?.optionClick}
                            >
                              {options?.subText}
                              {rightClickedRow?.status === options?.subText && <img src={tick} alt="tick" />}
                            </p>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default ClickUpMenu;
