import { useState } from 'react';

import QaTesting from './listing';
import ImportModule from './import-module';

const Index = ({
  noHeader,
  projectId,
  //TODO: Discard Scenario
}) => {
  const [isImportActive, setIsImportActive] = useState(false);

  //TODO: Discard Scenario

  return isImportActive ? (
    <ImportModule
      {...{
        noHeader,
        projectId,
        //TODO: Discard Scenario
      }}
      setIsImportActive={setIsImportActive}
    />
  ) : (
    <QaTesting {...{ noHeader, projectId, setIsImportActive }} />
  );
};

export default Index;
