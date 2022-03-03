import { useState } from 'react';

const ChatListItem = (props) => {
  const [currentChannel, setCurrentChannel] = useState(false);
  const myUserName = localStorage.getItem('username');
  const channelUsersList = props.chat.people;
 
  const listIconStyles = currentChannel ? 'channel-list-active' : 'channel-list';

  const openChatHandler = () => {
    console.log('Double Click');
  }

  const changeChannelHandler = () => {
      setCurrentChannel(!currentChannel)
  }

  return (
    <>
      <div className="channel-list-item">
        <ul className={listIconStyles}>
          <li onDoubleClick={openChatHandler} onClick={changeChannelHandler}>
            {props.chat.title}
            <span> (0/{props.chat.people.length})</span>
            <div className='channel-users-container'>
                {currentChannel && <ul className='channel-users-list'>
                    {props.chat.people.map((user) => <li className='channel-users'>&ensp;{user.person.username === myUserName ? user.person.username + ' (Me)' : user.person.username}</li>)}
                </ul>}
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};

export default ChatListItem;
