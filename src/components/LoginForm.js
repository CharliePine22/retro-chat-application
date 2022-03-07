import { useState } from 'react';
import NewWindow from 'react-new-window';
import chatBubbles from '../assets/images/chat-bubbles.png';
import redKey from '../assets/images/red-key.png';

const LoginForm = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newUser, setNewUser] = useState(false);
  const [error, setError] = useState(false);

  const changeAuthenticationHandler = () => {
    setNewUser(!newUser);
  };

  const formSubmitHandler = (e) => {
    const data = {username, password}
    e.preventDefault();
    props.formSubmit(data)
  }
  
  return (
    <>
      <NewWindow
        title="LoginForm"
        name="LoginForm"
        center="parent"
        features={{ width: 350, height: 575 }}
      >
        <div className='login-form-wrapper'>
           <div className='logo-container'>
            <img src={chatBubbles} />
           </div> 
           <hr />
           <div className='login-container'>
           <form onSubmit={formSubmitHandler}>
             <div className='username-container'>
             <label htmlFor='username'><em>ScreenName</em><img src={redKey}/></label>
              <input
                type="text"
                id='username'
                className="username-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <span onClick={changeAuthenticationHandler} className='new-user-button'>{!newUser ? 'Get a Screen Name' : 'Login with Screen Name'}</span>
              </div>
              <div className='password-container'>
              <label htmlFor='password'>Password</label>
              <input
                type="password"
                id='password'
                className="password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              </div>
              <div className="form-actions">
                <button type="submit" className="sign-in-button">
                  <img src='http://coolbuddy.com/icon/buddyicons/buddy45.gif'/>
                </button>
              </div>
              <h2 className="error">{error}</h2>
            </form>
           </div>
        </div>
      </NewWindow>
    </>
  );
};

export default LoginForm;
