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
    confirmPassword,
    type,
    gender
  ) => {
    if (
      firstName.length === 0 ||
      lastName.length === 0 ||
      email.length === 0 ||
      password.length === 0 ||
      confirmPassword.length === 0 ||
      type.length === 0 ||
      gender.length === 0
    ) {
      throw new Error('Please fill in all the required fields.');
    }

    if (password.length < 8) {
      throw new Error('Your password needs to be at least 8 characters long.');
    }

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match.');
    }

    try {
      const register = await auth.createUserWithEmailAndPassword(
        email,
        password
      );

      const user = register.user;

      const accountsRef = db.collection('accounts');
      await accountsRef.doc(user.uid).set({
        type: type,
        firstName: firstName,
        lastName: lastName,
        middleName: middleName,
        gender: gender,
      });
    } catch (err) {
      if (err.message === 'The email address is badly formatted.') {
        throw new Error('Invalid email address format.');
      } else {
        throw new Error('Email address is already taken.');
      }
    }
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
