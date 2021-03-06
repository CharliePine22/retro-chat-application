import "./App.css";
import { ChatEngine } from "react-chat-engine";
import { useState, useEffect, useRef } from "react";
import useSound from "use-sound";
import sendSound from "./assets/sounds/imsend.wav";
import ChatFeed from "./components/ChatFeed";
import WelcomeScreen from "./components/WelcomeScreen";
import ChatList from "./components/ChatList";

function App() {
  // Sound and volume settings
  const [soundVolume, setSoundVolume] = useState(1);
  const [playSend] = useSound(sendSound, { volume: soundVolume });

  // Chat room settings
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(0);

  // List of all users
  const [allUsers, setAllUsers] = useState([]);
  const [firebaseUsersList, setFirebaseUsersList] = useState([]);

  // First update for grabbing all users
  const firstChatEngineUpdate = useRef(true);


  // Chaning sound volume settings
  const changeVolume = (volume) => {
    if (volume == "Full") {
      setSoundVolume(1);
    } else if (volume == "Half") {
      setSoundVolume(0.5);
    } else {
      setSoundVolume(0);
    }
  };

//   const alertUser = (event) => {
//     event.preventDefault()
//     event.returnValue = ''
// }

// const handleTabClosing = () => {
//   localStorage.removeItem('username')
// }

  // Use to  auto log user out and potentially set online status to offline
//   useEffect(() => {
//     window.addEventListener('beforeunload', alertUser)
//     window.addEventListener('unload', handleTabClosing)
//     return () => {
//         window.removeEventListener('beforeunload', alertUser)
//         window.removeEventListener('unload', handleTabClosing)
//     }
// })

const changeLoadingTrue = () => {
  setLoading(true);
}

const changeLoadingFalse = () => {
  setLoading(false);
}

  // Fetch messages based on current chat channel
  const grabMessages = (chatId) => {
    setCurrentChatId(chatId);
    var myHeaders = new Headers();
    myHeaders.append("Project-ID", process.env.REACT_APP_PROJECT_ID);
    myHeaders.append("User-Name", localStorage.getItem("username"));
    myHeaders.append("User-Secret", localStorage.getItem("password"));

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`https://api.chatengine.io/chats/${chatId}/messages/`, requestOptions)
      .then((response) => response.json())
      .then((result) => setChatMessages(result))
      .catch((error) => console.log("error", error));
    setLoading(false);
  };

  // Grab every user in chat engine database
  const getAllUsers = () => {
    var myHeaders = new Headers();
    myHeaders.append("PRIVATE-KEY", process.env.REACT_APP_PRIVATE_KEY);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    // Set our state array to list all the users
    fetch("https://api.chatengine.io/users/", requestOptions)
      .then((response) => response.json())
      .then((result) => setAllUsers(result))
      .catch((error) => console.log("error", error));
  };

  // Grab firebase info for status and avatar update
  // Chat engine didn't allow for easy avatar or status updates, so firebase database was created
  const fetchFirebaseInfo = async () => {
    let url = `https://retro-chat-app22-default-rtdb.firebaseio.com/users.json`;
    // Grab every user in the database
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS, PUT",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-Requested-With",
      },
    });
    const result = await response.json();
    setFirebaseUsersList(result);
  };

  // Update users list frequently to seee any update for them
  // Like if they update their status or go onlline
  useEffect(() => {
    let mounted = true;
    // On first render, just grab the list of users
    if (firstChatEngineUpdate.current) {
      firstChatEngineUpdate.current = false;
      if (mounted) {
        getAllUsers();
        fetchFirebaseInfo();
      }
    }
    // After initial render, refetch users list every 5 seconds to see if theres any updates
    const intervalId = setInterval(() => {
      if (mounted) {
        getAllUsers();
        fetchFirebaseInfo();
      }
    }, 3000);
    return () => {
      clearInterval(intervalId);
      mounted = false;
    };
  }, []);


  // If login failes return them back to same page
  if (!localStorage.getItem("username"))
    return <WelcomeScreen allUsers={allUsers} />;

  return (
    <>
      <ChatEngine
        height="100vh"
        projectID={process.env.REACT_APP_PROJECT_ID}
        userName={localStorage.getItem("username")}
        userSecret={localStorage.getItem("password")}
        renderChatList={(chatAppProps) => (
          <ChatList
            {...chatAppProps}
            allUsers={allUsers}
            firebaseUsersList={firebaseUsersList}
            loading={loading}
            changeLoadingTrue={changeLoadingTrue}
            changeLoadingFalse={changeLoadingFalse}
            fetchChannelMessages={grabMessages}
            changeVolume={changeVolume}
          />
        )}
        onNewMessage={playSend}
        // onGetMessages={playReceived}
        renderChatFeed={(chatAppProps) => (
          <ChatFeed
            {...chatAppProps}
            loading={loading}
            changeLoadingTrue={changeLoadingTrue}
            changeLoadingFalse={changeLoadingFalse}
            fetchChannelMessages={grabMessages}
            chatMessages={chatMessages}
            firebaseUsersList={firebaseUsersList}
          />
        )}
        renderChatSettings={(chatAppState) => {}}
      />
    </>
  );
}

export default App;
