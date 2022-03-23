import { useState, useRef } from "react";
import { sendMessage, isTyping } from "react-chat-engine";
import { PictureOutlined } from "@ant-design/icons";
import sendButtonImage from "../assets/images/send-message-button.png";
import colorPalette from "../assets/images/color-palette.png";
import warnIcon from "../assets/images/warn.png";
import blockIcon from "../assets/images/block.png";
import redDice from "../assets/images/red-dice.png";
import Picker from "emoji-picker-react";
import { FaEnvelopeOpenText } from "react-icons/fa";

const MessageForm = (props) => {
  const { chatId, creds } = props;
  const [value, setValue] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [chosenEmoji, setChosenEmoji] = useState(null);

  // Handle text form input changes
  const handleChange = (e) => {
    setValue(e.target.value);
    // isTyping(props, chatId);
  };

  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
    setValue(() => value + "" + emojiObject.emoji);
  };

  // Handle upload image materials
  const uploadHandler = (e) => {
    sendMessage(creds, chatId, { files: e.target.files, text: "" });
  };

  // Submit message handler
  const formSubmitHandler = (e) => {
    e.preventDefault();
    const text = value.trim();
    if (text.length > 0) sendMessage(creds, chatId, { text });
    setValue("");
    setShowEmoji(false);
  };

  // const config = {
  //   readonly: false, // all options from https://xdsoft.net/jodit/doc/
  //   beautifyHTML: true,
  //   buttons: "bold,italic,underline,fontsize,brush,image,file,link",
  // };

  // const editor = useRef(null);

  // JODIT RICH TEXT AREA SETTINGS
  // import JoditEditor from 'jodit-react';
  // import 'jodit/build/jodit.min.css';
  // return (
  // <form onSubmit={formSubmitHandler}>
  //   <JoditEditor
  //     ref={editor}
  //     value={value}
  //     config={config}
  //     tabIndex={1} // tabIndex of textarea
  //     onBlur={(newContent) => setValue(newContent)} // preferred to use only this option to update the content for performance reasons
  //     // onChange={(newContent) => {setContent(newContent)}}
  //   />
  // <div className='message-form-actions'>
  {
    /* <label htmlFor="upload-button">
          <span className="image-button">
            <PictureOutlined className="picture-icon" />
          </span>
        </label>
        <input
          type="file"
          multiple={false}
          id="upload-button"
          style={{ display: 'none' }}
          onChange={uploadHandler}
        /> */
  }
  //     <button type="submit" className="send-button">
  //       <img src={sendButtonImage}/>
  //     </button>
  //   </div>
  // </form>

  return (
    <form className="message-form" onSubmit={formSubmitHandler}>
      {/* RICH TEXTAREA SETTINGS */}
      <div className="message-tab-actions">
        {/* Font Color Container */}
        <div className="font-color-settings">
          <button type="button" className="font-color">
            A
          </button>
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
          <button type="button">B</button>
          <button type="button">
            <em>I</em>
          </button>
          <button type="button">
            <u>U</u>
          </button>
          <span>|</span>
        </div>
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
          <div className="message-events-container">
            {/* Expressions */}
            <div className="message-expressions">
              <img src={colorPalette} />
              <span>Expressions</span>
            </div>
            <div className='message-games'>
              <img src={redDice} />
              <span>Games</span>
            </div>
          </div>

          {/* Send Message */}
          <div className="send-block-container">
            <button type="submit" className="send-button">
              <img src={sendButtonImage} />
              {/* add colors */}
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
