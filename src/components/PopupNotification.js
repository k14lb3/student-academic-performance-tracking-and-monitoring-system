import { useEffect } from 'react';

const PopupNotification = ({
  popupState: { popup, setPopup },
  message,
  timeout,
}) => {
  useEffect(() => {
    if (popup) {
      setTimeout(() => {
        setPopup(false);
      }, timeout);
    }
  }, [popup, setPopup, timeout]);

  return (
    <div className={`popup${popup ? ' popup--active' : ''}`}>
      <p className="popup__message">{message}</p>
    </div>
  );
};

PopupNotification.defaultProps = {
  timeout: 3000,
};

export default PopupNotification;
