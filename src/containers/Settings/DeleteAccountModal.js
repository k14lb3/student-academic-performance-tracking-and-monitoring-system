import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Loader from 'components/Loader';

const DeleteAccountModal = ({
  setDeleteAccountModal,
  handleDelete,
  deleting,
}) => {
  return (
    <div className="deleteSubjectModal modal">
      <div className="modal__inner">
        <div className="modal__header">
          <h1>Delete Account</h1>
          <button
            disabled={deleting}
            className="modal__closeButton button"
            onClick={() => {
              setDeleteAccountModal(false);
            }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div>
          <p>Are you really sure you want to delete your account?</p>
          <div className="modal__buttonGroup">
            <button
              disabled={deleting}
              className="modal__button button"
              onClick={() => {
                handleDelete();
              }}
            >
              <span className={deleting ? 'hidden' : ''}>Yes</span>
              {deleting && <Loader />}
            </button>
            <button
              disabled={deleting}
              className="modal__button button button--outline"
              onClick={() => {
                setDeleteAccountModal(false);
              }}
            >
              No
            </button>
          </div>
        </div>
        <div
          className="modal__shadow"
          onClick={() => {
            if (!deleting) {
              setDeleteAccountModal(false);
            }
          }}
        ></div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
