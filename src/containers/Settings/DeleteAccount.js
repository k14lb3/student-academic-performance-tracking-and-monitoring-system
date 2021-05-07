import { useState, useRef } from 'react';
import { useAuth } from 'contexts/AuthContext';
import { useUser } from 'contexts/UserContext';
import Button from 'components/Button/Button';
import Label from 'components/Label';
import Input from 'components/Input';
import Modal from 'components/Modal';
import Error from 'components/Error';

const DeleteAccount = () => {
  const { deleteUser } = useAuth();
  const { userInfo } = useUser();
  const [deleteModal, setDeleteModal] = useState(false);
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
        await deleteUser(userInfo.type, passwordRef.current.value.trim());
      } catch (err) {
        setError(err.message);
      }
      setDeleting(false);
      setDeleteModal(false);
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
      {deleteModal && (
        <Modal
          title="Delete account"
          message="Do you really want to delete your account?"
          button={{
            yes: {
              label: <span className={deleting ? 'invisible' : ''}>Yes</span>,
              onClick: handleDelete,
              hasLoader: { loading: deleting },
            },
            no: {
              label: 'No',
              onClick: () => {
                setDeleteModal(false);
              },
            },
          }}
          closeModal={() => {
            setDeleteModal(false);
          }}
        />
      )}
      {confirmPassword ? (
        <div className="p-5 xs:p-3 mb-5 xs:mb-3 border border-orange-500 rounded xs:text-sm">
          <div className="mb-5 pb-5 border-b border-orange">
            <h3 className="text-xl xs:text-base">Confirm your password</h3>
          </div>
          <p className="mb-5 xs:mb-3">
            Complete the deletion of your account by entering the password
            associated with your account.
          </p>
          <Label>Password</Label>
          <Input
            className="w-full"
            ref={passwordRef}
            type="password"
            onChange={handleChange}
          />
          {error && <Error error={error} />}
        </div>
      ) : (
        <div className="p-5 xs:p-3 mb-5 xs:mb-3 border border-orange-500 rounded xs:text-sm">
          <div className="mb-5 xs:mb-3 pb-5 xs:pb-3 border-b border-orange">
            <h3 className="text-xl xs:text-base">
              This will delete your account
            </h3>
          </div>
          <p className="mb-5 xs:mb-3 ml-5 xs:ml-3">
            You’re about to start the process of deleting your account.
          </p>
          <div className="mb-5 xs:mb-3 pb-5 xs:pb-3 border-b border-orange">
            <h3 className="text-xl xs:text-base">What else you should know</h3>
          </div>
          <ul className="ml-5 list-disc">
            <li>You cannot restore your account.</li>
            <li>
              Your information, e.g., name, grades, exams, etc, will not be
              deleted from the other user's archived subjects.
            </li>
          </ul>
        </div>
      )}
      <Button
        className="block m-auto px-20"
        disabled={!deleteButton}
        onClick={() => {
          if (confirmPassword) {
            setDeleteModal(true);
          } else {
            setConfirmPassword(true);
            setDeleteButton(false);
          }
        }}
      >
        Delete
      </Button>
    </div>
  );
};

export default DeleteAccount;
