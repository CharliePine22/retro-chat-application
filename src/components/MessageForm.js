// React hooks and components
import { useState, useRef } from "react";
import OpenGroupWindow from "./OpenGroupWindow";

// Send message function
import { sendMessage, isTyping } from "react-chat-engine";

// Upload image picture
import { PictureOutlined } from "@ant-design/icons";

// Message form images
import sendButtonImage from "../assets/images/send-message-button.png";
import colorPalette from "../assets/images/color-palette.png";
import warnIcon from "../assets/images/warn.png";
import blockIcon from "../assets/images/block.png";
import redDice from "../assets/images/red-dice.png";
import addGroupIcon from "../assets/images/add-group.png";

// Message form emojis
import Picker from "emoji-picker-react";
import { FaEnvelopeOpenText } from "react-icons/fa";

// Message form color picker
import { GithubPicker } from 'react-color';

const MessageForm = (props) => {
  const { chatId, creds } = props;
  // Value for message form
  const [value, setValue] = useState("");
  // Group State settings
  const [viewingBuddyWindow, setViewingBuddyWindow] = useState(false);
  // Emoji State settings
  const [showEmoji, setShowEmoji] = useState(false);
  const [chosenEmoji, setChosenEmoji] = useState(null);
  // Color State settings
  const [showColors, setShowColors] = useState(false);
  const [chosenColor, setChosenColor] = useState(null);

  const messageFormRef = useRef();

  // Handle text form input changes
  const handleChange = (e) => {
    setValue(e.target.value);
    // isTyping(props, chatId);
  };

  // Set the chosen color to the user's pick
  const handleColorChange = (color, event) => {
    setChosenColor(color.hex);
    console.log(color.hex);
  }

  // On emoji click, add that emoji to current user message
  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
    setValue(() => value + "" + emojiObject.emoji);
  };

  // Handle upload image materials
  const uploadHandler = (e) => {
    sendMessage(creds, chatId, { files: e.target.files, text: "" });
  };

  // Determines if group window is open or closed 
  const handleGroupWindow = () => {
    setViewingBuddyWindow(!viewingBuddyWindow)
  }

  // Allows users to submit messages by pressing the enter key
  const onEnterPress = (e) => {
    if(e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      const text = value.trim();
      if (text.length > 0) sendMessage(creds, chatId, { text });
      setValue("");
      setShowEmoji(false);
    }
  }

  // Submit message handler
  const formSubmitHandler = (e) => {
    e.preventDefault();
    const text = value.trim();
    if (text.length > 0) sendMessage(creds, chatId, { text });
    setValue("");
    setShowEmoji(false);
  };


  return (
    <form className="message-form" onSubmit={formSubmitHandler}>
      {/* RICH TEXTAREA SETTINGS */}
      <div className="message-tab-actions">

        {/* Font Color Container */}
        <div className="font-color-settings">
          <button type="button" className="font-color" onClick={() => setShowColors(!showColors)}>
            A
          </button>
          {showColors && <div className='message-form-color-picker'><GithubPicker  onChangeComplete={handleColorChange}/></div>}
          <button type="button" className="font-highlight-color">
            A
          </button>
          <span>|</span>
        </div>

        {/* Font Size Container */}
        <div className="font-size-settings">
          <button type="button" className="font-size-decrease">
            <span>&#8659;</span> A
          </button>
          <button type="button" className="font-size-normal">
            A
          </button>
          <button type="button" className="font-size-increase">
            <span>&#8657;</span>A
          </button>
          <span>|</span>
        </div>

        {/* Font Weight Settings */}
        <div className="font-weight-settings">
          <button type="button" className='bold'>B</button>
          <button type="button">
            <em>I</em>
          </button>
          <button type="button">
            <u>U</u>
          </button>
          <span>|</span>
        </div>

        {/* Message Form Attachment Settings */}
        <div className="attachment-settings">
          {/* Link */}
          <button type="button" className="attachment-settings-link">
            link
          </button>
          {/* Image */}
          <label htmlFor="upload-button">
            <span className="image-button">
              <PictureOutlined className="picture-icon" />
            </span>
          </label>
          <input
            type="file"
            multiple={false}
            id="upload-button"
            style={{ display: "none" }}
            onChange={uploadHandler}
          />
          {/* Email */}
          <button type="button">
            <FaEnvelopeOpenText />
          </button>

          {/* Emoji */}
          <button type="button" onClick={() => setShowEmoji(!showEmoji)}>
            😎
          </button>
          <div className="emoji-table-container">
            {showEmoji && (
              <Picker
                className="emoji-table"
                disableAutoFocus={true}
                onEmojiClick={onEmojiClick}
              />
            )}
          </div>
        </div>

        <div className="unknown-settings"></div>
      </div>

      {/* TEXTAREA */}
      <textarea
        className="message-input"
        rows="12"
        value={value}
        onChange={handleChange}
        onKeyDown={onEnterPress}
      />

      {/* TEXTAREA SETTINGS */}
      <div className="message-form-actions">
        {/* Warning and Blocking */}
        <div className='user-warnings-container'>
              <div className='warning'>
                <img src={warnIcon}/> 
              </div>

              <div className='block'>
                <img src={blockIcon} />
              </div>
        </div>

        <hr className='message-border' />

        {/* Events */}
          <div className="message-events-container">
            {/* Expressions */}
            <div className="message-expressions">
              <img src={colorPalette} />
              <span>Expressions</span>
            </div>

            {/* Games */}
            <div className='message-games'>
              <img src={redDice} />
              <span>Games</span>
            </div>

            {/* Add Group */}
            <div className='add-group' onClick={handleGroupWindow}>
              <img src={addGroupIcon} />
              <span>Add Group</span>
            </div>

            {viewingBuddyWindow && <OpenGroupWindow chatId={chatId} /> }

          </div>
            <hr className='message-border' />
  
          {/* Send Message */}
          <div className="send-block-container">
            <button type="submit" className="send-button">
              <img src={sendButtonImage} />
  
              {/* Color bar below send image*/}
              <div className='send-message-bar'>
                <span className='message-bar-red'></span>
                <span className='message-bar-red'></span>
                <span className='message-bar-red'></span>
                <span className='message-bar-yellow'></span>
                <span className='message-bar-yellow'></span>
                <span className='message-bar-yellow'></span>
                <span className='message-bar-yellow'></span>
                <span className='message-bar-yellow'></span>
                <span className='message-bar-yellow'></span>
                <span className='message-bar-green'></span>
                <span className='message-bar-green'></span>
                <span className='message-bar-green'></span>
                <span className='message-bar-green'></span>
                <span className='message-bar-green'></span>
                <span className='message-bar-green'></span>
              </div>
            </button>
          </div>
      </div>
    </form>
  );
};

export default MessageForm;
