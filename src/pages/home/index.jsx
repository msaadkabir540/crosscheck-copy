import { useState, useEffect } from 'react';

import { useAppContext } from 'context/app-context';

import MainWrapper from 'components/layout/main-wrapper';

import { formattedDate } from 'utils/date-handler';

import DevDashboard from './dev-dashboard';
import QaDashboard from './qa-dashboard';
import AdminDashboard from './admin-dashboard';

const Home = () => {
  const { userDetails } = useAppContext();
  const [selectedUser, setSelectedUser] = useState(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  useEffect(() => {
    setUpdateTrigger((prev) => prev + 1);
  }, [userDetails]);

  return (
    <>
      {userDetails && userDetails?.signUpType !== 'Extension' && (
        <MainWrapper
          title="Dashboard"
          date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}
          setSelectedUser={setSelectedUser}
          admin={userDetails?.role === 'Admin' || userDetails?.superAdmin}
        >
          {userDetails?.role === 'Developer' || selectedUser?.role === 'Developer' ? (
            <DevDashboard key={updateTrigger} viewAs={selectedUser?.value || ''} />
          ) : userDetails?.role === 'QA' || selectedUser?.role === 'QA' ? (
            <QaDashboard key={updateTrigger} viewAs={selectedUser?.value} />
          ) : userDetails?.role === 'Admin' || userDetails?.role === 'Project Manager' ? (
            <AdminDashboard key={updateTrigger} userDetails={userDetails} viewAs={selectedUser?.value} />
          ) : (
            <></>
          )}
        </MainWrapper>
      )}
    </>
  );
};

export default Home;
