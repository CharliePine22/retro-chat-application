import React, { useState, useEffect } from "react";
import ChatListItem from "./ChatListItem";
import OpenIconWindow from "./OpenIconWindow";
import OpenStatusWindow from "./OpenStatusWindow";
import awayBuddyIcon from "../assets/images/noBuddyIcon.png";
import { FaEye } from "react-icons/fa";
import { ThreeDots } from 'react-loader-spinner';

const ChatList = (props) => {
  // TODO: BUDDY LIST, DISABLED GAME ICON, STYLING OF CHAT
  // Tabs for online chats or requests
  const [currentTab, setCurrentTab] = useState("buddies");
  const [currentChat, setCurrentChat] = useState("");

  // Sound and volume settings
  const [soundVolume, setSoundVolume] = useState(0);
  const soundVolumes = ["Full", "Half", "Off"];

  // Opens new windows to adjust user settings for icon and status
  const [openStatusWindow, setOpenStatusWindow] = useState(false);
  const [openIconWindow, setOpenIconWindow] = useState(false);

  // Adding new friend state
  const [addingNewFriend, setAddingNewFriend] = useState(false);
  const [newFriend, setNewFriend] = useState("");

  // The list of chat rooms
  const [chatList, setChatList] = useState([]);
  const [viewingBuddyList, setViewingBuddyList] = useState(false);

  // User online status (online, away, offline)
  const [currentUserAvailability, setCurrentUserAvailability] =
    useState("online");

  // Username settings
  const myUserName = localStorage.getItem("username");
  const [newUserName, setNewUserName] = useState('');
  const [changingUserName, setChangingUserName] = useState(false);
  // Password settings
  const [userPassword, setUserPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [hideUserPassword, setHideUserPassword] = useState(true);

  const [currentUserStatus, setCurrentUserStatus] = useState("");
  const savedUserStatus = localStorage.getItem("status");
  const savedUserIcon = localStorage.getItem("icon");

  // Grab chat rooms on render
  let [onlineUsers, setOnlineUsers] = useState([]);

  // Grab all the chat rooms available to users
  useEffect(() => {
    setChatList(props.chats);
    const fetchCurrentMessages = () => {
      if (chatList !== null && props.chats && chatList.length > 0) {
        props.fetchChannelMessages(chatList[props.activeChat].id);
      } else {
        return "Fetching....";
      }
    };
    fetchCurrentMessages();
  }, [props.chats]);

  // Loop to listen for escape key press to exit out add friend
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        setAddingNewFriend(false);
        setChangingPassword(false);
      }
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  //////////////////////////////////// ! FUNCTIONS AND HANDLERS ! ///////////////////////////////
  // Switch to selected chat channel
  const switchChatChannel = (channelId) => {
    setCurrentChat(channelId);
    props.setActiveChat(channelId);
  };

  // Loop through chat engine to get users channels
  const getChannelsList = () => {
    const keys = Object.keys(chatList);
    return keys.map((key) => {
      const chat = chatList[key];
      const friendChannelName =
        chat && chat.people[0].person.username == myUserName
          ? chat.people[1].person.username
          : chat.people[0].person.username;

      return (
        chat &&
        chat.people && (
          <ChatListItem
            friendChannelName={friendChannelName}
            loading={props.loading}
            switchChannel={switchChatChannel}
            allUsers={props.allUsers}
            chat={chat}
          />
        )
      );
    });
  };

  const viewBuddyListHandler = () => {
    setViewingBuddyList(!viewingBuddyList);
  };

  const createDirectChat = (friend) => {
    var myHeaders = new Headers();
    myHeaders.append("Project-ID", "b8a0fde0-1fae-4db8-9870-6bba5beb67c0");
    myHeaders.append("User-Name", localStorage.getItem("username"));
    myHeaders.append("User-Secret", localStorage.getItem("password"));
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: JSON.stringify({ usernames: [friend] }),
      is_direct_chat: true,
    };

    fetch("https://api.chatengine.io/chats/", requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result));
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

  // Change user password
  const usernameChangeHandler = (e) => {
    e.preventDefault();

    var myHeaders = new Headers();
    myHeaders.append("Project-ID", "b8a0fde0-1fae-4db8-9870-6bba5beb67c0");
    myHeaders.append("User-Name", localStorage.getItem("username"));
    myHeaders.append("User-Secret", localStorage.getItem("password"));
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: JSON.stringify({'username' : props}),
    };

    fetch(`https://api.chatengine.io/users/me/`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));

    localStorage.setItem('password', userPassword)
    setChangingPassword(false);
  }

  // Change user password
  const passwordChangeHandler = (e) => {
    e.preventDefault();

    var myHeaders = new Headers();
    myHeaders.append("Project-ID", "b8a0fde0-1fae-4db8-9870-6bba5beb67c0");
    myHeaders.append("User-Name", localStorage.getItem("username"));
    myHeaders.append("User-Secret", localStorage.getItem("password"));
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: JSON.stringify({'secret' : userPassword}),
    };

    fetch(`https://api.chatengine.io/users/me/`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));

    localStorage.setItem('password', userPassword)
    setChangingPassword(false);
  }

  // Open status window
  const setStatusHandler = () => {
    setOpenStatusWindow(!openStatusWindow);
  };

  // Set user status
  const setUserStatus = (status) => {
    // Update local browser to show status change
    const body = {
      custom_json: status,
    };

    // Update user settings to add status
    var myHeaders = new Headers();
    myHeaders.append("Project-ID", "b8a0fde0-1fae-4db8-9870-6bba5beb67c0");
    myHeaders.append("User-Name", localStorage.getItem("username"));
    myHeaders.append("User-Secret", localStorage.getItem("password"));
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: JSON.stringify(body),
      redirect: "follow",
    };

    fetch(`https://api.chatengine.io/users/me/`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));

    setCurrentUserStatus(status);
    localStorage.setItem("status", status);

    // Close status window when done
    setOpenStatusWindow(false);
  };

  // Open icon window
  const setIconHandler = () => {
    setOpenIconWindow(!openIconWindow);
  };

  // Set user avatar
  const setUserIcon = (url) => {
    localStorage.setItem("icon", url);
    const fileName = "userAvatar.jpg";
    const user = props.allUsers.find((obj) => {
      return obj.username == localStorage.getItem("username");
    });

    // Convert url image to JS file
    const convertImage = async (url) => {
      const response = await fetch(url);
      const contentType = response.headers.get("content-type");
      const blob = await response.blob();
      const file = new File([blob], fileName, { contentType });

      return file;
    };

    const imageFile = convertImage(url)

    // Update user avatar with file
    var myHeaders = new Headers();
    myHeaders.append("Project-ID", "b8a0fde0-1fae-4db8-9870-6bba5beb67c0");
    myHeaders.append("User-Name", localStorage.getItem("username"));
    myHeaders.append("User-Secret", localStorage.getItem("password"));
    myHeaders.append(
      "Content-Type",
      "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"
    );

    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: {
        avatar: convertImage(url),
      },
      redirect: "follow",
    };

    fetch(`https://api.chatengine.io/users/me/`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));

    setOpenIconWindow(false);
  };

  const logoutHandler = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    window.location.reload();
  };

  //Determine user status
  useEffect(() => {

    // const intervalId = setInterval(() => {
      if (props.allUsers.length == 0) return <div />;
      if (props.allUsers.length > 0) {
        const user = props.allUsers.find((obj) => {
          return obj.username == localStorage.getItem("username");
        });
        if (user && user["custom_json"] !== "{}") {
          setCurrentUserStatus(user["custom_json"]);
          console.log('FETCHED')
        } else {
          if (savedUserStatus === "" || savedUserStatus === null) {
            setCurrentUserStatus("Set a status message");
          } else {
            setCurrentUserStatus(localStorage.getItem("status"));
            console.log('STORAGE')
          }
        }
      }
    // }, 5000);

    // return () => clearInterval(intervalId);
  }, [props.allUsers, useState]);

  if (!props.chats || props.allUsers.length == 0) {
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
              {props.userName}{" "}
              <span className="user-availability">{`(${currentUserAvailability})`}</span>
            </p>

            {/* Status  */}
            <span onClick={setStatusHandler} className="user-status">
              {chatList !== null && currentUserStatus !== '' ? currentUserStatus : <div className='dots-status-loader'><ThreeDots color='blue' height={50} width={50}/></div>}
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
                savedUserIcon === "" || savedUserIcon === null
                  ? awayBuddyIcon
                  : savedUserIcon
              }
            />
          </div>
        </div>

        {/* Chat Channels */}
        <div className="user-tabs">
          <button autoFocus onClick={() => setCurrentTab("buddies")}>
            Online
          </button>
          <button onClick={() => setCurrentTab("settings")}>Settings</button>
        </div>
        <div className="user-channels">
          {/* Users list */}
          {currentTab == "buddies" && (
            <ul className="buddies-list-name">
              <span onClick={viewBuddyListHandler}>
                Buddies{" "}
                <span>
                  {" "}
                  ({onlineUsers.length}/
                  {chatList &&
                    Object.keys(chatList).length > 0 &&
                    Object.keys(chatList).length}
                  )
                </span>
              </span>
              <div className="buddy-list">
                {viewingBuddyList && chatList ? getChannelsList() : ""}
              </div>
            </ul>
          )}
          {/* User Settings */}
          {currentTab == "settings" && (
            <>
              <div className="user-settings-header">
                <h3>User Settings</h3>
              </div>
              <div className="user-settings-actions">
                <div className="user-settings-username">
                  <p>ScreenName: {props.userName}</p>
                  <button>Change ScreenName</button>
                </div>
                <div className="user-settings-password">
                  {!changingPassword ? <p>
                    Password:{" "}
                    {hideUserPassword
                      ? props.creds.userSecret.replace(/./g, "*")
                      : props.creds.userSecret}{" "}
                    <FaEye
                      onClick={() => setHideUserPassword(!hideUserPassword)}
                      className="hide-password-icon"
                    />
                  </p> : <form onSubmit={passwordChangeHandler}> 
                  <input type='text' value={userPassword}  onChange={(e) => setUserPassword(e.target.value)} placeholder='New pasword'/>
                  </form>
                  }
                  <button onClick={() => setChangingPassword(true)}>{!changingPassword ? 'Change Password' : '' }</button>
                </div>
                <div className="user-settings-deleteBuddy">
                  <button>Delete Buddy</button>
                </div>
              </div>
            </>
          )}
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
