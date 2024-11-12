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
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    try {
      await dispatch(sessionActions.login({ credential, password }));
      closeModal();
    } catch (res) {
      if (res.status === 401) {
        setErrors({ credential: "The provided credentials were invalid" });
      } else {
        setErrors({ credential: "An error occurred. Please try again." });
      }
    }
  };

  const demoLogin = async (e) => {
    e.preventDefault();
    try {
      await dispatch(sessionActions.login({ 
        credential: "Demo-lition", 
        password: "password" 
      }));
      closeModal();
    } catch (error) {
      setErrors({ credential: "Demo login failed. Please try again." });
    }
  };

  useEffect(() => {
    setIsFormValid(credential.length >= 4 && password.length >= 6);
  }, [credential, password]);

  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        {errors.credential && (
          <p className="error-message">{errors.credential}</p>
        )}
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
      <button 
        className='demo-login' 
        onClick={demoLogin}
      >
        Login as Demo User
      </button>
    </>
  );
}

export default LoginFormModal;
