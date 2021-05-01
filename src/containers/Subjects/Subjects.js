import { useState, useEffect, useRef } from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { useUser } from 'contexts/UserContext';
import { useSubject } from 'contexts/SubjectContext';
import Button from 'components/Button/Button';
import Subject from 'components/Subject';
import Loader from 'components/Loader';
import PopupNotification from 'components/PopupNotification';
import ArchivedSubjects from './ArchivedSubjects';
import CreateSubjectModal from './Modal/CreateSubjectModal';
import JoinSubjectModal from './Modal/JoinSubjectModal';
import DeleteSubjectModal from './Modal/DeleteSubjectModal';

const Subjects = () => {
  const { userInfo } = useUser();
  const { subjects, getSubjects } = useSubject();
  const [toDelete, setToDelete] = useState({ archived: false, code: '' });
  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [popup, setPopup] = useState({ up: false, message: '' });
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
    <>
      {popup.up && (
        <PopupNotification popupState={{ popup: popup, setPopup: setPopup }} />
      )}
      {deleteModal && (
        <DeleteSubjectModal toDelete={toDelete} setModal={setDeleteModal} />
      )}
      <div className="flex items-center py-5 xs:pt-0 xs:pb-3 border-solid border-b border-orange-500">
        <h1 className="text-5xl xs:text-3xl">Subjects</h1>
      </div>
      <div
        className={`${loading ? '' : 'py-5'} ${
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
                  {modal &&
                    (userInfo.type === 'Instructor' ? (
                      <CreateSubjectModal setModal={setModal} />
                    ) : (
                      <JoinSubjectModal setModal={setModal} />
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
                        setModal(true);
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
                        setPopup={setPopup}
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
                        deleteSubject={({ archived, code }) => {
                          setToDelete({ archived, code });
                          setDeleteModal(true);
                        }}
                      />
                    );
                  })}
                </>
              )}
            />
            <Route
              path="/subjects/archived"
              render={() => (
                <ArchivedSubjects
                  setToDelete={setToDelete}
                  setDeleteModal={setDeleteModal}
                />
              )}
            />
          </Switch>
        )}
      </div>
    </>
  );
};

export default Subjects;
