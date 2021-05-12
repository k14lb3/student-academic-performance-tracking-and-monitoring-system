import { useState, useRef } from 'react';
import { useSubject } from 'contexts/SubjectContext';
import Modal from 'components/Modal';
import Label from 'components/Label';
import Input from 'components/Input';
import Error from 'components/Error';

const SettingsModal = ({ subjectState: { subject, setSubject }, setModal }) => {
  const titleRef = useRef();
  const { updateTitle } = useSubject();
  const [updating, setUpdating] = useState(false);
  const [updateButton, setUpdateButton] = useState(false);

  const handleUpdate = async () => {
    if (updateButton) {
      const title = titleRef.current.value.trim();
      await updateTitle(subject.code, title);
      setSubject((prevSubject) => ({ ...prevSubject, title: title }));
    }
  };

  const handleInputChange = () => {
    const title = titleRef.current.value.trim();
    if (title === subject.title || title === '') {
      return setUpdateButton(false);
    }
    return setUpdateButton(true);
  };

  return (
    <Modal
      title="Subject Settings"
      button={{
        yes: {
          disabled: updating || !updateButton,
          label: <span className={updating ? 'invisible' : ''}>Update</span>,
          onClick: () => {
            handleUpdate();
          },
          hasLoader: { loading: updating },
        },
      }}
      closeModal={() => {
        if (!updating) {
          setModal('');
        }
      }}
    >
      <Label>Title</Label>
      <Input
        ref={titleRef}
        className="w-full"
        defaultValue={subject.title}
        onChange={handleInputChange}
      />
    </Modal>
  );
};

export default SettingsModal;
