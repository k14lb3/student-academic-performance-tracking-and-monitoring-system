import { useState, useRef } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import Button from 'components/Button/Button';
import Input from 'components/Input';
import Select from 'components/Select';
import Error from 'components/Error';

const SignIn = () => {
  const { user, register } = useAuth();
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
    const firstName = firstNameRef.current.value.trim(),
      lastName = lastNameRef.current.value.trim(),
      middleName = middleNameRef.current.value.trim(),
      email = emailRef.current.value.trim(),
      password = passwordRef.current.value.trim(),
      confirmPassword = confirmPasswordRef.current.value.trim(),
      type = typeRef.current.value.trim(),
      gender = genderRef.current.value.trim();

    setLoading(true);
    setError('');

    try {
      await register(
        firstName,
        lastName,
        middleName,
        email,
        password,
        confirmPassword,
        type,
        gender
      );
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      {user ? (
        <Redirect to="/home" />
      ) : (
        <div className="p-10 xs:p-6 bg-gray shadow-xl xs:shadow-none">
          <div className="pb-5 xs:pb-3 mb-5 xs:mb-3 border-b border-yellow-500">
            <h2 className="text-3xl">Create an account</h2>
          </div>
          <div className="register__body">
            <form onSubmit={handleSubmit}>
              <label
                tw-content-after=" *"
                className="content-after after:text-orange"
              >
                First Name
              </label>
              <Input ref={firstNameRef} className="w-full mb-3" />
              <label
                tw-content-after=" *"
                className="content-after after:text-orange"
              >
                Last Name
              </label>
              <Input ref={lastNameRef} className="w-full mb-3" />
              <label>Middle Name</label>
              <Input ref={middleNameRef} className="w-full mb-3" />
              <label
                tw-content-after=" *"
                className="content-after after:text-orange"
              >
                Email
              </label>
              <Input ref={emailRef} className="w-full mb-3" />
              <div className="grid grid-cols-2 gap-5 mb-3">
                <div>
                  <label
                    tw-content-after=" *"
                    className="content-after after:text-orange"
                  >
                    Password
                  </label>
                  <Input
                    ref={passwordRef}
                    className="w-full"
                    type="password"
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <label
                    tw-content-after=" *"
                    className="content-after after:text-orange"
                  >
                    Confirm Password
                  </label>
                  <Input
                    ref={confirmPasswordRef}
                    className="w-full"
                    type="password"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label
                    tw-content-after=" *"
                    className="content-after after:text-orange"
                  >
                    Account type
                  </label>
                  <Select ref={typeRef} className="w-full">
                    <option value="Instructor">Instructor</option>
                    <option value="Student">Student</option>
                  </Select>
                </div>
                <div>
                  <label
                    tw-content-after=" *"
                    className="content-after after:text-orange"
                  >
                    Gender
                  </label>
                  <Select ref={genderRef} className="w-full">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="N/A">N/A</option>
                  </Select>
                </div>
              </div>
              {error && <Error error={error} />}
              <Button
                className="w-full mb-1 mt-3"
                hasLoader={{ loading: loading }}
              >
                <span className={loading ? 'invisible' : ''}>Register</span>
              </Button>
            </form>
            <Link to="/sign-in" className="text-orange hover:underline">
              Already have an account?
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default SignIn;
