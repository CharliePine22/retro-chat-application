import { useState } from 'react';
import { ChatEngine, getOrCreateChat } from 'react-chat-engine';

const DirectChatPage = (props) => { 
    const [username, setUsername] = useState('');

    function createDirectChat(creds) {
		getOrCreateChat(
			creds,
			{ is_direct_chat: true, usernames: [username] },
			() => setUsername('')
		)
	}

    function renderChatForm(creds) {
		return (
			<div>
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

    return renderChatForm

 }

export default DirectChatPage;