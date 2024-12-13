import style from './notification-table.module.scss';
import Row from './row';

const NotificationTable = ({ array = [], handleChangeValueEvent, setComingSoonModal }) => {
  const mapTitlesToText = (prettyObjectName) => {
    switch (prettyObjectName) {
      case 'Bug Comments':
        return 'Comments';
      default:
        return prettyObjectName;
    }
  };

  return (
    <>
      {array?.map((obj) => {
        const objectName = Object?.keys(obj)[0];
        const prettyObjectName = objectName?.replace(/([A-Z])/g, ' $1')?.replace(/^./, (str) => str?.toUpperCase());
        const actions = Object?.values(obj)[0];

        return (
          <div className={style.table} key={Math.random()}>
            <div className={style.tableHeader}>
              <span className={style.headerLabel}>{mapTitlesToText(prettyObjectName)}</span>
              <span className={style.headerLabel}>Cross Check</span>
              <span className={style.headerLabel}>Teams</span>
              <span className={style.headerLabel}>Slack</span>
              <span className={style.headerLabel}>Email</span>
            </div>
            {Object?.keys(actions)?.map((action) => {
              const prettyAction = action?.replace(/([A-Z])/g, ' $1')?.replace(/^./, (str) => str?.toUpperCase());

              return (
                <Row
                  setComingSoonModal={setComingSoonModal}
                  prettyAction={prettyAction}
                  checked={actions[action]?.notifyOn}
                  disabled={actions[action]?.isDisabled}
                  key={Math.random()}
                  parentKey={objectName}
                  childKey={action}
                  handleChangeValueEvent={handleChangeValueEvent}
                />
              );
            })}
          </div>
        );
      })}
    </>
  );
};

export default NotificationTable;
