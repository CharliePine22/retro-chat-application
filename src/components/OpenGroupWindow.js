import { useState } from "react";
import NewWindow from "react-new-window";

const OpenGroupWindow = (props) => {
  // Grab chatId to let engine know which group buddy belongs in?
  const chatId = props.chatId;

  // Group Name is the input value
  const [groupName, setGroupName] = useState("");

  // Group Item is the selected pre-existing group in users groups list
  const [groupItem, setGroupItem] = useState("");
  const [error, setError] = useState("");

  // User's fetched groups from firebase
  const firebaseGroups = props.firebaseGroups;

  // Grab username from local storage for fetching
  const myUserName = localStorage.getItem("username");

  // Formats user's entry into title case to compare to database groups
  const titleCase = (str) => {
    str = str.toLowerCase().split(' ');
    // Loop through string and reformat into title case
    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
    }
    return str.join(' ');
  }

  // Creates new group if user doesn't already have it
  const createNewGroup = async () => {
      const group = titleCase(groupName)
        // If the user already has the group in their lists, throw an error
        if (groupNames.includes(group)) {
          setError("This group already exists, select it from the groups list!");
          return;
        } else {
          // Fetch settings
          let url = `https://retro-chat-app22-default-rtdb.firebaseio.com/users/${myUserName}/groups/${group}/users.json`;
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS, PUT",
              "Access-Control-Allow-Headers":
                "Content-Type, Authorization, X-Requested-With",
            },

            // Add group to database and then add the user as a part of the created group
            body: JSON.stringify({
                username: props.buddyName
            })
          });
          const result = await response.json();
          console.log(result);
        }
  }

  // Adds user to group that's in user's group list
  const addUserToGroup = async () => {
    // Flag to determine if user is in group or not
      let flag;
    // Loop and see if user is already apart of the group
    const currentGroupUsers = Object.keys(firebaseGroups).map((key) => {
        if (key == groupItem) {
            // If user is in group, return true
           const users = Object.values(firebaseGroups[key].users)
           return users.map((user) => {
              if(props.buddyName == user.username) {
                  return true
              }
            })
        }
    })

    // Removes undefined values from current group list
    const userExists = currentGroupUsers[0].filter(function(x) {
        return x !== undefined
    })


    // If userExists returns true, the user is apart of the group so throw an error
    if(userExists[0]) {
        setError('User is already in this group!');
        return;
    }

    // If there is no selection and form is blank
    if(groupItem == "") {
        setError('Please either choose a group from the list, or create one!');
        return;
    }

      // Add group to database
      let url = `https://retro-chat-app22-default-rtdb.firebaseio.com/users/${myUserName}/groups/${groupItem}/users.json`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS, PUT",
          "Access-Control-Allow-Headers":
            "Content-Type, Authorization, X-Requested-With",
        },
        // Add group to database and then add the user as a part of the created group
        body: JSON.stringify({
            username: props.buddyName
        })
      });
      const result = await response.json();
      console.log(result);
  }

  const formSubmitHandler = async () => {
    // If the user has submitted a custom group that isn't empty
     if (groupName.trim().length > 0) {
        createNewGroup()
     }
    else {
      addUserToGroup();
    }
  };

  // Function handler for group items
  const groupSelectHandler = (group) => {
    setGroupItem(group);
    setGroupName("");
  };

  // Reformat fetched group into array
  const groupNames = Object.keys(firebaseGroups).map((key) => {
      return key
  })

  return (
    <>
      <NewWindow
        title={props.buddyName}
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
                onChange={(e) => {
                    setGroupName(e.target.value) 
                    setGroupItem("")
                    setError("")
                }}
                className="groupInput"
                type="text"
                id="groupId"
              />

              {/* User groups list */}
              <div className="current-groups-container">
                <ul className="current-groups-list">
                  {groupNames.length > 0
                    ? groupNames.map((group, key) => (
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
                      ))
                    : "No available groups..."}
                </ul>
                <button>Add User</button>
              </div>
            </form>
          </div>
            {error && <p className='error'>{error}</p> }
        </div>
      </NewWindow>
    </>
  );
};

export default OpenGroupWindow;
