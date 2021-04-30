import Modal from 'components/Modal';

const DeleteSubjectModal = ({
  userInfo,
  setDeleteModal,
  modalLoading,
  modalDeleteSubject,
  toDelete,
}) => {
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
          label: <span className={modalLoading ? 'invisible' : ''}>Yes</span>,
          onClick: modalDeleteSubject,
          hasLoader: { loading: modalLoading },
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
  );
};

export default DeleteSubjectModal;
