import React, { useState, useEffect, useContext, createContext } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

const UserProvider = ({ children }) => {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState();

  const updateType = (type) => {
    const userRef = db.collection('accounts').doc(user.uid);
    return userRef.set({
      ...userInfo,
      type: type,
    });
  };

  const updateName = (firstName, lastName, middleName) => {
    const userRef = db.collection('accounts').doc(user.uid);
    return userRef.set({
      ...userInfo,
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
    });
  };

  const updateGender = (gender) => {
    const userRef = db.collection('accounts').doc(user.uid);
    return userRef.set({
      ...userInfo,
      gender: gender,
    });
  };

  useEffect(() => {
    setUserInfo();
    if (user) {
      const getUserInfo = async () => {
        const accountRef = db.collection('accounts').doc(user.uid);
        const account = await accountRef.get();
        setUserInfo(account.data());
      };

      const unsubscribe = getUserInfo();
      return unsubscribe;
    }
  }, [user]);

  const value = {
    userInfo,
    setUserInfo,
    updateType,
    updateName,
    updateGender,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
