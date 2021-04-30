import { forwardRef } from 'react';
import Modal from 'components/Modal';
import Input from 'components/Input';

const CreateSubjectModal = ({
  titleRef,
  setModal,
  modalLoading,
  modalCreateSubject,
}) => {
  return (
    <Modal
      title="Create subject"
      message="Enter subject title"
      button={{
        yes: {
          label: (
            <span className={modalLoading ? 'invisible' : ''}>Create</span>
          ),
          onClick: modalCreateSubject,
          hasLoader: { loading: modalLoading },
        },
      }}
      closeModal={() => {
        setModal(false);
      }}
    >
      <Input ref={titleRef} className="w-full mt-3" />
    </Modal>
  );
};

export default forwardRef(CreateSubjectModal);
