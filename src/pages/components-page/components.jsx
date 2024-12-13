import MainWrapper from 'components/layout/main-wrapper';

import { formattedDate } from 'utils/date-handler';

const Component = () => {
  return (
    <div style={{ paddingLeft: '10px' }}>
      <MainWrapper title="Components page" date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}>
        {}

        <button>Button to be Clicked</button>
      </MainWrapper>
    </div>
  );
};

export default Component;
