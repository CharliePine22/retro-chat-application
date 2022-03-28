import { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import buddyIcon from '../assets/images/noBuddyIcon.png';

const ChatListItem = (props) => {
  const [currentChannel, setCurrentChannel] = useState(false);
  const [friendStatus, setFriendStatus] = useState('');
  const myUserName = localStorage.getItem('username');
  const friendChannelName = props.friendChannelName;
  
  const user = props.allUsers.find(obj => {
    return obj.username == friendChannelName;
  });

  const changeChannelHandler = () => {
    setCurrentChannel(!currentChannel);
    props.switchChannel(props.chat.id);
  };

  // Grab friends status
  useEffect(() => {
    // const intervalId = setInterval(() => {
        const user = props.allUsers.find(obj => {
          return obj.username == friendChannelName;
        })
        if(user['custom_json'] === '{}') {
          setFriendStatus('No user status')
        } else {
          setFriendStatus(user['custom_json'])
        }
    // }, 1000)
    // return () => clearInterval(intervalId);
  }, [props.allUsers])

  // Grab friends avatar 
  const grabUserImage = () => {
    const user = props.allUsers.find(obj => {
      return obj.username == friendChannelName;
    })
   if(user.avatar == null) {
     return <img className='buddy-avatar' src={buddyIcon} />
   } else {
     return <img className='buddy-avatar' src={user.avatar} />
   }
  }


  if(!props.chat || props.chat == undefined || props.allUsers.length == 0) {
    console.log('Loading...')
  }

  return (
    <>
      <div className="channel-list-item">
        <li
          className="chat-channel-name"
          onClick={changeChannelHandler}
        >
          <span>{grabUserImage()}</span>
          {user['is_online'] ? <p className='user-online-name'>{friendChannelName}</p> : <p className='user-offline-name'>{friendChannelName}</p>}
          </li>
        <span className='friend-status'><em>{friendStatus}</em></span>
        
      </div>
    </>
  );
};

export default ChatListItem;
