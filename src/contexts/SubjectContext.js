import React, { useReducer, useContext, createContext } from 'react';
import { useAuth } from './AuthContext';
import { useUser } from './UserContext';
import { db } from '../firebase';

const SubjectContext = createContext();

export const useSubject = () => useContext(SubjectContext);

export const ACTIONS = {
  INSTRUCTOR_SUBJECTS: 'instructor_subjects',
  STUDENT_SUBJECTS: 'student_subjects',
};

const subjectsReducer = (subjects, action) => {
  switch (action.type) {
    case 'instructor_subjects':
      return action.payload.data.map((doc) => ({
        code: doc.id,
        title: doc.data().title,
        students: doc.data().students,
      }));
    case 'student_subjects':
      return action.payload.data.map((doc) => ({
        code: doc.id,
        title: doc.data().title,
        instructor: doc.data().instructor,
      }));
    default:
      return subjects;
  }
};

const SubjectProvider = ({ children }) => {
  const { user } = useAuth();
  const { userInfo } = useUser();
  const [subjects, subjectsDispatch] = useReducer(subjectsReducer, null);

  const doesExist = async (code) => {
    const subjectRef = db.collection('subjects').doc(code);
    const subject = await subjectRef.get();
    return subject.exists;
  };

  const getSubjects = async () => {
    const userSubjectsRef = db
      .collection('accounts')
      .doc(user.uid)
      .collection('subjects');
    const userSubjectsCol = await userSubjectsRef.get();

    const userSubjects = userSubjectsCol.docs.map((doc) => doc.id);

    const subjectsRef = db.collection('subjects');
    const subjectsCol = await subjectsRef.orderBy('title', 'asc').get();

    const subjects = subjectsCol.docs.filter((doc) =>
      userSubjects.includes(doc.id)
    );

    subjectsDispatch({
      type:
        userInfo.type === 'Instructor'
          ? ACTIONS.INSTRUCTOR_SUBJECTS
          : ACTIONS.STUDENT_SUBJECTS,
      payload: { data: subjects },
    });
  };

  const value = {
    subjects,
    getSubjects,
    doesExist,
  };

  return (
    <SubjectContext.Provider value={value}>{children}</SubjectContext.Provider>
  );
};

export default SubjectProvider;
