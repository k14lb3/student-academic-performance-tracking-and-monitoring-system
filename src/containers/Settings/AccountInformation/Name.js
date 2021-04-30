import { useState, useEffect, useRef } from 'react';
import { useUser } from 'contexts/UserContext';
import Loader from 'components/Loader';
import Button from 'components/Button/Button';
import Label from 'components/Label';
import Input from 'components/Input';

const Name = ({ setPopup }) => {
  const { userInfo, updateName } = useUser();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const middleNameRef = useRef();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updateButton, setUpdateButton] = useState(false);

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
      (firstName === userInfo.firstName &&
        lastName === userInfo.lastName &&
        middleName === userInfo.middleName) ||
      firstName === '' ||
      lastName === ''
    )
      return setUpdateButton(false);
    return setUpdateButton(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const firstName = firstNameRef.current.value.trim(),
      lastName = lastNameRef.current.value.trim(),
      middleName = middleNameRef.current.value.trim();

    if (updateButton) {
      setUpdating(true);
      await updateName(firstName, lastName, middleName);
      setPopup({ up: true, message: 'Name updated' });
      setUpdateButton(false);
      setUpdating(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader className="mx-auto mt-5" />
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="p-5 xs:p-3 border border-orange-500 rounded">
            <Label>First Name</Label>
            <Input
              ref={firstNameRef}
              className="w-full mb-3"
              defaultValue={userInfo.firstName}
              type="text"
              onChange={handleChange}
            />
            <Label>Last Name</Label>
            <Input
              ref={lastNameRef}
              className="w-full mb-3"
              defaultValue={userInfo.lastName}
              type="text"
              onChange={handleChange}
            />
            <Label>Middle Name</Label>
            <Input
              ref={middleNameRef}
              className="w-full"
              defaultValue={userInfo.middleName}
              type="text"
              onChange={handleChange}
            />
          </div>
          <Button
            disabled={updating || !updateButton}
            className="mt-5 ml-auto"
            hasLoader={{ loading: updating }}
          >
            <span className={updating ? 'invisible' : ''}>Update</span>
          </Button>
        </form>
      )}
    </>
  );
};

export default Name;
