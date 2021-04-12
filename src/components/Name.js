import './Name.scss';
import { useState, useEffect, useRef } from 'react';
import { useUser, ACTIONS } from '../contexts/UserContext';
import PopupNotification from './PopupNotification';
import Loader from './Loader';

const Name = () => {
  const { userInfo, userInfoDispatch, updateName } = useUser();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const middleNameRef = useRef();
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
    const firstName = firstNameRef.current.value.trim(),
      lastName = lastNameRef.current.value.trim(),
      middleName = middleNameRef.current.value.trim();
    if (
      firstName === userInfo.firstName &&
      lastName === userInfo.lastName &&
      middleName === userInfo.middleName
    )
      return setUpdateButton(false);
    return setUpdateButton(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const firstName = firstNameRef.current.value.trim(),
      lastName = lastNameRef.current.value.trim(),
      middleName = middleNameRef.current.value.trim();

    setUpdating(true);
    await updateName(firstName, lastName, middleName);
    userInfoDispatch({
      type: ACTIONS.UPDATE_NAME,
      payload: {
        firstName: firstName,
        lastName: lastName,
        middleName: middleName,
      },
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
        <div className="name">
          <PopupNotification
            popupState={{ popup: popup, setPopup: setPopup }}
            message="Name updated"
          />
          <form onSubmit={handleSubmit}>
            <div>
              <div>
                <label>First Name</label>
                <div className="input">
                  <input
                    type="text"
                    defaultValue={userInfo.firstName}
                    ref={firstNameRef}
                    onChange={handleChange}
                  ></input>
                </div>
              </div>
              <div>
                <label>Last Name</label>
                <div className="input">
                  <input
                    type="text"
                    defaultValue={userInfo.lastName}
                    ref={lastNameRef}
                    onChange={handleChange}
                  ></input>
                </div>
              </div>
              <div>
                <label>Middle Name</label>
                <div className="input">
                  <input
                    type="text"
                    defaultValue={userInfo.middleName}
                    ref={middleNameRef}
                    onChange={handleChange}
                  ></input>
                </div>
              </div>
            </div>
            <button
              disabled={updating || !updateButton}
              className="name__updateButton button"
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

export default Name;
