import { v4 as uuid } from 'uuid';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import AccountInformationItem from './AccountInformationItem';
import Loader from './Loader';

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
        <Loader />
      ) : (
        <>
          <AccountInformationItem
            key={uuid()}
            link={'/settings/account-information/account-type'}
            title={'Account type'}
            info={userInfo.type}
          />
          <AccountInformationItem
            key={uuid()}
            link={'/settings/account-information/name'}
            title={'Name'}
            info={`${userInfo.firstName} ${userInfo.middleName} ${userInfo.lastName}`}
          />
          <AccountInformationItem
            key={uuid()}
            link={'/settings/account-information/email'}
            title={'Email'}
            info={user?.email}
          />
          <AccountInformationItem
            key={uuid()}
            link={'/settings/account-information/gender'}
            title={'Gender'}
            info={userInfo?.gender}
          />
        </>
      )}
    </>
  );
};

export default AccountInformation;
