import React, { useState, useRef } from 'react';
import { useAuth } from 'contexts/AuthContext';
import Label from 'components/Label';
import Input from 'components/Input';
import Button from 'components/Button/Button';
import Error from 'components/Error';

const errors = [
  'Your password needs to be at least 8 characters. Please enter a long one.',
  'Passwords do not match.',
  'New password cannot be the same as your existing password',
  'The password you entered was incorrect.',
];

const ChangePassword = ({ setPopup }) => {
  const { reauthenticateWithCredential, updatePassword } = useAuth();
  const currentPasswordRef = useRef();
  const newPasswordRef = useRef();
  const confirmNewPasswordRef = useRef();
  const [changeButton, setChangeButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPasswordRef.current.value.length < 8) {
      setError(0);
      return;
    }

    if (newPasswordRef.current.value !== confirmNewPasswordRef.current.value) {
      setError(1);
      return;
    }

    if (currentPasswordRef.current.value === newPasswordRef.current.value) {
      setError(2);
      return;
    }

    try {
      setError('');
      setLoading(true);
      setChangeButton(false);
      await reauthenticateWithCredential(currentPasswordRef.current.value);
      await updatePassword(newPasswordRef.current.value);
      setLoading(false);
      currentPasswordRef.current.value = '';
      newPasswordRef.current.value = '';
      confirmNewPasswordRef.current.value = '';
      setPopup({ up: true, message: 'Password changed' });
    } catch {
      setLoading(false);
      setError(3);
    }
  };

  const handleChange = () => {
    if (
      currentPasswordRef.current.value.length > 0 &&
      newPasswordRef.current.value.length > 0 &&
      confirmNewPasswordRef.current.value.length > 0
    ) {
      return setChangeButton(true);
    }
    return setChangeButton(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="p-5 xs:p-3 mb-5 xs:mb-3 border border-orange-500 rounded">
          <Label>Current password</Label>
          <Input
            ref={currentPasswordRef}
            className="w-full"
            type="password"
            autoComplete="new-password"
            onChange={handleChange}
          />
          {error === 3 && <Error error={errors[error]} />}
        </div>
        <div className="p-5 xs:p-3 border border-orange-500 rounded">
          <Label>New password</Label>
          <Input
            ref={newPasswordRef}
            className="w-full mb-5 xs:mb-3"
            type="password"
            autoComplete="new-password"
            onChange={handleChange}
          />
          {(error === 0 || error === 2) && <Error error={errors[error]} />}
          <Label>Confirm new password</Label>
          <Input
            ref={confirmNewPasswordRef}
            className="w-full"
            type="password"
            autoComplete="new-password"
            onChange={handleChange}
          />
          {error === 1 && <div className="error"> {errors[error]}</div>}
        </div>
        <Button
          disabled={!changeButton}
          className="mt-5 xs:mt-3 ml-auto"
          hasLoader={{ loading: loading }}
        >
          <span className={loading ? 'invisible' : ''}>Change</span>
        </Button>
      </form>
    </div>
  );
};

export default ChangePassword;
