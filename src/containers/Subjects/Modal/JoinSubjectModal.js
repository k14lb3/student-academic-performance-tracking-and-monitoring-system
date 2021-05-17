import { useState, useRef } from 'react';
import { useSubjects } from 'contexts/SubjectsContext';
import Modal from 'components/Modal';
import Input from 'components/Input';
import Error from 'components/Error';

const JoinSubjectModal = ({ closeModal }) => {
  const { joinSubject } = useSubjects();
  const codeRef = useRef();
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async () => {
    setError('');

    try {
      setJoining(true);
      await joinSubject(codeRef.current.value.trim());
      setJoining(false);
      closeModal();
    } catch (err) {
      setError(err.message);
      setJoining(false);
    }
  };

  return (
    <Modal
      title="Join subject"
      message="Enter subject code"
      button={{
        yes: {
          disabled: joining,
          label: <span className={joining ? 'invisible' : ''}>Join</span>,
          onClick: () => {
            if (!joining) {
              handleJoin();
            }
          },
          hasLoader: { loading: joining },
        },
      }}
      closeModal={() => {
        if (!joining) {
          closeModal();
        }
      }}
    >
      <Input ref={codeRef} className="w-full mt-3" maxLength="7" />
      <Error error={error} />
    </Modal>
  );
};

export default JoinSubjectModal;
