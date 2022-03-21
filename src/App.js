import './App.css';
import { ChatEngine } from 'react-chat-engine';
import { useState, useEffect } from 'react';
import useSound from 'use-sound';
import sendSound from './assets/sounds/imsend.wav';
import receivedSound from './assets/sounds/imreceive.mp3';
import ChatFeed from './components/ChatFeed';
import WelcomeScreen from './components/WelcomeScreen';
import ChatList from './components/ChatList';
// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

function App() {
  // Sound settings 
  const [soundVolume, setSoundVolume] = useState(1);
  const [playSend] = useSound(sendSound, { volume: soundVolume });
  const [playReceived] = useSound(receivedSound, { volume: soundVolume });

  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentChatId, setCurrentChatId] = useState();
  const [allUsers, setAllUsers] = useState([]);

  // Chaning sound volume settings
  const changeVolume = (volume) => {
    if (volume == 'Full') {
      setSoundVolume(1);
    } else if (volume == 'Half') {
      setSoundVolume(0.5);
    } else {
      setSoundVolume(0);
    }
  };

  // Use to  auto log user out and potentially set online status to offline
  useEffect(() => {
    const unloadCallback = (event) => {
      event.preventDefault();
      event.returnValue = "";
      return "";
    };
  
    window.addEventListener("beforeunload", unloadCallback);
    return () => window.removeEventListener("beforeunload", unloadCallback);
  }, []);

  // Fetch messages based on current chat channel
  const grabMessages = (chatId) => {
    setCurrentChatId(chatId);
    setLoading(true);
    var myHeaders = new Headers();
    myHeaders.append('Project-ID', 'b8a0fde0-1fae-4db8-9870-6bba5beb67c0');
    myHeaders.append('User-Name', localStorage.getItem('username'));
    myHeaders.append('User-Secret', localStorage.getItem('password'));

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };
    
    fetch(`https://api.chatengine.io/chats/${chatId}/messages/`, requestOptions)
      .then((response) => response.json())
      .then((result) => setChatMessages(result))
      .catch((error) => console.log('error', error));
    setLoading(false);
  };

  
  // Grab every user
  useEffect(() => {
    const getAllUsers = () => {
      var myHeaders = new Headers();
      myHeaders.append('PRIVATE-KEY', 'e20c09ad-f36b-4f4a-b309-99ae04944996');

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      fetch('https://api.chatengine.io/users/', requestOptions)
        .then((response) => response.json())
        .then((result) => setAllUsers(result))
        .catch((error) => console.log('error', error));
    };
    getAllUsers();
  }, []);


  // If login failes return them back to same page
  if (!localStorage.getItem('username')) return <WelcomeScreen />;

  return (
    <>
      <ChatEngine
        height="100vh"
        projectID="b8a0fde0-1fae-4db8-9870-6bba5beb67c0"
        userName={localStorage.getItem('username')}
        userSecret={localStorage.getItem('password')}
        renderChatList={(chatAppProps) => (
          <ChatList
            {...chatAppProps}
            allUsers={allUsers}
            loading={loading}
            fetchChannelMessages={grabMessages}
            changeVolume={changeVolume}
          />
        )}
        onNewMessage={playSend}
        onGetMessages={playReceived}
        renderChatFeed={(chatAppProps) => (
          <ChatFeed
            {...chatAppProps}
            loading={loading}
            fetchChannelMessages={grabMessages}
            chatMessages={chatMessages}
          />
        )}
        renderChatSettings={(chatAppState) => {}}
      />
    </>
  );
}

export default App;
