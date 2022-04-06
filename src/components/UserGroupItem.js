import { useState } from "react";

const UserGroupItem = (props) => {
  const [viewingGroupList, setViewingGroupList] = useState(false);

  // Fetch groups and theirs users from db
  const users = Object.keys(props.data.users).map((key) => {
    return props.data.users[key];
  });

  // List arrow styles
  const buddyListStyles = viewingGroupList
    ? "group-list-name-active"
    : "group-list-name";

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
        <div className="channel-list-item">
          {viewingGroupList ?
            users.map((user) => {
              return <li className='chat-channel-name'>
                  <p className='user-online-name'>{user.username}</p>
                  </li>;
            }) : ''}
        </div>
      </div>
    </>
  );
};

export default UserGroupItem;
