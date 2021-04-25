import { faStickyNote } from '@fortawesome/free-regular-svg-icons';
import { faCog, faHome } from '@fortawesome/free-solid-svg-icons';
import NavigationButton from 'components/Button/NavigationButton';

const Navigation = () => {
  return (
    <nav className="flex flex-col xs:flex-row xs:justify-between xs:w-full py-5 xs:py-0 xs:px-5">
      <ul>
        <li>
          <NavigationButton to="/home" icon={faHome} title="Home" />
        </li>
        <li>
          <NavigationButton
            to="/subjects"
            icon={faStickyNote}
            title="Subjects"
          />
        </li>
        <li>
          <NavigationButton to="/settings" icon={faCog} title="Settings" />
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
