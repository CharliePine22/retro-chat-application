import './App.css';
import { ChatEngine, getOrCreateChat  } from 'react-chat-engine';
import { useState } from 'react';
import useSound from 'use-sound';
import sendSound from './assets/sounds/imsend.wav';
import ChatFeed from './components/ChatFeed';
import DirectChatPage from './components/DirectChatPage';
import WelcomeScreen from './components/WelcomeScreen';
import ChatList from './components/ChatList';

function App() {
  const [soundVolume, setSoundVolume] = useState(1);
  const [username, setUsername] = useState('');
  
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

  const createDirectChat = (creds) => {
    getOrCreateChat(
			creds,
			{ is_direct_chat: true, usernames: [username] },
			() => setUsername('')
		)
  }

  const renderChatForm = (creds) => {
    return (
			<div className='test-block'>
				<input 
					placeholder='Username' 
					value={username} 
					onChange={(e) => setUsername(e.target.value)} 
				/>
				<button onClick={() => createDirectChat(creds)}>
					Create
				</button>
			</div>
		)
  } 

  // If login failes return them back to same page
  if (!localStorage.getItem('username')) return <WelcomeScreen />;

  return <>
    <ChatEngine
      height="100vh"
      projectID="b8a0fde0-1fae-4db8-9870-6bba5beb67c0"
      userName={localStorage.getItem('username')}
      userSecret={localStorage.getItem('password')}
      renderChatList={(chatAppProps) => <ChatList {...chatAppProps} changeVolume={changeVolume} />}
      renderNewChatCard={(creds) => <DirectChatPage changeVolume={changeVolume} {...creds} />} 
      onNewMessage={play}
      renderChatFeed={(chatAppProps) => <ChatFeed {...chatAppProps} />}
      renderChatSettings={(chatAppState) => {}}
      renderNewChatForm={(creds) => renderChatForm(creds)}
    />
  </>;
}

export default App;
