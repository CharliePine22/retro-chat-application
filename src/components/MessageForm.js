import { useState, useEffect } from 'react';
import { sendMessage, isTyping } from 'react-chat-engine';
import { SendOutlined, PictureOutlined } from '@ant-design/icons';

const MessageForm = (props) => {
  const [value, setValue] = useState('');
  const { chatId, creds } = props;

  // Listen for enter key when typing to submit text area
  //   useEffect(() => {
  //     const listener = event => {
  //       if (event.code === "Enter" || event.code === "NumpadEnter") {
  //         console.log("Enter key was pressed. Run your function.");
  //         event.preventDefault();
  //         formSubmitHandler(event);
  //       }
  //     };
  //     document.addEventListener("keydown", listener);
  //     return () => {
  //       document.removeEventListener("keydown", listener);
  //     };
  //   }, []);

  // Handle text form input changes
  const handleChange = (e) => {
    setValue(e.target.value);
    isTyping(props, chatId);
  };

  // Handle upload image materials
  const uploadHandler = (e) => {
    sendMessage(creds, chatId, { files: e.target.files, text: '' });
  };

  // Submit message handler
  const formSubmitHandler = (e) => {
    e.preventDefault();

    const text = value.trim();
    if (text.length > 0) sendMessage(creds, chatId, { text });

    setValue('');
  };

  return (
    <form className="message-form" onSubmit={formSubmitHandler}>

        {/* RICH TEXTAREA SETTINGS */}
      <div className="message-tab-actions">
          {/* Font Color Container */}
        <div className="font-color-settings">
          <button className="font-color">A</button>
          <button className="font-highlight-color">A</button>
          <span>|</span>
        </div>
        {/* Font Size Container */}
        <div className="font-size-settings">
          <button className="font-size-decrease">
            <span>&#8659;</span> A
          </button>
          <button className="font-size-normal">A</button>
          <button className="font-size-increase">
            <span>&#8657;</span>A
          </button>
          <span>|</span>
        </div>
        {/* Font Weight Settings */}
        <div className="font-weight-settings">
            <button></button>
            <button></button>
            <button></button>
        </div>
        <div className="attachment-settings"></div>
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
        <label htmlFor="upload-button">
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
        />
        <button type="submit" className="send-button">
          {' '}
          <SendOutlined className="send-icon" />{' '}
        </button>
      </div>
    </form>
  );
};

export default MessageForm;
