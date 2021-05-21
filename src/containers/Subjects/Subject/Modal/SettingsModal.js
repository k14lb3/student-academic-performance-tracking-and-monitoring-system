import { useState, useRef } from 'react';
import { useSubject } from 'contexts/SubjectContext';
import Modal from 'components/Modal';
import Label from 'components/Label';
import Input from 'components/Input';
import Error from 'components/Error';

const SettingsModal = ({ closeModal }) => {
  const titleRef = useRef();
  const lecturesRef = useRef();
  const attendancePercentageRef = useRef();
  const activitiesPercentageRef = useRef();
  const majorExaminationsPercentageRef = useRef();
  const [percentagesWarning, setPercentagesWarning] = useState(false);
  const { subject, updateSubjectSettings } = useSubject();
  const [updating, setUpdating] = useState(false);
  const [updateButton, setUpdateButton] = useState(false);

  const onUpdateSubjectSettings = async () => {
    const title = titleRef.current.value.trim();
    const lectures = parseInt(lecturesRef.current.value.trim());
    let attendancePercentage = parseInt(
      attendancePercentageRef.current.value.trim()
    );
    let activitiesPercentage = parseInt(
      activitiesPercentageRef.current.value.trim()
    );
    let majorExaminationsPercentage = parseInt(
      majorExaminationsPercentageRef.current.value.trim()
    );

    setPercentagesWarning(false);
    setUpdating(true);

    if (
      attendancePercentage +
        activitiesPercentage +
        majorExaminationsPercentage !==
      100
    ) {
      attendancePercentage = subject.percentages.attendance;
      activitiesPercentage = subject.percentages.activities;
      majorExaminationsPercentage = subject.percentages.majorExaminations;
    }

    await updateSubjectSettings({
      title: title,
      lectures: lectures,
      percentages: {
        attendance: attendancePercentage,
        activities: activitiesPercentage,
        majorExaminations: majorExaminationsPercentage,
      },
    });
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
      attendancePercentage +
        activitiesPercentage +
        majorExaminationsPercentage !==
      100
    ) {
      setPercentagesWarning(true);
    } else {
      setPercentagesWarning(false);
    }

    if (
      title === subject.title &&
      lectures === subject.lectures &&
      activitiesPercentage === subject.percentages.activities &&
      majorExaminationsPercentage === subject.percentages.majorExaminations
    ) {
      setUpdateButton(false);
    } else {
      setUpdateButton(true);
    }
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
      <div className="max-h-96 sm:max-h-80 xs:max-h-64 overflow-y-scroll">
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
          className="w-full mb-3"
          onChange={handleInputChange}
        />
        <Label>Activities</Label>
        <Input
          ref={activitiesPercentageRef}
          numberOnly
          defaultValue={subject.percentages.activities}
          className="w-full mb-3"
          onChange={handleInputChange}
        />
        <Label>Major Examinations</Label>
        <Input
          ref={majorExaminationsPercentageRef}
          numberOnly
          defaultValue={subject.percentages.majorExaminations}
          className="w-full"
          onChange={handleInputChange}
        />
      </div>
      {percentagesWarning && (
        <Error
          className="!text-orange"
          error="Percentages will be assigned with previous values if the total does not equal to 100%"
        />
      )}
    </Modal>
  );
};

export default SettingsModal;
