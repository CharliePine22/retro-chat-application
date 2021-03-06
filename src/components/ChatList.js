import React, { useState, useEffect } from "react";
import ChatListItem from "./ChatListItem";
import OpenIconWindow from "./OpenIconWindow";
import OpenStatusWindow from "./OpenStatusWindow";
import awayBuddyIcon from "../assets/images/noBuddyIcon.png";
import { FaEye } from "react-icons/fa";
import { ThreeDots, BallTriangle } from "react-loader-spinner";
import UserGroupItem from "./UserGroupItem";

const ChatList = (props) => {
  ////////////////////////////////////// ! State Settings ! ////////////////////////////////////
  // Tabs for online chats or requests
  const [currentTab, setCurrentTab] = useState("buddies");
  const [currentChat, setCurrentChat] = useState(0);

  // Sound and volume settings
  const [soundVolume, setSoundVolume] = useState(0);
  const soundVolumes = ["Full", "Half", "Off"];

  // Opens new windows to adjust user settings for icon and status
  const [openStatusWindow, setOpenStatusWindow] = useState(false);
  const [openIconWindow, setOpenIconWindow] = useState(false);

  // Adding new friend state
  const [addingNewFriend, setAddingNewFriend] = useState(false);
  const [newFriend, setNewFriend] = useState("");

  // The list of chat rooms, handler to view, and current length of friends list
  const [chatList, setChatList] = useState([]);
  const [viewingBuddyList, setViewingBuddyList] = useState(false);
  const [currentBuddyLength, setCurrentBuddyLength] = useState(0);

  // Error and Loading States
  const [error, setError] = useState("");
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Username settings
  const myUserName = localStorage.getItem("username");
  const [newUserName, setNewUserName] = useState("");
  const [changingUserName, setChangingUserName] = useState(false);

  // Password settings
  const [userPassword, setUserPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [hideUserPassword, setHideUserPassword] = useState(true);

  // Opens and closes the deleting buddy form
  const [deletingBuddy, setDeletingBuddy] = useState(false);
  const [deleteBuddyName, setDeleteBuddyName] = useState("");

  // User status and icon settings
  const [currentUserStatus, setCurrentUserStatus] = useState("");
  const [currentUserAvatar, setCurrentUserAvatar] = useState("");
  const [currentUserGroups, setCurrentUserGroups] = useState([]);

  // Grab chat rooms on render
  let [onlineUsers, setOnlineUsers] = useState([]);
  let [offlineUsers, setOfflineUsers] = useState([]);

  //////////////////////////////////// ! USE EFFECTS ! //////////////////////////////////////
  const fetchCurrentMessages = () => {
    // If data is fetched and available display it
    if (chatList !== null && props.chats && chatList.length > 0) {
      props.fetchChannelMessages(chatList[props.activeChat].id);
    } else {
      return "Fetching....";
    }
  };

  // Grab all the chat rooms available to users
  useEffect(() => {
    if (props.chats) {
      setChatList(props.chats);
    } else {
      console.log("Loading...");
    }
    // Populate chat feed with current chatRoom messages
    fetchCurrentMessages();

    // If firebase fetching isn't done yet return and wait
    if (props.firebaseUsersList.length == 0) {
      return <div />;
    } else {
      // If it is done, set the current users avatar to their saved avatar and status
      setCurrentUserAvatar(props.firebaseUsersList[myUserName].avatar);
      setCurrentUserStatus(props.firebaseUsersList[myUserName].status);
      setCurrentUserGroups(props.firebaseUsersList[myUserName].groups);
    }
  }, [props.chats, props.firebaseUsersList]);

  // Loop to listen for escape key press
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        // Close add new friend, remove error, and reset field
        setAddingNewFriend(false);
        setNewFriend("");
        setHasError(false);

        // Cancel username/password change
        setChangingPassword(false);
        setChangingUserName(false);

        // Cancel delete buddy form
        setDeletingBuddy(false);
      }
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  // Determine length of buddy list
  useEffect(() => {
    grabBuddyListLength() 
  }, [currentUserGroups, chatList]);


  //Determine user online/availability status
  useEffect(() => {
    // If theres no users or it hasn't finished fetching yet
    if (props.allUsers.length == 0 || chatList == null) return <div />;

    // Grab all the users that are online
    const currentUsers = props.allUsers.filter((obj) => {
      // Don't include current user in count
      if (obj.username == myUserName) return ""; 
      // Dont include group users in count
      else if(determineInGroup(obj.username)) return "";
      // Set online users list
      else {
          // RETURNS ALL USERS ONLINE
          return obj["is_online"];
      }
    });

    const offlineUsers = props.allUsers.filter((obj) => {
      // Don't include current user in count
      if (obj.username == myUserName) return ""; 
      // Dont include group users in count
      else if(determineInGroup(obj.username)) return "";
      // Set online users list
      else {
          // RETURNS ALL USERS ONLINE
          return !obj["is_online"];
      }
    });

    setOnlineUsers(currentUsers);
    setOfflineUsers(offlineUsers)

  }, [props.allUsers, chatList, useState]);

  //////////////////////////////////// ! FUNCTIONS AND HANDLERS ! ///////////////////////////////
  // Switch to selected chat channel
  const switchChatChannel = (channelId) => {
    props.setActiveChat(channelId);
    setCurrentChat(channelId);
  };

  const grabBuddyListLength = () => {
    const currentLength = [];
    // If any of the keys have falsey values, remove them
    // Happens after a user deletes a buddy
    Object.keys(chatList).forEach(key => {
      if (!chatList[key]) delete chatList[key];
    });
    
    
    // If the user has any groups determine buddy list length
    if (currentUserGroups) {
      for (let group in Object.values(currentUserGroups)) {
        const keys = Object.values(currentUserGroups)[group].users;
        for (let user of Object.values(keys)) {
          currentLength.push(user.username);
        }
      }
      setCurrentBuddyLength(
        Object.keys(chatList).length - currentLength.length
      );
    } 
    // If the user has no groups, set length equal to chat list
    else {
      setCurrentBuddyLength(Object.keys(chatList).length)
    }
  }


  // Loop through chat engine to get users channels
  const getChannelsList = () => {
    const keys = Object.keys(chatList);
    return keys.map((key) => {
      const chat = chatList[key];
      if(chat == null){
        return <div/>
      }
      if (chat.people.length < 2) return <div />; // Prevents chats that didnt properly delete with users from showing
      
      const friendChannelName =
        chatList && chat && chat.people[0].person.username == myUserName
          ? chat.people[1].person.username
          : chat.people[0].person.username;

      // Check to see if user is in a group
      const inGroup = determineInGroup(friendChannelName);

      // If the user is not in a group, render them
      if (!inGroup) {
        return (
          chat &&
          chat.people && (
            <ChatListItem
              key={friendChannelName}
              friendChannelName={friendChannelName}
              loading={props.loading}
              changeLoadingTrue={props.changeLoadingTrue}
              switchChannel={switchChatChannel}
              allUsers={props.allUsers}
              firebaseUsersList={props.firebaseUsersList}
              chat={chat}
             
            />
          )
        );
      }
    });
  };

  // Determine if user is in a group, return false if user is not
  const determineInGroup = (buddy) => {
    // Set empty array to hold group users
    const usersInGroups = [];

    // Loop through groups and push each username to the array
    for (let group in currentUserGroups) {
      const users = currentUserGroups[group].users;
      for (let user of Object.values(users)) {
        usersInGroups.push(user.username);
      }
    }

    // If the array has the buddy name in it, they're in a group
    if (usersInGroups.includes(buddy)) {
      return true;
    }

    return false;
  };

  // Open and close your buddy list
  const viewBuddyListHandler = () => {
    // bool set to toggle off/on
    setViewingBuddyList(!viewingBuddyList);
  };

  // Creates new chat object with friend
  const createDirectChat = (friend) => {
    // Loop through channels to grab all friends' usernames
    const keys = Object.keys(chatList);
    const currentFriends = keys.map((key) => {
      const chat = chatList[key];
      if(chat == null) return <div/>
      const friendUserNames =
        chat.people[0].person.username == myUserName
          ? chat.people[1].person.username
          : chat.people[0].person.username;
      return friendUserNames;
    });


    // If the requested username is already in users friends list throw error
    if (currentFriends.includes(friend)) {
      setHasError(true);
      setError(`${friend} is already in your buddies list!`);
    }

    // API Creds
    var myHeaders = new Headers();
    myHeaders.append("Project-ID", process.env.REACT_APP_PROJECT_ID);
    myHeaders.append("User-Name", localStorage.getItem("username"));
    myHeaders.append("User-Secret", localStorage.getItem("password"));
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: JSON.stringify({ usernames: [friend] }),
      is_direct_chat: true, // ensures that its a direct message chat object
    };

    fetch("https://api.chatengine.io/chats/", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // If the user requested does not exist
        if (result.message == "At least one username is not a user") {
          setError(
            "That username does not exist, please check your spelling and try again."
          );
          setHasError(true);
        } if (!hasError) {
          // If theres no error, close the add buddy input form
          setAddingNewFriend(false);
          setNewFriend("");
          setLoading(false);
        } else {
        // If there is still an error or issue, keep the form open
        setAddingNewFriend(true);
        setLoading(false);
        }
      });
  };


  // Send a friend request
  const addFriendHandler = (e) => {
    setLoading(true);
    e.preventDefault();
    createDirectChat(newFriend);
  };

  // Adjust sound volume
  const changeSoundHandler = () => {
    setSoundVolume((prev) => (prev + 1) % 3);
    props.changeVolume(soundVolumes[soundVolume + 1]);
  };

  // Change user password
  const userNameChangeHandler = (e) => {
    e.preventDefault();

    var myHeaders = new Headers();
    myHeaders.append("Project-ID", process.env.REACT_APP_PROJECT_ID);
    myHeaders.append("User-Name", localStorage.getItem("username"));
    myHeaders.append("User-Secret", localStorage.getItem("password"));
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: JSON.stringify({ username: newUserName }),
    };

    fetch(`https://api.chatengine.io/users/me/`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));

    localStorage.setItem("username", newUserName);
    window.location.reload();
  };

  // Change user password
  const passwordChangeHandler = (e) => {
    e.preventDefault();

    var myHeaders = new Headers();
    myHeaders.append("Project-ID", process.env.REACT_APP_PROJECT_ID);
    myHeaders.append("User-Name", localStorage.getItem("username"));
    myHeaders.append("User-Secret", localStorage.getItem("password"));
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: JSON.stringify({
        secret: userPassword,
      }),
    };

    fetch(`https://api.chatengine.io/users/me/`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));

    localStorage.setItem("password", userPassword);
    window.location.reload();
  };

  // Open status window
  const setStatusHandler = () => {
    setOpenStatusWindow(!openStatusWindow);
  };

  // Set user status
  const setUserStatus = async (status) => {
    // Update local browser to show status change
    let url = `https://retro-chat-app22-default-rtdb.firebaseio.com/users/${myUserName}.json`;
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS, PUT",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-Requested-With",
      },
      body: JSON.stringify({ status: status }),
    });
    const result = await response.json();
    setCurrentUserStatus(status);

    // Close status window when done
    setOpenStatusWindow(false);
  };

  // Open icon window
  const setIconHandler = () => {
    setOpenIconWindow(!openIconWindow);
  };

  // Set user avatar
  const setUserIcon = async (imageUrl) => {
    // If the url isnt an image format, return error message
    if (imageUrl.match(/\.(jpeg|jpg|gif|png)$/) == null) {
      setError("Invalid format, image must be a JPG, GIF, or PNG!");
      return;
    }

    // Update user avatar with file
    let url = `https://retro-chat-app22-default-rtdb.firebaseio.com/users/${myUserName}.json`;
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS, PUT",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-Requested-With",
      },
      body: JSON.stringify({ avatar: imageUrl }),
    });
    const result = await response.json();
    setCurrentUserAvatar(imageUrl);

    setOpenIconWindow(false);
    setError("");
  };

  // Removes user info from local storage, refreshes and logs them out
  // Returns them to the Welcome Screen
  const logoutHandler = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    window.location.reload();
  };

  // If chat rooms or userdata hasn't loaded yet, return and wait for load to complete
  if (!props.chats || props.allUsers.length == 0) {
    return <div />;
  }

  // If the buddy length hasn't populated yet, keep loading
  if(currentBuddyLength < 0) {
    return 'Loading...'
  }

  // List arrow that changes based on the buddy list being viewed
  const buddyListStyles = viewingBuddyList
    ? "buddies-list-name-active"
    : "buddies-list-name";

  // Tab button style settings
  const onlineTabStyles =
    currentTab == "buddies" ? "active-tab" : "inactive-tab";
  const requestsTabStyles =
    currentTab == "requests" ? "requests-active-tab" : "inactive-tab";
  const settingsTabStyles =
    currentTab == "settings" ? "active-tab" : "inactive-tab";

  //////////////////////////////////////// ! RENDER HTML ! //////////////////////////////////////////////////////
  return (
    <>
      <div className="chat-list-container">
        {/* User Container */}
        <div className="user">
          {/* Username */}
          <div className="user-details">
            <p className="user-name">{props.userName}</p>

            {/* Status  */}
            <span onClick={setStatusHandler} className="user-status">
              {chatList !== null && currentUserStatus !== "" ? (
                currentUserStatus
              ) : (
                <div className="dots-status-loader">
                  <ThreeDots color="blue" height={50} width={50} />
                </div>
              )}
              <span className="status-change-word"> Change</span>
            </span>
          </div>

          {/* Icon change window */}
          <div>
            {openIconWindow && (
              <OpenIconWindow changeIcon={setUserIcon} error={error} />
            )}
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
              src={currentUserAvatar !== "" ? currentUserAvatar : awayBuddyIcon}
            />
          </div>
        </div>

        {/* Online and Settings Tabs */}
        <ul className="user-tabs">
          <li className="buddies-tab">
            <button
              className={onlineTabStyles}
              onClick={() => setCurrentTab("buddies")}
            >
              Online
            </button>
          </li>
          {/* Friend Requests Tab */}

          {/* <li className="requests-tab">
            <button
              className={requestsTabStyles}
              onClick={() => setCurrentTab("requests")}
            >
              Requests <span className='friend-requests-count'>1</span> 
            </button>
          </li> */}
          <li className="settings-tab">
            <button
              className={settingsTabStyles}
              onClick={() => setCurrentTab("settings")}
            >
              Settings
            </button>
          </li>
        </ul>

        {/* Users Channels */}
        <div className="user-channels-outer">
          <div className="user-channels">
            {currentTab == "buddies" && (
              <ul className={buddyListStyles}>
                <span className="buddies" onClick={viewBuddyListHandler}>
                  Buddies{" "}
                  <span>
                    {" "}
                    ({onlineUsers.length}/{chatList && currentBuddyLength})
                  </span>
                </span>
                {/* Buddies List */}
                <div className="buddy-list">
                  {viewingBuddyList && chatList ? getChannelsList() : ""}
                </div>
                {/* Users custom groups list */}
                <div className="groups">
                  {currentUserGroups
                    ? Object.keys(currentUserGroups).map((key) => {
                        return (
                          <UserGroupItem
                            key={key}
                            title={key}
                            data={currentUserGroups[key]}
                            chat={chatList}
                            switchChannel={switchChatChannel}
                            firebaseUsersList={props.firebaseUsersList}
                            allUsers={props.allUsers}
                          />
                        );
                      })
                    : ""}
                </div>
                <div className='offline-users-list'>
                  {
                    // offlineUsers.map((key) => {
                    //   return (
                    //     <span>{key.username}</span>
                    //   )
                    // })
                  }
                </div>
              </ul>
            )}

             {/* Request tab settings */}
             {currentTab == 'requests' && (
              <>
              <div style={{textAlign: "center", marginTop: "10px"}}>
                <p>Coming soon...</p>
              </div>
              </>
            )}

            {/************************  User Settings ********************/}
            {currentTab == "settings" && (
              <>
                <div className="user-settings-header">
                  <h3>User Settings</h3>
                </div>
                <div className="user-settings-actions">
                  {/* Username Settings */}
                  <div className="user-settings-username">
                    {!changingUserName ? (
                      <p>ScreenName: {props.userName}</p>
                    ) : (
                      <form onSubmit={userNameChangeHandler}>
                        <input
                          type="text"
                          value={newUserName}
                          onChange={(e) => setNewUserName(e.target.value)}
                          placeholder="New username"
                        />
                      </form>
                    )}
                    <button onClick={() => setChangingUserName(true)}>
                      Change ScreenName
                    </button>
                  </div>

                  {/* Password settings */}
                  <div className="user-settings-password">
                    {!changingPassword ? (
                      <p>
                        Password:{" "}
                        {hideUserPassword
                          ? props.creds.userSecret.replace(/./g, "*")
                          : props.creds.userSecret}{" "}
                        <FaEye
                          onClick={() => setHideUserPassword(!hideUserPassword)}
                          className="hide-password-icon"
                        />
                      </p>
                    ) : (
                      <form onSubmit={passwordChangeHandler}>
                        <input
                          type="text"
                          value={userPassword}
                          onChange={(e) => setUserPassword(e.target.value)}
                          placeholder="New password"
                        />
                      </form>
                    )}
                    <button onClick={() => setChangingPassword(true)}>
                      {!changingPassword ? "Change Password" : ""}
                    </button>
                  </div>
                </div>
              </>
            )}
           
          </div>
        </div>

        {/* User Options */}
        <div className="user-actions">
          {!addingNewFriend && (
            <button onClick={(e) => setAddingNewFriend(true)}>
              Add a Buddy
            </button>
          )}
          {addingNewFriend && !loading && (
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
          {loading && (
            <div>
              <BallTriangle height="70" color="blue" />
            </div>
          )}
          {addingNewFriend && hasError && !loading && (
            <span className="error">{error}</span>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatList;
