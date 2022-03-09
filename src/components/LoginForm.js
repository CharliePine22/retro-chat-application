import { useState } from 'react';
import NewWindow from 'react-new-window';
import loginIcon from '../assets/images/login-icon.jpg';
import signOnGif from '../assets/images/sign-on-gif.gif';
import redKey from '../assets/images/red-key.png';
import helpIcon from '../assets/images/help.png';
import setupIcon from '../assets/images/setup-icon.png';

const LoginForm = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newUser, setNewUser] = useState(false);
  const [error, setError] = useState(false);

  const changeAuthenticationHandler = () => {
    setNewUser(!newUser);
  };

  const formSubmitHandler = (e) => {
    e.preventDefault();
    if (!newUser) {
      const data = { username, password };
      props.formSubmit(data, 'login');
    } else {
      const data = { username, secret: password };
      props.formSubmit(data, 'signup');
    }
  };

  return (
    <>
      <NewWindow
        title="LoginForm"
        name="LoginForm"
        center="parent"
        features={{ width: 325, height: 575 }}
      >
        <div className="login-form-wrapper">
          <div className="logo-container">
            <img src={loginIcon} />
          </div>
          <hr />
          <div className="login-container">
            <form onSubmit={formSubmitHandler}>
              <div className="username-container">
                <label htmlFor="username">
                  <em>ScreenName</em>
                  <img src={redKey} alt="a-red-key" />
                </label>
                <input
                  type="text"
                  id="username"
                  className="username-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <span
                  onClick={changeAuthenticationHandler}
                  className="new-user-button"
                >
                  {!newUser ? 'Get a Screen Name' : 'Login with Screen Name'}
                </span>
              </div>
              <div className="password-container">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  className="password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  onClick={changeAuthenticationHandler}
                  className="forgot-password-button"
                >
                  {!newUser ? 'Forgot Password?' : ''}
                </span>
              </div>
              <div className='sign-in-checks'>
                  <input type='checkbox' id='save-password'/> 
                  <label className='save-password-check' htmlFor='save-password'>Save password</label>

                  <input type='checkbox' id='auto-login'/> 
                  <label htmlFor='auto-login'>Auto-login</label>
                </div>
              <div className="form-actions">
                <div className='form-actions-settings'>
                  <div className='help-icon-container'>
                    <img className='help-icon' src={helpIcon} />
                    <p className='help-icon-text'><u>H</u>elp</p>
                  </div>
                  <div className='setup-icon-container'>
                    <img className='setup-icon' src={setupIcon}/>
                    <p className='setup-icon-text'>S<u>e</u>tup</p>
                  </div>
                </div>
                <button type="submit" className="sign-in-button">
                  <img src={signOnGif} />
                </button>
              </div>
              <h2 className="error">{error}</h2>
              <p className='version-text'>Version: 3.1.2022</p>
            </form>
          </div>
        </div>
      </NewWindow>
    </>
  );
};

export default LoginForm;
