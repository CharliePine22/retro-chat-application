import { useState, useEffect, useRef } from 'react';
import MessageForm from './MessageForm';
import MyMessage from './MyMessage';
import TheirMessage from './TheirMessage';
import sayHello from '../assets/images/say-hello.gif';
import NewUserWelcome from './NewUserWelcome';
import { ThreeCircles, InfinitySpin } from 'react-loader-spinner';

const ChatFeed = (props) => {
  // Grab all the props from the Chat Engine to produce messages
  const { chats, activeChat, userName, messages } = props;
  const [currentMessagesList, setCurrentMessagesList] = useState([]);
  const chat = chats && chats[activeChat];
  // Ref used for auto scrolling to bottom of chat
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Automatically scroll to bottom of chat to see new chats
  useEffect(() => {
      scrollToBottom();
  }, [currentMessagesList]);

  // Set messages to state to update accordingly
  useEffect(() => {
    const grabMessages = () => {
      setLoading(true);
      // If theres a chat object
      if(chat && chat.id) {
      var myHeaders = new Headers();
      myHeaders.append('Project-ID', 'b8a0fde0-1fae-4db8-9870-6bba5beb67c0');
      myHeaders.append('User-Name', localStorage.getItem('username'));
      myHeaders.append('User-Secret', localStorage.getItem('password'));
  
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };
      
      fetch(`https://api.chatengine.io/chats/${chat.id}/messages/`, requestOptions)
        .then((response) => response.json())
        .then((result) => setCurrentMessagesList(result))
        .catch((error) => console.log('error', error));
      setLoading(false);
    };
  }
    grabMessages()
  }, [chat]);


  // Render messages from chat app
  function renderMessages() {
    const keys = Object.keys(currentMessagesList);
    // If there are no available messages, show ice breaker
    if (keys.length === 0) {
      return (
        <div className="no-chat-messages">
          <img src={sayHello} />
          <h2>No messages here yet...</h2>
        </div>
      );
    }
    return keys.map((key, index) => {
      const message = currentMessagesList[key];
      const lastMessageKey = index === 0 ? null : keys[index - 1];
      const isMyMessage = userName === message.sender.username;
      return (
        <>
          <div key={`msg_${index}`} style={{ width: '100%' }}>
            <div className="message-block">
              {isMyMessage ? (
                <MyMessage message={message} />
              ) : (
                <TheirMessage
                  message={message}
                  lastMessage={messages[lastMessageKey]}
                />
              )}
            </div>
          </div>
        </>
      );
    });
  }

  const Navbar = () => {
    return (
      <nav className="nav">
        <ul className="nav__list">
          <li className="nav__item">File</li>
          <li className="nav__item">Edit</li>
          <li className="nav__item">Insert</li>
        </ul>
        <span className="nav__warning-level">
          {userName}'s Warning Level: 0%
        </span>
      </nav>
    );
  };

  if (props.activeChat == 0) {
    return <NewUserWelcome nav={Navbar}/>
  }

  if (localStorage.getItem('newUser') == 'false' && (!chat || !props.chatMessages || !chats))
    return <div className="loading-messages"> <ThreeCircles
    color="#00FFEE"
    height={200}
    width={250}
    ariaLabel="three-circles-rotating"
  />
  </div> 


  return (
    <>
      <div className="chat-feed-container">
        <div className="header">
          {chat && chat.people[1].person.username == userName
            ? chat.people[0].person.username
            : chat.people[1].person.username}{' '}
          <ul className="header__links">
            <li className="header__minimize">_</li>
            <li className="header__maximize">[ ]</li>
            <li className="header__close">&times;</li>
          </ul>
        </div>
        {Navbar()}
        <div className="chat-feed">
          {!loading ? <div>
            {renderMessages()}
            <div ref={messagesEndRef} />
            </div>
          : (
            <div className='loading-messages'>
              <ThreeCircles
                color="#00FFEE"
                height={200}
                width={250}
                ariaLabel="three-circles-rotating"
              />
            </div>
          )}
          <div style={{ height: '100px' }} />
          <div className="message-form-wrapper">
            <div className="message-form-container">
              <MessageForm
                {...props}
                chatId={activeChat}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatFeed;