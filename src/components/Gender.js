import './Gender.scss';
import { useState, useEffect, useRef } from 'react';
import { useUser } from '../contexts/UserContext';
import PopupNotification from './PopupNotification';
import Loader from './Loader';

const Gender = () => {
  const { userInfo, setUserInfo, updateGender } = useUser();
  const genderRef = useRef();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updateButton, setUpdateButton] = useState(false);
  const [popup, setPopup] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setLoading(false);
    }
  }, [userInfo]);

  const handleChange = () => {
    if (genderRef.current.value === userInfo.gender)
      return setUpdateButton(false);
    return setUpdateButton(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setUpdating(true);
    await updateGender(genderRef.current.value);
    setUserInfo({
      ...userInfo,
      gender: genderRef.current.value,
    });
    setPopup(true);
    setUpdating(false);
    setUpdateButton(false);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="gender">
          <PopupNotification
            popupState={{ popup: popup, setPopup: setPopup }}
            message="Gender updated"
          />
          <form onSubmit={handleSubmit}>
            <div>
              <label>Gender</label>
              <div className="input">
                <select
                  defaultValue={userInfo.gender}
                  ref={genderRef}
                  onChange={handleChange}
                >
                  <option value="NA">N/A</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
            <button
              disabled={updating || !updateButton}
              className="gender__updateButton button"
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
