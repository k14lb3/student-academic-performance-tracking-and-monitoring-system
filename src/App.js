import { BrowserRouter } from 'react-router-dom';
import UserProvider from './contexts/UserContext';
import AuthProvider from './contexts/AuthContext';
import SubjectsProvider from './contexts/SubjectsContext';
import Header from './components/Header/Header';
import Main from './containers/Main';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <UserProvider>
            <SubjectsProvider>
              <Header />
              <Main />
            </SubjectsProvider>
          </UserProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
