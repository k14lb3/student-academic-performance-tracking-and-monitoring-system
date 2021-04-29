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
      className={`fixed bottom-5 py-3 px-8 bg-orange rounded text-gray${
        popup ? ' block' : ' hidden '
      }`}
    >
      <p className="text-xl">{popup.message}</p>
    </div>
  );
};

PopupNotification.defaultProps = {
  timeout: 3000,
};

export default PopupNotification;
