import { useState, useEffect, useRef } from 'react';
import MessageForm from './MessageForm';
import MyMessage from './MyMessage';
import TheirMessage from './TheirMessage';
import {getMessages} from 'react-chat-engine';

const ChatFeed = (props) => {
  const { chats, activeChat, userName, messages } = props;
  const [messageStyles, setMessageStyles] = useState('')
  const chat = chats && chats[activeChat];
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
    console.log(props.chatMessages)
  }, [props.chatMessages]);


  const formatStringToCamelCase = str => {
    const splitted = str.split("-");
    if (splitted.length === 1) return splitted[0];
    return (
      splitted[0] +
      splitted
        .slice(1)
        .map(word => word[0].toUpperCase() + word.slice(1))
        .join("")
    );
  };
  

  const grabMessageStyles = (message, split=false) => {
    let styles = [];
    
    const dom = (new DOMParser()).parseFromString(message, "text/html");
    dom.querySelectorAll('[style]').forEach((el) => {
      if(split) {
        styles = [...styles, ...el.getAttribute("style").split(';')];
      }
      else {
        styles.push(el.getAttribute("style"));
      }
    });
    if(styles.length > 0) { 
        setMessageStyles(formatStringToCamelCase(styles[0].slice(0, -1)))
    } else {
        setMessageStyles('')
    }
  }

  function renderMessages() {
    const keys = Object.keys(props.chatMessages);
    if (keys === []) {
      return <div><h1>NO MESSAGES</h1></div>;
    } 
    return keys.map((key, index) => {
      const message = props.chatMessages[key];
      const lastMessageKey = index === 0 ? null : keys[index - 1];
      const isMyMessage = userName === message.sender.username;
      return <>
        <div key={`msg_${index}`} style={{ width: '100%' }}>
          <div className="message-block" >
            {isMyMessage ? (
              <MyMessage message={message} messageStyles={messageStyles}/>
            ) : (
              <TheirMessage
                message={message}
                lastMessage={messages[lastMessageKey]}
              />
            )}
          </div>
        </div>
        <div ref={messagesEndRef} />
        </>;
    });
  };


  if (props.chatMessages === [] || props.loading) return 'Loading...'
  // const renderChannelMessages = () => {
  //   const keys = Object.keys(props.chatMessages)
  //   console.log(keys)
  //   return props.chatMessages.map((message) => {
  //     const isMyMessage = userName === message.sender.username;
  //     const messages = message.text
  //     return <> 
  //     <div key={`${message.id}`} style={{ width: '100%' }}>
  //         <div className="message-block" >
  //           {isMyMessage ? (
  //             <MyMessage message={message} messageStyles={messageStyles}/>
  //           ) : (
  //             <TheirMessage
  //               message={message}
  //               // lastMessage={messages[lastMessageKey]}
  //             />
  //           )}
  //         </div>
  //       </div>
  //       <div ref={messagesEndRef} />
  //     </>
  //   })
  // }

  if (!chat || !props.chatMessages) return 'Loading...';


  return <>
    <div className='buddy-name'>
          <h1>
            {chat.people[1].person.username == userName ? chat.people[0].person.username : chat.people[1].person.username}
          </h1>
    </div>
    <div className="chat-feed">
      <div className="chat-title-container">
        <div className="chat-title">{chat.title}</div>
        <div className="chat-subtitle">
          {chat.people.map((person) => ` ${person.person.username}`)}
        </div>
      </div>
      {!props.loading ? renderMessages() : 'Loading'}
      <div style={{ height: '100px' }} />
      <div className='message-form-wrapper'>
        <div className="message-form-container">
          <MessageForm {...props} grabMessageStyles={grabMessageStyles} chatId={activeChat} />
        </div>
      </div>
    </div>
    </>;
};

export default ChatFeed;
