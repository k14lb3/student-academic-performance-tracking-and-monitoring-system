import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useUser } from 'contexts/UserContext';
import { useSubjects } from 'contexts/SubjectsContext';
import Loader from 'components/Loader';
import ArchivedSubjectModal from './Modal/ArchivedSubjectModal';
import SubjectItem from './SubjectItem';

const ArchivedSubjects = ({ setToDelete, deleteSubject }) => {
  const history = useHistory();
  const { userInfo } = useUser();
  const { subjects, getArchivedSubjects } = useSubjects();
  const [code, setCode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userInfo) {
      const fetchSubjects = async () => {
        await getArchivedSubjects();
        setLoading(false);
      };
      fetchSubjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  return (
    <>
      {code && (
        <ArchivedSubjectModal codeState={{ code: code, setCode: setCode }} />
      )}
      <div className="flex items-center mb-5 xs:mb-3">
        <div
          className="text-orange-500 px-2.5 py-1 mr-3 rounded-full text-lg cursor-pointer duration-200 hover:bg-orange-500 hover:bg-opacity-5"
          onClick={() => {
            history.goBack();
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </div>
        <h2 className="text-2xl xs:text-lg">Archived Subjects</h2>
      </div>
      {loading ? (
        <Loader className="mx-auto mt-5" />
      ) : (
        <>
          {subjects.archived.map((subject) => (
            <SubjectItem
              key={uuid()}
              archived
              type={
                subject.type === 'Instructor'
                  ? {
                      instructor: { students: subject.students },
                    }
                  : {
                      student: {
                        instructor: subject.instructor,
                        grade: subject.grade,
                      },
                    }
              }
              code={subject.code}
              title={subject.title}
              deleteSubject={({ archived, code }) => {
                setToDelete({ archived, code });
                deleteSubject();
              }}
              openSubjectModal={(code) => {
                setCode(code);
              }}
            />
          ))}
        </>
      )}
    </>
  );
};

export default ArchivedSubjects;
