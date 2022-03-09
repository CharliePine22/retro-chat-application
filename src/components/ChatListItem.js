import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';

const ChatListItem = (props) => {
  console.log(props);
  const [currentChannel, setCurrentChannel] = useState(false);
  const myUserName = localStorage.getItem('username');
  const channelUsersList = props.chat.people;

  const openChatHandler = () => {
    console.log('Double Click');
  };

  const deleteChatHandler = () => {
    var myHeaders = new Headers();
    myHeaders.append('Project-ID', 'b8a0fde0-1fae-4db8-9870-6bba5beb67c0');
    myHeaders.append('User-Name', localStorage.getItem('username'));
    myHeaders.append('User-Secret', localStorage.getItem('password'));

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders
    };

    fetch(`https://api.chatengine.io/chats/${props.chat.id}/`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error));

      window.location.reload();
  };

  const changeChannelHandler = () => {
    setCurrentChannel(!currentChannel);
    props.switchChannel(props.chat.id);
  };

  return (
    <>
      <div className="channel-list-item">
        <li
          className="chat-channel-name"
          onDoubleClick={openChatHandler}
          onClick={changeChannelHandler}
        >
          {props.chat.people[0].person.username == myUserName
            ? props.chat.people[1].person.username
            : props.chat.people[0].person.username}{' '}
          <span className="trash-icon">
            <FaTrash onClick={deleteChatHandler} />
          </span>
        </li>
      </div>
    </>
  );
};

export default ChatListItem;
