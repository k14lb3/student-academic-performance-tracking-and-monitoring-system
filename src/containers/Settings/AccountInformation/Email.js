import { useState, useEffect, useRef } from 'react';
import { useAuth } from 'contexts/AuthContext';
import Loader from 'components/Loader';
import Button from 'components/Button/Button';
import Input from 'components/Input';
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
        <Loader className="mx-auto mt-5" />
      ) : (
        <div>
          <PopupNotification
            popupState={{ popup: popup, setPopup: setPopup }}
            message="Email updated"
          />
          <form onSubmit={handleSubmit}>
            <div className="p-5 xs:p-3 border border-orange-500 rounded">
              <label>Email</label>
              <Input
                ref={emailRef}
                className="w-full"
                defaultValue={user.email}
                type="text"
                onChange={handleChange}
              />
              {error && <div className="error">{error}</div>}
            </div>
            <Button
              disabled={updating || !updateButton}
              className="mt-5 ml-auto"
              hasLoader={{ loading: updating }}
            >
              <span className={updating ? 'invisible' : ''}>Update</span>
            </Button>
          </form>
        </div>
      )}
    </>
  );
};

export default Email;
