import { useState } from 'react';

import TestCasesListing from './listing';
import ImportModule from './import-test-cases';

const Index = ({ noHeader, projectId }) => {
  const [isImportActive, setIsImportActive] = useState(false);

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
    <TestCasesListing {...{ noHeader, projectId, setIsImportActive }} />
  );
};

export default Index;
