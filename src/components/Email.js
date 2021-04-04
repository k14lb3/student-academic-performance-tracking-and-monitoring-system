import './Email.scss';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PopupNotification from './PopupNotification';
import Loader from './Loader';

const Email = () => {
  const { user, updateEmail } = useAuth();
  const emailRef = useRef();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updateButton, setUpdateButton] = useState(false);
  const [popup, setPopup] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  const handleChange = () => {
    if (emailRef.current.value === user.email) return setUpdateButton(false);
    return setUpdateButton(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    await updateEmail(emailRef.current.value);
    setPopup(true);
    setUpdating(false);
    setUpdateButton(false);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="email">
          <PopupNotification
            popupState={{ popup: popup, setPopup: setPopup }}
            message="Email updated"
          />
          <form onSubmit={handleSubmit}>
            <div>
              <label>Email</label>
              <div className="input">
                <input
                  defaultValue={user.email}
                  type="text"
                  ref={emailRef}
                  onChange={handleChange}
                />
              </div>
            </div>
            <button
              disabled={updating || !updateButton}
              className="email__updateButton button"
            >
              <span className={updating ? 'hidden' : ''}>Update</span>
              {updating && <Loader />}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Email;
