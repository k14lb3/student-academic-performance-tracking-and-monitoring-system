import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import Modal from 'components/Modal';
import Loader from 'components/Loader';

const ArchivedSubjectModal = ({ title, studentsState, setModal }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentsState.students) {
      setLoading(false);
    }
  }, [studentsState.students]);

  return (
    <Modal
      title={title}
      closeModal={() => {
        setModal('');
        studentsState.setStudents();
      }}
    >
      {loading ? (
        <Loader className="mx-auto" />
      ) : (
        <>
          <div className="mb-3 pb-3 border-b border-orange">
            <div className="inline-block w-4/5 text-xl xs:text-base ">Name</div>
            <div className="inline-block w-1/5 text-xl text-center xs:text-base">Grade</div>
          </div>
          <div className="text-lg xs:text-sm">
            {studentsState.students.map((student) => (
              <div key={uuid()}>
                <div className="inline-block w-4/5">{student.name}</div>
                <div className="inline-block w-1/5 text-center border-l border-orange">
                  {student.grade}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Modal>
  );
};

export default ArchivedSubjectModal;
