import { useState, useEffect } from 'react';
import ChatListItem from './ChatListItem';
import OpenIconWindow from './OpenIconWindow';
import OpenStatusWindow from './OpenStatusWindow';
import { getOrCreateChat } from 'react-chat-engine';

const DirectChatPage = (props, creds) => {
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

  // Send a friend request
  const addFriendHandler = (e) => {
    e.preventDefault();
    addNewChat(newFriend);
    setAddingNewFriend(false);
  };

  // Adjust sound volume
  const changeSoundHandler = () => {
    setSoundVolume((prev) => (prev + 1) % 3);
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

  //   Grab chat rooms on render
  //   useEffect(() => {
  //     setChatList(props.chats);
  //   }, [props.chats]);

  useEffect(() => {
    const getChats = () => {
      var myHeaders = new Headers();
      myHeaders.append('Project-ID', 'b8a0fde0-1fae-4db8-9870-6bba5beb67c0');
      myHeaders.append('User-Name', localStorage.getItem('username'));
      myHeaders.append('User-Secret', localStorage.getItem('password'));
      myHeaders.append('Content-Type', 'application/json');

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      fetch('https://api.chatengine.io/chats/', requestOptions)
        .then((response) => response.json())
        .then((result) => console.log(result))
        .then((result) => setChatList(result));
      //   .catch(error => console.log('error', error));
    };
    getChats();
	console.log('RENDER')
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

  const addNewChat = (buddyName) => {
    var myHeaders = new Headers();
    myHeaders.append('Project-ID', 'b8a0fde0-1fae-4db8-9870-6bba5beb67c0');
    myHeaders.append('User-Name', localStorage.getItem('username'));
    myHeaders.append('User-Secret', localStorage.getItem('password'));
    myHeaders.append('Content-Type', 'application/json');

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: JSON.stringify({
        usernames: [buddyName],
        is_direct_chat: true,
      }),
    };

    fetch('https://api.chatengine.io/chats/', requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error));
  };

  // function createDirectChat(creds) {
  //   getOrCreateChat(
  //     creds,
  //     { is_direct_chat: true, usernames: [newFriend] },
  //     () => setNewFriend('')
  //   );
  // }

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
        <div className="user-channels">{chatList}</div>

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

export default DirectChatPage;
