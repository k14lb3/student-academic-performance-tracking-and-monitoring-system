import { useState, useEffect } from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { useUser } from 'contexts/UserContext';
import { useSubject } from 'contexts/SubjectContext';
import Button from 'components/Button/Button';
import Subject from 'components/Subject';
import Loader from 'components/Loader';
import ArchivedSubjects from './ArchivedSubjects';
import CreateSubjectModal from './CreateSubjectModal';
import JoinSubjectModal from './JoinSubjectModal';

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
                    <Button
                      to="/subjects/archived"
                      className="xxx:mb-3"
                      link
                      outlined
                    >
                      Archived Subjects
                    </Button>
                    <Button
                      onClick={() => {
                        setSubjectModal(true);
                      }}
                    >
                      {userInfo.type === 'Instructor'
                        ? 'Create subject'
                        : 'Join subject'}
                    </Button>
                  </div>
                  {subjects.map((subject) => {
                    return (
                      <Subject
                        key={uuid()}
                        type={
                          userInfo.type === 'Instructor'
                            ? {
                                instructor: { students: subject.students },
                              }
                            : {
                                student: {
                                  instructor: subject.instructor,
                                  grade: subject.grade,
                                },
                              }
                        }
                        code={subject.code}
                        title={subject.title}
                      />
                    );
                  })}
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
