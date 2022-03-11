import { useState, useEffect, useRef } from 'react';
import MessageForm from './MessageForm';
import MyMessage from './MyMessage';
import TheirMessage from './TheirMessage';
import sayHello from '../assets/images/say-hello.gif';
import { ThreeCircles } from 'react-loader-spinner';

const ChatFeed = (props) => {
  const { chats, activeChat, userName, messages } = props;
  const [messageStyles, setMessageStyles] = useState('');
  const [currentMessagesList, setCurrentMessagesList] = useState([]);
  const chat = chats && chats[activeChat];
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Automatically scroll to bottom of chat to see new chats
  useEffect(() => {
    scrollToBottom();
  }, [props.chatMessages]);

  // Set messgaes to state to update accordingly
  useEffect(() => {
    setCurrentMessagesList(props.chatMessages);
  }, [props.chatMessages.length]);

  console.log(props.chatMessages)

  const formatStringToCamelCase = (str) => {
    const splitted = str.split('-');
    if (splitted.length === 1) return splitted[0];
    return (
      splitted[0] +
      splitted
        .slice(1)
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join('')
    );
  };

  // Try to add styles to the messages from chat engine parser
  const grabMessageStyles = (message, split = false) => {
    let styles = [];

    const dom = new DOMParser().parseFromString(message, 'text/html');
    dom.querySelectorAll('[style]').forEach((el) => {
      if (split) {
        styles = [...styles, ...el.getAttribute('style').split(';')];
      } else {
        styles.push(el.getAttribute('style'));
      }
    });
    if (styles.length > 0) {
      setMessageStyles(formatStringToCamelCase(styles[0].slice(0, -1)));
    } else {
      setMessageStyles('');
    }
  };

  // Render messages from chat app
  function renderMessages() {
    const keys = Object.keys(currentMessagesList);
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
                <MyMessage message={message} messageStyles={messageStyles} />
              ) : (
                <TheirMessage
                  message={message}
                  lastMessage={messages[lastMessageKey]}
                />
              )}
            </div>
          </div>
          <div ref={messagesEndRef} />
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

  if (props.chatMessages === [] || props.loading) return 'Loading...';

  if (!chat || !props.chatMessages)
    return <div className="loading-messages"><ThreeCircles
    color="blue"
    height={200}
    width={200}
    ariaLabel="three-circles-rotating"
  /></div>;

  return (
    <>
      <div className="chat-feed-container">
        <div className="header">
          {chat.people[1].person.username == userName
            ? chat.people[0].person.username
            : chat.people[1].person.username}{' '}
          - Instant Message
          <ul className="header__links">
            <li className="header__minimize">_</li>
            <li className="header__maximize">[ ]</li>
            <li className="header__close">&times;</li>
          </ul>
        </div>
        {Navbar()}
        <div className="chat-feed">
          {!loading ? (
            renderMessages()
          ) : (
            <div className='loading-messages'>
              <ThreeCircles
                color="blue"
                height={200}
                width={200}
                ariaLabel="three-circles-rotating"
              />
            </div>
          )}
          <div style={{ height: '100px' }} />
          <div className="message-form-wrapper">
            <div className="message-form-container">
              <MessageForm
                {...props}
                grabMessageStyles={grabMessageStyles}
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
