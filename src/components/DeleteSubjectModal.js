import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useSubject } from '../contexts/SubjectContext';
import Loader from './Loader';

const DeleteSubjectModal = ({ code, students, setDeleteModal }) => {
  const { deleteSubject } = useSubject();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await deleteSubject(code);
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
            Are you sure you want to delete the subject?
          </p>
          <div className="modal__buttonGroup">
            <button
              disabled={loading}
              className="modal__button button"
              onClick={() => {
                handleDelete();
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
