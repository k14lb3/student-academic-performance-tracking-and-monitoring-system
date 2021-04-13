import './Navigation.scss';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStickyNote } from '@fortawesome/free-regular-svg-icons';
import { faCog, faHome } from '@fortawesome/free-solid-svg-icons';

const Navigation = () => {
  return (
    <nav className="navigation">
      <NavLink to="/home" activeClassName="navigation__link--active">
        <div>
          <FontAwesomeIcon icon={faHome} />
        </div>
        <span>Home</span>
      </NavLink>
      <NavLink to="/subjects" activeClassName="navigation__link--active">
        <div>
          <FontAwesomeIcon icon={faStickyNote} />
        </div>
        <span>Subjects</span>
      </NavLink>
      <NavLink to="/settings" activeClassName="navigation__link--active">
        <div>
          <FontAwesomeIcon icon={faCog} />
        </div>
        <span>Settings</span>
      </NavLink>
    </nav>
  );
};

export default Navigation;
