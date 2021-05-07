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

      const usersRef = db.collection('users');
      await usersRef.doc(user.uid).set({
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

  const deleteUser = async (type, password) => {
    try {
      await reauthenticateWithCredential(password);
    } catch (err) {
      throw new Error('The password you entered was incorrect.');
    }

    const usersRef = db.collection('users');

    const userRef = usersRef.doc(user.uid);

    const userArchivedSubjectsRef = userRef.collection('archived_subjects');

    const userArchivedSubjects = await userArchivedSubjectsRef.get();

    if (!userArchivedSubjects.empty) {
      userArchivedSubjects.forEach(async (subject) => {
        await userArchivedSubjectsRef.doc(subject.id).delete();
      });
    }

    const userSubjectsRef = userRef.collection('subjects');

    const userSubjects = await userSubjectsRef.get();

    if (!userSubjects.empty) {
      const userSubjectsCodes = userSubjects.docs.map((doc) => doc.id);

      const subjectsRef = db.collection('subjects');

      const subjects = await subjectsRef.get();

      const joinedSubjects = subjects.docs.filter((doc) =>
        userSubjectsCodes.includes(doc.id)
      );

      if (type === 'Instructor') {
        joinedSubjects.forEach(async (subject) => {
          const subjectRef = subjectsRef.doc(subject.id);

          const subjectStudentsRef = subjectRef.collection('students');

          const subjectStudents = await subjectStudentsRef.get();

          const { title, instructor } = subject.data();

          subjectStudents.forEach(async (student) => {
            subjectStudentsRef.doc(student.id).delete();

            const userRef = usersRef.doc(student.id);

            const userSubjectRef = userRef.collection('subjects');

            const userArchivedSubjectsRef = userRef.collection(
              'archived_subjects'
            );

            await userSubjectRef.doc(subject.id).delete();

            const { grade } = student.data();

            await userArchivedSubjectsRef.add({
              type: 'Student',
              title: title,
              instructor: instructor,
              grade: grade,
            });

            const subjectStudent = subjectStudentsRef.doc(student.id);

            await subjectStudent.delete();
          });

          subjectRef.delete();
        });
      } else {
        joinedSubjects.forEach((subject) => {
          const subjectRef = subjectsRef.doc(subject.id);

          const subjectStudentsRef = subjectRef.collection('students');

          subjectStudentsRef.doc(user.uid).delete();

          subjectRef.set({
            ...subject.data(),
            students: parseInt(subject.data().students) - 1,
          });
        });
      }
    }

    userSubjects.forEach((subject) => {
      userSubjectsRef.doc(subject.id).delete();
    });

    await userRef.delete();

    await auth.currentUser.delete();
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
    deleteUser,
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
