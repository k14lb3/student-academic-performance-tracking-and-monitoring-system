import { useState, useRef } from 'react';
import { useSubject } from 'contexts/SubjectContext';
import Modal from 'components/Modal';
import Input from 'components/Input';
import Error from 'components/Error';

const JoinSubjectModal = ({ setModal }) => {
  const { joinSubject } = useSubject();
  const codeRef = useRef();
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async () => {
    setError('');

    try {
      setJoining(true);
      await joinSubject(codeRef.current.value.trim());
      setJoining(false);
      setModal(false);
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
          label: <span className={joining ? 'invisible' : ''}>Join</span>,
          onClick: handleJoin,
          hasLoader: { loading: joining },
        },
      }}
      closeModal={() => {
        setModal(false);
      }}
    >
      <Input ref={codeRef} className="w-full mt-3" maxLength="7" />
      <Error error={error} />
    </Modal>
  );
};

export default JoinSubjectModal;
