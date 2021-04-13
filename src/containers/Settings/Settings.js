import './Settings.scss';
import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { Switch, Route } from 'react-router-dom';
import { faUser, faKey } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from 'contexts/AuthContext';
import SettingsOption from 'components/SettingsOption';
import SettingsNavigation from 'components/SettingsNavigation';
import AccountInformation from './AccountInformation/AccountInformation';
import ChangePassword from './ChangePassword/ChangePassword';
import AccountType from './AccountInformation/AccountType';
import Name from './AccountInformation/Name';
import Email from './AccountInformation/Email';
import Gender from './AccountInformation/Gender';

const settingsOptions = [
  {
    link: '/settings/account-information',
    icon: faUser,
    title: 'Account information',
    description: 'See your account information.',
  },
  {
    link: '/settings/change-password',
    icon: faKey,
    title: 'Change password',
    description: 'Change your password.',
  },
];

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
                {settingsOptions.map(({ link, icon, title, description }) => (
                  <SettingsOption
                    key={uuid()}
                    link={link}
                    icon={icon}
                    title={title}
                    description={description}
                  />
                ))}
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
