import { useAppContext } from 'context/app-context';

import { formattedDate } from 'utils/date-handler';

import Tiptap from '../../components/tip-tap';
import MainWrapper from '../../components/layout/main-wrapper';

const TipTap = () => {
  const { userDetails } = useAppContext();

  return (
    <MainWrapper
      title="Tip Tap"
      date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}
      admin={userDetails?.role === 'Admin' || userDetails?.superAdmin}
    >
      <Tiptap />
    </MainWrapper>
  );
};

export default TipTap;
