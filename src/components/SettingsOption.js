import './SettingsOption.scss';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SettingsOption = ({ link, icon, title, description }) => {
  return (
    <Link to={link} className="settingsOption button">
      <div className="settingsOption__icon">
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className="settingsOption__body">
        <h3 className="settingsOption__title">{title}</h3>
        <div>{description}</div>
      </div>
    </Link>
  );
};

export default SettingsOption;
