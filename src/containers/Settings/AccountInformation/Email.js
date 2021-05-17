import { useState, useEffect, useRef } from 'react';
import { useAuth } from 'contexts/AuthContext';
import Loader from 'components/Loader';
import Button from 'components/Button/Button';
import Label from 'components/Label';
import Input from 'components/Input';
import Error from 'components/Error';

const Email = ({ setPopup }) => {
  const { user, updateEmail } = useAuth();
  const emailRef = useRef();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updateButton, setUpdateButton] = useState(false);
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

  const handleUpdate = async () => {
    if (updateButton) {
      setError('');
      setUpdating(true);
      try {
        await updateEmail(emailRef.current.value);
        setPopup({ up: true, message: 'Email updated' });
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
        <>
          <div className="p-5 xs:p-3 border border-orange-500 rounded">
            <Label>Email</Label>
            <Input
              ref={emailRef}
              className="w-full"
              defaultValue={user.email}
              type="text"
              onChange={handleChange}
            />
            {error && <Error error={error} />}
          </div>
          <Button
            disabled={!updateButton}
            className="mt-5 ml-auto"
            hasLoader={{ loading: updating }}
            onClick={handleUpdate}
          >
            <span className={updating ? 'invisible' : ''}>Update</span>
          </Button>
        </>
      )}
    </>
  );
};

export default Email;
