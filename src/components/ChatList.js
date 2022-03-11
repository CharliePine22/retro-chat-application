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
  // const [buddyLength, setBuddyLength] = useState(0);

  // User onnline status (online, away, offline)
  const [currentUserAvailability, setCurrentUserAvailability] =
    useState('online');

  // User settings
  const [currentUser, setCurrentUser] = useState('');
  const [currentUserStatus, setCurrentUserStatus] = useState('');
  const [currentUserIcon, setCurrentUserIcon] = useState();
  const [userSettings, setUserSettings] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const savedUserStatus = localStorage.getItem('status');
  const savedUserIcon = localStorage.getItem('icon');

  // Grab chat rooms on render
  useEffect(() => {
    setChatList(props.chats);
    const fetchCurrentMessages = () => {
      if(chatList !== null && chatList.length > 0) {
      props.fetchChannelMessages(chatList[props.activeChat].id);
      } else {
        return 'Fetching....'
      }
      
    }
    fetchCurrentMessages();
  }, [props.chats]);

  console.log(chatList)
  // console.log(props)
  // console.log(props.chats[props.chats.activeChat])
  // useEffect(() => {
  //   props.fetchChannelMessages(chatList[chatList.activeChat].id);
  // }, [chatList[chatList.activeChat]['last_message']])

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

  // Grab every user
  useEffect(() => {
    const getAllUsers = () => {
      var myHeaders = new Headers();
      myHeaders.append('PRIVATE-KEY', 'e20c09ad-f36b-4f4a-b309-99ae04944996');

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      fetch('https://api.chatengine.io/users/', requestOptions)
        .then((response) => response.json())
        .then((result) => setAllUsers(result))
        .catch((error) => console.log('error', error));
    };
    getAllUsers();
    return;
  }, []);

  // FUNCTIONS AND HANDLERS //
  const switchChatChannel = (channelId) => {
    setCurrentChat(channelId);
    props.setActiveChat(channelId);
    props.fetchChannelMessages(channelId);
  };

  const getChannelsList = () => {
    // Loop through chat engine to get users channels
    const keys = Object.keys(chatList);
    return keys.map((key) => {
      const chat = chatList[key];
      return (
        <ChatListItem
          loading={props.loading}
          switchChannel={switchChatChannel}
          allUsers={allUsers}
          chat={chatList[key]}
        />
      );
    });
  };

  const viewBuddyListHandler = () => {
    setViewingBuddyList(!viewingBuddyList);
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

  // Open icon window
  const setIconHandler = () => {
    setOpenIconWindow(!openIconWindow);
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

  // Set user avatar
  const setUserIcon = (url) => {
    localStorage.setItem('icon', url);

    const user = allUsers.find((obj) => {
      return obj.username == localStorage.getItem('username');
    });

    var myHeaders = new Headers();
    myHeaders.append('PRIVATE-KEY', 'e20c09ad-f36b-4f4a-b309-99ae04944996');
    myHeaders.append('Content-Type', 'application/json');

    var requestOptions = {
      method: 'PATCH',
      headers: myHeaders,
      body: JSON.stringify({
        avatar: currentUserIcon,
      }),
      redirect: 'follow',
    };

    fetch(`https://api.chatengine.io/users/${user.id}/`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error));

    setOpenIconWindow(false);
  };

  const logoutHandler = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    window.location.reload();
  };

  const determineBuddyOnlineStatus = () => {
    let buddyLength = 0;
    if (props.chats == undefined || props.chats == null) return buddyLength;
    if (props.chats) {
      buddyLength = Object.keys(chatList).length;
    }
    console.log(buddyLength);
  };

  useEffect(() => {
    if (allUsers.length == 0) return <div />;
    if (allUsers.length > 0) {
      const user = allUsers.find((obj) => {
        setCurrentUserStatus(obj.username == localStorage.getItem('username'));
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
  }, [allUsers]);

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
          <ul className="buddies-list-name">
            <span onClick={viewBuddyListHandler}>
              Buddies{' '}
              <span>
                {' '}
                (0/{chatList !== null && Object.keys(chatList).length})
              </span>
            </span>

            <div className="buddy-list">
              {viewingBuddyList ? getChannelsList() : ''}
            </div>
          </ul>
          <ul className="offline-buddies-list-name">
            Offline
            <span>
              {' '}
              (0/{chatList !== null && Object.keys(chatList).length})
            </span>
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
