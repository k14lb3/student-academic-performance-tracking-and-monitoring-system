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
  const currentPasswordRef = useRef();
  const newPasswordRef = useRef();
  const confirmNewPasswordRef = useRef();
  const [changeButton, setChangeButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(false);
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
      setPopup(true);
      currentPasswordRef.current.value = '';
      newPasswordRef.current.value = '';
      confirmNewPasswordRef.current.value = '';
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
      currentPasswordRef.current.value.length > 0 &&
      newPasswordRef.current.value.length > 0 &&
      confirmNewPasswordRef.current.value.length > 0
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
          <div className="input">
            <label>Current password</label>
            <input
              ref={currentPasswordRef}
              type="password"
              onChange={handleChange}
            />
          </div>
          {error === 3 && <div className="error"> {errors[error]}</div>}
        </div>
        <div>
          <div className="input">
            <label>New password</label>
            <input ref={newPasswordRef} type="password" onChange={handleChange} />
          </div>
          {(error === 0 || error === 2) && (
            <div className="error"> {errors[error]}</div>
          )}
          <div className="input">
            <label>Confirm new password</label>
            <input
              ref={confirmNewPasswordRef}
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
