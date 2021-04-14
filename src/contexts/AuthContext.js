import React, { useState, useEffect, useContext, createContext } from 'react';
import { auth, firebaseAuth } from 'firebase.js';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  const register = (email, password) =>
    auth.createUserWithEmailAndPassword(email, password);

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
