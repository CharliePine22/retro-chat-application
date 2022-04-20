import { useState, useEffect } from "react";
import buddyIcon from "../assets/images/noBuddyIcon.png";

const UserGroupItem = (props) => {
  const [viewingGroupList, setViewingGroupList] = useState(false);
  const [currentChannel, setCurrentChannel] = useState(false);
  const [onlineList, setOnlineList] = useState([]);

  // Grab current user to compare names
  const myUserName = localStorage.getItem("username");

  // Empty obj to store user info later
  const userObj = {};

  const firebaseUsers = props.firebaseUsersList;

  // Fetch groups and theirs users from db
  const users = Object.keys(props.data.users).map((key) => {
    return props.data.users[key];
  });

  useEffect(() => {
    users.map((user) => {
      // Loop through chat engine users and compare to group to find group users
      for (let i = 0; i < props.allUsers.length; i++) {
        if (user.username == props.allUsers[i].username) {
          // Determine if user is curerntly online and add count
          if (props.allUsers[i]["is_online"]) {
            setOnlineList((prev) => [...prev, props.allUsers[i].username]);
          }
        }
      }
    })
  }, [props.allUsers])


  // Changes the chat channel/room to the selected friend
  const changeChannelHandler = (id) => {
    setCurrentChannel(!currentChannel);
    props.switchChannel(id);
  };

  // Grab chat engine username to find corresponding id for chat channel use
  const chatEngineUsers = Object.keys(props.chat).map((key) => {
    // Grab the name of the user
    const friends =
      props.chat[key].people[0].person.username == myUserName
        ? props.chat[key].people[1].person.username
        : props.chat[key].people[0].person.username;

    // Grab the ids
    const friendId = props.chat[key].id;

    // Add friend name as key and their corresponding chat id as its value to obj
    userObj[friends] = friendId;
  });

  // Function helper for rendering user info
  const renderUserInfo = () => {
    return users.map((user) => {

      return (
        <>
          <div className="group-list-item">
            <li
              key={user}
              className="group-channel-name"
              onClick={() => changeChannelHandler(userObj[user.username])}
            >
              {/* Grab friends avatar */}
              <span>
                <img
                  className="buddy-avatar"
                  src={firebaseUsers[user.username].avatar !== '' ? firebaseUsers[user.username].avatar : buddyIcon}
                />
              </span>
              {user['is_online'] ? <p className="user-online-name">{user.username}</p> : <p className="user-offline-name">{user.username}</p>}
            </li>

            {/* Grab friends status */}
            {user['is_online'] ? <span className="friend-status-online">
              <em>{firebaseUsers[user.username].status}</em>
            </span> : <span className="friend-status-offline">
              <em>{firebaseUsers[user.username].status}</em>
            </span>}
          </div>
        </>
      );
    });
  };


  // List arrow styles
  const buddyListStyles = viewingGroupList
    ? "group-list-name-active"
    : "group-list-name";

  //////////////////////////////////////// ! RENDER HTML ! //////////////////////////////////////////////////////
  return (
    <>
      <div className={buddyListStyles}>
        <span
          className="buddies"
          onClick={(e) => setViewingGroupList(!viewingGroupList)}
        >
          {props.title}
          <span>
            {" "}
            ({onlineList.filter((v,i,a) => a.indexOf(v) == i).length}/{users.length})
          </span>
        </span>
      </div>
      <div className="group-list">
        {viewingGroupList ? renderUserInfo() : ""}
      </div>
    </>
  );
};

export default UserGroupItem;
