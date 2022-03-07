import './App.css';
import { ChatEngine } from 'react-chat-engine';
import { useState } from 'react';
import useSound from 'use-sound';
import sendSound from './assets/sounds/imsend.wav';
import ChatFeed from './components/ChatFeed';
import DirectChatPage from './components/DirectChatPage';
import LoginForm from './components/LoginForm';
import ChatList from './components/ChatList';

function App() {
  const [soundVolume, setSoundVolume] = useState(1);
  
  const [play] = useSound(sendSound, {volume: soundVolume});

  const changeVolume = (volume) => {
    if(volume == 'Full') {
      setSoundVolume(1);
    } else if(volume == 'Half') {
      setSoundVolume(.50);
    } else {
      setSoundVolume(0);
    }
    console.log(volume)
  }

  // If login failes return them back to same page
  if (!localStorage.getItem('username')) return <LoginForm />;

  return <>
    <ChatEngine
      height="100vh"
      projectID="b8a0fde0-1fae-4db8-9870-6bba5beb67c0"
      userName={localStorage.getItem('username')}
      userSecret={localStorage.getItem('password')}
      renderChatList={(chatAppProps) => <ChatList {...chatAppProps} changeVolume={changeVolume} />}
      renderNewChatForm={(creds) => <DirectChatPage {...creds} />}
      onNewMessage={play}
      renderChatFeed={(chatAppProps) => <ChatFeed {...chatAppProps} />}
      renderChatSettings={(chatAppState) => {}}
      // renderOptionsSettings={(creds, chat) => <ChatSettings creds={creds} chat={chat} />}
    />
  </>;
}

export default App;
