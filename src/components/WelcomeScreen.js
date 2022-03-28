import { useState } from "react";
import axios from "axios";
import siteLogo from "../assets/images/site-logo.png";
import chatPreview from "../assets/images/chat-preview.jpg";
import LoginForm from "./LoginForm";

const WelcomeScreen = (props) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const openLoginWindow = () => {
    setLoading(false);
    setIsLoggingIn(!isLoggingIn);
    setError(false);
  };

  const allUserNames = props.allUsers.map((user) => user.username)

  // If the user is signing up
  const signupFormSubmitHandler = (data) => {
    if(allUserNames.includes(data.username)) {
      setError('Username already exists, please try a different username!');
      return;
    }

    var myHeaders = new Headers();
    myHeaders.append("PRIVATE-KEY", "e20c09ad-f36b-4f4a-b309-99ae04944996");
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({
        username: data.username,
        secret: data.password,
      }),
    };

    fetch("https://api.chatengine.io/users/", requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));

    localStorage.setItem("username", data.username);
    localStorage.setItem("password", data.password);
    window.location.reload();
    // formSubmitHandler(data, true);
  };

  const formSubmitHandler = async (data) => {
    // If the user is logging in
    setLoading(true);
    const authObject = {
      "Project-ID": "b8a0fde0-1fae-4db8-9870-6bba5beb67c0",
      "User-Name": data.username,
      "User-Secret": data.password,
    };

    try {
      // Grab user authentication
      await axios.get("https://api.chatengine.io/chats", {
        headers: authObject,
      });

      // Authentication successful
      localStorage.setItem("newUser", false);
      localStorage.setItem("username", data.username);
      localStorage.setItem("password", data.password);
      setIsLoggingIn(false);
      window.location.reload();
    } catch (error) {
      if(allUserNames.includes(data.username)) {
        setError('Incorrect password, please try again!')
        return;
      }
      console.log(error)
      setError("Screenname does not exist, try again or create a new one!");
    }
    setLoading(false);
  };

  return (
    <>
      <div className="getBanner">
        <div className="announcement">
          <p>Welcome to the Chat App! Nostalgia mixed with a modern look!</p>
          <button onClick={openLoginWindow} className="login-button">
            Launch Messenger App
          </button>
        </div>
      </div>
      <div className="wrapper">
        {isLoggingIn && (
          <LoginForm
            loading={loading}
            formSubmit={formSubmitHandler}
            signupFormSubmit={signupFormSubmitHandler}
            error={error}
          />
        )}
        <div className="jumbo">
          <h1>
            <img src={siteLogo} alt="1997.chat, a retro IM app" width="519" />
          </h1>
        </div>
        <div className="form-img">
          <img src={chatPreview} alt="It's back." />
        </div>
      </div>
    </>
  );
};

export default WelcomeScreen;
