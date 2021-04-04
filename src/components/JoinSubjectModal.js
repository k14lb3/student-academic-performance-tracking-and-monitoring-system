import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import Loader from './Loader';

const JoinSubjectModal = ({
  userSubjects,
  getUserSubjects,
  doesExist,
  setSubjectModal,
}) => {
  const { user } = useAuth();
  const codeRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const code = codeRef.current.value.trim();

    setError('');
    if (code.length < 5 || code.length > 7) {
      return setError(
        'Subject codes are 5-7 characters that are made up of letters and numbers, and no spaces or symbols.'
      );
    }

    if (userSubjects.includes(code)) {
      return setError('You are already in the class with that key.');
    }

    setLoading(true);

    if (!(await doesExist(code))) {
      setLoading(false);
      return setError('Subject with that code does not exist.');
    }

    await db
      .collection('accounts')
      .doc(user.uid)
      .collection('subjects')
      .doc(code)
      .set({ grade: '' });

    const subjectRef = db.collection('subjects').doc(code);

    await subjectRef.collection('students').doc(user.uid).set({});

    const subject = await subjectRef.get();

    const { instructor, title, students } = subject.data();

    await subjectRef.set({
      title: title,
      instructor: instructor,
      students: parseInt(students) + 1,
    });

    setLoading(false);
    setSubjectModal(false);
    getUserSubjects();
  };

  return (
    <div className="joinSubjectModal modal">
      <div className="modal__inner">
        <div className="modal__header">
          <h1 className="modal__title">Join subject</h1>
          <button
            className="modal__closeButton button"
            onClick={() => {
              setSubjectModal(false);
            }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <label>Subject code</label>
            <div className="input">
              <input ref={codeRef} type="text" maxLength="7" />
            </div>
            {error && <div className="error">{error}</div>}
            <button disabled={loading} className="modal__button button">
              <span className={loading ? 'hidden' : ''}>Join</span>
              {loading && <Loader />}
            </button>
          </form>
        </div>
      </div>
      <div
        className="modal__shadow"
        onClick={() => {
          setSubjectModal(false);
        }}
      ></div>
    </div>
  );
};

export default JoinSubjectModal;
