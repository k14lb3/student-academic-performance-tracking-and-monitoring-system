import { useState, useRef } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from 'contexts/AuthContext';
import Button from 'components/Button/Button';
import Input from 'components/Input';
import Error from 'components/Error';

const SignIn = () => {
  const { user, signIn } = useAuth();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await signIn(emailRef.current.value, passwordRef.current.value);
    } catch {
      setLoading(false);
      setError('Invalid email or password!');
    }
  };

  return (
    <>
      {user ? (
        <Redirect to="/home" />
      ) : (
        <div className="flex sm:flex-col w-11/12 xs:w-full p-5 xs:p-0 m-auto bg-gray rounded shadow-xl xs:shadow-none">
          <div className="flex items-center w-5/12 sm:w-full p-5 pr-10 sm:pr-5 sm:pb-0 xs:px3 border-r sm:border-none border-orange-500 text-orange-500">
            <h1 className="text-4xl xs:text-2xl leading-snug sm:text-center">
              Student Academic Performance Tracking and Monitoring System
            </h1>
          </div>
          <div className="w-7/12 p-5 pl-10 sm:pl-5 sxs:p-3 sm:w-full">
            <h2 className="pb-5 xs:pb-3 mb-5 xs:mb-3 border-b border-orange-500 text-3xl xs:text-lg">
              Sign In
            </h2>
            <form onSubmit={handleSubmit}>
              <label>Email</label>
              <Input ref={emailRef} className="w-full mb-3" type="email" />
              <label>Password</label>
              <div className="relative">
                <Input
                  ref={passwordRef}
                  className="w-full"
                  type={showPassword ? 'text' : 'password'}
                />
                <div
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 w-6 text-gray-500 text-center"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                </div>
              </div>

              {error && <Error error={error} />}
              <Button
                className="w-full mb-1 mt-3"
                hasLoader={{ loading: loading }}
              >
                <span className={loading ? 'invisible' : ''}>Sign in</span>
              </Button>
            </form>
            Need an account?
            <Link to="/register" className="ml-1 text-orange-500">
              Register
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default SignIn;
