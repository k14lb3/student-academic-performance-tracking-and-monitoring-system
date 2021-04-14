import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import { useUser } from 'contexts/UserContext';
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
        <Loader />
      ) : (
        <>
          <Link
            to="/settings/account-information/account-type"
            className="button"
          >
            <div>
              <h3>Account type</h3>
              <div>{userInfo.type}</div>
            </div>
          </Link>
          <Link to="/settings/account-information/name" className="button">
            <div>
              <h3>Name</h3>
              <div>{`${userInfo.firstName} ${userInfo.middleName} ${userInfo.lastName}`}</div>
            </div>
          </Link>
          <Link to="/settings/account-information/email" className="button">
            <div>
              <h3>Email</h3>
              <div>{user.email}</div>
            </div>
          </Link>
          <Link to="/settings/account-information/gender" className="button">
            <div>
              <h3>Gender</h3>
              <div>{userInfo.gender}</div>
            </div>
          </Link>
        </>
      )}
    </>
  );
};

export default AccountInformation;
