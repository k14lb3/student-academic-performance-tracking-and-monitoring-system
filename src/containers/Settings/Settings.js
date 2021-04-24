import { useState, useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faUser,
  faKey,
  faUserTimes,
} from '@fortawesome/free-solid-svg-icons';
import SettingsButton from 'components/Button/SettingsButton';
import Button from 'components/Button/Button';
import AccountInformation from './AccountInformation/AccountInformation';
import ChangePassword from './ChangePassword/ChangePassword';
import AccountType from './AccountInformation/AccountType';
import Name from './AccountInformation/Name';
import Email from './AccountInformation/Email';
import Gender from './AccountInformation/Gender';
import DeleteAccount from './DeleteAccount';

const Settings = () => {
  const { signOut } = useAuth();
  const [width, setWidth] = useState(window.innerWidth);
  const history = useHistory();

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
    <div className="settings w-full">
      <div className="flex items-center py-5 xs:pt-0 xs:pb-3 border-solid border-b border-orange-500">
        <h1 className="text-5xl xs:text-3xl">Settings</h1>
      </div>
      <div className="py-5 xs:py-3">
        <div className="flex items-center h-7 mb-5 xs:mb-3">
          <Switch>
            <Route
              strict
              path={['/settings/']}
              component={() => (
                <div
                  className="text-orange-500 px-2.5 py-1 mr-3 rounded-full text-lg cursor-pointer duration-200 hover:bg-orange-500 hover:bg-opacity-5"
                  onClick={() => {
                    history.goBack();
                  }}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </div>
              )}
            />
          </Switch>
          <h2 className="text-2xl xs:text-lg">
            <Switch>
              <Route
                path="/settings/account-information/account-type"
                component={() => <>Account type</>}
              />
              <Route
                path="/settings/account-information/name"
                component={() => <>Name</>}
              />
              <Route
                path="/settings/account-information/email"
                component={() => <>Email</>}
              />
              <Route
                path="/settings/account-information/gender"
                component={() => <>Gender</>}
              />
              <Route
                exact
                path="/settings/account-information"
                component={() => <>Account information</>}
              />
              <Route
                path="/settings/change-password"
                component={() => <>Change password</>}
              />
              <Route
                path="/settings/delete-account"
                component={() => <>Delete account</>}
              />
              <Route
                exact
                path="/settings"
                component={() => <>Your Account</>}
              />
            </Switch>
          </h2>
        </div>
        <Switch>
          <Route
            exact
            path="/settings"
            component={() => (
              <div>
                <SettingsButton
                  to="/settings/account-information"
                  icon={faUser}
                  title="Account information"
                  desc="See your account information."
                />
                <SettingsButton
                  to="/settings/change-password"
                  icon={faKey}
                  title="Change password"
                  desc="Change your password."
                />
                <SettingsButton
                  to="/settings/delete-account"
                  icon={faUserTimes}
                  title="Delete account"
                  desc="Delete your account."
                />
                {width <= 480 && (
                  <Button
                    className="block w-1/2 mt-3 ml-auto"
                    onClick={signOut}
                  >
                    Sign Out
                  </Button>
                )}
              </div>
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
          <Route path="/settings/delete-account" component={DeleteAccount} />
        </Switch>
      </div>
    </div>
  );
};

export default Settings;
