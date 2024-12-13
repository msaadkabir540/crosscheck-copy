import { useState, useEffect, useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import Menu from 'components/menu';
import Checkbox from 'components/checkbox';
import Permissions from 'components/permissions';
import MobileMenu from 'components/mobile-menu';
import TableModal from 'components/table-modal';
import Loader from 'components/loader';

import { useGetDevReport } from 'api/v1/dashboard/dashboard';

import style from './report.module.scss';
import { useProjectOptions } from '../helper';
import Icon from '../../../../components/icon/themed-icon';

const DevReport = ({ userDetails }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [tableModal, setTableModal] = useState(false);
  const [tableModalType, setTableModalType] = useState('');
  const [checkedUsers, setCheckedUsers] = useState([]);
  const [report, setReport] = useState({});
  const { data = {} } = useProjectOptions();
  const { devOptions = [] } = data;

  const [filters, setFilters] = useState({
    allDevUserIds: userDetails?.role === 'QA' ? [userDetails?.id] : [],
  });

  // NOTE: getReport
  const { mutateAsync: _getAllDevReport, isLoading: _isGettingDev } = useGetDevReport();

  const fetchDevReport = async (filters) => {
    try {
      const response = await _getAllDevReport(filters);
      setReport(response?.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDevReport(filters);
  }, [filters]);

  const checker = (id) => {
    if (id === '-select-all-') {
      checkedUsers?.length === devOptions.length - 1
        ? setCheckedUsers([])
        : setCheckedUsers(() => devOptions.filter((x) => x.value !== '-select-all-').map((x) => x.value));
    } else {
      setCheckedUsers((pre) => (pre.includes(id) ? pre.filter((x) => x !== id) : [...pre, id]));
    }
  };

  const userMenu = devOptions?.map((item) => ({
    compo: item.checkbox ? (
      <Checkbox
        checked={
          item?.value === '-select-all-'
            ? checkedUsers?.length === devOptions?.length - 1
            : checkedUsers?.includes(item?.value)
        }
        handleChange={() => {
          checker(item?.value);
        }}
      />
    ) : null,

    title: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginLeft: '5px' }}>
        {item?.image ? (
          <img style={{ borderRadius: '50%' }} alt="icon" height={24} width={24} src={item?.image} />
        ) : (
          item?.imagAlt && <div className={style.imgDiv}>{item?.imagAlt}</div>
        )}
        {item.label || 'Default Title'}
      </div>
    ),
    click: () => {
      checker(item?.value);
    },
  }));

  const filteredHandler = (props) => {
    const queryParams = new URLSearchParams({
      bugBy: checkedUsers || [],
      ...props,
    }).toString();

    navigate({
      pathname: '/home',
      search: queryParams.toString(),
    });
  };

  const handleOpen = useCallback(() => {
    setUser(true);
    setIsOpen(true);
  }, [setUser, setIsOpen]);

  const handleCloseTableModal = useCallback(() => {
    filteredHandler({ status: ['Closed'] }, 'bugs', true);
    setTableModal(true);
    setTableModalType('bugs');
  }, [filteredHandler, setTableModal, setTableModalType]);

  const handleOpenTableModal = useCallback(() => {
    filteredHandler({ status: ['Open'] }, 'bugs', true);
    setTableModalType('bugs');
    setTableModal(true);
  }, [filteredHandler, setTableModal, setTableModalType]);

  const handleOpenMoalForBugs = useCallback(() => {
    filteredHandler({ status: ['Reproducible'] }, 'bugs', true);
    setTableModalType('bugs');
    setTableModal(true);
  }, [filteredHandler, setTableModal, setTableModalType]);

  const handleOpenMoalForBugsAndStausBlocked = useCallback(() => {
    filteredHandler({ status: ['Blocked'] }, 'bugs', true);
    setTableModalType('bugs');
    setTableModal(true);
  }, [filteredHandler, setTableModal, setTableModalType]);

  const handleOpenMoalForBugsAndStausNeedToDiscuss = useCallback(() => {
    filteredHandler({ status: ['Need To Discuss'] }, 'bugs', true);
    setTableModalType('bugs');
    setTableModal(true);
  }, [filteredHandler, setTableModal, setTableModalType]);

  const handleOpenMoalForBugsAndBugTypeUI = useCallback(() => {
    filteredHandler({ bugType: ['UI'] }, 'bugs', true);
    setTableModalType('bugs');
    setTableModal(true);
  }, [filteredHandler, setTableModal, setTableModalType]);

  const handleOpenMoalForBugsAndBugTypeFunctionality = useCallback(() => {
    filteredHandler({ bugType: ['Functionality'] }, 'bugs', true);
    setTableModalType('bugs');
    setTableModal(true);
  }, [filteredHandler, setTableModal, setTableModalType]);

  const handleOpenMoalForBugsAndBugTypePerformance = useCallback(() => {
    filteredHandler({ bugType: ['Performance'] }, 'bugs', true);
    setTableModalType('bugs');
    setTableModal(true);
  }, [filteredHandler, setTableModal, setTableModalType]);

  const handleOpenMoalForBugsAndBugTypeSecurtiy = useCallback(() => {
    filteredHandler({ bugType: ['Security'] }, 'bugs', true);
    setTableModalType('bugs');
    setTableModal(true);
  }, [filteredHandler, setTableModal, setTableModalType]);

  const handleOpenMoalForBugsAndBugTypeCritical = useCallback(() => {
    filteredHandler({ severity: ['Critical'] }, 'bugs', true);
    setTableModalType('bugs');
    setTableModal(true);
  }, [filteredHandler, setTableModal, setTableModalType]);

  const handleOpenMoalForBugsAndBSeverityHigh = useCallback(() => {
    filteredHandler({ severity: ['High'] }, 'bugs', true);
    setTableModalType('bugs');
    setTableModal(true);
  }, [filteredHandler, setTableModal, setTableModalType]);

  const handleOpenMoalForBugsAndBSeverityMedium = useCallback(() => {
    filteredHandler({ severity: ['Medium'] }, 'bugs', true);
    setTableModalType('bugs');
    setTableModal(true);
  }, [filteredHandler, setTableModal, setTableModalType]);

  const handleOpenMoalForBugsAndBSeverityLow = useCallback(() => {
    filteredHandler({ severity: ['Medium'] }, 'bugs', true);
    setTableModalType('bugs');
    setTableModal(true);
  }, [filteredHandler, setTableModal, setTableModalType]);

  const nullifyUser = useCallback(() => {
    setUser(false);
  }, [setUser]);

  return (
    <div className={style.main}>
      <div className={style.header}>
        <div className={style.headerLeftDiv}>
          <Permissions allowedRoles={['Admin', 'Project Manager']} currentRole={userDetails?.role}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px',
              }}
              onClick={handleOpen}
            >
              <Icon name={'UpDownArrow'} height={24} width={24} iconClass={style.iconClass} />
              {user && (
                <div className={style.userMenuDiv}>
                  <Menu
                    menu={userMenu}
                    searchable
                    type={'dev'}
                    isDisabled={!checkedUsers?.length}
                    handleClear={() => {
                      checkedUsers?.length && setCheckedUsers([]);
                      checkedUsers?.length &&
                        setFilters(() => ({
                          allDevUserIds: [],
                        }));
                    }}
                    handleSubmit={() =>
                      setFilters((prev) => ({
                        ...prev,
                        allDevUserIds: checkedUsers,
                      }))
                    }
                  />
                </div>
              )}
            </div>
            <div className={style.userMenuDivMobile}>
              <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen}>
                {userMenu?.map((ele) => {
                  return (
                    <div className={style.innerDiv} onClick={ele.click} key={ele?.title}>
                      {ele?.img ||
                        (ele?.compo && (
                          <div style={{ width: '15px' }}>
                            {ele?.img ? <img src={ele?.img} alt="mobile-menu-icon" /> : ele?.compo ? ele?.compo : ''}
                          </div>
                        ))}
                      {<p>{ele?.title}</p>}
                    </div>
                  );
                })}
              </MobileMenu>
            </div>
          </Permissions>

          <h2>
            {checkedUsers.length === 1
              ? `${devOptions.find((x) => x.value === checkedUsers[0]).label} `
              : checkedUsers.length > 1
                ? `Combined`
                : userDetails?.role === 'Admin'
                  ? 'All Developers '
                  : userDetails?.role === 'Project Manager' && 'All Developers '}
            Report
          </h2>
        </div>
        <Icon name={'MoreInvertIcon'} height={24} width={24} iconClass={style.iconDark} />
      </div>
      {_isGettingDev ? (
        <Loader className={style.customLoader} />
      ) : (
        <>
          <div className={style.mid}>
            <div>
              <p>
                Total Bugs: <span>{report?.totalBugs ? `${report?.totalBugs}` : 0}</span>
              </p>
              <p>
                Bug Reopened Rate: <span>{report?.reopenedBugRate ? `${report?.reopenedBugRate} %` : ''}</span>
              </p>
            </div>
            <div>
              <p>
                Bug Closure Rate: <span>{report?.bugClosureRateDays ? `${report?.bugClosureRateDays} Days` : ''}</span>
              </p>
              <p>
                Bug Reproducible Rate: <span>{report?.reproducedBugRate ? `${report?.reproducedBugRate} %` : ''}</span>
              </p>
            </div>
          </div>
          <div className={style.inner}>
            <div className={style.section}>
              <div className={style.titleTime}>
                <span>Bugs Status</span>
              </div>
              <div className={style.lowerDiv}>
                <div className={style.colorSection}>
                  <div className={style.dataLine}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div
                        style={{
                          height: '10px',
                          width: '10px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--green)',
                        }}
                      />
                      <span>Closed</span>
                    </div>
                    <span>
                      {!report?.metaData?.BugStatus?.closed ? (
                        '-'
                      ) : (
                        <span style={{ cursor: 'pointer' }} onClick={handleCloseTableModal}>
                          {report?.metaData?.BugStatus?.closed}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className={style.dataLine}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div
                        style={{
                          height: '10px',
                          width: '10px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--light-red)',
                        }}
                      />
                      <span>Opened</span>
                    </div>
                    <span>
                      {!report?.metaData?.BugStatus?.open ? (
                        '-'
                      ) : (
                        <span style={{ cursor: 'pointer' }} onClick={handleOpenTableModal}>
                          {report?.metaData?.BugStatus?.open}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className={style.dataLine}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div
                        style={{
                          height: '10px',
                          width: '10px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--orange)',
                        }}
                      />
                      <span>Reproducible</span>
                    </div>
                    <span>
                      {!report?.metaData?.BugStatus?.reproducible ? (
                        '-'
                      ) : (
                        <span style={{ cursor: 'pointer' }} onClick={handleOpenMoalForBugs}>
                          {report?.metaData?.BugStatus?.reproducible}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className={style.dataLine}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div
                        style={{
                          height: '10px',
                          width: '10px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--red)',
                        }}
                      />
                      <span>Blocked</span>
                    </div>
                    <span>
                      {!report?.metaData?.BugStatus?.blocked ? (
                        '-'
                      ) : (
                        <span style={{ cursor: 'pointer' }} onClick={handleOpenMoalForBugsAndStausBlocked}>
                          {report?.metaData?.BugStatus?.blocked}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className={style.dataLine}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div
                        style={{
                          height: '10px',
                          width: '10px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--blue)',
                        }}
                      />
                      <span>Need to Discuss</span>
                    </div>
                    <span>
                      {!report?.metaData?.BugStatus?.needToDiscuss ? (
                        '-'
                      ) : (
                        <span style={{ cursor: 'pointer' }} onClick={handleOpenMoalForBugsAndStausNeedToDiscuss}>
                          {report?.metaData?.BugStatus?.needToDiscuss}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className={style.section}>
              <div className={style.titleTime}>
                <span>Bugs Types</span>
              </div>
              <div className={style.lowerDiv}>
                <div className={style.colorSection}>
                  <div className={style.dataLine}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div
                        style={{
                          height: '10px',
                          width: '10px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--green)',
                        }}
                      />
                      <span>UI</span>
                    </div>
                    <span>
                      {!report?.metaData?.BugType?.ui ? (
                        '-'
                      ) : (
                        <span style={{ cursor: 'pointer' }} onClick={handleOpenMoalForBugsAndBugTypeUI}>
                          {' '}
                          {report?.metaData?.BugType?.ui}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className={style.dataLine}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div
                        style={{
                          height: '10px',
                          width: '10px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--light-red)',
                        }}
                      />
                      <span>Functionality</span>
                    </div>
                    <span>
                      {!report?.metaData?.BugType?.functionality ? (
                        '-'
                      ) : (
                        <span style={{ cursor: 'pointer' }} onClick={handleOpenMoalForBugsAndBugTypeFunctionality}>
                          {report?.metaData?.BugType?.functionality}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className={style.dataLine}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div
                        style={{
                          height: '10px',
                          width: '10px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--orange)',
                        }}
                      />
                      <span>Performance</span>
                    </div>
                    <span>
                      {!report?.metaData?.BugType?.performance ? (
                        '-'
                      ) : (
                        <span style={{ cursor: 'pointer' }} onClick={handleOpenMoalForBugsAndBugTypePerformance}>
                          {report?.metaData?.BugType?.performance}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className={style.dataLine}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div
                        style={{
                          height: '10px',
                          width: '10px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--red)',
                        }}
                      />
                      <span>Security</span>
                    </div>
                    <span>
                      {!report?.metaData?.BugType?.security ? (
                        '-'
                      ) : (
                        <span style={{ cursor: 'pointer' }} onClick={handleOpenMoalForBugsAndBugTypeSecurtiy}>
                          {report?.metaData?.BugType?.security}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className={style.section}>
              <div className={style.titleTime}>
                <span>Bugs Severity</span>
              </div>
              <div className={style.lowerDiv} style={{ borderRight: 'none' }}>
                <div className={style.colorSection}>
                  <div className={style.dataLine}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div
                        style={{
                          height: '10px',
                          width: '10px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--red)',
                        }}
                      />
                      <span>Critical</span>
                    </div>
                    <span>
                      {!report?.metaData?.BugSeverity?.critical ? (
                        '-'
                      ) : (
                        <span style={{ cursor: 'pointer' }} onClick={handleOpenMoalForBugsAndBugTypeCritical}>
                          {report?.metaData?.BugSeverity?.critical}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className={style.dataLine}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div
                        style={{
                          height: '10px',
                          width: '10px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--light-red)',
                        }}
                      />
                      <span>High</span>
                    </div>
                    <span>
                      {!report?.metaData?.BugSeverity?.high ? (
                        '-'
                      ) : (
                        <span style={{ cursor: 'pointer' }} onClick={handleOpenMoalForBugsAndBSeverityHigh}>
                          {report?.metaData?.BugSeverity?.high}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className={style.dataLine}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div
                        style={{
                          height: '10px',
                          width: '10px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--orange)',
                        }}
                      />
                      <span>Medium</span>
                    </div>
                    <span>
                      {!report?.metaData?.BugSeverity?.medium ? (
                        '-'
                      ) : (
                        <span style={{ cursor: 'pointer' }} onClick={handleOpenMoalForBugsAndBSeverityMedium}>
                          {report?.metaData?.BugSeverity?.medium}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className={style.dataLine}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div
                        style={{
                          height: '10px',
                          width: '10px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--blue)',
                        }}
                      />
                      <span>Low</span>
                    </div>
                    <span>
                      {!report?.metaData?.BugSeverity?.low ? (
                        '-'
                      ) : (
                        <span style={{ cursor: 'pointer' }} onClick={handleOpenMoalForBugsAndBSeverityLow}>
                          {report?.metaData?.BugSeverity?.low}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <TableModal open={tableModal} setOpen={setTableModal} type={tableModalType} setType={setTableModalType} />
      {user && <div className={style.backdropDiv} onClick={nullifyUser}></div>}
    </div>
  );
};

export default DevReport;
