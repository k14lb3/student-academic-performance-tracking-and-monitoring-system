import './InstructorSubject.scss';
import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import PopupNotification from 'components/PopupNotification';
import DeleteSubjectModal from './DeleteSubjectModal';

const InstructorSubject = ({ archived, code, title, students }) => {
  const [popup, setPopup] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  return (
    <div className="instructorSubject subject">
      <PopupNotification
        popupState={{ popup: popup, setPopup: setPopup }}
        message="Link copied"
      />
      {deleteModal && (
        <DeleteSubjectModal
          archived={archived}
          code={code}
          students={students}
          setDeleteModal={setDeleteModal}
        />
      )}
      <div className="subject__header">
        <h1 className="subject__title">{title}</h1>
        <div className="subject__deleteButton--wrapper">
          <button
            className="subject__deleteButton button"
            onClick={() => {
              setDeleteModal(true);
            }}
          >
            <FontAwesomeIcon icon={archived ? faTrashAlt : faArchive} />
          </button>
        </div>
      </div>
      <div className="subject__body">
        {!archived && (
          <div className="subject__buttonGroup">
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
            <button className="subject__openButton button">Open</button>
          </div>
        )}
        {archived && (
          <button className="subject__openButton button">Open</button>
        )}
        <div className="subject__students">
          {students > 0 ? `Student/s: ${students}` : 'No students'}
        </div>
      </div>
    </div>
  );
};

export default InstructorSubject;
