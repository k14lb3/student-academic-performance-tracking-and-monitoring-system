import './DeleteAccount.scss';
import { useState, useRef } from 'react';
import { useAuth } from 'contexts/AuthContext';
import { useUser } from 'contexts/UserContext';
import DeleteAccountModal from './DeleteAccountModal';

const DeleteAccount = () => {
  const { deleteAccount } = useAuth();
  const { userInfo } = useUser();
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const passwordRef = useRef();
  const [deleting, setDeleting] = useState(false);
  const [deleteButton, setDeleteButton] = useState(true);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!deleting) {
      setError('');
      setDeleting(true);
      try {
        await deleteAccount(userInfo.type, passwordRef.current.value.trim());
      } catch (err) {
        setError(err.message);
      }
      setDeleting(false);
      setDeleteAccountModal(false);
    }
  };

  const handleChange = () => {
    if (passwordRef.current.value.length > 0) {
      setDeleteButton(true);
    } else {
      setDeleteButton(false);
    }
  };

  return (
    <div className="deleteAccount">
      {deleteAccountModal && (
        <DeleteAccountModal
          setDeleteAccountModal={setDeleteAccountModal}
          handleDelete={handleDelete}
          deleting={deleting}
        />
      )}
      {confirmPassword ? (
        <div className="deleteAccount__confirmPassword">
          <div>
            <h3>Confirm your password</h3>
            <p>
              Complete the deletion of your account by entering the password
              associated with your account.
            </p>
            <div className="input">
              <label>Password</label>
              <input
                ref={passwordRef}
                type="password"
                onChange={handleChange}
              />
            </div>
            {error && <span className="error">{error}</span>}
          </div>
        </div>
      ) : (
        <div className="deleteAccount__warning">
          <h3>This will delete your account</h3>
          <p>You’re about to start the process of deleting your account.</p>
          <h3>What else you should know</h3>
          <ul>
            <li>You cannot restore your account.</li>
            <li>
              Your information, e.g., name, grades, exams, etc, will not be
              deleted from the other user's archived subjects.
            </li>
          </ul>
        </div>
      )}
      <button
        disabled={!deleteButton}
        className="button"
        onClick={() => {
          if (confirmPassword) {
            setDeleteAccountModal(true);
          } else {
            setConfirmPassword(true);
            setDeleteButton(false);
          }
        }}
      >
        Delete
      </button>
    </div>
  );
};

export default DeleteAccount;
