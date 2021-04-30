import { useEffect } from 'react';

const PopupNotification = ({ popupState: { popup, setPopup }, timeout }) => {
  useEffect(() => {
    if (popup) {
      setTimeout(() => {
        setPopup({ up: false, message: '' });
      }, timeout);
    }
  }, [popup, setPopup, timeout]);

  return (
    <div
      className={`fixed bottom-5 xs:bottom-20 py-3 xs:py-2 px-8 xs:px-5 bg-orange rounded text-gray z-50${
        popup ? ' block' : ' hidden '
      }`}
    >
      <p className="text-xl xs:text-sm">{popup.message}</p>
    </div>
  );
};

PopupNotification.defaultProps = {
  timeout: 3000,
};

export default PopupNotification;
