import './Subjects.scss';
import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { useUser } from '../contexts/UserContext';
import { useSubject } from '../contexts/SubjectContext';
import CreateSubjectModal from './CreateSubjectModal';
import JoinSubjectModal from './JoinSubjectModal';
import StudentSubject from './StudentSubject';
import InstructorSubject from './InstructorSubject';
import Loader from './Loader';

const Subjects = () => {
  const { userInfo } = useUser();
  const { subjects, getSubjects, doesExist } = useSubject();
  const [subjectModal, setSubjectModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userInfo) {
      const fetchSubjects = async () => {
        await getSubjects();
        setLoading(false);
      };
      fetchSubjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  const showModal = () => {
    if (!subjectModal) return;
    if (userInfo.type === 'Instructor')
      return (
        <CreateSubjectModal
          doesExist={doesExist}
          setSubjectModal={setSubjectModal}
        />
      );
    return (
      <JoinSubjectModal
        subjects={subjects}
        doesExist={doesExist}
        setSubjectModal={setSubjectModal}
      />
    );
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
          {userInfo.type === 'Instructor'
            ? subjects.map(({ code, title, students }) => (
                <InstructorSubject
                  key={uuid()}
                  code={code}
                  title={title}
                  students={students}
                  getUserSubjects={getSubjects}
                />
              ))
            : subjects.map(({ code, title, instructor, grade }) => (
                <StudentSubject
                  key={uuid()}
                  code={code}
                  title={title}
                  instructor={instructor}
                  grade={grade}
                  getUserSubjects={getSubjects}
                />
              ))}
        </div>
      )}
    </div>
  );
};

export default Subjects;
