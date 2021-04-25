import { useState, useEffect } from 'react';
import { Switch, Route, Link, useLocation } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { useUser } from 'contexts/UserContext';
import { useSubject } from 'contexts/SubjectContext';
import Subject from 'components/Subject';
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
    <div className="w-full">
      <div className="flex items-center py-5 xs:pt-0 xs:pb-3 border-solid border-b border-orange-500">
        <h1 className="text-5xl xs:text-3xl">Subjects</h1>
      </div>
      <div
        className={`${loading ? '' : 'pt-5'} ${
          location.pathname === '/subjects/archived' ? ' archivedSubjects' : ''
        }`}
      >
        {loading ? (
          <Loader className="mx-auto mt-5" />
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
                  <div className="flex xxx:flex-col mb-5 justify-between">
                    <Link
                      to="/subjects/archived"
                      className="button button--outline xxx:mb-3"
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
                  <Subject
                    subject={{ type: { instructor: { students: '69' } } }}
                    code="oGAY3pP"
                    title="Integral Calculus"
                  />
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
