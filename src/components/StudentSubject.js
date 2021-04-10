import './StudentSubject.scss';
import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import PopupNotification from './PopupNotification';
import DeleteSubjectModal from './DeleteSubjectModal';

const StudentSubject = ({ archived, code, title, instructor, grade }) => {
  const [popup, setPopup] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  return (
    <div className="studentSubject subject">
      <PopupNotification
        popupState={{ popup: popup, setPopup: setPopup }}
        message="Link copied"
      />
      {deleteModal && (
        <DeleteSubjectModal archived={archived} code={code} setDeleteModal={setDeleteModal} />
      )}
      <div className="subject__header">
        <h2 className="subject__title">{title}</h2>
        <div className="subject__deleteButton--wrapper">
          <button
            className="subject__deleteButton button"
            onClick={() => {
              setDeleteModal(true);
            }}
          >
            <FontAwesomeIcon icon={faTrashAlt} />
          </button>
        </div>
      </div>
      <div className="subject__body">
        <div>
          {archived && (
            <span className="subject__instructorLabel">Instructor :</span>
          )}
          <h3 className="subject__instructor">{instructor}</h3>
          {!archived && (
            <CopyToClipboard
              text={code}
              onCopy={() => {
                setPopup(true);
              }}
            >
              <button className="subject__code button button--outline">
                Code
                <code>{code}</code>
                <span className="tooltip">Click to copy code</span>
              </button>
            </CopyToClipboard>
          )}
        </div>
        <div className="subject__grade">
          <div>
            <h2>{grade ? grade : '--'}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSubject;
