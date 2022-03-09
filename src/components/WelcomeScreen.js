import { useState } from 'react';
import axios from 'axios';
import siteLogo from '../assets/images/site-logo.png';
import chatPreview from '../assets/images/chat-preview.jpg';
import LoginForm from './LoginForm';
import { collection, addDoc } from 'firebase/firestore';

const WelcomeScreen = (params) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState('');

  const openLoginWindow = () => {
    setIsLoggingIn(!isLoggingIn);
  };

  const formSubmitHandler = async (data, method) => {
    //Login
    if (method === 'login') {
      const authObject = {
        'Project-ID': 'b8a0fde0-1fae-4db8-9870-6bba5beb67c0',
        'User-Name': data.username,
        'User-Secret': data.password,
      };
      try {
        // Grab user authentication
        await axios.get('https://api.chatengine.io/chats', {
          headers: authObject,
        });

        // Authentication successful
        localStorage.setItem('username', data.username);
        localStorage.setItem('password', data.password);

        window.location.reload();
      } catch (error) {
        setError('Oops, incorrect credentials.');
      }

      setIsLoggingIn(false);
    } else {
      // New User
      const config = {
        method: 'POST',
        url: 'https://api.chatengine.io/users/',
        headers: {
          'PRIVATE-KEY': 'e20c09ad-f36b-4f4a-b309-99ae04944996',
        },
        data,
      };
      try {
        // const userRef = await addDoc(collection(db, "users"), {
        //   username: data.username,
        //   password: data.password
        // });

        const response = await axios(config);
        localStorage.setItem('username', data.username);
        localStorage.setItem('password', data.password);
        window.location.reload();
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
          <button onClick={openLoginWindow} className="login-button">
            Launch Messenger App
          </button>
        </div>
      </div>
      <div className="wrapper">
        {isLoggingIn && <LoginForm formSubmit={formSubmitHandler} />}
        <div className="jumbo">
          <h1>
            <img src={siteLogo} alt="1997.chat, a retro IM app" width="519" />
          </h1>
        </div>
        <div className="form-img">
          <img src={chatPreview} alt="It's back." />
        </div>
      </div>
    </>
  );
};

export default WelcomeScreen;
