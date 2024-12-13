import { useAppContext } from 'context/app-context';

import MainWrapper from 'components/layout/main-wrapper';
import Permissions from 'components/permissions';
import Icon from 'components/icon/themed-icon';

import { formattedDate } from 'utils/date-handler';

import style from './shortcuts.module.scss';

const Shortcuts = () => {
  const { userDetails } = useAppContext();

  return (
    <div>
      {' '}
      <MainWrapper title="Shortcut" date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}>
        <div>
          <div className={style.mainClass}>
            <h6>
              Count (
              {shortcutsLeft.filter((x) => x.access.includes(userDetails.role)).length +
                shortcutsRight.filter((x) => x.access.includes(userDetails.role)).length}
              )
            </h6>
          </div>
          <div className={style.sectionWrapper}>
            <div className={style.leftSection}>
              {shortcutsLeft?.map((ele) => (
                <div key={ele?.id}>
                  <Permissions allowedRoles={ele.access} currentRole={userDetails?.role}>
                    <div className={style.shortcutWrapper}>
                      {ele?.second && (
                        <>
                          <div className={style.btn}>{ele.first}</div>
                          <span>+</span>
                        </>
                      )}
                      <div className={style.btn}>{ele.second}</div>
                      {ele.third && (
                        <>
                          <span>+</span>
                          <div className={style.btn}>{ele?.third}</div>
                        </>
                      )}
                      <span>{ele.text}</span>
                    </div>
                  </Permissions>
                </div>
              ))}
            </div>

            <div className={style.rightSection}>
              {shortcutsRight?.map((ele) => (
                <div key={ele?.id}>
                  <Permissions allowedRoles={ele.access} currentRole={userDetails?.role}>
                    <div className={style.shortcutWrapper}>
                      <div className={style.btn}>{ele.first}</div>
                      {ele?.second && (
                        <>
                          <span>+</span>
                          <div className={style.btn}>{ele.second}</div>
                        </>
                      )}
                      {ele.third && (
                        <>
                          <span>+</span>
                          <div className={style.btn}>{ele?.third}</div>
                        </>
                      )}
                      <span>{ele.text}</span>
                    </div>
                  </Permissions>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MainWrapper>
    </div>
  );
};

export default Shortcuts;

const shortcutsLeft = [
  {
    id: 1,
    first: 'Alt',
    second: 'E',
    text: 'Retest Bug',
    access: ['Admin', 'Project Manager', 'QA'],
  },
  {
    id: 2,
    first: 'Alt',
    second: 'Q',
    text: 'Execute Search',
    access: ['Admin', 'Project Manager', 'QA', 'Developer'],
  },
  {
    id: 3,
    first: 'Alt',
    second: 'D',
    text: 'Open Home/Dashboard',
    access: ['Admin', 'Project Manager', 'QA', 'Developer'],
  },
  {
    id: 4,
    first: 'Alt',
    second: 'P',
    text: 'Open Projects',
    access: ['Admin', 'Project Manager', 'QA', 'Developer'],
  },
  {
    id: 5,
    first: 'Alt',
    second: 'T',
    text: 'Open Test Cases',
    access: ['Admin', 'Project Manager', 'QA', 'Developer'],
  },
  {
    id: 6,
    first: 'Alt',
    second: 'R',
    text: 'Open Test Runs',
    access: ['Admin', 'Project Manager', 'QA'],
  },
  {
    id: 7,
    first: 'Alt',
    second: 'B',
    text: 'Open Bugs Reporting',
    access: ['Admin', 'Project Manager', 'QA', 'Developer'],
  },
  {
    id: 8,
    first: 'Alt',
    second: 'U',
    text: 'Open User Management',
    access: ['Admin', 'Project Manager'],
  },
  {
    id: 9,
    first: 'Alt',
    second: 'A',
    text: 'Open Activities',
    access: ['Admin', 'Project Manager', 'QA', 'Developer'],
  },
  {
    id: 10,
    first: 'Alt',
    second: 'C',
    text: 'Table Column Change modal',
    access: ['Admin', 'Project Manager', 'QA', 'Developer'],
  },
  {
    id: 11,
    first: 'Alt',
    second: 'N',
    text: 'Open Notifications',
    access: ['Admin', 'Project Manager', 'QA', 'Developer'],
  },
  {
    id: 12,
    first: 'Alt',
    second: 'S',
    text: 'Open Shortcuts',
    access: ['Admin', 'Project Manager', 'QA', 'Developer'],
  },
  {
    id: 13,
    first: 'Alt',
    second: 'Z',
    text: 'Reopen a Bug',
    access: ['Admin', 'Project Manager', 'QA'],
  },
];

const shortcutsRight = [
  {
    id: 1,
    first: 'Shift',
    second: 'A',
    text: 'Add Test Case',
    access: ['Admin', 'Project Manager', 'QA'],
  },
  {
    id: 2,
    first: 'Shift',
    second: 'E',
    text: 'Create Test Run',
    access: ['Admin', 'Project Manager', 'QA'],
  },
  {
    id: 3,
    first: 'Shift',
    second: 'Alt',
    third: 'D',
    text: 'Delete Selected Records',
    access: ['Admin', 'Project Manager', 'QA', 'Developer'],
  },
  {
    id: 4,
    first: 'Shift',
    second: 'Alt',
    third: 'S',
    text: 'Show All Projects',
    access: ['Admin', 'Project Manager', 'QA', 'Developer'],
  },
  {
    id: 5,
    first: 'Shift',
    second: 'Alt',
    third: 'A',
    text: 'Show Achieved Projects',
    access: ['Admin', 'Project Manager'],
  },
  {
    id: 6,
    first: 'Alt',
    second: <Icon name="ArrowRight24" iconClass={style.icon} />,
    text: 'Move to Next Bug/Test Case',
    access: ['Admin', 'Project Manager', 'QA', 'Developer'],
  },
  {
    id: 7,
    first: 'Alt',
    second: <Icon name="ArrowLeft" iconClass={style.icon} />,
    text: 'Move to Previous Bug/Test Case',
    access: ['Admin', 'Project Manager', 'QA', 'Developer'],
  },
  {
    id: 8,
    first: 'Esc',
    text: 'Close Side drawer/Modal',
    access: ['Admin', 'Project Manager', 'QA', 'Developer'],
  },
];
