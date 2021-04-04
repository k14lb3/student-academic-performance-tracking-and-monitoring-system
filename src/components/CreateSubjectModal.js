import { useState, useRef } from 'react';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Loader from './Loader';

const characters =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const CreateSubjectModal = ({
  doesExist,
  setSubjectModal,
  getUserSubjects,
}) => {
  const { user } = useAuth();
  const { userInfo } = useUser();
  const titleRef = useRef();
  const [loading, setLoading] = useState(false);
  const [createButton, setCreateButton] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const title = titleRef.current.value.trim();

    const generateCode = async () => {
      let code, duplicate;
      do {
        code = '';

        for (let i = 0; i < 7; i++) {
          code += characters[Math.floor(Math.random() * characters.length)];
        }

        duplicate = await doesExist(code);
      } while (duplicate);

      return code;
    };

    const code = await generateCode();

    await db
      .collection('accounts')
      .doc(user.uid)
      .collection('subjects')
      .doc(code)
      .set({});

    await db
      .collection('subjects')
      .doc(code)
      .set({
        title: title,
        instructor: `${userInfo.lastName}, ${userInfo.firstName}${
          userInfo.middleName && ` ${userInfo.middleName[0]}.`
        }`,
        students: 0,
      });
    setLoading(false);
    setSubjectModal(false);
    getUserSubjects();
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
