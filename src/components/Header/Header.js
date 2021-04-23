import './Header.scss';
import logo from 'assets/logo512.png';
import { Switch, Route, Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from 'contexts/AuthContext';
import Navigation from './Navigation';

const Header = () => {
  const { signOut } = useAuth();
  const XS = useMediaQuery({ query: '(min-width: 480px)' });

  return (
    <Switch>
      <Route
        path={['/home', '/subjects', '/settings']}
        component={() => (
          <header className="header">
            <div className="header__container">
              {XS && (
                <Link to="/home">
                  <div className="header__logo">
                    <img src={logo} alt="" />
                  </div>
                </Link>
              )}
              <Navigation />
              <button
                className="header__signOutButton button"
                onClick={signOut}
              >
                <div className="button__icon">
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </div>
                <div className="button__label">Sign Out</div>
              </button>
            </div>
          </header>
        )}
      />
    </Switch>
  );
};

export default Header;
