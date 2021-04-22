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
    <div className="w-full">
      <div className="flex items-center py-5 xs:pt-0 xs:pb-3 border-solid border-b border-orange-500">
        <h1 className="text-5xl xs:text-3xl">Home</h1>
      </div>
      {loading ? (
        <Loader className="mx-auto mt-5" />
      ) : (
        <div className="py-5 xs:py-3">
          <h2 className="text-3xl xs:text-lg">
            {`${userInfo.lastName}, ${userInfo.firstName} ${
              userInfo.middleName && `${userInfo.middleName[0]}.`
            }`}
          </h2>
          <span className="text-2xl xs:text-base">{userInfo.type}</span>
        </div>
      )}
    </div>
  );
};

export default Home;
