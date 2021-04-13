import './Settings.scss';
import { useState, useEffect } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { faUser, faKey } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from 'contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SettingsNavigation from 'components/SettingsNavigation';
import AccountInformation from './AccountInformation/AccountInformation';
import ChangePassword from './ChangePassword/ChangePassword';
import AccountType from './AccountInformation/AccountType';
import Name from './AccountInformation/Name';
import Email from './AccountInformation/Email';
import Gender from './AccountInformation/Gender';

const Settings = () => {
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
    <div className="settings">
      <div className="settings__header">
        <h1 className="settings__title">Settings</h1>
      </div>
      <div className="settings__body">
        <SettingsNavigation />
        <Switch>
          <Route
            exact
            path="/settings"
            component={() => (
              <>
                <Link
                  to="/settings/account-information"
                  className="settingsOption button"
                >
                  <div className="settingsOption__icon">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                  <div className="settingsOption__body">
                    <h3 className="settingsOption__title">
                      Account information
                    </h3>
                    <div>See your account information.</div>
                  </div>
                </Link>
                <Link
                  to="/settings/change-password"
                  className="settingsOption button"
                >
                  <div className="settingsOption__icon">
                    <FontAwesomeIcon icon={faKey} />
                  </div>
                  <div className="settingsOption__body">
                    <h3 className="settingsOption__title">Change password</h3>
                    <div>See your account information.</div>
                  </div>
                </Link>
                {width <= 480 ? (
                  <button
                    className="settings__signOutButton button"
                    onClick={signOut}
                  >
                    Sign Out
                  </button>
                ) : (
                  <></>
                )}
              </>
            )}
          />
          <Route
            path="/settings/account-information/account-type"
            component={AccountType}
          />
          <Route path="/settings/account-information/name" component={Name} />
          <Route path="/settings/account-information/email" component={Email} />
          <Route
            path="/settings/account-information/gender"
            component={Gender}
          />
          <Route
            path="/settings/account-information"
            component={AccountInformation}
          />
          <Route path="/settings/change-password" component={ChangePassword} />
        </Switch>
      </div>
    </div>
  );
};

export default Settings;
