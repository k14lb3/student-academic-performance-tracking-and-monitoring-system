import { forwardRef } from 'react';
import Modal from 'components/Modal';
import Input from 'components/Input';
import Error from 'components/Error';

const JoinSubjectModal = ({
  codeRef,
  setModal,
  modalLoading,
  modalJoinSubject,
  modalError,
}) => {
  return (
    <Modal
      title="Join subject"
      message="Enter subject code"
      button={{
        yes: {
          label: <span className={modalLoading ? 'invisible' : ''}>Join</span>,
          onClick: modalJoinSubject,
          hasLoader: { loading: modalLoading },
        },
      }}
      closeModal={() => {
        setModal(false);
      }}
    >
      <Input ref={codeRef} className="w-full mt-3" maxLength="7" />
      <Error error={modalError} />
    </Modal>
  );
};

export default forwardRef(JoinSubjectModal);
