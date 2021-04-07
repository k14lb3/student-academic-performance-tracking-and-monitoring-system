import { useState, useRef } from 'react';
import { useSubject } from '../contexts/SubjectContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Loader from './Loader';

const CreateSubjectModal = ({ setSubjectModal }) => {
  const { createSubject } = useSubject();
  const titleRef = useRef();
  const [loading, setLoading] = useState(false);
  const [createButton, setCreateButton] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    await createSubject(titleRef.current.value.trim());
    setSubjectModal(false);
  };

  const handleChange = () => {
    if (titleRef.current.value.trim().length > 0) return setCreateButton(false);
    setCreateButton(true);
  };

  return (
    <div className="createSubjectModal modal">
      <div className="modal__inner">
        <div className="modal__header">
          <h1 className="modal__title">Create subject</h1>
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
            <label>Title</label>
            <div className="input">
              <input
                ref={titleRef}
                type="text"
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <button
              disabled={loading || createButton}
              className="modal__button button"
            >
              <span className={loading ? 'hidden' : ''}>Create</span>
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

export default CreateSubjectModal;
