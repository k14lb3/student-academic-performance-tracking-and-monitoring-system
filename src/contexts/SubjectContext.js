import React, { useReducer, useContext, createContext } from 'react';
import { useAuth } from './AuthContext';
import { useUser } from './UserContext';
import { db } from '../firebase';

const SubjectContext = createContext();

export const useSubject = () => useContext(SubjectContext);

export const ACTIONS = {
  RESET_SUBJECTS: 'reset_subjects',
  SET_INSTRUCTOR_SUBJECTS: 'set_instructor_subjects',
  SET_STUDENT_SUBJECTS: 'set_student_subjects',
};

const subjectsReducer = (subjects, action) => {
  switch (action.type) {
    case 'reset_subjects':
      return null;
    case 'set_instructor_subjects':
      return action.payload.data.map((doc) => ({
        code: doc.id,
        title: doc.data().title,
        students: doc.data().students,
      }));
    case 'set_student_subjects':
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
    subjectsDispatch({ type: ACTIONS.RESET_SUBJECTS });

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
          ? ACTIONS.SET_INSTRUCTOR_SUBJECTS
          : ACTIONS.SET_STUDENT_SUBJECTS,
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
