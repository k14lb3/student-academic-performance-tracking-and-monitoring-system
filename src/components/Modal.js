import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Button from 'components/Button/Button';

const Modal = ({ title, message, button, closeModal, children }) => {
  return (
    <div className="flex justify-center items-center fixed top-0 left-0 w-full h-full z-50">
      <div className="w-96 xs:w-72 px-5 xs:px-3 py-5 xs:py-3 bg-gray rounded shadow-xl z-50">
        <div className="flex justify-between items-center pb-3 mb-3 border-b border-orange">
          <h1 className="text-3xl xs:text-xl">{title}</h1>
          <Button outlined className="!px-2 !py-0.5" onClick={closeModal}>
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <p className="xs:text-sm">{message}</p>
            {children}
          </div>
          <div className="flex justify-end mt-5 xs:mt-3">
            {button?.no && (
              <Button outlined className="mr-3" onClick={button?.no.onClick}>
                {button.no.label}
              </Button>
            )}
            <Button
              hasLoader={button?.yes.hasLoader}
              onClick={button?.yes.onClick}
            >
              {button?.yes.label}
            </Button>
          </div>
        </div>
      </div>
      <div
        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-20"
        onClick={closeModal}
      ></div>
    </div>
  );
};

export default Modal;