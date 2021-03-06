import { Switch, Route, Redirect } from 'react-router-dom';
import PrivateRoute from 'hoc/PrivateRoute';
import { useAuth } from 'contexts/AuthContext';
import SignIn from './SignIn';
import Register from './Register';
import Home from './Home/Home';
import Subjects from './Subjects/Subjects';
import Settings from './Settings/Settings';

const Main = () => {
  const { user } = useAuth();

  return (
    <main
      className={`${user ? 'w-full bg-gray-500' : 'xs:w-full m-auto xs:mt-0 bg-transparent'}`}
    >
      <div className={`p-5 ${user ? 'xs:p-3 xs:pb-14' : 'xs:p-0'}`}>
        <Switch>
          <PrivateRoute path="/home" component={Home} />
          <PrivateRoute path="/subjects" component={Subjects} />
          <PrivateRoute path="/settings" component={Settings} />
          <Route path="/register" component={Register} />
          <Route path="/sign-in" component={SignIn} />
          <Redirect to="/sign-in" />
        </Switch>
      </div>
    </main>
  );
};

export default Main;
