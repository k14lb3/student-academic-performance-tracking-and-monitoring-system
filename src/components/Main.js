import './Main.scss';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PrivateRoute from './PrivateRoute';
import SignIn from './SignIn';
import Home from './Home';
import Subjects from './Subjects';
import Settings from './Settings';

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
