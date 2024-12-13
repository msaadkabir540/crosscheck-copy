import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import DevtoolsInfo from 'pages/captures/view-capture/devtools-info';
import GeneralInfo from 'pages/captures/view-capture/general-info';

import style from './style.module.scss';
import CheckTabDividedDevtools from '../check-tab-divided-devtools';

const DevtoolAndGeneralInfoComponent = ({ check, isMobileView }) => {
  const devtoolObjects = Object.keys(check?.devtools);

  return (
    <div className={style.panel_container}>
      <PanelGroup autoSaveId="example" direction="vertical" height="100%">
        {!isMobileView && (
          <Panel id="general-info" defaultSize={30}>
            <GeneralInfo generalInfo={check} userInfo={check?.userId} />
          </Panel>
        )}

        <PanelResizeHandle className={style.divider_border} />
        <Panel id="devtools-info" defaultSize={70} minSize={45} maxSize={95}>
          <div className={style.devtools_info_outer_container}>
            {devtoolObjects?.length > 1 ? (
              <CheckTabDividedDevtools check={check} isMobileView={isMobileView} />
            ) : (
              <div className={style.devtools_info_inner_container}>
                <DevtoolsInfo
                  userInfo={check?.userId}
                  isMobileView={isMobileView}
                  check={check}
                  consoleData={check?.devtools[devtoolObjects[0]]?.consoles}
                  networkData={check?.devtools[devtoolObjects[0]]?.networks}
                  actionData={check?.devtools[devtoolObjects[0]]?.actions}
                />
              </div>
            )}
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default DevtoolAndGeneralInfoComponent;
