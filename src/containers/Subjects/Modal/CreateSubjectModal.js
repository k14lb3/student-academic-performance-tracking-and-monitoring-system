import { useState, useRef } from 'react';
import { useSubject } from 'contexts/SubjectContext';
import Modal from 'components/Modal';
import Input from 'components/Input';

const CreateSubjectModal = ({ setModal }) => {
  const { createSubject } = useSubject();
  const titleRef = useRef();
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    setCreating(true);
    await createSubject(titleRef.current.value.trim());
    setCreating(false);
    setModal(false);
  };

  return (
    <Modal
      title="Create subject"
      message="Enter subject title"
      button={{
        yes: {
          disabled: creating,
          label: <span className={creating ? 'invisible' : ''}>Create</span>,
          onClick: () => {
            if (!creating) {
              handleCreate();
            }
          },
          hasLoader: { loading: creating },
        },
      }}
      closeModal={() => {
        if (!creating) {
          setModal(false);
        }
      }}
    >
      <Input ref={titleRef} className="w-full mt-3" />
    </Modal>
  );
};

export default CreateSubjectModal;
