import './Header.scss';
import logo from 'assets/logo512.png';
import { useState, useEffect } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from 'contexts/AuthContext';
import Navigation from 'components/Navigation';

const Header = () => {
  const { signOut } = useAuth();

  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleWindowSizeChange = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleWindowSizeChange);

    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);
  return (
    <Switch>
      <Route
        path={['/home', '/subjects', '/settings']}
        component={() => (
          <header className="header">
            <div className="header__container">
              {width >= 480 ? (
                <Link to="/home">
                  <div className="header__logo">
                    <img src={logo} alt="" />
                  </div>
                </Link>
              ) : (
                <></>
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
