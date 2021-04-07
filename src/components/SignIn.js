import './SignIn.scss';
import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Loader from './Loader';

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
        <div className="signIn">
          <div className="signIn__header">
            <h1 className="signIn__title">
              Student Academic Performance Tracking and Monitoring System
            </h1>
          </div>
          <div className="signIn__body">
            <h2 className="signIn__signInlabel">Sign In</h2>
            <form onSubmit={handleSubmit}>
              <label>Email</label>
              <div className="input">
                <input ref={emailRef} type="email" />
              </div>
              <label>Password</label>
              <div className="input">
                <input
                  ref={passwordRef}
                  type={showPassword ? 'text' : 'password'}
                />
                <div
                  className="signIn__showPassword"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                </div>
              </div>
              {error && <span className="error">{error}</span>}
              <button
                disabled={loading}
                className="signIn__signInButton button"
              >
                <span className={loading ? 'hidden' : ''}>Sign in</span>
                {loading && <Loader />}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SignIn;
