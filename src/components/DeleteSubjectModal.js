import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import Loader from './Loader';

const DeleteSubjectModal = ({
  code,
  students,
  setDeleteModal,
  getUserSubjects,
}) => {
  const { user } = useAuth();
  const { userInfo } = useUser();
  const [loading, setLoading] = useState(false);

  const deleteSubject = async () => {
    setLoading(true);
    await db
      .collection('accounts')
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
      const { instructor, title, students } = subject.data();
      await subjectRef.set({
        title: title,
        instructor: instructor,
        students: parseInt(students) - 1,
      });
    }

    setLoading(false);
    setDeleteModal(false);
    getUserSubjects();
  };
  return (
    <div className="deleteSubjectModal modal">
      <div className="modal__inner">
        <div className="modal__header">
          <h1>Delete subject</h1>
          <button
            className="modal__closeButton button"
            onClick={() => {
              setDeleteModal(false);
            }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div>
          <p>
            {students > 0
              ? `Subject currently has ${
                  students === 1 ? 'a student' : 'students'
                }. `
              : ''}
            Are you really sure you want to delete the subject?
          </p>
          <div className="modal__buttonGroup">
            <button
              disabled={loading}
              className="modal__button button"
              onClick={() => {
                deleteSubject();
              }}
            >
              <span className={loading ? 'hidden' : ''}>Yes</span>
              {loading && <Loader />}
            </button>
            <button
              disabled={loading}
              className="modal__button button button--outline"
              onClick={() => {
                setDeleteModal(false);
              }}
            >
              No
            </button>
          </div>
        </div>
        <div
          className="modal__shadow"
          onClick={() => {
            setDeleteModal(false);
          }}
        ></div>
      </div>
    </div>
  );
};

export default DeleteSubjectModal;
