import './Subjects.scss';
import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { db } from '../firebase';
import CreateSubjectModal from './CreateSubjectModal';
import JoinSubjectModal from './JoinSubjectModal';
import StudentSubject from './StudentSubject';
import InstructorSubject from './InstructorSubject';
import Loader from './Loader';

const Subjects = () => {
  const { user } = useAuth();
  const { userInfo } = useUser();
  const [subjectModal, setSubjectModal] = useState(false);
  const [userSubjects, setUserSubjects] = useState();
  const [subjects, setSubjects] = useState();
  const [loading, setLoading] = useState(true);

  const getUserSubjects = async () => {
    const userSubjectsRef = db
      .collection('accounts')
      .doc(user.uid)
      .collection('subjects');
    const allUserSubjects = await userSubjectsRef.get();
    setUserSubjects(allUserSubjects.docs.map((doc) => doc.id));
  };

  const doesExist = async (code) => {
    const subjectRef = db.collection('subjects').doc(code);
    const subject = await subjectRef.get();
    return subject.exists;
  };

  useEffect(() => {
    const unsubscribe = getUserSubjects();

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userInfo && userSubjects) {
      const getSubjects = async () => {
        const subjectsRef = db.collection('subjects');
        const allSubjects = await subjectsRef.orderBy('title', 'asc').get();

        const subjects = allSubjects.docs.filter((doc) =>
          userSubjects.includes(doc.id)
        );

        if (userInfo.type === 'Instructor') {
          setSubjects(
            subjects.map((doc) => ({
              code: doc.id,
              title: doc.data().title,
              students: doc.data().students,
            }))
          );
        } else {
          setSubjects(
            subjects.map((doc) => ({
              code: doc.id,
              title: doc.data().title,
              instructor: doc.data().instructor,
            }))
          );
        }
      };
      getSubjects();
    }
  }, [userInfo, userSubjects]);

  useEffect(() => {
    if (userInfo && subjects) {
      setLoading(false);
    }
  }, [userInfo, subjects]);

  const showModal = () => {
    if (!subjectModal) return;
    if (userInfo.type === 'Instructor')
      return (
        <CreateSubjectModal
          doesExist={doesExist}
          setSubjectModal={setSubjectModal}
          getUserSubjects={getUserSubjects}
        />
      );
    return (
      <JoinSubjectModal
        userSubjects={userSubjects}
        getUserSubjects={getUserSubjects}
        doesExist={doesExist}
        setSubjectModal={setSubjectModal}
      />
    );
  };
  const showSubjects = () => {
    if (userInfo.type === 'Instructor') {
      return subjects.map(({ code, title, students }) => (
        <InstructorSubject
          key={uuid()}
          code={code}
          title={title}
          students={students}
          getUserSubjects={getUserSubjects}
        />
      ));
    }

    return subjects.map(({ code, title, instructor, grade }) => (
      <StudentSubject
        key={uuid()}
        code={code}
        title={title}
        instructor={instructor}
        grade={grade}
        getUserSubjects={getUserSubjects}
      />
    ));
  };

  return (
    <div className="subjects">
      <div className="subjects__header">
        <h1 className="subjects__title">Subjects</h1>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="subjects__body">
          {showModal()}
          <button
            className="subjects__button button"
            onClick={() => {
              setSubjectModal(true);
            }}
          >
            {userInfo.type === 'Instructor' ? 'Create subject' : 'Join subject'}
          </button>
          {showSubjects()}
        </div>
      )}
    </div>
  );
};

export default Subjects;
