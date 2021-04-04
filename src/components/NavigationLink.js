import './NavigationLink.scss';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NavigationLink = ({ link, icon, label }) => {
  return (
    <>
      <NavLink
        to={link}
        activeClassName="navigationLink--active"
        className="navigationLink"
      >
        <div className={`navigationLink__icon navigationLink__${label.toLowerCase()}`}>
          <FontAwesomeIcon icon={icon} />
        </div>
        <div className="navigationLink__label">{label}</div>
      </NavLink>
    </>
  );
};

export default NavigationLink;
