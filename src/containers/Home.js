import './Home.scss';
import { useEffect, useState } from 'react';
import { useUser } from 'contexts/UserContext';
import Loader from 'components/Loader';

const Home = () => {
  const { userInfo } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userInfo) {
      setLoading(false);
    }
  }, [userInfo]);

  return (
    <div className="home">
      <div className="home__header">
        <h1 className="home__title">Home</h1>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="home__body">
          <h2 className="home__accountName">
            {`${userInfo.lastName}, ${userInfo.firstName} ${
              userInfo.middleName && `${userInfo.middleName[0]}.`
            }`}
          </h2>
          <span className="home__accountType">{userInfo.type}</span>
        </div>
      )}
    </div>
  );
};

export default Home;
