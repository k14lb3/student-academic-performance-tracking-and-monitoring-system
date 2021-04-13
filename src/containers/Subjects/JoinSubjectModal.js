import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useSubject } from 'contexts/SubjectContext';
import Loader from 'components/Loader';

const JoinSubjectModal = ({ setSubjectModal }) => {
  const { joinSubject } = useSubject();
  const codeRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const handleJoin = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);
    try {
      await joinSubject(codeRef.current.value.trim());
      setSubjectModal(false)
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
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
          <form onSubmit={handleJoin}>
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
