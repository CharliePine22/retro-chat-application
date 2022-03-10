import './App.css';
import { ChatEngine, getOrCreateChat  } from 'react-chat-engine';
import { useState, useEffect } from 'react';
import useSound from 'use-sound';
import sendSound from './assets/sounds/imsend.wav';
import ChatFeed from './components/ChatFeed';
import DirectChatPage from './components/DirectChatPage';
import WelcomeScreen from './components/WelcomeScreen';
import ChatList from './components/ChatList';

function App() {
  const [soundVolume, setSoundVolume] = useState(1);
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  
  const [play] = useSound(sendSound, {volume: soundVolume});

  const changeVolume = (volume) => {
    if(volume == 'Full') {
      setSoundVolume(1);
    } else if(volume == 'Half') {
      setSoundVolume(.50);
    } else {
      setSoundVolume(0);
    }
  }

  const grabMessages = (chatId) => {
    setLoading(true)
    var myHeaders = new Headers();
    myHeaders.append('Project-ID', 'b8a0fde0-1fae-4db8-9870-6bba5beb67c0');
    myHeaders.append('User-Name', localStorage.getItem('username'));
    myHeaders.append('User-Secret', localStorage.getItem('password'));

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

  fetch(`https://api.chatengine.io/chats/${chatId}/messages/`, requestOptions)
  .then(response => response.json())
  .then(result => setChatMessages(result))
  .catch(error => console.log('error', error));
  setLoading(false);
  }

  const changeLoadingTrue = () => {
    setLoading(true)
  }

  const changeLoadingFalse = () => {
    setLoading(false)
  }


  // If login failes return them back to same page
  if (!localStorage.getItem('username')) return <WelcomeScreen />;

  return <>
    <ChatEngine
      height="100vh"
      projectID="b8a0fde0-1fae-4db8-9870-6bba5beb67c0"
      userName={localStorage.getItem('username')}
      userSecret={localStorage.getItem('password')}
      renderChatList={(chatAppProps) => <ChatList {...chatAppProps} loading={loading} changeLoadingTrue={changeLoadingTrue} changeLoadingFalse={changeLoadingFalse} fetchChannelMessages={grabMessages} changeVolume={changeVolume} />}
      onNewMessage={play}
      renderChatFeed={(chatAppProps) => <ChatFeed {...chatAppProps} loading={loading} chatMessages={chatMessages}/>}
      renderChatSettings={(chatAppState) => {}}
      // renderNewChatForm={(creds) => renderChatForm(creds)}
    />
  </>;
}

export default App;
