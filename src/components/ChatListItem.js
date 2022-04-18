import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import buddyIcon from "../assets/images/noBuddyIcon.png";

const ChatListItem = (props) => {
  const [currentChannel, setCurrentChannel] = useState(false);
  const [friendStatus, setFriendStatus] = useState("");
  const myUserName = localStorage.getItem("username");
  const friendChannelName = props.friendChannelName;
  const firebaseUsers = props.firebaseUsersList;

  // Grab the friend name to match the channel name
  const user = props.allUsers.find((obj) => {
    return obj.username == friendChannelName;
  });

  // Changes the chat channel/room to the selected friend
  const changeChannelHandler = () => {
    setCurrentChannel(!currentChannel);
    props.switchChannel(props.chat.id);
  };

  // Grab friends status
  useEffect(() => {
    const fbUsers = Object.keys(firebaseUsers);
    const fbUsersData = Object.keys(firebaseUsers).map(key => {
      if (key == friendChannelName) {
        setFriendStatus(firebaseUsers[key].status)
      }
    })
    
    // const user = props.allUsers.find((obj) => {
    //   return obj.username == friendChannelName;
    // });
    // if (user["custom_json"] === "{}") {
    //   setFriendStatus("No user status");
    // } else {
    //   setFriendStatus(user["custom_json"]);
    // }
  }, [props.allUsers, firebaseUsers]);

  // Grab friends avatar
  const grabUserImage = () => {
    const fbUsersData = Object.keys(firebaseUsers).map(key => {
      if (key == friendChannelName) {
        return <img className="buddy-avatar" src={firebaseUsers[key].avatar} />;
      }
    })

    return fbUsersData;
    // const user = props.allUsers.find((obj) => {
    //   return obj.username == friendChannelName;
    // });
    // if (user.avatar == null) {
    //   return <img className="buddy-avatar" src={buddyIcon} />;
    // } else {
    //   return <img className="buddy-avatar" src={user.avatar} />;
    // }
  };

  if (!props.chat || props.chat == undefined || props.allUsers.length == 0) {
    console.log("Loading...");
  }

  return (
    <>
      <div className="channel-list-item">
        <li className="chat-channel-name" onClick={changeChannelHandler}>
          <span>{grabUserImage()}</span>
          {user["is_online"] ? (
            <p className="user-online-name">{friendChannelName}</p>
          ) : (
            <p className="user-offline-name">{friendChannelName}</p>
          )}
        </li>
        <span className="friend-status">
          <em>{friendStatus}</em>
        </span>
      </div>
    </>
  );
};

export default ChatListItem;
