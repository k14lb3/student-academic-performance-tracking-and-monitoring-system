import logo from 'assets/logo512.png';
import { Switch, Route, Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from 'contexts/AuthContext';
import Navigation from './Navigation';
import Button from 'components/Button/Button';

const Header = () => {
  const { signOut } = useAuth();
  const XS = useMediaQuery({ query: '(min-width: 480px)' });

  return (
    <Switch>
      <Route
        path={['/home', '/subjects', '/settings']}
        component={() => (
          <header className="py-5 xs:py-1.5 bg-gray xs:fixed xs:bottom-0 xs:w-full xs:border-t xs:border-orange-500 z-50">
            <div className="h-full px-5 border-r xs:border-r-0 border-orange">
              {XS && (
                <Link className="flex justify-start pt-5 pb-5 pl-3" to="/home">
                  <img
                    className="transform h-12 duration-200 hover:scale-110"
                    src={logo}
                    alt=""
                  />
                </Link>
              )}
              <Navigation />
              {XS && (
                <Button className="w-full sm:p-3" onClick={signOut}>
                  <span className="text-xl sm:hidden">Sign Out</span>
                  <div className="text-xl hidden sm:block">
                    <FontAwesomeIcon icon={faSignOutAlt} />
                  </div>
                </Button>
              )}
            </div>
          </header>
        )}
      />
    </Switch>
  );
};

export default Header;
