import { useState } from 'react';
import { useUser } from 'contexts/UserContext';
import { useSubjects } from 'contexts/SubjectsContext';
import Modal from 'components/Modal';

const DeleteSubjectModal = ({ toDelete, closeModal }) => {
  const { userInfo } = useUser();
  const { deleteSubject } = useSubjects();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    const { archived, code } = toDelete;
    setDeleting(true);
    await deleteSubject({ archived: archived, code: code });
    setDeleting(false);
    closeModal();
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
              closeModal();
            }
          },
        },
      }}
      closeModal={() => {
        if (!deleting) {
          closeModal();
        }
      }}
    />
  );
};

export default DeleteSubjectModal;
