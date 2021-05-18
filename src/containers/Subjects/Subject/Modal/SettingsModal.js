import { useState, useRef } from 'react';
import { useSubject } from 'contexts/SubjectContext';
import Modal from 'components/Modal';
import Label from 'components/Label';
import Input from 'components/Input';

const SettingsModal = ({ closeModal }) => {
  const titleRef = useRef();
  const lecturesRef = useRef();
  const { subject, updateSubjectSettings } = useSubject();
  const [updating, setUpdating] = useState(false);
  const [updateButton, setUpdateButton] = useState(false);

  const onUpdateSubjectSettings = async () => {
    const title = titleRef.current.value.trim();
    const lectures = lecturesRef.current.value.trim();
    setUpdating(true);
    await updateSubjectSettings({ title: title, lectures: lectures });
    setUpdating(false);
    setUpdateButton(false);
  };

  const handleInputChange = () => {
    const title = titleRef.current.value.trim();
    const lectures = parseInt(lecturesRef.current.value.trim());

    if (title === subject.title && lectures === subject.lectures) {
      return setUpdateButton(false);
    }
    return setUpdateButton(true);
  };

  return (
    <Modal
      title="Subject settings"
      button={{
        yes: {
          disabled: !updateButton,
          label: <span className={updating ? 'invisible' : ''}>Update</span>,
          onClick: () => {
            if (updateButton) {
              onUpdateSubjectSettings();
            }
          },
          hasLoader: { loading: updating },
        },
      }}
      closeModal={() => {
        if (!updating) {
          closeModal();
        }
      }}
    >
      <Label>Title</Label>
      <Input
        ref={titleRef}
        className="w-full mb-3"
        defaultValue={subject.title}
        onChange={handleInputChange}
      />
      <Label>Total Lectures</Label>
      <Input
        ref={lecturesRef}
        numberOnly
        className="w-full"
        defaultValue={subject.lectures}
        onChange={handleInputChange}
        onBlur={(e) => {
          if (parseInt(e.target.value) === 0) {
            e.target.value = 1;
          }
        }}
      />
    </Modal>
  );
};

export default SettingsModal;
