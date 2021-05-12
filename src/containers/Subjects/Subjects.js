import { useState, useEffect } from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { useUser } from 'contexts/UserContext';
import { useSubject } from 'contexts/SubjectContext';
import Button from 'components/Button/Button';
import Loader from 'components/Loader';
import PopupNotification from 'components/PopupNotification';
import ArchivedSubjects from './ArchivedSubjects';
import CreateSubjectModal from './Modal/CreateSubjectModal';
import JoinSubjectModal from './Modal/JoinSubjectModal';
import DeleteSubjectModal from './Modal/DeleteSubjectModal';
import Subject from './Subject/Subject';
import SubjectItem from './SubjectItem';

const MODAL = {
  JOIN_SUBJECT: 'join_subject',
  CREATE_SUBJECT: 'create_subject',
  DELETE_SUBJECT: 'delete_subject',
};

const Subjects = () => {
  const { userInfo } = useUser();
  const { subjects, getSubjects } = useSubject();
  const [toDelete, setToDelete] = useState({ archived: false, code: '' });
  const [openSubjectCode, setOpenSubjectCode] = useState('');
  const [modal, setModal] = useState('');
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

  const showModal = () => {
    const closeModal = () => {
      setModal('');
    };

    switch (modal) {
      case MODAL.CREATE_SUBJECT:
        return <CreateSubjectModal closeModal={closeModal} />;
      case MODAL.JOIN_SUBJECT:
        return <JoinSubjectModal closeModal={closeModal} />;
      case MODAL.DELETE_SUBJECT:
        return (
          <DeleteSubjectModal toDelete={toDelete} closeModal={closeModal} />
        );
      default:
        return <></>;
    }
  };

  return (
    <>
      {popup.up && (
        <PopupNotification popupState={{ popup: popup, setPopup: setPopup }} />
      )}
      {modal && showModal()}
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
                        setModal(
                          userInfo.type === 'Instructor'
                            ? MODAL.CREATE_SUBJECT
                            : MODAL.JOIN_SUBJECT
                        );
                      }}
                    >
                      {userInfo.type === 'Instructor'
                        ? 'Create subject'
                        : 'Join subject'}
                    </Button>
                  </div>
                  {subjects.map((subject) => {
                    return (
                      <SubjectItem
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
                          setModal(MODAL.DELETE_SUBJECT);
                        }}
                        openSubject={(code) => {
                          setOpenSubjectCode(code);
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
                  deleteSubject={() => {
                    setModal(MODAL.DELETE_SUBJECT);
                  }}
                />
              )}
            />
            <Route
              exact
              path={`/subjects/${openSubjectCode}`}
              render={() => <Subject code={openSubjectCode} />}
            />
          </Switch>
        )}
      </div>
    </>
  );
};

export default Subjects;
