import { useState } from 'react';
import axios from 'axios';

const LoginForm = (params) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newUser, setNewUser] = useState(false);
  const [error, setError] = useState('');

  const changeAuthenticationHandler = () => {
    setNewUser(!newUser);
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();

    if (!newUser) {
      const authObject = {
        'Project-ID': 'b8a0fde0-1fae-4db8-9870-6bba5beb67c0',
        'User-Name': username,
        'User-Secret': password,
      };
      try {
        // Grab user authentication
        await axios.get('https://api.chatengine.io/chats', {
          headers: authObject,
        });

        // Authentication successful
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);

        window.location.reload();
      } catch (error) {
        setError('Oops, incorrect credentials.');
      }
    } else {
      const data = { username: username, password: password };
      const config = {
        method: 'POST',
        url: 'https://api.chatengine.io/users/',
        headers: {
          'PRIVATE-KEY': 'e20c09ad-f36b-4f4a-b309-99ae04944996',
        },
        data: data,
      };
      try {
        const response = await axios(config);
        console.log(response);
      } catch (error) {
        setError(error);
      }
    }
  };

  return (
    <>
      <div className="getBanner">
        <div className="announcement">
          <p>Welcome to the Chat App! Nostalgia mixed with a modern look!</p>
        </div>
      </div>
      <div className="wrapper">
        <div className="jumbo">
          <h1>
            <img
              src="/assets/images/site-logo.png"
              alt="1997.chat, a retro IM app"
              width="519"
            />
          </h1>
        </div>
        <div className="form-container">
          <div className="form-img">
            <img src="/assets/images/chat-preview.jpg" alt="It's back." />
          </div>
          <div className="form">
            <h1 className="title">Chat Application</h1>
            <form onSubmit={formSubmitHandler}>
              <input
                type="text"
                className="input"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                className="input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div align="center">
                <button type="submit" className="button">
                  <span>{!newUser ? 'Start Chatting' : 'Submit'}</span>
                </button>
              </div>
              <h2 className="error">{error}</h2>
            </form>
            <div align="center">
              <button onClick={changeAuthenticationHandler} className="button">
                <span>{!newUser ? 'Create New Account' : 'Login'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
