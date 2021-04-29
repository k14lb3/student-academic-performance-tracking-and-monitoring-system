import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Button from 'components/Button/Button';

const Subject = ({ type, code, title, archived, deleteSubject, setPopup }) => {
  return (
    <div className="w-full p-5 xs:p-3 my-5 xs:my-3 first:mt-0 last:mt-0 border border-orange-500 rounded">
      <div className="flex justify-between pb-5 xs:pb-3 mb-5 xs:mb-3 border-b border-orange-500">
        <h2 className="text-2xl xs:text-xl pr-5 xs:pr-3">{title}</h2>
        <div className="flex items-end pb-1 text-2xl xs:text-lg hover:text-orange-500 duration-200 cursor-pointer">
          <FontAwesomeIcon
            icon={type?.instructor && !archived ? faArchive : faTrashAlt}
            onClick={() => {
              deleteSubject({ archived: archived, code: code });
            }}
          />
        </div>
      </div>
      <div
        className={`flex ${archived && type?.instructor ? '' : 'xm:flex-col'}`}
      >
        <div
          className={`flex ${
            type?.instructor
              ? archived
                ? 'w-3/5 '
                : 'w-3/4 '
              : 'flex-col w-3/5 xm:items-center '
          }xm:w-full pr-5 ${
            archived && type.instructor
              ? ''
              : 'xm:pr-0 xm:pb-5 xm:mr-0 xm:mb-5 xm:border-r-0 xm:border-b xs:!pb-3 xs:!mb-3 '
          }justify-center mr-5 border-r border-orange-500`}
        >
          {type?.student && (
            <>
              {archived && <span className="text-xl">Instructor:</span>}
              <h4
                className={`text-xl xs:text-lg ${
                  archived ? '' : 'mb-5 '
                }xs:mb-3`}
              >
                {type?.student.instructor}
              </h4>
            </>
          )}
          {archived || (
            <CopyToClipboard
              text={code}
              onCopy={() => {
                setPopup({ up: true, message: 'Link copied' });
              }}
            >
              <Button
                className="group relative flex self-start xm:self-center"
                outlined
              >
                <div className="pr-5 mr-5 border-r border-orange-500">Code</div>
                <code className="m-auto tracking-widest">{code}</code>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 hidden group-hover:block py-1 px-4 mt-2 bg-gray-600 rounded whitespace-nowrap">
                  Click to copy code
                </div>
              </Button>
            </CopyToClipboard>
          )}
          {type?.instructor && (
            <Button className={`${archived ? '' : 'ml-5'} flex-grow`}>
              Open
            </Button>
          )}
        </div>
        <div
          className={`flex justify-center items-center ${
            type?.instructor ? (archived ? 'w-2/5 ' : 'w-1/4 ') : 'w-2/5 '
          }xm:w-full text-lg xs:text-sm`}
        >
          {type?.instructor && (
            <>
              {type?.instructor.students > 0 ? (
                <>
                  <div>Student/s:</div>
                  <div className="w-full xm:w-auto pl-1 text-center">
                    {type?.instructor.students}
                  </div>
                </>
              ) : (
                <span>No students</span>
              )}
            </>
          )}
          {type?.student && (
            <div className="flex justify-center items-center w-24 h-20 xm:h-16 border-r border-b xm:border-b-0 xm:border-l border-orange">
              <h3 className="text-5xl xm:text-4xl">
                {type.student.grade || '--'}
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Subject.defaultProps = {
  title: 'Subject',
  code: 'lololol',
  type: { instructor: { students: '0' } },
};

export default Subject;
