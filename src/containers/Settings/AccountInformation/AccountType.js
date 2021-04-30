import { useState, useEffect, useRef } from 'react';
import { useUser } from 'contexts/UserContext';
import Loader from 'components/Loader';
import Button from 'components/Button/Button';
import Label from 'components/Label';
import Select from 'components/Select';
import Error from 'components/Error';

const Gender = ({setPopup}) => {
  const { userInfo, updateType, hasSubjects } = useUser();
  const typeRef = useRef();
  const [updateButton, setUpdateButton] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userInfo) {
      setLoading(false);
    }
  }, [userInfo]);

  const handleChange = () => {
    if (typeRef.current.value === userInfo.type) return setUpdateButton(false);
    return setUpdateButton(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (updateButton) {
      const type = typeRef.current.value;

      setError('');
      setUpdating(true);
      if (await hasSubjects()) {
        setError(
          'You cannot change account type as long as you have active subjects.'
        );
        setUpdating(false);
        return;
      }
      await updateType(type);
      setPopup({ up: true, message: 'Account type updated' });
      setUpdating(false);
      setUpdateButton(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader className="mx-auto mt-5" />
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <div className="p-5 xs:p-3 border border-orange-500 rounded">
              <Label>Account type</Label>
              <Select
                ref={typeRef}
                className="w-32 xs:w-28"
                defaultValue={userInfo.type}
                onChange={handleChange}
              >
                <option value="Instructor">Instructor</option>
                <option value="Student">Student</option>
              </Select>
              {error && <Error error={error} />}
            </div>
            <Button
              disabled={updating || !updateButton}
              className="mt-5 ml-auto"
              hasLoader={{ loading: updating }}
            >
              <span className={updating ? 'invisible' : ''}>Update</span>
            </Button>
          </form>
        </>
      )}
    </>
  );
};

export default Gender;
