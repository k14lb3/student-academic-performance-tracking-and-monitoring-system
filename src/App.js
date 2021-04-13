import { BrowserRouter } from 'react-router-dom';
import UserProvider from './contexts/UserContext';
import AuthProvider from './contexts/AuthContext';
import SubjectProvider from './contexts/SubjectContext';
import Header from './components/Header/Header';
import Main from './containers/Main';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <UserProvider>
            <SubjectProvider>
              <Header />
              <Main />
            </SubjectProvider>
          </UserProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
