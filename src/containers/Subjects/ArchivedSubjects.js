import './ArchivedSubjects.scss';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useUser } from 'contexts/UserContext';
import { useSubject } from 'contexts/SubjectContext';
import Subject from 'components/Subject';
import Loader from 'components/Loader';

const ArchivedSubjects = ({ setToDelete, setDeleteModal }) => {
  const history = useHistory();
  const { userInfo } = useUser();
  const { archivedSubjects, getArchivedSubjects } = useSubject();
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
      <div className="archivedSubjects__navigation">
        <div
          className="archivedSubjects__backButton"
          onClick={() => {
            history.goBack();
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </div>
        <h2 className="archivedSubjects__title">Archived Subjects</h2>
      </div>
      {loading ? (
        <Loader className="mx-auto mt-5" />
      ) : (
        <>
          {archivedSubjects.map((subject) => (
            <Subject
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
                setDeleteModal(true);
              }}
            />
          ))}
        </>
      )}
    </>
  );
};

export default ArchivedSubjects;
