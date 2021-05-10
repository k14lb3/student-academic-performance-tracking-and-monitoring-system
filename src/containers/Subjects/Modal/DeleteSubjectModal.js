import { useState } from 'react';
import { useUser } from 'contexts/UserContext';
import { useSubject } from 'contexts/SubjectContext';
import Modal from 'components/Modal';

const DeleteSubjectModal = ({ toDelete, setModal }) => {
  const { userInfo } = useUser();
  const { archiveSubject, deleteSubject } = useSubject();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    const { archived, code } = toDelete;
    setDeleting(true);
    if (archived) {
      await deleteSubject({ archived: archived, code: code });
    } else {
      if (userInfo.type === 'Instructor') {
        await archiveSubject(code);
      } else {
        await deleteSubject({ archived: archived, code: code });
      }
    }
    setDeleting(false);
    setModal(false);
  };
  return (
    <Modal
      title={
        toDelete.archived || userInfo.type === 'Student'
          ? 'Delete subject'
          : 'Archive subject'
      }
      message={
        toDelete.archived || userInfo.type === 'Student'
          ? 'Do you really want to delete this subject?'
          : 'Do you really want to archive this subject?'
      }
      button={{
        yes: {
          disabled: deleting,
          label: <span className={deleting ? 'invisible' : ''}>Yes</span>,
          onClick: () => {
            if (!deleting) {
              handleDelete();
            }
          },
          hasLoader: { loading: deleting },
        },
        no: {
          disabled: deleting,
          label: 'No',
          onClick: () => {
            if (!deleting) {
              setModal(false);
            }
          },
        },
      }}
      closeModal={() => {
        if (!deleting) {
          setModal(false);
        }
      }}
    />
  );
};

export default DeleteSubjectModal;
