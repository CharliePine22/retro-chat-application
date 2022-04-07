import { useState, useEffect } from "react";
import buddyIcon from "../assets/images/noBuddyIcon.png";

const UserGroupItem = (props) => {
  const [viewingGroupList, setViewingGroupList] = useState(false);
  const [currentChannel, setCurrentChannel] = useState(false);
  const [friendStatus, setFriendStatus] = useState("");

  // Grab current user to compare names
  const myUserName = localStorage.getItem("username");

  // Empty obj to store user info later
  const userObj = {};

  const firebaseUsers = props.firebaseUsersList;

  // Fetch groups and theirs users from db
  const users = Object.keys(props.data.users).map((key) => {
    return props.data.users[key];
  });

  // console.log(users)

  // Changes the chat channel/room to the selected friend
  const changeChannelHandler = (id) => {
    console.log(id);
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

  // Grab friends status
  useEffect(() => {
    const fbUsersData = Object.keys(userObj).map((key) => {
      // Grab the data that belongs to the buddy
      if (key in firebaseUsers) {
        setFriendStatus(firebaseUsers[key].status);
      }
    });
  }, [props.allUsers, firebaseUsers]);

  // Grab friends avatar
  const grabUserImage = () => {
    const fbUsersData = Object.keys(firebaseUsers).map((key) => {
      if (key in userObj) {
        if (firebaseUsers[key].avatar !== "") {
          return (
            <img
              key={key}
              className="buddy-avatar"
              src={firebaseUsers[key].avatar}
            />
          );
        } else {
          return <img key="0" className="buddy-avatar" src={buddyIcon} />;
        }
      }
    });

    return fbUsersData;
  };

  const renderUserInfo = () => {
    return users.map((user) => {
      // console.log(firebaseUsers[user.username])
      return <>
       <div className="group-list-item">
        <li
          className="group-channel-name"
          onClick={() => changeChannelHandler(userObj[user.username])}
        >
          <span><img className='buddy-avatar' src={firebaseUsers[user.username].avatar} /></span>
          <p className="user-online-name">{user.username}</p>
        </li>
        <span className="friend-status">
        <em>{firebaseUsers[user.username].status}</em>
      </span>
      </div>
      </>;
    })
  }

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
        </span>
      </div>
      <div className="group-list">
          {viewingGroupList
            ? renderUserInfo()
            : ""}
      </div>
    </>
  );
};

export default UserGroupItem;
