import React, { useState, useEffect, useContext, createContext } from 'react';
import { db, auth, firebaseAuth } from 'firebase.js';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  const register = async (
    firstName,
    lastName,
    middleName,
    email,
    password,
    type,
    gender
  ) => {
    const register = await auth.createUserWithEmailAndPassword(email, password);
    const user = register.user;

    const accountsRef = db.collection('accounts');
    await accountsRef.doc(user.uid).set({
      type: type,
      firstName: firstName,
      lastName: lastName,
      middleName: middleName,
      gender: gender,
    });
  };

  const signIn = (email, password) =>
    auth.signInWithEmailAndPassword(email, password);

  const signOut = () => auth.signOut();

  const reauthenticateWithCredential = (password) => {
    const credential = firebaseAuth.EmailAuthProvider.credential(
      user.email,
      password
    );
    return user.reauthenticateWithCredential(credential);
  };

  const updateEmail = (email) => user.updateEmail(email);

  const updatePassword = (password) => user.updatePassword(password);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    register,
    signIn,
    signOut,
    reauthenticateWithCredential,
    updateEmail,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
