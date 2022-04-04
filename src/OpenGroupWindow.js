import { useState } from "react";
import NewWindow from "react-new-window";

const OpenGroupWindow = (props) => {
  // Grab chatId to let engine know which group buddy belongs in?
  const chatId = props.chatId;
  // Group Name is the input value
  const [groupName, setGroupName] = useState("");
  // Group Item is the selected pre-existing group in users groups list
  const [groupItem, setGroupItem] = useState("");
  const [error, setError] = useState('');

  const myUserName = localStorage.getItem("username");

  const formSubmitHandler = async () => {
    let group;
    if (groupName.trim().length > 0) {
      if(groups.includes(groupName.toLowerCase())) {
          setError('This group already exists, select it from the groups list!');
          return;
      } 
      group = groupName;
      let url = `https://retro-chat-app22-default-rtdb.firebaseio.com/users/${myUserName}/groups.json`;
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS, PUT",
          "Access-Control-Allow-Headers":
            "Content-Type, Authorization, X-Requested-With",
        },
        body: JSON.stringify(group),
      });
      const result = await response.json();
    } else {
      console.log(groupItem);
    }
  };
  
  const groupSelectHandler = (group) => {
    setGroupItem(group);
    setGroupName("");
  };

  // Test groups
  let groups = ["Family", "Work", "Homies", "Blocked", "Squad"];

  return (
    <>
      <NewWindow
        title="Group Window"
        name="Buddy Groups"
        center="screen"
        features={{ width: 500, height: 350 }}
      >
        <div className="group-window-container">
          <p className="group-window-message">
            Please type in the name of the group that you'd like to add this
            user to. If you already have a group created, select the group and
            click add user!
          </p>
          <div className="group-form-container">
            <form onSubmit={formSubmitHandler}>
              {/* Group input */}
              <label htmlFor="groupId">Group Name</label>
              <input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="groupInput"
                type="text"
                id="groupId"
              />

              {/* User groups list */}
              <div className="current-groups-container">
                <ul className="current-groups-list">
                  {groups.map((group, key) => (
                    <div
                      key={key}
                      className="group-item-container"
                      onClick={() => groupSelectHandler(group)}
                    >
                      <li className="group-item">{group}</li>
                      <span
                        className={
                          groupItem == group
                            ? "group-item-indicator active"
                            : "group-item-indicator inactive"
                        }
                      />
                    </div>
                  ))}
                </ul>
                <button>Add User</button>
              </div>
            </form>
            {error && {error}}
          </div>
        </div>
      </NewWindow>
    </>
  );
};

export default OpenGroupWindow;
