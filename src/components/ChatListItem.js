import { useState, useEffect } from "react";
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
    props.changeLoadingTrue();
    props.switchChannel(props.chat.id);
  };

  // Grab friends status
  useEffect(() => {
    const fbUsersData = Object.keys(firebaseUsers).map((key) => {
      // Grab the data that belongs to the buddy
      if (key == friendChannelName) {
        setFriendStatus(firebaseUsers[key].status);
      }
    });
  }, [props.allUsers, firebaseUsers]);

  // Grab friends avatar
  const grabUserImage = () => {
    const fbUsersData = Object.keys(firebaseUsers).map((key) => {
      if (key == friendChannelName) {
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

  // If data hasn't fetched on time of render, return loading
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
        {user["is_online"] ? (
          <span className="friend-status-online">
            <em>{friendStatus}</em>
          </span>
        ) : (
          <span className="friend-status-offline">
            <em>{friendStatus}</em>
          </span>
        )}
      </div>
    </>
  );
};

export default ChatListItem;
