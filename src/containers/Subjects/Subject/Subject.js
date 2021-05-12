import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCog } from '@fortawesome/free-solid-svg-icons';
import { useSubject } from 'contexts/SubjectContext';
import Label from 'components/Label';
import Input from 'components/Input';
import Select from 'components/Select';
import Loader from 'components/Loader';
import SettingsModal from './Modal/SettingsModal';

const MODAL = {
  SETTINGS: 'settings',
};

const Subject = ({ code }) => {
  const { getSubject } = useSubject();
  const [subject, setSubject] = useState();
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState('');
  const history = useHistory();

  const showModal = () => {
    switch (modal) {
      case MODAL.SETTINGS:
        return (
          <SettingsModal
            subjectState={{ subject: subject, setSubject: setSubject }}
            setModal={setModal}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchSubject = async () => {
      const subject = await getSubject(code);
      setSubject({ code: code, ...subject });
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
          {subject.students.length > 0 ? (
            <div className="grid grid-cols-2">
              <div>
                <Label>Students</Label>
                <Select className="mb-5 xs:mb-3">
                  {subject.students.map((student) => (
                    <option key={uuid()} value={student.name}>
                      {student.name}
                    </option>
                  ))}
                </Select>
                <div>
                  <Label>Lectures Attended</Label>
                  <div className="flex">
                    <Input className="w-14 text-center" />
                    <div className="flex items-center ml-3 text-lg">/ 50</div>
                  </div>
                </div>
              </div>
              <div></div>
            </div>
          ) : (
            <div className="text-xl text-center">No students</div>
          )}
        </>
      )}
    </>
  );
};

export default Subject;
