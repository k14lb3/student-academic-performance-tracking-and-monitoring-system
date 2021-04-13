import './Main.scss';
import { Switch, Route, Redirect } from 'react-router-dom';
import PrivateRoute from 'hoc/PrivateRoute';
import { useAuth } from 'contexts/AuthContext';
import SignIn from './SignIn';
import Home from './Home/Home';
import Subjects from './Subjects/Subjects';
import Settings from './Settings/Settings';

const Main = () => {
  const { user } = useAuth();

  return (
    <main className={`main${user ? '' : ' main--signin'}`}>
      <div className="main__container">
        <Switch>
          <PrivateRoute path="/home" component={Home} />
          <PrivateRoute path="/subjects" component={Subjects} />
          <PrivateRoute path="/settings" component={Settings} />
          <Route path="/sign-in" component={SignIn} />
          <Redirect to="/sign-in" />
        </Switch>
      </div>
    </main>
  );
};

export default Main;
