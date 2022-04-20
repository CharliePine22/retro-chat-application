import { useState, useEffect, useRef } from "react";
import MessageForm from "./MessageForm";
import MyMessage from "./MyMessage";
import TheirMessage from "./TheirMessage";
import sayHello from "../assets/images/say-hello.gif";
import fullScreen from "../assets/images/full-screen-icon.gif";
import NewUserWelcome from "./NewUserWelcome";
import { ThreeCircles, LineWave } from "react-loader-spinner";

const ChatFeed = (props) => {
  // Grab all the props from the Chat Engine to produce messages
  const { chats, activeChat, userName, messages } = props;
  const [currentMessagesList, setCurrentMessagesList] = useState([]);
  const [firebaseGroups, setFirebaseGroups] = useState("");
  const chat = chats && chats[activeChat];


  // Ref used for auto scrolling to bottom of chat
  const messagesEndRef = useRef(null);

  // Loading state
  const [loading, setLoading] = useState(false);

  // Grab buddy name to pass down to Message form component for Add Group use
  const buddyName = chat
    ? chat.people[1].person.username == userName
      ? chat.people[0].person.username
      : chat.people[1].person.username
    : "";

  // scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Automatically scroll to bottom of chat to see new chats
  useEffect(() => {
    scrollToBottom();
  }, [currentMessagesList, loading]);

  // Used for chat room transition effect
  useEffect(() => {
    // Set loading to false to finish chat room transition
    setLoading(false);
  }, [currentMessagesList]);

  // Set firebase list to fetched data when available
  useEffect(() => {
    // If firebase fetching isn't done yet return and wait
    if (props.firebaseUsersList.length == 0) {
      return <div />;
    } else {
      // Set groups to firebase fetched data to pass down to message form and group component
      setFirebaseGroups(
        props.firebaseUsersList && props.firebaseUsersList[userName].groups
      );
    }
  }, [props.firebaseUsersList]);

  const grabMessages = () => {
    setLoading(true);
    // If theres a chat object
    if (chat && chat.id) {
      var myHeaders = new Headers();
      myHeaders.append("Project-ID", "b8a0fde0-1fae-4db8-9870-6bba5beb67c0");
      myHeaders.append("User-Name", localStorage.getItem("username"));
      myHeaders.append("User-Secret", localStorage.getItem("password"));
      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(
        `https://api.chatengine.io/chats/${chat.id}/messages/`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => setCurrentMessagesList(result))
        .catch((error) => console.log("error", error));
    }
  };

  // Set messages to state to update accordingly
  useEffect(() => {
    grabMessages();
  }, [activeChat]);

  // Render messages from chat app
  function renderMessages() {
    const keys = Object.keys(currentMessagesList);
    // If there are no available messages, show ice breaker
    if (keys.length === 0) {
      return (
        <div className="no-chat-messages">
          <img src={sayHello} />
          <h2>No messages here yet, say Hello to get started!</h2>
        </div>
      );
    }
    return keys.map((key, index) => {
      const message = currentMessagesList[key];
      const lastMessageKey = index === 0 ? null : keys[index - 1];
      const isMyMessage = userName === message.sender.username;
      return (
        <>
          <div key={`msg_${index}`} style={{ width: "100%" }}>
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
          <li key={1} className="nav__item">File</li>
          <li key={2} className="nav__item">Edit</li>
          <li key={3} className="nav__item">Insert</li>
        </ul>
        <span className="nav__warning-level">
          {userName}'s Warning Level: 0%
        </span>
      </nav>
    );
  };

  // If the user has no chats available (usually for new users), show welcome screen
  if (props.activeChat == 0) {
    return <NewUserWelcome nav={Navbar} />;
  }

  // If the chats haven't finsihed loading yet, show loading screen
  if (
    !chat ||
    !props.chatMessages ||
    !chat.id ||
    !chats ||
    !props.firebaseUsersList
  )
    return (
      <div className="loading-app">
        {" "}
        <ThreeCircles
          color="navy"
          height={200}
          width={350}
          ariaLabel="three-circles-rotating"
        />
      </div>
    );

  return (
    <>
      <div className="chat-feed-container">
        <div className="header">
          {chat && chat.people[1].person.username == userName
            ? chat.people[0].person.username
            : chat.people[1].person.username}{" "}
          <ul className="header__links">
            <li key={4} className="header__minimize">_</li>
            <li key={5} className="header__maximize"><img src={fullScreen}/></li>
            <li key={6} className="header__close">&times;</li>
          </ul>
        </div>
        {Navbar()}
        <div className="chat-feed">
          {!loading ? (
            renderMessages()
          ) : (
            <div className="loading-messages">
              <LineWave
                color="navy"
                height="100%"
                width="100%"
                ariaLabel="infinity-symbol-spinning"
              />
            </div>
          )}
          <div ref={messagesEndRef} />

          <div style={{ height: "100px" }} />
          <div className="message-form-wrapper">
            <div className="message-form-container">
              <MessageForm
                {...props}
                key='message-form'
                chatId={activeChat}
                buddyName={buddyName}
                firebaseGroups={firebaseGroups}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatFeed;
