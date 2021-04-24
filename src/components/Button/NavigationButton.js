import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NavigationButton = ({ to, icon, title }) => {
  return (
    <NavLink
      to={to}
      className="flex p-3 my-0.5 rounded hover:bg-orange-500 hover:bg-opacity-5 text-2xl hover:text-orange-500"
      activeClassName="text-orange-500 pointer-events-none"
    >
      <div className="w-10 mr-3 sm:mr-0 text-center">
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className="tracking-wider sm:hidden">{title}</div>
    </NavLink>
  );
};

export default NavigationButton;
