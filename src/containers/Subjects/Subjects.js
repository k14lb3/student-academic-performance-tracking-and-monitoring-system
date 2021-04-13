import './Subjects.scss';
import { useState, useEffect } from 'react';
import { Switch, Route, Link, useLocation } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { useUser } from 'contexts/UserContext';
import { useSubject } from 'contexts/SubjectContext';
import Loader from 'components/Loader';
import ArchivedSubjects from './ArchivedSubjects';
import CreateSubjectModal from './CreateSubjectModal';
import JoinSubjectModal from './JoinSubjectModal';
import InstructorSubject from './InstructorSubject';
import StudentSubject from './StudentSubject';

const Subjects = () => {
  const { userInfo } = useUser();
  const { subjects, getSubjects } = useSubject();
  const [subjectModal, setSubjectModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

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

  return (
    <div className="subjects">
      <div className="subjects__header">
        <h1 className="subjects__title">Subjects</h1>
      </div>
      <div
        className={`subjects__body${
          location.pathname === '/subjects/archived' ? ' archivedSubjects' : ''
        }`}
      >
        {loading ? (
          <Loader />
        ) : (
          <Switch>
            <Route
              exact
              path="/subjects"
              component={() => (
                <>
                  {subjectModal &&
                    (userInfo.type === 'Instructor' ? (
                      <CreateSubjectModal setSubjectModal={setSubjectModal} />
                    ) : (
                      <JoinSubjectModal setSubjectModal={setSubjectModal} />
                    ))}
                  <div className="subjects__controls">
                    <Link
                      to="/subjects/archived"
                      className="button button--outline"
                    >
                      Archived Subjects
                    </Link>
                    <button
                      className="button"
                      onClick={() => {
                        setSubjectModal(true);
                      }}
                    >
                      {userInfo.type === 'Instructor'
                        ? 'Create subject'
                        : 'Join subject'}
                    </button>
                  </div>
                  {userInfo.type === 'Instructor'
                    ? subjects.map(({ code, title, students }) => (
                        <InstructorSubject
                          key={uuid()}
                          code={code}
                          title={title}
                          students={students}
                        />
                      ))
                    : subjects.map(({ code, title, instructor, grade }) => (
                        <StudentSubject
                          key={uuid()}
                          code={code}
                          title={title}
                          instructor={instructor}
                          grade={grade}
                        />
                      ))}
                </>
              )}
            />
            <Route path="/subjects/archived" component={ArchivedSubjects} />
          </Switch>
        )}
      </div>
    </div>
  );
};

export default Subjects;
