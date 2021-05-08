import React, { useReducer, useEffect, useContext, createContext } from 'react';
import { db } from 'firebase.js';
import { useAuth } from './AuthContext';
import { useUser } from './UserContext';

const SubjectContext = createContext();

export const useSubject = () => useContext(SubjectContext);

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

const generateCode = async () => {
  const characters =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  let code, duplicate;
  do {
    code = '';

    for (let i = 0; i < 7; i++) {
      code += characters[Math.floor(Math.random() * characters.length)];
    }

    duplicate = await doesSubjectExists(code);
  } while (duplicate);

  return code;
};

const doesSubjectExists = async (code) => {
  const subjectsRef = db.collection('subjects');
  const subjectRef = subjectsRef.doc(code);
  const subject = await subjectRef.get();
  return subject.exists;
};

const SubjectProvider = ({ children }) => {
  const { user } = useAuth();
  const { userInfo } = useUser();
  const [subjects, subjectsDispatch] = useReducer(subjectsReducer);
  const [archivedSubjects, archivedSubjectsDispatch] = useReducer(
    subjectsReducer,
    []
  );

  const createSubject = async (title) => {
    const code = await generateCode();
    const usersRef = db.collection('users');
    const userRef = usersRef.doc(user.uid);
    const userSubjectsRef = userRef.collection('subjects');
    const userSubjectRef = userSubjectsRef.doc(code);
    await userSubjectRef.set({});

    const subjectsRef = db.collection('subjects');
    const subjectRef = subjectsRef.doc(code);
    await subjectRef.set({
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

    if (!(await doesSubjectExists(code))) {
      throw new Error('Subject with that code does not exist.');
    }

    const usersRef = db.collection('users');
    const userRef = usersRef.doc(user.uid);
    const userSubjectsRef = userRef.collection('subjects');
    const userSubjectRef = userSubjectsRef.doc(code);
    await userSubjectRef.set({});

    const subjectsRef = db.collection('subjects');
    const subjectRef = subjectsRef.doc(code);
    const subjectStudentsRef = subjectRef.collection('students');
    const subjectStudentRef = subjectStudentsRef.doc(user.uid);
    await subjectStudentRef.set({ grade: '' });

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
    const usersRef = db.collection('users');
    const userRef = usersRef.doc(user.uid);

    const subjectsRef = db.collection('subjects');
    const subjectRef = subjectsRef.doc(code);
    const subjectSnapshot = await subjectRef.get();
    const { title, instructor, students } = subjectSnapshot.data();

    const userArchivedSubjectsRef_instructor = userRef.collection(
      'archived_subjects'
    );
    const userArchivedSubjectRef_instructor = await userArchivedSubjectsRef_instructor.add(
      {
        type: 'Instructor',
        title: title,
        students: students,
      }
    );

    const archive = async (id, grade) => {
      const userRef_student = usersRef.doc(id);
      const user_studentSnapshot = await userRef_student.get();
      const { firstName, lastName, middleName } = user_studentSnapshot.data();

      const name = `${lastName}, ${firstName} ${middleName}`;

      const finalGrade = grade || 'inc';

      const userArchivedSubjectRef_student = userRef_student.collection(
        'archived_subjects'
      );
      await userArchivedSubjectRef_student.add({
        type: 'Student',
        title: title,
        instructor: instructor,
        grade: finalGrade,
      });

      const userArchivedSubjectStudentsRef_instructor = userArchivedSubjectsRef_instructor
        .doc(userArchivedSubjectRef_instructor.id)
        .collection('students');

      userArchivedSubjectStudentsRef_instructor.doc(id).set({
        name: name,
        grade: finalGrade,
      });

      const userSubjectRef_student = userRef_student
        .collection('subjects')
        .doc(code);
      await userSubjectRef_student.delete();

      const subjectStudentsRef = subjectRef.collection('students');
      const subjectStudentRef = subjectStudentsRef.doc(id);
      await subjectStudentRef.delete();
    };

    const subjectStudentsRef = subjectRef.collection('students');
    const subjectStudentsSnapshot = await subjectStudentsRef.get();
    subjectStudentsSnapshot.forEach(async (student) => {
      await archive(student.id, student.data().grade);
    });

    const userSubjectsRef = userRef.collection('subjects');
    const userSubjectRef = userSubjectsRef.doc(code);
    await userSubjectRef.delete();

    await subjectRef.delete();

    subjectsDispatch({ type: ACTIONS.DELETE_SUBJECT, payload: { code: code } });

    archivedSubjectsDispatch({
      type: ACTIONS.ADD_SUBJECT,
      payload: { subject: subjectSnapshot.data() },
    });
  };

  const deleteSubject = async ({ archived, code }) => {
    if (archived) {
      await db
        .collection('users')
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
        .collection('users')
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
    const usersRef = db.collection('users');
    const userRef = usersRef.doc(user.uid);
    const userSubjectsRef = userRef.collection('subjects');
    const userSubjectsSnapshot = await userSubjectsRef.get();
    const userSubjects = userSubjectsSnapshot.docs.map((doc) => doc.id);

    const subjectsRef = db.collection('subjects');
    const subjectsSnapshot = await subjectsRef.get();
    const joinedSubjects = subjectsSnapshot.docs.filter((doc) =>
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
    const subjectStudentsRef = subjectRef.collection('students');
    const subjectStudents = await subjectStudentsRef.get();
    const usersRef = db.collection('users');
    const students = subjectStudents.docs.map(async (student) => {
      const userRef = usersRef.doc(student.id);
      const user = await userRef.get();
      const { firstName, lastName, middleName } = user.data();
      const name = `${lastName}, ${firstName} ${middleName}`;
      return {
        id: student.id,
        name: name,
        grade: student.data().grade,
      };
    });
    const subject = await subjectRef.get();
    return {
      ...subject.data(),
      students: await Promise.all(students),
    };
  };

  const getArchivedSubjects = async () => {
    const userSubjectsRef = db
      .collection('users')
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

  const getArchivedSubject = async (code) => {
    const usersRef = db.collection('users');
    const userRef = usersRef.doc(user.uid);
    const userArchivedSubjectsRef = userRef.collection('archived_subjects');
    const userArchivedSubjectRef = userArchivedSubjectsRef.doc(code);
    const userArchivedSubjectStudentsRef = userArchivedSubjectRef.collection(
      'students'
    );
    const userArchivedSubject = await userArchivedSubjectRef.get();
    const userArchivedSubjectsStudents = await userArchivedSubjectStudentsRef.get();
    return {
      title: userArchivedSubject.data().title,
      students: userArchivedSubjectsStudents.docs.map((students) =>
        students.data()
      ),
    };
  };

  useEffect(() => {
    if (!user) {
      subjectsDispatch({ type: ACTIONS.RESET_SUBJECTS });
    }
  }, [user]);

  const updateTitle = async (code, title) => {
    const subjectsRef = db.collection('subjects');
    const subjectRef = subjectsRef.doc(code);
    subjectRef.update({ title: title });
    console.log('hi');
  };

  const value = {
    subjects,
    archivedSubjects,
    getSubjects,
    getSubject,
    getArchivedSubjects,
    getArchivedSubject,
    createSubject,
    joinSubject,
    archiveSubject,
    deleteSubject,
    updateTitle,
  };

  return (
    <SubjectContext.Provider value={value}>{children}</SubjectContext.Provider>
  );
};

export default SubjectProvider;
