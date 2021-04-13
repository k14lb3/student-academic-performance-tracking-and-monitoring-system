import './AccountType.scss';
import { useState, useEffect, useRef } from 'react';
import { useUser } from 'contexts/UserContext';
import Loader from 'components/Loader';
import PopupNotification from 'components/PopupNotification';

const Gender = () => {
  const { userInfo, updateType, hasSubjects } = useUser();
  const typeRef = useRef();
  const [updateButton, setUpdateButton] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [popup, setPopup] = useState(false);
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
    setPopup(true);
    setUpdating(false);
    setUpdateButton(false);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="accountType">
          <PopupNotification
            popupState={{ popup: popup, setPopup: setPopup }}
            message="Account type updated"
          />
          <form onSubmit={handleSubmit}>
            <div>
              <label>Account type</label>
              <div className="input">
                <select
                  defaultValue={userInfo.type}
                  ref={typeRef}
                  onChange={handleChange}
                >
                  <option value="Instructor">Instructor</option>
                  <option value="Student">Student</option>
                </select>
              </div>
              {error && <div className="error">{error}</div>}
            </div>
            <button
              disabled={updating || !updateButton}
              className="accountType__updateButton button"
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

export default Gender;
