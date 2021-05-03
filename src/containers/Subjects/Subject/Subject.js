import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useSubject } from 'contexts/SubjectContext';
import Loader from 'components/Loader';

const Subject = ({ code }) => {
  const { getSubject } = useSubject();
  const [subject, setSubject] = useState();
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const fetchSubject = async () => {
      const subject = await getSubject(code);
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
    <>
      {loading ? (
        <Loader className="mx-auto" />
      ) : (
        <>
          <div className="flex items-center mb-5 xs:mb-3">
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
        </>
      )}
    </>
  );
};

export default Subject;
