import { faStickyNote } from '@fortawesome/free-regular-svg-icons';
import { faCog, faHome } from '@fortawesome/free-solid-svg-icons';
import NavigationButton from 'components/Button/NavigationButton';

const Navigation = () => {
  return (
    <nav className="flex flex-col xs:flex-row xs:justify-between xs:w-full py-5 xs:py-0 xs:px-5">
      <NavigationButton to="/home" icon={faHome} title="Home" />
      <NavigationButton to="/subjects" icon={faStickyNote} title="Subjects" />
      <NavigationButton to="/settings" icon={faCog} title="Settings" />
    </nav>
  );
};

export default Navigation;
