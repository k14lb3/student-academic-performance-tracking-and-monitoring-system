import './Navigation.scss';
import { v4 as uuid } from 'uuid';
import { faStickyNote } from '@fortawesome/free-regular-svg-icons';
import { faCog, faHome } from '@fortawesome/free-solid-svg-icons';
import NavigationLink from './NavigationLink';

const Navigation = () => {
  return (
    <nav className="navigation">
      <NavigationLink key={uuid()} link="/home" icon={faHome} label="Home" />
      <NavigationLink
        key={uuid()}
        link="/subjects"
        icon={faStickyNote}
        label="Subjects"
      />
      <NavigationLink
        key={uuid()}
        link="/settings"
        icon={faCog}
        label="Settings"
      />
    </nav>
  );
};

export default Navigation;
