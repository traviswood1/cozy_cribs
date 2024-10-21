import { useState, useEffect, useCallback } from 'react';
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

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  }, [credential, password, dispatch, closeModal]);

  useEffect(() => {
    setIsFormValid(credential.length >= 4 && password.length >= 6);
  }, [credential, password]);

  const demoLogin = (e) => {
    e.preventDefault();
    setCredential("Demo-lition");
    setPassword("password");
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
