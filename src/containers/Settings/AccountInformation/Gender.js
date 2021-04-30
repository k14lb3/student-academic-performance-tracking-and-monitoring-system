import { useState, useEffect, useRef } from 'react';
import { useUser, ACTIONS } from 'contexts/UserContext';
import Loader from 'components/Loader';
import Button from 'components/Button/Button';
import Label from 'components/Label';
import Select from 'components/Select';
import PopupNotification from 'components/PopupNotification';

const Gender = () => {
  const { userInfo, userInfoDispatch, updateGender } = useUser();
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

    if (updateButton) {
      const gender = genderRef.current.value;

      setUpdating(true);
      await updateGender(gender);
      userInfoDispatch({
        type: ACTIONS.UPDATE_GENDER,
        payload: { gender: gender },
      });
      setPopup(true);
      setUpdating(false);
      setUpdateButton(false);
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
            message="Gender updated"
          />
          <form onSubmit={handleSubmit}>
            <div className="p-5 xs:p-3 border border-orange-500 rounded">
              <Label>Gender</Label>
              <Select
                ref={genderRef}
                className="w-28 xs:w-24"
                defaultValue={userInfo.gender}
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="N/A">N/A</option>
              </Select>
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

export default Gender;
