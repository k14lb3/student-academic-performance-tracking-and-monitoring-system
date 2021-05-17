import { useState, useEffect, useRef } from 'react';
import { useUser } from 'contexts/UserContext';
import Loader from 'components/Loader';
import Button from 'components/Button/Button';
import Label from 'components/Label';
import Select from 'components/Select';

const Gender = ({ setPopup }) => {
  const { userInfo, updateGender } = useUser();
  const genderRef = useRef();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updateButton, setUpdateButton] = useState(false);

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

  const handleUpdate = async () => {
    if (updateButton) {
      const gender = genderRef.current.value;
      setUpdating(true);
      await updateGender(gender);
      setPopup({ up: true, message: 'Gender updated' });
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

export default Gender;
