import { useState, useRef } from 'react';
import { useSubject } from 'contexts/SubjectContext';
import Modal from 'components/Modal';
import Label from 'components/Label';
import Input from 'components/Input';

const SettingsModal = ({ closeModal }) => {
  const titleRef = useRef();
  const lecturesRef = useRef();
  const attendancePercentageRef = useRef();
  const activitiesPercentageRef = useRef();
  const majorExaminationsPercentageRef = useRef();
  const { subject, updateSubjectSettings } = useSubject();
  const [updating, setUpdating] = useState(false);
  const [updateButton, setUpdateButton] = useState(false);

  const onUpdateSubjectSettings = async () => {
    const title = titleRef.current.value.trim();
    const lectures = parseInt(lecturesRef.current.value.trim());
    setUpdating(true);
    await updateSubjectSettings({ title: title, lectures: lectures });
  };

  const handleInputChange = () => {
    const title = titleRef.current.value.trim();
    const lectures = parseInt(lecturesRef.current.value.trim());
    const attendancePercentage = parseInt(
      attendancePercentageRef.current.value.trim()
    );
    const activitiesPercentage = parseInt(
      activitiesPercentageRef.current.value.trim()
    );
    const majorExaminationsPercentage = parseInt(
      majorExaminationsPercentageRef.current.value.trim()
    );

    if (
      title === subject.title &&
      lectures === subject.lectures &&
      attendancePercentage === subject.percentages.attendance &&
      activitiesPercentage === subject.percentages.activities &&
      majorExaminationsPercentage === subject.percentages.majorExaminations
    ) {
      return setUpdateButton(false);
    }
    return setUpdateButton(true);
  };

  const lecturesOnBlur = (e) => {
    let highestLecturesAttended = 0;

    Object.values(subject.students).forEach((student, index) => {
      if (index === 0) {
        highestLecturesAttended = student.lectures;
      }
      if (student.lectures > highestLecturesAttended) {
        highestLecturesAttended = student.lectures;
      }
    });

    if (parseInt(e.target.value.trim()) <= highestLecturesAttended) {
      if (highestLecturesAttended === 0) {
        e.target.value = 1;
      } else {
        e.target.value = highestLecturesAttended;
      }
    }
  };

  console.log(subject);

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
      <Label className="text-lg xs:text-sm">Title</Label>
      <Input
        ref={titleRef}
        className="w-full mb-3"
        defaultValue={subject.title}
        onChange={handleInputChange}
      />
      <Label className="text-lg xs:text-sm">Total Lectures</Label>
      <Input
        ref={lecturesRef}
        numberOnly
        className="w-full mb-3"
        defaultValue={subject.lectures}
        onChange={handleInputChange}
        onBlur={lecturesOnBlur}
      />
      <Label className="pt-3 mt-3 border-t border-orange text-lg xs:text-sm">
        Grade calculation percentages
      </Label>
      <Label>Attendance</Label>
      <Input
        ref={attendancePercentageRef}
        numberOnly
        defaultValue={subject.percentages.attendance}
        className="mb-3"
        onChange={handleInputChange}
      />
      <Label>Activities</Label>
      <Input
        ref={activitiesPercentageRef}
        numberOnly
        defaultValue={subject.percentages.activities}
        className="mb-3"
        onChange={handleInputChange}
      />
      <Label>Major Examinations</Label>
      <Input
        ref={majorExaminationsPercentageRef}
        numberOnly
        defaultValue={subject.percentages.majorExaminations}
        onChange={handleInputChange}
      />
    </Modal>
  );
};

export default SettingsModal;
