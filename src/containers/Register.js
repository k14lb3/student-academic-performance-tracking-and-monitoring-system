import './Register.scss';
import { useState, useRef } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from 'contexts/AuthContext';
import Loader from 'components/Loader';

const SignIn = () => {
  const { user, register, signIn } = useAuth();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const middleNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const genderRef = useRef();
  const typeRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <>
      {user ? (
        <Redirect to="/home" />
      ) : (
        <div className="register">
          <div className="register__header">
            <h2>Create an account</h2>
          </div>
          <div className="register__body">
            <form onSubmit={handleSubmit}>
              <div className="input">
                <label>First Name</label>
                <input ref={firstNameRef} type="text" />
              </div>
              <div className="input">
                <label>Last Name</label>
                <input ref={lastNameRef} type="text" />
              </div>
              <div className="input">
                <label>Middle Name</label>
                <input ref={middleNameRef} type="text" />
              </div>
              <div className="input">
                <label>Email</label>
                <input ref={emailRef} type="email" />
              </div>
              <div className="register__password">
                <div className="input">
                  <label>Password</label>
                  <input
                    autoComplete="new-password"
                    ref={passwordRef}
                    type="password"
                  />
                </div>
                {error && <span className="error">{error}</span>}
                <div className="input">
                  <label>Confirm password</label>
                  <input ref={confirmPasswordRef} type="password" />
                </div>
              </div>
              <div>
                <div className="input">
                  <label>Gender</label>
                  <select ref={genderRef}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="N/A">N/A</option>
                  </select>
                </div>
                <div className="input">
                  <label>Account type</label>
                  <select ref={typeRef}>
                    <option value="Instructor">Instructor</option>
                    <option value="Student">Student</option>
                  </select>
                </div>
              </div>
              {error && <span className="error">{error}</span>}
              <button
                disabled={loading}
                className="signIn__signInButton button"
              >
                <span className={loading ? 'hidden' : ''}>Register</span>
                {loading && <Loader />}
              </button>
            </form>
            <Link to="/sign-in" className="register__signInLink">
              Already have an account?
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default SignIn;
