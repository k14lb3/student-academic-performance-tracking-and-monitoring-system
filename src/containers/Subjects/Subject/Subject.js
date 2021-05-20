import { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faCog,
  faPlus,
  faMinus,
} from '@fortawesome/free-solid-svg-icons';
import { useSubject } from 'contexts/SubjectContext';
import Label from 'components/Label';
import Input from 'components/Input';
import Select from 'components/Select';
import Loader from 'components/Loader';
import Button from 'components/Button/Button';
import SettingsModal from './Modal/SettingsModal';
import ExercisesModal from './Modal/ExercisesModal';
import AssignmenstModal from './Modal/AssignmentsModal';
import QuizzesModal from './Modal/QuizzesModal';

const MODAL = {
  SETTINGS: 'settings',
  EXERCISES: 'exercises',
  ASSIGNMENTS: 'assignments',
  QUIZZES: 'quizzes',
};

const Subject = ({ code }) => {
  const {
    subject,
    getSubject,
    updateStudent,
    changeAttendance,
    changeMajorExaminationScore,
    changeMajorExaminationTotalScore,
  } = useSubject();
  const [studentId, setCurrentStudentId] = useState();
  const studentRef = useRef();
  const lecturesRef = useRef();
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState('');
  const history = useHistory();

  const showModal = () => {
    const closeModal = () => {
      setModal('');
    };
    switch (modal) {
      case MODAL.SETTINGS:
        return <SettingsModal closeModal={closeModal} />;
      case MODAL.EXERCISES:
        return (
          <ExercisesModal
            studentId={studentId}
            closeModal={closeModal}
          />
        );
      case MODAL.ASSIGNMENTS:
        return (
          <AssignmenstModal
            studentId={studentId}
            closeModal={closeModal}
          />
        );
      case MODAL.QUIZZES:
        return (
          <QuizzesModal
            studentId={studentId}
            closeModal={closeModal}
          />
        );
      default:
        return null;
    }
  };

  const changeStudent = (e) => {
    setCurrentStudentId(e.target.value);
  };
  
  useEffect(() => {
    const fetchSubject = async () => {
      setCurrentStudentId(await getSubject(code));
    };
    fetchSubject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (subject && studentId) {
      const update = async () => {
        await updateStudent(studentId);
      };
      update();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject]);

  useEffect(() => {
    if (subject) {
      setLoading(false);
    }
  }, [subject]);

  return (
    <>
      {loading ? (
        <Loader className="mx-auto" />
      ) : (
        <>
          {modal && showModal()}
          <div className="flex justify-between mb-5 xs:mb-3">
            <div className="flex">
              <div
                className="text-orange-500 px-2.5 py-1 mr-3 rounded-full text-lg cursor-pointer duration-200 hover:bg-orange-500 hover:bg-opacity-5"
                onClick={() => {
                  history.goBack();
                }}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </div>
              <h2 className="text-2xl xs:text-lg">{subject.title}</h2>
            </div>
            <div
              className="text-orange-500 px-2.5 py-1 mr-3 rounded-full text-lg cursor-pointer duration-200 hover:bg-orange-500 hover:bg-opacity-5"
              onClick={() => {
                setModal(MODAL.SETTINGS);
              }}
            >
              <FontAwesomeIcon icon={faCog} />
            </div>
          </div>
          {subject.students ? (
            <>
              <Label>Student</Label>
              <Select
                ref={studentRef}
                className="w-full mb-5 xs:mb-3"
                onChange={changeStudent}
                value={studentId}
              >
                {Object.keys(subject.students).map((id) => {
                  return (
                    <option key={uuid()} value={id}>
                      {subject.students[id].name}
                    </option>
                  );
                })}
              </Select>
              <div className="flex mb-5 xs:mb-3">
                <div className="flex flex-col justify-between w-2/5 mr-5">
                  <div>
                    <h3 className="text-xl mb-3">Lectures attended</h3>
                    <div className="flex items-center">
                      <Button
                        className="!px-3 rounded-tr-none rounded-br-none"
                        onClick={() => {
                          changeAttendance(
                            studentId,
                            subject.students[studentId].lectures,
                            subject.lectures,
                            -1
                          );
                        }}
                      >
                        <FontAwesomeIcon className="text-sm" icon={faMinus} />
                      </Button>
                      <Input
                        ref={lecturesRef}
                        readOnly
                        value={`${subject.students[studentId].lectures} / ${subject.lectures}`}
                        className="w-full text-center !rounded-none cursor-default outline-none"
                      />
                      <Button
                        className="!px-3 rounded-tl-none rounded-bl-none"
                        onClick={() => {
                          changeAttendance(
                            studentId,
                            subject.students[studentId].lectures,
                            subject.lectures,
                            1
                          );
                        }}
                      >
                        <FontAwesomeIcon className="text-sm" icon={faPlus} />
                      </Button>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      setModal(MODAL.EXERCISES);
                    }}
                  >
                    Exercises
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => {
                      setModal(MODAL.ASSIGNMENTS);
                    }}
                  >
                    Assignments
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => {
                      setModal(MODAL.QUIZZES);
                    }}
                  >
                    Quizzes
                  </Button>
                </div>
                <div key={uuid()} className="w-3/5">
                  <h3 className="text-xl mb-3">Major Examination</h3>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <Label className="xs:!text-sm">Prelim</Label>
                      <div className="grid grid-cols-2 gap-5 mb-5">
                        <div>
                          <Label>Score</Label>
                          <Input
                            numberOnly
                            defaultValue={
                              subject.students[studentId].majorExamination
                                .prelim.score
                            }
                            className="w-full"
                            onBlur={(e) => {
                              const score = parseInt(e.target.value.trim());

                              changeMajorExaminationScore(
                                studentId,
                                'prelim',
                                score,
                                subject.majorExamination.prelim.totalScore
                              );
                            }}
                          />
                        </div>
                        <div>
                          <Label>Total</Label>
                          <Input
                            numberOnly
                            defaultValue={
                              subject.majorExamination.prelim.totalScore
                            }
                            className="w-full"
                            onBlur={(e) => {
                              const totalScore = parseInt(
                                e.target.value.trim()
                              );
                              changeMajorExaminationTotalScore(
                                'prelim',
                                totalScore
                              );
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label className="xs:!text-sm">Midterm</Label>
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <Label>Score</Label>
                          <Input
                            numberOnly
                            defaultValue={
                              subject.students[studentId].majorExamination.midterm.score
                            }
                            className="w-full"
                            onBlur={(e) => {
                              const score = parseInt(e.target.value.trim());
                              changeMajorExaminationScore(
                                studentId,
                                'midterm',
                                score,
                                subject.majorExamination.midterm.totalScore
                              );
                            }}
                          />
                        </div>
                        <div>
                          <Label className="xs:!text-sm">Total</Label>
                          <Input
                            numberOnly
                            defaultValue={
                              subject.majorExamination.midterm.totalScore
                            }
                            className="w-full"
                            onBlur={(e) => {
                              const totalScore = parseInt(
                                e.target.value.trim()
                              );
                              changeMajorExaminationTotalScore(
                                'midterm',
                                totalScore
                              );
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <Label className="xs:!text-sm">Semi Finals</Label>
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <Label>Score</Label>
                          <Input
                            numberOnly
                            defaultValue={
                              subject.students[studentId].majorExamination.semiFinals.score
                            }
                            className="w-full"
                            onBlur={(e) => {
                              const score = parseInt(e.target.value.trim());
                              changeMajorExaminationScore(
                                studentId,
                                'semiFinals',
                                score,
                                subject.majorExamination.semiFinals.totalScore
                              );
                            }}
                          />
                        </div>
                        <div>
                          <Label>Total</Label>
                          <Input
                            numberOnly
                            defaultValue={
                              subject.majorExamination.semiFinals.totalScore
                            }
                            className="w-full"
                            onBlur={(e) => {
                              const totalScore = parseInt(
                                e.target.value.trim()
                              );
                              changeMajorExaminationTotalScore(
                                'semiFinals',
                                totalScore
                              );
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label className="xs:!text-sm">Finals</Label>
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <Label>Score</Label>
                          <Input
                            numberOnly
                            defaultValue={
                              subject.students[studentId].majorExamination.finals.score
                            }
                            className="w-full"
                            onBlur={(e) => {
                              const score = parseInt(e.target.value.trim());
                              changeMajorExaminationScore(
                                studentId,
                                'finals',
                                score,
                                subject.majorExamination.finals.totalScore
                              );
                            }}
                          />
                        </div>
                        <div>
                          <Label>Total</Label>
                          <Input
                            numberOnly
                            defaultValue={
                              subject.majorExamination.finals.totalScore
                            }
                            className="w-full"
                            onBlur={(e) => {
                              const totalScore = parseInt(
                                e.target.value.trim()
                              );
                              changeMajorExaminationTotalScore(
                                'finals',
                                totalScore
                              );
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <Label>Final Grade</Label>
                <div className="flex justify-center items-center w-24 h-20 xm:h-16 border-b border-orange">
                  <h3 className="text-5xl xm:text-4xl">
                    {studentId.grade || '--'}
                  </h3>
                </div>
                <Button className="mt-5 xs:mt-3">Publish grade</Button>
              </div>
            </>
          ) : (
            <div className="text-xl text-center">No students</div>
          )}
        </>
      )}
    </>
  );
};

export default Subject;
