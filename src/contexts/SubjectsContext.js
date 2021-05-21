import { useReducer, useEffect, createContext, useContext } from 'react';
import { REF } from 'refs';
import { useAuth } from './AuthContext';
import { useUser } from './UserContext';

const SubjectsContext = createContext();

export const useSubjects = () => useContext(SubjectsContext);

export const ACTIONS = {
  RESET_SUBJECTS: 'reset_subjects',
  SET_SUBJECTS: 'set_subjects',
  SET_ARCHIVED_SUBJECTS: 'set_archived_subjects',
  ADD_SUBJECT: 'add_subject',
  ARCHIVE_SUBJECT: 'archive_subject',
  DELETE_CURRENT_SUBJECT: 'delete_current_subject',
  DELETE_ARCHIVED_SUBJECT: 'delete_archived_subject',
  UPDATE_SUBJECT_TITLE: 'update_subject_title',
};

const doesSubjectExists = async (code) => {
  const subjectSnapshot = await REF.SUBJECT({ subject_code: code }).get();
  return subjectSnapshot.exists;
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

const subjectsInitialState = {
  current: [],
  archived: [],
};

const subjectsReducer = (subjects, action) => {
  switch (action.type) {
    case 'reset_subjects':
      return subjectsInitialState;
    case 'set_subjects':
      return {
        current: action.payload.subjects,
        archived: [...subjects.archived],
      };
    case 'set_archived_subjects':
      return {
        current: [...subjects.current],
        archived: action.payload.subjects,
      };
    case 'add_subject':
      return {
        current: [...subjects.current, action.payload.subject],
        archived: [...subjects.archived],
      };
    case 'archive_subject':
      return {
        current: subjects.current.filter(
          (subject) => subject.code !== action.payload.code
        ),
        archived: [...subjects.archived, action.payload.subject],
      };
    case 'delete_current_subject':
      return {
        current: subjects.current.filter(
          (subject) => subject.code !== action.payload.code
        ),
        archived: [...subjects.archived],
      };
    case 'delete_archived_subject':
      return {
        current: [...subjects.current],
        archived: subjects.archived.filter(
          (subject) => subject.code !== action.payload.code
        ),
      };
    case 'update_subject_title':
      return {
        current: subjects.current.map((subject) => {
          if (subject.code === action.payload.code) {
            return {
              ...subject,
              title: action.payload.title,
            };
          }
          return subject;
        }),
        archived: [...subjects.archived],
      };
    default:
      return subjects;
  }
};

const SubjectsProvider = ({ children }) => {
  const { user } = useAuth();
  const { userInfo } = useUser();
  const [subjects, subjectsDispatch] = useReducer(
    subjectsReducer,
    subjectsInitialState
  );
  const createSubject = async (title) => {
    const code = await generateCode();

    await REF.USER_SUBJECT({ user_uid: user.uid, subject_code: code }).set({});

    await REF.SUBJECT({ subject_code: code }).set({
      title: title,
      instructor: `${userInfo.lastName}, ${userInfo.firstName}${
        userInfo.middleName && ` ${userInfo.middleName[0]}.`
      }`,
      students: 0,
      lectures: 40,
      exercises: [],
      assignments: [],
      quizzes: [],
      majorExaminations: {
        prelim: {
          score: 100,
        },
        midterm: {
          score: 100,
        },
        semiFinals: {
          score: 100,
        },
        finals: {
          score: 100,
        },
      },
      percentages: {
        activities: 10,
        attendance: 10,
        majorExaminations: 80,
      },
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

    if (subjects.current.some((subject) => subject.code === code)) {
      throw new Error('You are already in the class with that key.');
    }

    if (!(await doesSubjectExists(code))) {
      throw new Error('Subject with that code does not exist.');
    }

    const subjectSnapshot = await REF.SUBJECT({ subject_code: code }).get();
    const { instructor, title, students, exercises, assignments, quizzes } =
      subjectSnapshot.data();

    await REF.SUBJECT({ subject_code: code }).update({
      students: students + 1,
    });

    await REF.USER_SUBJECT({ user_uid: user.uid, subject_code: code }).set({});

    await REF.SUBJECT_STUDENT({
      subject_code: code,
      student_uid: user.uid,
    }).set({
      grade: '',
      lectures: 0,
      exercises: exercises.map(() => ({
        score: 0,
      })),
      assignments: assignments.map(() => ({
        score: 0,
      })),
      quizzes: quizzes.map(() => ({
        score: 0,
      })),
      majorExaminations: {
        prelim: { score: 0 },
        midterm: { score: 0 },
        semiFinals: { score: 0 },
        finals: { score: 0 },
      },
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
    const subjectSnapshot = await REF.SUBJECT({ subject_code: code }).get();
    const { title, instructor, students } = subjectSnapshot.data();

    const archivedSubjectSnapshot = await REF.USER_ARCHIVED_SUBJECTS({
      user_uid: user.uid,
    }).add({
      type: 'Instructor',
      title: title,
      students: students,
    });

    const archive = async (id, grade) => {
      const userSnapshot = await REF.USER({ user_uid: id }).get();
      const { firstName, lastName, middleName } = userSnapshot.data();

      const finalGrade = grade || 'inc';

      await REF.USER_ARCHIVED_SUBJECTS({ user_uid: id }).add({
        type: 'Student',
        title: title,
        instructor: instructor,
        grade: finalGrade,
      });

      await REF.USER_ARCHIVED_SUBJECT_STUDENT({
        user_uid: user.uid,
        subject_code: archivedSubjectSnapshot.id,
        student_uid: id,
      }).set({
        name: `${lastName}, ${firstName} ${middleName}`,
        grade: finalGrade,
      });

      await REF.USER_SUBJECT({ user_uid: id, subject_code: code }).delete();

      await REF.SUBJECT_STUDENT({
        subject_code: code,
        student_uid: id,
      }).delete();
    };

    const subjectStudentsSnapshot = await REF.SUBJECT_STUDENTS({
      subject_code: code,
    }).get();

    subjectStudentsSnapshot.forEach(async (student) => {
      await archive(student.id, student.data().grade);
    });

    await REF.USER_SUBJECT({ user_uid: user.uid, subject_code: code }).delete();
    await REF.SUBJECT({ subject_code: code }).delete();

    subjectsDispatch({
      type: ACTIONS.ARCHIVE_SUBJECT,
      payload: { code: code, subject: subjectSnapshot.data() },
    });
  };

  const deleteSubject = async ({ archived, code }) => {
    if (archived) {
      await REF.USER_ARCHIVED_SUBJECT({
        user_uid: user.uid,
        subject_code: code,
      }).delete();
      subjectsDispatch({
        type: ACTIONS.DELETE_ARCHIVED_SUBJECT,
        payload: { code: code },
      });
    } else {
      await REF.USER_SUBJECT({
        user_uid: user.uid,
        subject_code: code,
      }).delete();
      if (userInfo.type === 'Instructor') {
        await archiveSubject(code);
        await REF.SUBJECT({ subject_code: code }).delete();
      } else {
        await REF.SUBJECT_STUDENT({
          subject_code: code,
          student_uid: user.uid,
        }).delete();
        const subjectSnapshot = await REF.SUBJECT({ subject_code: code }).get();
        await REF.SUBJECT({ subject_code: code }).update({
          students: parseInt(subjectSnapshot.data().students) - 1,
        });
        subjectsDispatch({
          type: ACTIONS.DELETE_CURRENT_SUBJECT,
          payload: { code: code },
        });
      }
    }
  };

  const getSubjects = async () => {
    const userSubjectsSnapshot = await REF.USER_SUBJECTS({
      user_uid: user.uid,
    }).get();
    const userSubjects = userSubjectsSnapshot.docs.map((doc) => doc.id);

    const subjectsSnapshot = await REF.SUBJECTS().get();
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
        const subjectStudentSnapshot = await REF.SUBJECT_STUDENT({
          subject_code: code,
          student_uid: user.uid,
        }).get();
        return subjectStudentSnapshot.data().grade;
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

  const getArchivedSubjects = async () => {
    const userArchivedSubjectsSnapshot = await REF.USER_ARCHIVED_SUBJECTS({
      user_uid: user.uid,
    }).get();

    const archivedSubjects = userArchivedSubjectsSnapshot.docs.map((doc) => ({
      code: doc.id,
      ...doc.data(),
    }));

    subjectsDispatch({
      type: ACTIONS.SET_ARCHIVED_SUBJECTS,
      payload: { subjects: archivedSubjects },
    });
  };

  const getArchivedSubject = async (code) => {
    const userArchivedSubject = await REF.USER_ARCHIVED_SUBJECT({
      user_uid: user.uid,
      subject_code: code,
    }).get();
    const userArchivedSubjectsStudents =
      await REF.USER_ARCHIVED_SUBJECT_STUDENTS({
        user_uid: user.uid,
        subject_code: code,
      }).get();
    return {
      title: userArchivedSubject.data().title,
      students: userArchivedSubjectsStudents.docs.map((students) =>
        students.data()
      ),
    };
  };

  const updateTitle = async (code, title) => {
    subjectsDispatch({
      type: ACTIONS.UPDATE_SUBJECT_TITLE,
      payload: { code: code, title: title },
    });
  };

  useEffect(() => {
    if (!user) {
      subjectsDispatch({ type: ACTIONS.RESET_SUBJECTS });
    }
  }, [user]);

  const value = {
    subjects,
    getSubjects,
    getArchivedSubjects,
    getArchivedSubject,
    createSubject,
    joinSubject,
    deleteSubject,
    updateTitle,
  };

  return (
    <SubjectsContext.Provider value={value}>
      {children}
    </SubjectsContext.Provider>
  );
};

export default SubjectsProvider;
