import { useState, useEffect, useRef } from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { useUser } from 'contexts/UserContext';
import { useSubject } from 'contexts/SubjectContext';
import Button from 'components/Button/Button';
import Subject from 'components/Subject';
import ArchivedSubjects from './ArchivedSubjects';
import Modal from 'components/Modal';
import Input from 'components/Input';
import Error from 'components/Error';
import Loader from 'components/Loader';
import PopupNotification from 'components/PopupNotification';

const Subjects = () => {
  const { userInfo } = useUser();
  const {
    subjects,
    getSubjects,
    createSubject,
    joinSubject,
    deleteSubject,
    archiveSubject,
  } = useSubject();
  const titleRef = useRef();
  const codeRef = useRef();
  const [toDelete, setToDelete] = useState({ archived: false, code: '' });
  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [popup, setPopup] = useState({ up: false, message: '' });
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const modalCreateSubject = async () => {
    setModalLoading(true);
    await createSubject(titleRef.current.value.trim());
    setModalLoading(false);
    setModal(false);
  };

  const modalJoinSubject = async () => {
    setModalError('');

    try {
      setModalLoading(true);
      await joinSubject(codeRef.current.value.trim());
      setModalLoading(false);
      setModal(false);
    } catch (err) {
      setModalError(err.message);
      setModalLoading(false);
    }
  };

  const modalDeleteSubject = async () => {
    const { archived, code } = toDelete;
    setModalLoading(true);
    if (archived) {
      await deleteSubject({ archived: archived, code: code });
    } else {
      if (userInfo.type === 'Instructor') {
        await archiveSubject(code);
      } else {
        deleteSubject({ code: code });
      }
    }
    setModalLoading(false);
    setDeleteModal(false);
  };

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
          <PopupNotification
            popupState={{ popup: popup, setPopup: setPopup }}
          />
        )}
      {deleteModal && (
        <Modal
          title={
            toDelete.archived || userInfo.type === 'Student'
              ? 'Delete subject'
              : 'Archive subject'
          }
          message={
            toDelete.archived || userInfo.type === 'Student'
              ? 'Do you really want to delete this subject?'
              : 'Do you really want to archive this subject?'
          }
          button={{
            yes: {
              label: (
                <span className={modalLoading ? 'invisible' : ''}>Yes</span>
              ),
              onClick: modalDeleteSubject,
              hasLoader: { loading: modalLoading },
            },
            no: {
              label: 'No',
              onClick: () => {
                setDeleteModal(false);
              },
            },
          }}
          closeModal={() => {
            setDeleteModal(false);
          }}
        ></Modal>
      )}
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
                  {modal &&
                    (userInfo.type === 'Instructor' ? (
                      <Modal
                        title="Create subject"
                        message="Enter subject title"
                        button={{
                          yes: {
                            label: (
                              <span className={modalLoading ? 'invisible' : ''}>
                                Create
                              </span>
                            ),
                            onClick: modalCreateSubject,
                            hasLoader: { loading: modalLoading },
                          },
                        }}
                        closeModal={() => {
                          setModal(false);
                        }}
                      >
                        <Input ref={titleRef} className="w-full mt-3" />
                      </Modal>
                    ) : (
                      <Modal
                        title="Join subject"
                        message="Enter subject code"
                        button={{
                          yes: {
                            label: (
                              <span className={modalLoading ? 'invisible' : ''}>
                                Join
                              </span>
                            ),
                            onClick: modalJoinSubject,
                            hasLoader: { loading: modalLoading },
                          },
                        }}
                        closeModal={() => {
                          setModal(false);
                        }}
                      >
                        <Input
                          ref={codeRef}
                          className="w-full mt-3"
                          maxLength="7"
                        />
                        <Error error={modalError} />
                      </Modal>
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
                        setModalError('');
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
