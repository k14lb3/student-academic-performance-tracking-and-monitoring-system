import React, { useReducer, useEffect, useContext, createContext } from 'react';
import { db } from 'firebase.js';
import { useAuth } from './AuthContext';
import { useUser } from './UserContext';

const SubjectContext = createContext();

export const useSubject = () => useContext(SubjectContext);

const characters =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export const ACTIONS = {
  RESET_SUBJECTS: 'reset_subjects',
  SET_SUBJECTS: 'set_subjects',
  ADD_SUBJECT: 'add_subject',
  DELETE_SUBJECT: 'delete_subject',
};

const subjectsReducer = (subjects, action) => {
  switch (action.type) {
    case 'reset_subjects':
      return null;
    case 'set_subjects':
      return action.payload.subjects;
    case 'add_subject':
      return [...subjects, action.payload.subject];
    case 'delete_subject':
      return subjects.filter((subject) => subject.code !== action.payload.code);
    default:
      return subjects;
  }
};

const SubjectProvider = ({ children }) => {
  const { user } = useAuth();
  const { userInfo } = useUser();
  const [subjects, subjectsDispatch] = useReducer(subjectsReducer, []);
  const [archivedSubjects, archivedSubjectsDispatch] = useReducer(
    subjectsReducer,
    []
  );

  const doesExist = async (code) => {
    const subjectRef = db.collection('subjects').doc(code);
    const subject = await subjectRef.get();
    return subject.exists;
  };

  const createSubject = async (title) => {
    const generateCode = async () => {
      let code, duplicate;
      do {
        code = '';

        for (let i = 0; i < 7; i++) {
          code += characters[Math.floor(Math.random() * characters.length)];
        }

        duplicate = await doesExist(code);
      } while (duplicate);

      return code;
    };

    const code = await generateCode();

    await db
      .collection('accounts')
      .doc(user.uid)
      .collection('subjects')
      .doc(code)
      .set({});

    await db
      .collection('subjects')
      .doc(code)
      .set({
        title: title,
        instructor: `${userInfo.lastName}, ${userInfo.firstName}${
          userInfo.middleName && ` ${userInfo.middleName[0]}.`
        }`,
        students: 0,
      });

    subjectsDispatch({
      type: ACTIONS.ADD_SUBJECT,
      payload: {
        subject: {
          code: code,
          title: title,
          students: 0,
        },
      },
    });
  };

  const joinSubject = async (code) => {
    if (code.length < 5 || code.length > 7) {
      throw new Error(
        'Subject codes are 5-7 characters that are made up of letters and numbers, and no spaces or symbols.'
      );
    }

    if (subjects.some((subject) => subject.code === code)) {
      throw new Error('You are already in the class with that key.');
    }

    if (!(await doesExist(code))) {
      throw new Error('Subject with that code does not exist.');
    }

    await db
      .collection('accounts')
      .doc(user.uid)
      .collection('subjects')
      .doc(code)
      .set({});

    const subjectRef = db.collection('subjects').doc(code);

    await subjectRef.collection('students').doc(user.uid).set({ grade: '' });

    const subject = await subjectRef.get();

    const { instructor, title, students } = subject.data();

    await subjectRef.set({
      title: title,
      instructor: instructor,
      students: parseInt(students) + 1,
    });

    subjectsDispatch({
      type: ACTIONS.ADD_SUBJECT,
      payload: {
        subject: {
          code: code,
          title: title,
          instructor: instructor,
          grade: '',
        },
      },
    });
  };

  const archiveSubject = async (code) => {
    const usersRef = db.collection('accounts');

    const userRef = usersRef.doc(user.uid);

    const subjectRef = db.collection('subjects').doc(code);

    const subject = await subjectRef.get();

    const { title, instructor, students } = subject.data();

    const userInstructorArchivedSubjectsRef = userRef.collection(
      'archived_subjects'
    );

    const userInstructorArchivedSubjectRef = await userInstructorArchivedSubjectsRef.add(
      {
        type: 'Instructor',
        title: title,
        students: students,
      }
    );

    const archive = async (id, grade) => {
      const userStudentRef = usersRef.doc(id);

      const userStudent = await userStudentRef.get();

      const { firstName, lastName, middleName } = userStudent.data();

      const name = `${lastName}, ${firstName} ${middleName}`;

      const finalGrade = grade || 'inc';

      const userStudentArchivedSubjectRef = userStudentRef.collection(
        'archived_subjects'
      );

      await userStudentArchivedSubjectRef.add({
        type: 'Student',
        title: title,
        instructor: instructor,
        grade: finalGrade,
      });

      const userInstructorArchivedSubjectStudentsRef = userInstructorArchivedSubjectsRef
        .doc(userInstructorArchivedSubjectRef.id)
        .collection('students');

      userInstructorArchivedSubjectStudentsRef.doc(id).set({
        name: name,
        grade: finalGrade,
      });

      const userSubjectRef = userStudentRef.collection('subjects').doc(code);

      await userSubjectRef.delete();

      const subjectStudentRef = subjectRef.collection('students').doc(id);

      await subjectStudentRef.delete();
    };

    const studentsRef = subjectRef.collection('students');

    const studentsCol = await studentsRef.get();

    studentsCol.forEach(async (student) => {
      await archive(student.id, student.data().grade);
    });

    const userSubjectRef = userRef.collection('subjects').doc(code);

    await userSubjectRef.delete();

    await subjectRef.delete();

    subjectsDispatch({ type: ACTIONS.DELETE_SUBJECT, payload: { code: code } });

    archivedSubjectsDispatch({
      type: ACTIONS.ADD_SUBJECT,
      payload: { subject: subject.data() },
    });
  };

  const deleteSubject = async ({ archived, code }) => {
    if (archived) {
      await db
        .collection('accounts')
        .doc(user.uid)
        .collection('archived_subjects')
        .doc(code)
        .delete();

      archivedSubjectsDispatch({
        type: ACTIONS.DELETE_SUBJECT,
        payload: { code: code },
      });
    } else {
      await db
        .collection('accounts')
        .doc(user.uid)
        .collection('subjects')
        .doc(code)
        .delete();

      const subjectRef = db.collection('subjects').doc(code);

      if (userInfo.type === 'Instructor') {
        await subjectRef.delete();
      } else {
        await subjectRef.collection('students').doc(user.uid).delete();
        const subject = await subjectRef.get();
        await subjectRef.set({
          ...subject.data(),
          students: parseInt(subject.data().students) - 1,
        });
      }
    }

    subjectsDispatch({ type: ACTIONS.DELETE_SUBJECT, payload: { code: code } });
  };

  const getSubjects = async () => {
    const userSubjectsRef = db
      .collection('accounts')
      .doc(user.uid)
      .collection('subjects');
    const userSubjectsCol = await userSubjectsRef.get();

    const userSubjects = userSubjectsCol.docs.map((doc) => doc.id);

    const subjectsRef = db.collection('subjects');
    const subjectsCol = await subjectsRef.get();

    const joinedSubjects = subjectsCol.docs.filter((doc) =>
      userSubjects.includes(doc.id)
    );

    let subjects;

    if (userInfo.type === 'Instructor') {
      subjects = joinedSubjects.map((subject) => ({
        code: subject.id,
        title: subject.data().title,
        students: subject.data().students,
      }));
    } else {
      const getGrade = async (code) => {
        const userSubjectRef = db
          .collection('subjects')
          .doc(code)
          .collection('students')
          .doc(user.uid);

        const userSubject = await userSubjectRef.get();
        return userSubject.data().grade;
      };

      subjects = joinedSubjects.map(async (subject) => ({
        code: subject.id,
        title: subject.data().title,
        instructor: subject.data().instructor,
        grade: await getGrade(subject.id),
      }));

      subjects = await Promise.all(subjects);
    }

    subjectsDispatch({
      type: ACTIONS.SET_SUBJECTS,
      payload: { subjects: subjects },
    });
  };

  const getSubject = async (code) => {
    const subjectsRef = db.collection('subjects');
    const subjectRef = subjectsRef.doc(code);
    const subject = await subjectRef.get();
    return subject.data();
 };

  const getArchivedSubjects = async () => {
    const userSubjectsRef = db
      .collection('accounts')
      .doc(user.uid)
      .collection('archived_subjects');
    const userSubjectsCol = await userSubjectsRef.get();

    const archivedSubjects = userSubjectsCol.docs.map((doc) => ({
      code: doc.id,
      ...doc.data(),
    }));

    archivedSubjectsDispatch({
      type: ACTIONS.SET_SUBJECTS,
      payload: { subjects: archivedSubjects },
    });
  };

  useEffect(() => {
    if (!user) {
      subjectsDispatch({ type: ACTIONS.RESET_SUBJECTS });
    }
  }, [user]);

  useEffect(() => {
    if (subjects) {
      subjects.sort((a, b) => {
        const sA = a.title.toLowerCase();
        const sB = b.title.toLowerCase();
        if (sA < sB) {
          return -1;
        }
        if (sA > sB) {
          return 1;
        }
        return 0;
      });
    } else {
    }
  }, [subjects]);

  const value = {
    subjects,
    archivedSubjects,
    getSubjects,
    getSubject,
    getArchivedSubjects,
    createSubject,
    joinSubject,
    archiveSubject,
    deleteSubject,
  };

  return (
    <SubjectContext.Provider value={value}>{children}</SubjectContext.Provider>
  );
};

export default SubjectProvider;
