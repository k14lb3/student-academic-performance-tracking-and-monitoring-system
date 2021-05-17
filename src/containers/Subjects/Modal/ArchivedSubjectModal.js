import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useSubjects } from 'contexts/SubjectsContext';
import Modal from 'components/Modal';
import Loader from 'components/Loader';

const ArchivedSubjectModal = ({ codeState: { code, setCode } }) => {
  const { getArchivedSubject } = useSubjects();
  const [subject, setSubject] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubject = async () => {
      const subject = await getArchivedSubject(code);
      setSubject(subject);
    };
    fetchSubject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (subject) {
      setLoading(false);
    }
  }, [subject]);

  return (
    <Modal
      title={subject?.title}
      closeModal={() => {
        setCode('');
      }}
    >
      {loading ? (
        <Loader className="mx-auto" />
      ) : (
        <>
          {subject.students === 0 ? (
            <>
              <div className="text-xl text-center">No students</div>
            </>
          ) : (
            <>
              <div className="mb-3 pb-3 border-b border-orange">
                <div className="inline-block w-4/5 text-xl xs:text-base ">
                  Name
                </div>
                <div className="inline-block w-1/5 text-xl text-center xs:text-base">
                  Grade
                </div>
              </div>
              <div className="text-lg xs:text-sm">
                {subject.students.map((student) => (
                  <div key={uuid()}>
                    <div className="inline-block w-4/5">{student.name}</div>
                    <div className="inline-block w-1/5 align-top text-center border-l border-orange">
                      {student.grade}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </Modal>
  );
};

export default ArchivedSubjectModal;
