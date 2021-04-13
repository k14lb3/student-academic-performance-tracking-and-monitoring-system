import './SettingsNavigation.scss';
import { Switch, Route, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const SettingsNavigation = () => {
  const history = useHistory();
  return (
    <div className="settingsNavigation">
      <Switch>
        <Route
          strict
          path={['/settings/']}
          component={() => (
            <div
              className="settingsNavigation__backButton"
              onClick={() => {
                history.goBack();
              }}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </div>
          )}
        />
      </Switch>
      <div>
        <h2 className="settingsNavigation__title">
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
              component={() => <>Account Information</>}
            />
            <Route
              path="/settings/change-password"
              component={() => <>Change password</>}
            />
            <Route exact path="/settings" component={() => <>Your Account</>} />
          </Switch>
        </h2>
      </div>
    </div>
  );
};

export default SettingsNavigation;
