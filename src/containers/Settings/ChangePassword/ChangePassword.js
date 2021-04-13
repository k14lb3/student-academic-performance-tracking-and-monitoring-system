import './ChangePassword.scss';
import React, { useState, useRef } from 'react';
import { useAuth } from 'contexts/AuthContext';
import Loader from 'components/Loader';

const errors = [
  'Your password needs to be at least 8 characters. Please enter a long one.',
  'Passwords do not match.',
  'New password cannot be the same as your existing password',
  'The password you entered was incorrect.',
];

const ChangePassword = () => {
  const { reauthenticateWithCredential, updatePassword } = useAuth();
  const currentPassword = useRef();
  const newPassword = useRef();
  const confirmNewPassword = useRef();
  const [changeButton, setChangeButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(false);
  const [error, setError] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.current.value.length < 8) {
      setError(0);
      return;
    }

    if (newPassword.current.value !== confirmNewPassword.current.value) {
      setError(1);
      return;
    }

    if (currentPassword.current.value === newPassword.current.value) {
      setError(2);
      return;
    }

    try {
      setError('');
      setLoading(true);
      setChangeButton(false);
      await reauthenticateWithCredential(currentPassword.current.value);
      await updatePassword(newPassword.current.value);
      setLoading(false);
      setPopup(true);
      currentPassword.current.value = '';
      newPassword.current.value = '';
      confirmNewPassword.current.value = '';
      setTimeout(() => {
        setPopup(false);
      }, 5000);
    } catch {
      setLoading(false);
      setError(2);
    }
  };

  const handleChange = () => {
    if (
      currentPassword.current.value.length > 0 &&
      newPassword.current.value.length > 0 &&
      confirmNewPassword.current.value.length > 0
    ) {
      return setChangeButton(true);
    }
    return setChangeButton(false);
  };

  return (
    <div className="changePassword">
      <div className={`popup${popup ? ' popup--active' : ''}`}>
        Your password has been successfully updated
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Current password</label>
          <div className="input">
            <input
              ref={currentPassword}
              type="password"
              onChange={handleChange}
            />
          </div>
          {error === 3 && <div className="error"> {errors[error]}</div>}
        </div>
        <div>
          <label>New password</label>
          <div className="input">
            <input ref={newPassword} type="password" onChange={handleChange} />
          </div>
          {(error === 0 || error === 2) && (
            <div className="error"> {errors[error]}</div>
          )}
          <label>Confirm new password</label>
          <div className="input">
            <input
              ref={confirmNewPassword}
              type="password"
              onChange={handleChange}
            />
          </div>
          {error === 1 && <div className="error"> {errors[error]}</div>}
        </div>
        <button
          disabled={loading || !changeButton}
          className="changePassword__changeButton button"
        >
          <span className={loading ? 'hidden' : ''}>Change</span>
          {loading && <Loader />}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
