import { useEffect, useState } from 'react';
import { useAuth } from 'contexts/AuthContext';
import { useUser } from 'contexts/UserContext';
import SettingsButton from 'components/Button/SettingsButton';
import Loader from 'components/Loader';

const AccountInformation = () => {
  const { user } = useAuth();
  const { userInfo } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userInfo) {
      setLoading(false);
    }
  }, [userInfo]);

  return (
    <>
      {loading ? (
        <Loader className="mx-auto mt-5" />
      ) : (
        <>
          <SettingsButton
            to="/settings/account-information/account-type"
            title="Account type"
            desc={userInfo.type}
          />
          <SettingsButton
            to="/settings/account-information/email"
            title="Email"
            desc={user.email}
          />
          <SettingsButton
            to="/settings/account-information/name"
            title="Name"
            desc={`${userInfo.firstName} ${userInfo.middleName} ${userInfo.lastName}`}
          />
          <SettingsButton
            to="/settings/account-information/gender"
            title="Gender"
            desc={userInfo.gender}
          />
        </>
      )}
    </>
  );
};

export default AccountInformation;
