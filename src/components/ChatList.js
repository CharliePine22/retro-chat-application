import React, { useState, useEffect } from 'react';
import ChatListItem from './ChatListItem';
import OpenIconWindow from './OpenIconWindow';
import OpenStatusWindow from './OpenStatusWindow';


const ChatList = (props) => {
  // TODO: BUDDY LIST, DISABLED GAME ICON, STYLING OF CHAT

  // Tabs for online chats or requests
  const [currentTab, setCurrentTab] = useState('');

  // Sound and volume settings
  const [soundVolume, setSoundVolume] = useState(0);
  const soundVolumes = ['Full', 'Half', 'Off'];
 
  // Opens new windows to adjust user settings for icon and status
  const [openStatusWindow, setOpenStatusWindow] = useState(false);
  const [openIconWindow, setOpenIconWindow] = useState(false);

  // Adding new friend state
  const [addingNewFriend, setAddingNewFriend] = useState(false);
  const [newFriend, setNewFriend] = useState('');

  // The list of chat rooms
  const [chatList, setChatList] = useState([]);

  // User onnline status (online, away, offline)
  const [currentUserAvailability, setCurrentUserAvailability] =
    useState('online');

  // User settings
  const [currentUserStatus, setCurrentUserStatus] = useState('');
  const savedUserStatus = localStorage.getItem('status');
  const savedUserIcon = localStorage.getItem('icon');

  // Grab chat rooms on render
  useEffect(() => {
    setChatList(props.chats);
  }, [props.chats]);

  // Loop to listen for escape key press to exit out add friend
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        setAddingNewFriend(false);
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);


  // FUNCTIONS AND HANDLERS //
  const getChannelsList = () => {
    // Loop through chat engine to get users channels
    const keys = Object.keys(chatList);
    return keys.map((key) => {
      const chat = chatList[key];
      return (
        <div>
          <ChatListItem chat={chatList[key]} />
        </div>
      );
    });
  };

  // Send a friend request
  const addFriendHandler = (e) => {
    e.preventDefault();
    console.log(newFriend);
    setAddingNewFriend(false);
  };

  // Adjust sound volume
  const changeSoundHandler = () => {
    setSoundVolume(prev => (prev + 1) % 3);
    props.changeVolume(soundVolumes[soundVolume + 1]);
  };

  const setStatusHandler = () => {
    setOpenStatusWindow(!openStatusWindow);
  };

  const setIconHandler = () => {
    setOpenIconWindow(!openIconWindow);
  };

  const setUserStatus = (status) => {
    setCurrentUserStatus(status);
    localStorage.setItem('status', status);
    setOpenStatusWindow(false);
  };

  const setUserIcon = (url) => {
    localStorage.setItem('icon', url);
    setOpenIconWindow(false);
  };

  const logoutHandler = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    window.location.reload();
  };

  if (!chatList) {
    return 'Loading...';
  }

  return (
    <>
      <div className="chat-list-container">
        {/* User Container */}
        <div className="user">
          {/* Stats */}
          <div className="user-details">
            <p className="user-name">
              {props.userName}{' '}
              <span className="user-availability">{`(${currentUserAvailability})`}</span>
            </p>
            <span onClick={setStatusHandler} className="user-status">
              {savedUserStatus === '' || savedUserStatus === undefined
                ? 'Set a status message'
                : localStorage.getItem('status')}{' '}
              <span className="status-change-word">Change</span>
            </span>
          </div>

          {/* Icon change window */}
          <div>
            {openIconWindow && <OpenIconWindow changeIcon={setUserIcon} />}
          </div>

          {/* Status change window */}
          <div>
            {openStatusWindow && (
              <OpenStatusWindow changeStatus={setUserStatus} />
            )}
          </div>
        

          {/* Icon */}
          <div className="user-icon" onClick={setIconHandler}>
            <img
              src={
                savedUserIcon === '' ? '/images/noBuddyIcon.png' : savedUserIcon
              }
            />
          </div>
        </div>

        {/* Chat Channels */}
        <div className="user-tabs">
          <button autoFocus>Online</button>
          <button>Requests</button>
        </div>
        <div className="user-channels">{getChannelsList()}</div>

        {/* User Options */}
        <div className="user-actions">
          {!addingNewFriend && (
            <button onClick={(e) => setAddingNewFriend(true)}>
              Add a Buddy
            </button>
          )}
          {addingNewFriend && (
            <form onSubmit={addFriendHandler} className="new-friend-form">
              <input
                value={newFriend}
                onChange={(e) => setNewFriend(e.target.value)}
                type="text"
                placeholder="Add a Buddy"
              />
            </form>
          )}
          {!addingNewFriend && (
            <button onClick={changeSoundHandler}>Sound: {soundVolumes[soundVolume]}</button>
          )}
          {!addingNewFriend && (
            <button onClick={logoutHandler}>Sign Out</button>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatList;
