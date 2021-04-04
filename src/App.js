import { BrowserRouter } from 'react-router-dom';
import UserProvider from './contexts/UserContext';
import AuthProvider from './contexts/AuthContext';
import Header from './components/Header';
import Main from './components/Main';

const App = () => {

  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <UserProvider>
            <Header />
            <Main />
          </UserProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
