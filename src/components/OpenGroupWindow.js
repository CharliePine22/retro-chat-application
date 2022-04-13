import { useState, useEffect } from "react";
import NewWindow from "react-new-window";

const OpenGroupWindow = (props) => {
  // Grab chatId to let engine know which group buddy belongs in?
  const [buddyFirebaseKey, setBuddyFirebaseKey] = useState();

  // Group Name is the input value
  const [groupName, setGroupName] = useState("");

  // Group Item is the selected pre-existing group in users groups list
  const [groupItem, setGroupItem] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // User's fetched groups from firebase
  const firebaseGroups = props.firebaseGroups;

  const getUserFirebaseKey = () => {
    const keys = Object.values(firebaseGroups);
    for(const group in keys) {
      const entries = Object.entries(keys[group].users)
      for(const user in entries) {
        if(entries[user][1].username == props.buddyName) {
          setBuddyFirebaseKey(entries[user][0])
        }
      }
    }
  };

  useEffect(() => {
    getUserFirebaseKey()
  }, [props.buddyName])
  

  // Grab username from local storage for fetching
  const myUserName = localStorage.getItem("username");

  // Formats user's entry into title case to compare to database groups
  const titleCase = (str) => {
    str = str.toLowerCase().split(" ");
    // Loop through string and reformat into title case
    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(" ");
  };

  // Creates new group if user doesn't already have it
  const createNewGroup = async () => {
    const group = titleCase(groupName);
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
          username: props.buddyName,
        }),
      });
      const result = await response.json();
    }
  };

  // Adds user to group that's in user's group list
  const addUserToGroup = async () => {
    // Loop and see if user is already apart of the group
    const currentGroupUsers = Object.keys(firebaseGroups).map((key) => {
      if (key == groupItem) {
        // If user is in group, return true
        const users = Object.values(firebaseGroups[key].users);
        return users.map((user) => {
          if (props.buddyName == user.username) {
            return true;
          }
        });
      }
    });

    // Removes undefined values from current group list
    const userExists = currentGroupUsers.filter(function (x) {
      return x !== undefined;
    });

    // If there is no selection and form is blank
    if (groupItem == "") {
      setError("Please either choose a group from the list, or create one!");
      return;
    }

    // If userExists returns true, the user is apart of the group so throw an error
    if (userExists[0][0] !== undefined) {
      setError("User is already in this group!");
      return;
    }
    // Add group to database
    else {
      try {
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
            username: props.buddyName,
          }),
        });
      } catch (err) {
        setError(err);
      }
      setSuccess(`${props.buddyName} added to ${groupItem}!`)
      setTimeout(() => {
        props.handleGroupWindow()
      }, 2000)
    }
  };

  // Remove user from group
  const removeUserFromGroup = async () => {
    let url = `https://retro-chat-app22-default-rtdb.firebaseio.com/users/${myUserName}/groups/${groupItem}/users/${buddyFirebaseKey}.json`;
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS, PUT",
          "Access-Control-Allow-Headers":
            "Content-Type, Authorization, X-Requested-With",
        },
        // Add group to database and then add the user as a part of the created group
        body: JSON.stringify({
          username: props.buddyName,
        }),
      });
    } catch (err) {
      setError(err);
    } 
    setSuccess(`${props.buddyName} removed from ${groupItem}!`)
      setTimeout(() => {
        props.removeGroupHandler()
      }, 2000)
  };

  const formSubmitHandler = () => {
    // IF the user is adding buddy to group
    if (props.action == "add") {
      // If the user has submitted a custom group that isn't empty
      if (groupName.trim().length > 0) {
        createNewGroup();
      } else {
        addUserToGroup();
      }
    }
    // If the user is removing buddy from group
    else {
      removeUserFromGroup();
    }
  };

  // Function handler for group items
  const groupSelectHandler = (group) => {
    setGroupItem(group);
    setGroupName("");
  };

  // Reformat fetched group into array
  const groupNames = Object.keys(firebaseGroups).map((key) => {
    return key;
  });

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
            {/* Change message depending on what action the user is doing (adding or removing buddy from group) */}
            {props.action == "add"
              ? "Please type in the name of the group that you'd like to add this user to. If you already have a group created, select the group and click add user!"
              : `Please type or select the group that you'd like to remove ${props.buddyName} from!`}
          </p>
          <div className="group-form-container">
            <form onSubmit={formSubmitHandler}>
              {/* Group input */}
              {props.action == "add" && (
                <>
                  <label htmlFor="groupId">Group Name</label>
                  <input
                    value={groupName}
                    onChange={(e) => {
                      setGroupName(e.target.value);
                      setGroupItem("");
                      setError("");
                    }}
                    className="groupInput"
                    type="text"
                    id="groupId"
                  />
                </>
              )}

              {/* User groups list */}
              <div className="current-groups-container">
                <ul className="current-groups-list">
                  {/* If the user is adding a buddy to group */}
                  {props.action == "add" && groupNames.length > 0
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
                    : props.action == "add" && groupNames.length == 0
                    ? "No available groups..."
                    : ""}
                  {/* If the user is removing a buddy from group */}
                  {props.action == "remove" && props.currentGroups.length > 0
                    ? props.currentGroups.map((group, key) => (
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
                    : props.action == "remove" &&
                      props.currentGroups.length == 0
                    ? "Buddy is not in any groups"
                    : ""}
                </ul>
                <button>
                  {props.action == "add" ? "Add User" : "Remove User"}
                </button>
              </div>
            </form>
          </div>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
        </div>
      </NewWindow>
    </>
  );
};

export default OpenGroupWindow;
