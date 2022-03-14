import React, { useState, useEffect } from 'react';
import ChatListItem from './ChatListItem';
import OpenIconWindow from './OpenIconWindow';
import OpenStatusWindow from './OpenStatusWindow';
import awayBuddyIcon from '../assets/images/noBuddyIcon.png';

const ChatList = (props) => {
  // TODO: BUDDY LIST, DISABLED GAME ICON, STYLING OF CHAT
  // Tabs for online chats or requests
  const [currentTab, setCurrentTab] = useState('');
  const [currentChat, setCurrentChat] = useState('');
  const myUserName = localStorage.getItem('username');

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
  const [chatList, setChatList] = useState(props.chats);
  const [viewingBuddyList, setViewingBuddyList] = useState(false);
  const [viewingOfflineList, setViewingOfflineList] = useState(false);

  // User onnline status (online, away, offline)
  const [currentUserAvailability, setCurrentUserAvailability] =
    useState('online');

  // User settings
  const [currentUser, setCurrentUser] = useState('');
  const [currentUserStatus, setCurrentUserStatus] = useState('');
  const [currentUserIcon, setCurrentUserIcon] = useState();
  const [userSettings, setUserSettings] = useState(false);
  const savedUserStatus = localStorage.getItem('status');
  const savedUserIcon = localStorage.getItem('icon');

  // Grab chat rooms on render
  let [onlineUsers, setOnlineUsers] = useState([]);
  let [offlineUsers, setOfflineUsers] = useState([]);

  // Grab all the chat rooms available to users
  useEffect(() => {
    setChatList(props.chats);
    const fetchCurrentMessages = () => {
      if (chatList !== null && chatList.length > 0) {
        props.fetchChannelMessages(chatList[props.activeChat].id);
      } else {
        return 'Fetching....';
      }
    };
    fetchCurrentMessages();
  }, [props.chats]);

  // Set online users list and offline users list

  // useEffect(() => {
  //   if (props.allUsers.length === 0) return <div />;
  //   const isOnlineList = props.allUsers
  //     .filter((user) => user['is_online'] && user.username !== myUserName)
  //     .map((user) => user.username);
  //   const isOfflineList = props.allUsers
  //     .filter((user) => !user['is_online'] && user.username !== myUserName)
  //     .map((user) => user.username);
  //   setOnlineUsers(isOnlineList);
  //   setOfflineUsers(isOfflineList);
  // }, [props.chats]);

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

  // Switch to selected chat channel
  const switchChatChannel = (channelId) => {
    setCurrentChat(channelId);
    props.setActiveChat(channelId);
    // props.fetchChannelMessages(channelId);
  };

  // Loop through chat engine to get users channels
  const getChannelsList = () => {
    const keys = Object.keys(chatList);
    return keys.map((key) => {
      const chat = chatList[key];
      // console.log(chat)
      // console.log(offlineUsers)
      const friendChannelName =
        chat.people[0].person.username == myUserName
          ? chat.people[1].person.username
          : chat.people[0].person.username;

      // console.log(friendChannelName)
      if (offlineUsers.includes(friendChannelName)) return '';

      return (
        <ChatListItem
          loading={props.loading}
          switchChannel={switchChatChannel}
          allUsers={props.allUsers}
          chat={chat}
        />
      );
    });
  };

  const viewBuddyListHandler = () => {
    setViewingBuddyList(!viewingBuddyList);
  };

  const viewOfflineListHandler = () => {
    setViewingOfflineList(!viewingOfflineList);
  };

  const createDirectChat = (friend) => {
    var myHeaders = new Headers();
    myHeaders.append('Project-ID', 'b8a0fde0-1fae-4db8-9870-6bba5beb67c0');
    myHeaders.append('User-Name', localStorage.getItem('username'));
    myHeaders.append('User-Secret', localStorage.getItem('password'));
    myHeaders.append('Content-Type', 'application/json');

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: JSON.stringify({ usernames: [friend] }),
      is_direct_chat: true,
    };

    fetch('https://api.chatengine.io/chats/', requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result));
    // .then((result) => setChatList(oldList => [...oldList, result]));
  };

  // Send a friend request
  const addFriendHandler = (e) => {
    e.preventDefault();
    createDirectChat(newFriend);
    setAddingNewFriend(false);
  };

  // Adjust sound volume
  const changeSoundHandler = () => {
    setSoundVolume((prev) => (prev + 1) % 3);
    props.changeVolume(soundVolumes[soundVolume + 1]);
  };

  // Open status window
  const setStatusHandler = () => {
    setOpenStatusWindow(!openStatusWindow);
  };

  // Set user status
  const setUserStatus = (status) => {
    // Update local browser to show status change
    setCurrentUserStatus(status);
    localStorage.setItem('status', status);
    const body = {
      custom_json: status,
    };

    // Update user settings to add status
    var myHeaders = new Headers();
    myHeaders.append('Project-ID', 'b8a0fde0-1fae-4db8-9870-6bba5beb67c0');
    myHeaders.append('User-Name', localStorage.getItem('username'));
    myHeaders.append('User-Secret', localStorage.getItem('password'));
    myHeaders.append('Content-Type', 'application/json');
    var requestOptions = {
      method: 'PATCH',
      headers: myHeaders,
      body: JSON.stringify(body),
      redirect: 'follow',
    };

    fetch(`https://api.chatengine.io/users/me/`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error));

    // Close status window when done
    setOpenStatusWindow(false);
  };

  // Open icon window
  const setIconHandler = () => {
    setOpenIconWindow(!openIconWindow);
  };


  // Set user avatar
  const setUserIcon = (url) => {
    localStorage.setItem('icon', url);
    const fileName = 'userAvatar.jpg';
    const user = props.allUsers.find((obj) => {
      return obj.username == localStorage.getItem('username');
    });
    
    const convertImage = async (url) => {
      const response = await fetch(url);
      const contentType = response.headers.get('content-type');
      const blob = await response.blob();
      const file = new File([blob], fileName, { contentType })

      return file
    }

    var myHeaders = new Headers();
    myHeaders.append('PRIVATE-KEY', 'e20c09ad-f36b-4f4a-b309-99ae04944996');
    myHeaders.append('Content-Type', 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW');

    var requestOptions = {
      method: 'PATCH',
      headers: myHeaders,
      body: {
        avatar: convertImage(),
      },
      redirect: 'follow',
    };

    fetch(`https://api.chatengine.io/users/${user.id}/`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error));

    setOpenIconWindow(false);
  };

  const logoutHandler = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    window.location.reload();
  };

  //Determine online and offline users
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (props.allUsers.length == 0) return <div />;
      if (props.allUsers.length > 0) {
        const user = props.allUsers.find((obj) => {
          setCurrentUserStatus(
            obj.username == localStorage.getItem('username')
          );
        });
        if (user && user['custom_json'] !== '{}') {
          setCurrentUserStatus(user['custom_json']);
        } else {
          if (savedUserStatus === '' || savedUserStatus === null) {
            setCurrentUserStatus('Set a status message');
          } else {
            setCurrentUserStatus(localStorage.getItem('status'));
          }
        }
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [props.allUsers, useState]);

  if (!props.chats) {
    return <div />;
  }

  return (
    <>
      <div className="chat-list-container">
        {/* User Container */}

        <div className="user">
          {/* Username */}
          <div className="user-details">
            <p className="user-name">
              {props.userName}{' '}
              <span className="user-availability">{`(${currentUserAvailability})`}</span>
            </p>

            {/* Status  */}
            <span onClick={setStatusHandler} className="user-status">
              {chatList !== null && currentUserStatus}
              <span className="status-change-word"> Change</span>
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
                savedUserIcon === '' || savedUserIcon === null
                  ? awayBuddyIcon
                  : savedUserIcon
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
          {/* Online users list */}
          <ul className="buddies-list-name">
            <span onClick={viewBuddyListHandler}>
              Buddies{' '}
              <span>
                {' '}
                ({onlineUsers.length}/
                {props.allUsers.length > 0 && props.allUsers.length - 1})
              </span>
            </span>
            <div className="buddy-list">
              {viewingBuddyList ? getChannelsList() : ''}
            </div>
          </ul>

          {/* Offline users list */}
          <ul
            className="offline-buddies-list-name"
            onClick={viewOfflineListHandler}
          >
            Offline
            <span>
              {' '}
              ({offlineUsers.length}/
              {props.allUsers.length > 0 && props.allUsers.length - 1})
            </span>
            {viewingOfflineList &&
              offlineUsers.map((user) => (
                <p className="offline-user-name">{user}</p>
              ))}
          </ul>
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
            <button onClick={changeSoundHandler}>
              Sound: {soundVolumes[soundVolume]}
            </button>
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
