import { useState, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPencilAlt,
  faCheck,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import Modal from 'components/Modal';
import Label from 'components/Label';
import Input from 'components/Input';
import Button from 'components/Button/Button';
import { useSubject } from 'contexts/SubjectContext';

const ExercisesModal = ({ studentId, closeModal }) => {
  const {
    subject,
    addActivity,
    deleteActivity,
    changeActivityTitle,
    changeActivityScore,
    changeActivityTotalScore,
  } = useSubject();
  const [editTitle, setEditTitle] = useState();
  const titleRef = useRef();
  const [adding, setAdding] = useState(false);

  const onAddQuiz = async () => {
    setAdding(true);
    await addActivity('quizzes');
    setAdding(false);
  };

  return (
    <Modal
      title="Quizzes"
      className=""
      closeModal={() => {
        closeModal();
      }}
    >
      <div className="max-h-96 overflow-y-auto">
        {subject.quizzes &&
          subject.quizzes.map((quiz, i) => (
            <div key={uuid()} className="pb-5 mb-5 border-b border-orange">
              <div className="flex justify-between">
                <div className="mr-5">
                  {editTitle === i ? (
                    <Input
                      autoFocus
                      ref={titleRef}
                      className="w-l !p-0 !pb-1 mb-1 !bg-transparent border-t-0 border-l-0 border-r-0 !rounded-none text-white text-xl xs:text-base mr-3 outline-none focus:border-orange"
                      defaultValue={quiz.title}
                    />
                  ) : (
                    <h3 className="inline-block text-xl xs:text-base mr-3 mb-2 border-b border-transparent">
                      {quiz.title}
                    </h3>
                  )}
                  <FontAwesomeIcon
                    className="xs:text-xs cursor-pointer duration-200 hover:text-orange-500"
                    icon={editTitle === i ? faCheck : faPencilAlt}
                    onClick={async () => {
                      if (editTitle === i) {
                        setEditTitle();
                        const title = titleRef.current.value.trim();
                        await changeActivityTitle('quizzes', i, title);
                      } else {
                        setEditTitle(i);
                      }
                    }}
                  />
                </div>
                <FontAwesomeIcon
                  className="xs:text-xs mt-2 cursor-pointer duration-200 hover:text-orange-500"
                  icon={faTrashAlt}
                  onClick={() => {
                    if (!adding) {
                      deleteActivity('quizzes', i);
                    }
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <Label>Score</Label>
                  <Input
                    numberOnly
                    defaultValue={subject.students[studentId].quizzes[i]?.score}
                    className="w-full"
                    onBlur={async (e) => {
                      const score = parseInt(
                        e.target.value === '' ? 0 : e.target.value
                      );
                      await changeActivityScore(
                        'quizzes',
                        studentId,
                        i,
                        score,
                        quiz.totalScore
                      );
                    }}
                  />
                </div>
                <div>
                  <Label>Total score</Label>
                  <Input
                    numberOnly
                    defaultValue={quiz.totalScore}
                    className="w-full"
                    onBlur={async (e) => {
                      const totalScore = parseInt(e.target.value.trim());
                      await changeActivityTotalScore('quizzes', i, totalScore);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
      <Button
        disabled={adding}
        className="w-full"
        onClick={onAddQuiz}
        hasLoader={{ loading: adding }}
      >
        <span className={adding ? 'invisible' : ''}>Add quiz</span>
      </Button>
    </Modal>
  );
};

export default ExercisesModal;
