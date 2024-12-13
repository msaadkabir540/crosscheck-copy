import { useState, useEffect, useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import Menu from 'components/menu';
import Checkbox from 'components/checkbox';
import DateRange from 'components/date-range';
import Permissions from 'components/permissions';
import MobileMenu from 'components/mobile-menu';
import TableModal from 'components/table-modal';
import Loader from 'components/loader';

import { useGetQaReport } from 'api/v1/dashboard/dashboard';

import { formattedDate } from 'utils/date-handler';

import { useProjectOptions } from '../helper';
import style from './report.module.scss';
import Icon from '../../../../components/icon/themed-icon';

const Report = ({ control, userDetails }) => {
  const [days, setDays] = useState(false);

  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState('Today');
  const [selectedDates, setSelectedDates] = useState();
  const [user, setUser] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [tableModal, setTableModal] = useState(false);
  const [tableModalType, setTableModalType] = useState('');
  const [checkedUsers, setCheckedUsers] = useState([]);
  const [report, setReport] = useState({});

  const { data = {} } = useProjectOptions();
  const { createdByOptions = [] } = data;

  const [filters, setFilters] = useState({
    allQaUsersIds: userDetails?.role === 'QA' ? [userDetails?.id] : [],
  });

  const onChange = (name, dates) => {
    const [start, end] = dates;
    setSelectedDates((pre) => ({ ...pre, [name]: { start, end } }));
  };

  // NOTE: getReport
  const { mutateAsync: _getAllQaReport, isLoading: _gettingQAReport } = useGetQaReport();

  const fetchQaReport = async (filters) => {
    try {
      const response = await _getAllQaReport(filters);
      setReport(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchQaReport(filters);
  }, [filters]);

  useEffect(() => {
    selectedDates?.range?.end &&
      setFilters((prev) => ({
        ...prev,
        activityAt: {
          start: formattedDate(selectedDates?.range?.start, 'yyyy-MM-dd'),
          end: formattedDate(selectedDates?.range?.end, 'yyyy-MM-dd'),
        },
      }));
  }, [selectedDates?.range?.end]);

  const checker = (id) => {
    if (id === '-select-all-') {
      checkedUsers?.length === createdByOptions.length - 1
        ? setCheckedUsers([])
        : setCheckedUsers(() => createdByOptions.filter((x) => x.value !== '-select-all-').map((x) => x.value));
    } else {
      setCheckedUsers((pre) => (pre.includes(id) ? pre.filter((x) => x !== id) : [...pre, id]));
    }
  };

  const userMenu = createdByOptions?.map((item) => ({
    compo: item.checkbox ? (
      <Checkbox
        checked={
          item?.value === '-select-all-'
            ? checkedUsers?.length === createdByOptions?.length - 1
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
          <img style={{ borderRadius: '50%' }} height={24} width={24} src={item?.image} />
        ) : (
          item?.imagAlt && <div className={style.imgDiv}>{item?.imagAlt}</div>
        )}{' '}
        {item.label || 'Default Title'}
      </div>
    ),
    click: () => {
      checker(item?.value);
    },
  }));

  const menu = [
    {
      title: 'Today',
      click: () => {
        setSelectedDay('Today');
        setSelectedDates('');
        setIsOpen2(false);
        setFilters((prev) => ({
          ...prev,
          activityAt: {
            start: formattedDate(new Date(), 'yyyy-MM-dd'),
            end: formattedDate(new Date(), 'yyyy-MM-dd'),
          },
        }));
        setDays(false);
      },
    },
    {
      title: 'Yesterday',
      click: () => {
        setSelectedDay('Yesterday');
        setSelectedDates('');
        setIsOpen2(false);
        setFilters((prev) => {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);

          return {
            ...prev,
            activityAt: {
              start: formattedDate(yesterday, 'yyyy-MM-dd'),
              end: formattedDate(yesterday, 'yyyy-MM-dd'),
            },
          };
        });
        setDays(false);
      },
    },
    {
      title: 'This Week',
      click: () => {
        setSelectedDay('This Week');
        setSelectedDates('');
        setIsOpen2(false);
        setFilters((prev) => {
          const currentDate = new Date();
          const startOfWeek = new Date(currentDate);
          const endOfWeek = new Date(currentDate);
          startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
          endOfWeek.setDate(currentDate.getDate() + (6 - currentDate.getDay()));

          return {
            ...prev,
            activityAt: {
              start: formattedDate(startOfWeek, 'yyyy-MM-dd'),
              end: formattedDate(endOfWeek, 'yyyy-MM-dd'),
            },
          };
        });

        setDays(false);
      },
    },
    {
      title: 'Last Week',
      click: () => {
        setSelectedDay('Last Week');
        setSelectedDates('');
        setIsOpen2(false);
        setFilters((prev) => {
          const currentDate = new Date();
          const startOfWeek = new Date(currentDate);
          startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
          const endOfWeek = new Date(currentDate);
          endOfWeek.setDate(currentDate.getDate() + (6 - currentDate.getDay()));
          const startOfLastWeek = new Date(startOfWeek);
          startOfLastWeek.setDate(startOfWeek.getDate() - 7);
          const endOfLastWeek = new Date(endOfWeek);
          endOfLastWeek.setDate(endOfWeek.getDate() - 7);

          return {
            ...prev,
            activityAt: {
              start: formattedDate(startOfLastWeek, 'yyyy-MM-dd'),
              end: formattedDate(endOfLastWeek, 'yyyy-MM-dd'),
            },
          };
        });

        setDays(false);
      },
    },
    {
      title: 'Range',
      click: () => {
        setSelectedDay('Range');
        setSelectedDates('');
        setDays(false);
      },
    },
  ];

  const filteredHandler = (props, type, missActivity = false) => {
    const queryParams = new URLSearchParams({
      reportedBy:
        userDetails?.role === 'Admin' || userDetails?.role === 'Project Manager'
          ? createdByOptions.reduce((acc, x) => {
              if (x.value !== '-select-all-') {
                acc.push(x.value);
              }

              return acc;
            }, [])
          : checkedUsers || [],

      ...(((filters?.activityAt?.start && filters?.activityAt?.end) || formattedDate(new Date(), 'yyyy-MM-dd')) && {
        ...(missActivity
          ? {
              retestDateStart: filters?.activityAt?.start || formattedDate(new Date(), 'yyyy-MM-dd'),
              retestDateEnd: filters?.activityAt?.end || formattedDate(new Date(), 'yyyy-MM-dd'),
              createdAtStart: filters?.activityAt?.start || formattedDate(new Date(), 'yyyy-MM-dd'),
              createdAtEnd: filters?.activityAt?.end || formattedDate(new Date(), 'yyyy-MM-dd'),
            }
          : {
              reportedAtStart: filters?.activityAt?.start || formattedDate(new Date(), 'yyyy-MM-dd'),
              reportedAtEnd: filters?.activityAt?.end || formattedDate(new Date(), 'yyyy-MM-dd'),
            }),
      }),
      ...props,
    }).toString();

    navigate({
      pathname:
        type === 'delete'
          ? `/home`
          : type === 'testCase'
            ? `/home`
            : type === 'testRun'
              ? `/home`
              : type === 'bugs' && '/home',
      search: queryParams.toString(),
    });
  };

  const handleOpenUser = useCallback(() => {
    setUser(true);
    setIsOpen(true);
  }, [setUser, setIsOpen]);

  const handleReset = useCallback(() => {
    checkedUsers?.length && setCheckedUsers([]);
    checkedUsers?.length &&
      setFilters(() => ({
        allQaUsersIds: [],
      }));
  }, [checkedUsers?.length, setFilters, setCheckedUsers]);

  const handleFilterOnSubmit = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      allQaUsersIds: checkedUsers,
    }));
  }, [setFilters, checkedUsers]);

  const handleOpen2AndDays = useCallback(() => {
    setDays(true);
    setIsOpen2(true);
  }, [setDays, setIsOpen2]);

  const handleFilterIssueTypeNewBug = useCallback(() => {
    filteredHandler({ issueType: ['New Bug'] }, 'bugs', true);
    setTableModal(true);
    setTableModalType('bugs');
  }, [filteredHandler, setTableModal, setTableModalType]);

  const handleFilterSearchTypeBug = useCallback(() => {
    filteredHandler({ searchType: ['Bug'] }, 'delete');
    setTableModal(true);
    setTableModalType('delete');
  }, [filteredHandler, setTableModal, setTableModalType]);

  const handleFilterStatusClose = useCallback(() => {
    filteredHandler({ status: ['Closed'] }, 'bugs', true);
    setTableModal(true);
    setTableModalType('bugs');
  }, [filteredHandler, setTableModal, setTableModalType]);

  const handleFilterStatusReproducible = useCallback(() => {
    filteredHandler({ status: ['Reproducible'] }, 'bugs', true);
    setTableModal(true);
    setTableModalType('bugs');
  }, [filteredHandler, setTableModal, setTableModalType]);

  const handleFilterStatusBlocked = useCallback(() => {
    filteredHandler({ status: ['Blocked'] }, 'bugs', true);
    setTableModal(true);
    setTableModalType('bugs');
  }, [filteredHandler, setTableModal, setTableModalType]);

  const handleFilterStatusNeedToDiscuss = useCallback(() => {
    filteredHandler({ status: ['Need To Discuss'] }, 'bugs', true);
    setTableModal(true);
    setTableModalType('bugs');
  }, [filteredHandler, setTableModal, setTableModalType]);

  const handleFilterStatusReopened = useCallback(() => {
    filteredHandler({ status: ['Reopened'] }, 'bugs', true);
    setTableModal(true);
    setTableModalType('bugs');
  }, [filteredHandler, setTableModal, setTableModalType]);

  const handleFiltertestCase = useCallback(() => {
    filteredHandler({}, 'testCase');
    setTableModal(true);
    setTableModalType('testCase');
  }, [filteredHandler, setTableModal, setTableModalType]);

  const handleFilterSearchTypetestCase = useCallback(() => {
    filteredHandler({ searchType: ['TestCase'] }, 'delete');
    setTableModal(true);
    setTableModalType('delete');
  }, [filteredHandler, setTableModal, setTableModalType]);

  const handleFilterStatusPassed = useCallback(() => {
    filteredHandler({ status: ['Passed'] }, 'testCase');
    setTableModal(true);
    setTableModalType('testCase');
  }, [filteredHandler, setTableModal, setTableModalType]);

  const handleFilterStatusFailed = useCallback(() => {
    filteredHandler({ status: ['Failed'] }, 'testCase');
    setTableModal(true);
    setTableModalType('testCase');
  }, [filteredHandler, setTableModal, setTableModalType]);

  const handleFilterTestCaseStatusBlocked = useCallback(() => {
    filteredHandler({ status: ['Blocked'] }, 'testCase');
    setTableModal(true);
    setTableModalType('testCase');
  }, [filteredHandler, setTableModal, setTableModalType]);

  const handleFilterTestRun = useCallback(() => {
    filteredHandler({}, 'testRun');
    setTableModal(true);
    setTableModalType('testRun');
  }, [filteredHandler, setTableModal, setTableModalType]);

  const handleFilterTestRunStatusClosed = useCallback(() => {
    filteredHandler({ status: ['Closed'] }, 'testRun');
    setTableModal(true);
    setTableModalType('testRun');
  }, [filteredHandler, setTableModal, setTableModalType]);

  const handleCloaseDays = useCallback(() => {
    setDays(false);
  }, [setDays]);

  const handleCloaseUsers = useCallback(() => {
    setUser(false);
  }, [setUser]);

  return (
    <div className={style.main}>
      <div className={style.header}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            position: 'relative',
          }}
        >
          <Permissions allowedRoles={['Admin', 'Project Manager']} currentRole={userDetails?.role}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px',
              }}
              onClick={handleOpenUser}
            >
              <Icon name={'UpDownArrow'} height={24} width={24} iconClass={style.iconClass} />
              {user && (
                <div className={style.userMenuDiv}>
                  <Menu
                    menu={userMenu}
                    type={'qa'}
                    isDisabled={!checkedUsers?.length}
                    searchable
                    handleClear={handleReset}
                    handleSubmit={handleFilterOnSubmit}
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
                            {ele?.img ? <img src={ele?.img} alt="" /> : ele?.compo ? ele?.compo : ''}
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
              ? `${createdByOptions.find((x) => x.value === checkedUsers[0]).label} `
              : checkedUsers.length > 1
                ? `Combined`
                : userDetails?.role === 'Admin'
                  ? 'All QA '
                  : userDetails?.role === 'Project Manager' && 'All QA '}
            Report
          </h2>
        </div>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div className={style.dateRangeDiv}>
            {selectedDay === 'Range' && !selectedDates?.range?.end && (
              <DateRange
                handleChange={(e) => onChange('range', e)}
                startDate={selectedDates?.range?.start}
                endDate={selectedDates?.range?.end}
                name={'range'}
                placeholder={'Select'}
                control={control}
              />
            )}
          </div>
          <div className={style.day} onClick={handleOpen2AndDays}>
            {selectedDay === 'Range' && selectedDates?.range?.end
              ? `${
                  selectedDates?.range?.start && formattedDate(selectedDates?.range?.start, 'yyyy/MM/dd')
                }-${formattedDate(selectedDates?.range?.end && selectedDates?.range?.end, 'yyyy/MM/dd')}`
              : selectedDay}
          </div>
          <Icon name={'MoreInvertIcon'} height={24} width={24} iconClass={style.iconDark} />
          {days && (
            <div className={style.menuDiv}>
              <Menu menu={menu} />
            </div>
          )}
          <div className={style.userMenuDivMobile}>
            <MobileMenu isOpen={isOpen2} setIsOpen={setIsOpen2}>
              {menu?.map((ele) => {
                return (
                  <div className={style.innerDiv} onClick={ele.click} key={ele?.title}>
                    {ele?.img ||
                      (ele?.compo && (
                        <div style={{ width: '15px' }}>
                          {ele?.img ? <img src={ele?.img} alt="" /> : ele?.compo ? ele?.compo : ''}
                        </div>
                      ))}
                    {<p>{ele?.title}</p>}
                  </div>
                );
              })}
              {selectedDay === 'Range' && !selectedDates?.range?.end && (
                <DateRange
                  handleChange={(e) => onChange('range', e)}
                  startDate={selectedDates?.range?.start}
                  endDate={selectedDates?.range?.end}
                  name={'range'}
                  placeholder={'Select'}
                  control={control}
                />
              )}
            </MobileMenu>
          </div>
        </div>
      </div>
      <div className={style.timeTrackedDiv}>
        <span>Time Tracked:</span>
        <span style={{ fontWeight: '600', marginLeft: '5px' }}>{report?.timeTracked}</span>
      </div>
      {_gettingQAReport ? (
        <Loader className={style.customLoader} />
      ) : (
        <div className={style.inner}>
          <div className={style.section}>
            <div className={style.titleTime}>
              <span>Bugs</span>
            </div>
            <div className={style.lowerDiv}>
              <div className={style.dataLine}>
                <span>Reported</span>
                <span>
                  {!report?.bugsMeta?.reported ? (
                    '-'
                  ) : (
                    <span style={{ cursor: 'pointer' }} onClick={handleFilterIssueTypeNewBug}>
                      {report?.bugsMeta?.reported}
                    </span>
                  )}
                </span>
              </div>
              <div className={style.dataLine}>
                <span>Deleted</span>
                <span>
                  {!report?.bugsMeta?.deleted ? (
                    '-'
                  ) : (
                    <span style={{ cursor: 'pointer' }} onClick={handleFilterSearchTypeBug}>
                      {report?.bugsMeta?.deleted}
                    </span>
                  )}
                </span>
              </div>
              <div className={style.dataLine}>
                <span>Restored</span>
                <span>{!report?.bugsMeta?.restored ? '-' : report?.bugsMeta?.restored}</span>
              </div>
              <div className={style.dataLine}>
                <span>Retest</span>
                <span>
                  {!report?.bugsMeta?.retest?.total ? (
                    '-'
                  ) : (
                    <span style={{ cursor: 'pointer' }}>{report?.bugsMeta?.retest?.total}</span>
                  )}
                </span>
              </div>
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
                    {!report?.bugsMeta?.retest?.closed ? (
                      '-'
                    ) : (
                      <span style={{ cursor: 'pointer' }} onClick={handleFilterStatusClose}>
                        {report?.bugsMeta?.retest?.closed}
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
                    {!report?.bugsMeta?.retest?.reproducible ? (
                      '-'
                    ) : (
                      <span style={{ cursor: 'pointer' }} onClick={handleFilterStatusReproducible}>
                        {report?.bugsMeta?.retest?.reproducible}
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
                    {!report?.bugsMeta?.retest?.blocked ? (
                      '-'
                    ) : (
                      <span style={{ cursor: 'pointer' }} onClick={handleFilterStatusBlocked}>
                        {report?.bugsMeta?.retest?.blocked}
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
                    {!report?.bugsMeta?.retest?.needToDiscuss ? (
                      '-'
                    ) : (
                      <span style={{ cursor: 'pointer' }} onClick={handleFilterStatusNeedToDiscuss}>
                        {report?.bugsMeta?.retest?.needToDiscuss}
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
                        backgroundColor: 'var(--yellow)',
                      }}
                    />
                    <span>Reopened</span>
                  </div>
                  <span>
                    {!report?.bugsMeta?.retest?.reopen ? (
                      '-'
                    ) : (
                      <span style={{ cursor: 'pointer' }} onClick={handleFilterStatusReopened}>
                        {report?.bugsMeta?.retest?.reopen}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className={style.section}>
            <div className={style.titleTime}>
              <span>Test Cases</span>
            </div>
            <div className={style.lowerDiv}>
              <div className={style.dataLine}>
                <span>Added</span>
                <span>
                  {!report?.testCasesMeta?.added ? (
                    '-'
                  ) : (
                    <span style={{ cursor: 'pointer' }} onClick={handleFiltertestCase}>
                      {report?.testCasesMeta?.added}
                    </span>
                  )}
                </span>
              </div>
              <div className={style.dataLine}>
                <span>Deleted</span>
                <span>
                  {!report?.testCasesMeta?.deleted ? (
                    '-'
                  ) : (
                    <span style={{ cursor: 'pointer' }} onClick={handleFilterSearchTypetestCase}>
                      {report?.testCasesMeta?.deleted}
                    </span>
                  )}
                </span>
              </div>
              <div className={style.dataLine}>
                <span>Restored</span>
                <span>{!report?.testCasesMeta?.restored ? '-' : report?.testCasesMeta?.restored}</span>
              </div>
              <div className={style.dataLine}>
                <span>Tested</span>
                <span>
                  {!report?.testCasesMeta?.tested?.total ? (
                    '-'
                  ) : (
                    <span style={{ cursor: 'pointer' }}>{report?.testCasesMeta?.tested?.total} </span>
                  )}
                </span>
              </div>
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
                    <span>Passed</span>
                  </div>
                  <span>
                    {!report?.testCasesMeta?.tested?.passed ? (
                      '-'
                    ) : (
                      <span style={{ cursor: 'pointer' }} onClick={handleFilterStatusPassed}>
                        {' '}
                        {report?.testCasesMeta?.tested?.passed}
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
                    <span>Failed</span>
                  </div>
                  <span>
                    {!report?.testCasesMeta?.tested?.failed ? (
                      '-'
                    ) : (
                      <span style={{ cursor: 'pointer' }} onClick={handleFilterStatusFailed}>
                        {report?.testCasesMeta?.tested?.failed}
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
                    {!report?.testCasesMeta?.tested?.blocked ? (
                      '-'
                    ) : (
                      <span style={{ cursor: 'pointer' }} onClick={handleFilterTestCaseStatusBlocked}>
                        {report?.testCasesMeta?.tested?.blocked}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className={style.section}>
            <div className={style.titleTime}>
              <span>Test Runs</span>
            </div>
            <div className={style.lowerDiv} style={{ borderRight: 'none' }}>
              <div className={style.dataLine}>
                <span>Created</span>
                <span>
                  {!report?.testRunsMeta?.created ? (
                    '-'
                  ) : (
                    <span style={{ cursor: 'pointer' }} onClick={handleFilterTestRun}>
                      {report?.testRunsMeta?.created}
                    </span>
                  )}
                </span>
              </div>
              <div className={style.dataLine}>
                <span>Closed</span>
                <span>
                  {!report?.testRunsMeta?.closed ? (
                    '-'
                  ) : (
                    <span style={{ cursor: 'pointer' }} onClick={handleFilterTestRunStatusClosed}>
                      {report?.testRunsMeta?.closed}
                    </span>
                  )}
                </span>
              </div>

              <div className={style.dataLine}>
                <span>Tested Test Cases</span>
                <span>{!report?.testRunsMeta?.testedTestCases ? '-' : report?.testRunsMeta?.testedTestCases}</span>
              </div>

              <div className={style.dataLine}>
                <span>Tested Bugs</span>
                <span>{report?.testRunsMeta?.testedBugs || '-'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      <TableModal open={tableModal} setOpen={setTableModal} type={tableModalType} setType={setTableModalType} />
      {days && <div className={style.backdropDiv} onClick={handleCloaseDays}></div>}
      {user && <div className={style.backdropDiv} onClick={handleCloaseUsers}></div>}
    </div>
  );
};

export default Report;
