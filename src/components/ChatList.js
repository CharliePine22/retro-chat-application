import React, { useState, useEffect } from 'react';
import ChatListItem from './ChatListItem';
import OpenIconWindow from './OpenIconWindow';
import OpenStatusWindow from './OpenStatusWindow';
import { getOrCreateChat } from 'react-chat-engine';

const ChatList = (props) => {
  // TODO: BUDDY LIST, DISABLED GAME ICON, STYLING OF CHAT
  console.log(props)
  // Tabs for online chats or requests
  const [currentTab, setCurrentTab] = useState('');
  const [currentChat, setCurrentChat] = useState('');

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
  const [viewingBuddyList, setViewingBuddyList] = useState(false);
  const [buddyLength, setBuddyLength] = useState(0);

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
    // const buddyAmount = Object.keys(chatList).length
    setBuddyLength(4)
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
  const switchChatChannel = (channelId) => {
    setCurrentChat(channelId)
    props.setActiveChat(channelId)
  }

  const getChannelsList = () => {
    // Loop through chat engine to get users channels
    const keys = Object.keys(chatList);
    return keys.map((key) => {
      const chat = chatList[key];
      return (
          <ChatListItem switchChannel={switchChatChannel} chat={chatList[key]} />
      );
    });
  };

  const viewBuddyListHandler = () => {
    setViewingBuddyList(!viewingBuddyList);
  }

  const createDirectChat = (friend) => {
    var myHeaders = new Headers();
    myHeaders.append('Project-ID', 'b8a0fde0-1fae-4db8-9870-6bba5beb67c0');
    myHeaders.append('User-Name', localStorage.getItem('username'));
    myHeaders.append('User-Secret', localStorage.getItem('password'));
    myHeaders.append('Content-Type', 'application/json');

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: JSON.stringify({usernames : [friend]}),
      is_direct_chat: true,
    };

    fetch('https://api.chatengine.io/chats/', requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      // .then((result) => setChatList(oldList => [...oldList, result]));
  }

  // Send a friend request
  const addFriendHandler = (e) => {
    e.preventDefault();
    createDirectChat(newFriend)
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
    return <div />;
}

  // const listIconStyles = currentChannel ? 'channel-list-active' : 'channel-list';

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
        <div className="user-channels">
          <ul className='buddies-list-name' onClick={viewBuddyListHandler}>Buddies<span> (0/{buddyLength})</span></ul>
          {viewingBuddyList ? getChannelsList() : ''}
        </div>

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
