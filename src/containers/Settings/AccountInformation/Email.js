import './Email.scss';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from 'contexts/AuthContext';
import Loader from 'components/Loader';
import PopupNotification from 'components/PopupNotification';

const Email = () => {
  const { user, updateEmail } = useAuth();
  const emailRef = useRef();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updateButton, setUpdateButton] = useState(false);
  const [popup, setPopup] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  const handleChange = () => {
    const email = emailRef.current.value.trim();
    if (email === user.email || email === '') return setUpdateButton(false);
    return setUpdateButton(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (updateButton) {
      setError('');
      setUpdating(true);
      try {
        await updateEmail(emailRef.current.value);
        setPopup(true);
        setUpdateButton(false);
      } catch (err) {
        setError('Invalid email address format.');
      }
      setUpdating(false);
    }
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
              {error && <div className="error">{error}</div>}
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
