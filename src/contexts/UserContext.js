import React, { useReducer, useEffect, useContext, createContext } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const ACTIONS = {
  RESET_INFO: 'reset_info',
  SET_INFO: 'set_info',
  UPDATE_TYPE: 'update_type',
  UPDATE_NAME: 'update_name',
  UPDATE_GENDER: 'update_gender',
};

const userInfoReducer = (userInfo, action) => {
  switch (action.type) {
    case 'reset_info':
      return null;
    case 'set_info':
      return action.payload.data;
    case 'update_type':
      return {
        ...userInfo,
        type: action.payload.type,
      };
    case 'update_name':
      return {
        ...userInfo,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        middleName: action.payload.middleName,
      };
    case 'update_gender':
      return {
        ...userInfo,
        gender: action.payload.gender,
      };
    default:
      return userInfo;
  }
};

const UserProvider = ({ children }) => {
  const { user } = useAuth();
  const [userInfo, userInfoDispatch] = useReducer(userInfoReducer, null);

  const hasSubjects = async () => {
    const userSubjectsRef = db
      .collection('accounts')
      .doc(user.uid)
      .collection('subjects');

    const subjectsCol = await userSubjectsRef.get();

    return subjectsCol.docs.length > 0;
  };

  const updateType = (type) => {
    const userRef = db.collection('accounts').doc(user.uid);
    return userRef.set({
      ...userInfo,
      type: type,
    });
  };

  const updateName = async (firstName, lastName, middleName) => {
    const userRef = db.collection('accounts').doc(user.uid);
    await userRef.set({
      ...userInfo,
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
    });
    userInfoDispatch({
      type: ACTIONS.UPDATE_NAME,
      payload: {
        firstName: firstName,
        lastName: lastName,
        middleName: middleName,
      },
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
    if (user) {
      const getUserInfo = async () => {
        const accountRef = db.collection('accounts').doc(user.uid);
        const account = await accountRef.get();
        userInfoDispatch({
          type: ACTIONS.SET_INFO,
          payload: { data: account.data() },
        });
      };

      const unsubscribe = getUserInfo();
      return unsubscribe;
    } else {
      userInfoDispatch({ type: ACTIONS.RESET_INFO });
    }
  }, [user]);

  const value = {
    userInfo,
    userInfoDispatch,
    updateType,
    updateName,
    updateGender,
    hasSubjects,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
