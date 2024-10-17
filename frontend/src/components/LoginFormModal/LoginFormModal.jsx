import { useState, useEffect } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [loginError, setLoginError] = useState("");
  const { closeModal } = useModal();
  const [isDemoLogin, setIsDemoLogin] = useState(false);

  useEffect(() => {
    setIsFormValid(credential.length >= 4 && password.length >= 6);
  }, [credential, password]);

  useEffect(() => {
    if (isDemoLogin && isFormValid) {
      handleSubmit({ preventDefault: () => {} });
      setIsDemoLogin(false);
    }
  }, [isDemoLogin, isFormValid]);

  const demoLogin = (e) => {
    e.preventDefault();
    setCredential("Demo-lition");
    setPassword("password");
    setIsDemoLogin(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    setLoginError(""); // Clear previous login error
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
          setLoginError("The provided credentials were invalid.");
        }
      });
  };

  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
          {errors.credential && <p className="error-message">{errors.credential}</p>}
        <label>
          <input
            type="text"
            value={credential}
            placeholder='Username or Email'
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            type="password"
            value={password}
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button 
          className='login-button' 
          type="submit" 
          disabled={!isFormValid}
        >
          Log In
        </button>
      </form>
      <button className='demo-login' onClick={demoLogin}>Login as Demo User</button>
    </>
  );
}

export default LoginFormModal;
