import { useState, useEffect, useRef } from 'react';
import { sendMessage, isTyping } from 'react-chat-engine';
import { SendOutlined, PictureOutlined } from '@ant-design/icons';
import sendButtonImage from '../assets/images/send-message-button.png';
import JoditEditor from 'jodit-react';
import 'jodit/build/jodit.min.css';

const MessageForm = (props) => {

  const { chatId, creds } = props;
  const [value, setValue] = useState('');

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
    console.log(text);
    props.grabMessageStyles(text);
    if (text.length > 0) sendMessage(creds, chatId, { text });

    setValue('');
  };

  const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/doc/
    beautifyHTML: true,
    buttons: 'bold,italic,underline,fontsize,brush,image,file,link',
  };

  const editor = useRef(null);

  return (
    <form onSubmit={formSubmitHandler}>
      <JoditEditor
        ref={editor}
        value={value}
        config={config}
        tabIndex={1} // tabIndex of textarea
        onBlur={(newContent) => setValue(newContent)} // preferred to use only this option to update the content for performance reasons
        // onChange={(newContent) => {setContent(newContent)}}
      />
      <div className='message-form-actions'>
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
          <img src={sendButtonImage}/>
        </button>
      </div>
    </form>


  // <form className="message-form" onSubmit={formSubmitHandler}>

  //     {/* RICH TEXTAREA SETTINGS */}
  //   <div className="message-tab-actions">
  //       {/* Font Color Container */}
  //     <div className="font-color-settings">
  //       <button className="font-color">A</button>
  //       <button className="font-highlight-color">A</button>
  //       <span>|</span>
  //     </div>
  //     {/* Font Size Container */}
  //     <div className="font-size-settings">
  //       <button className="font-size-decrease">
  //         <span>&#8659;</span> A
  //       </button>
  //       <button className="font-size-normal">A</button>
  //       <button className="font-size-increase">
  //         <span>&#8657;</span>A
  //       </button>
  //       <span>|</span>
  //     </div>
  //     {/* Font Weight Settings */}
  //     <div className="font-weight-settings">
  //         <button></button>
  //         <button></button>
  //         <button></button>
  //     </div>
  //     <div className="attachment-settings"></div>
  //     <div className="unknown-settings"></div>
  //   </div>

  //     {/* TEXTAREA */}
  //   <textarea
  //     className="message-input"
  //     rows="12"
  //     value={value}
  //     onChange={handleChange}
  //   />

  //     {/* TEXTAREA SETTINGS */}
  //     <div className='message-form-actions'>
  //       <label htmlFor="upload-button">
  //         <span className="image-button">
  //           <PictureOutlined className="picture-icon" />
  //         </span>
  //       </label>
  //       <input
  //         type="file"
  //         multiple={false}
  //         id="upload-button"
  //         style={{ display: 'none' }}
  //         onChange={uploadHandler}
  //       />
  //       <button type="submit" className="send-button">
  //         <img src={sendButtonImage}/>
  //       </button>
  //     </div>
  //   </form>
    );
};

export default MessageForm;
