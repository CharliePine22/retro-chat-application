import React, { useState, useRef } from 'react';
import { sendMessage, isTyping } from 'react-chat-engine';
import JoditEditor from 'jodit-react';

const RichText = ({props}) => {
  const editor = useRef(null);
//   const { chatId, creds } = props;
  const [content, setContent] = useState('');

  const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/doc/
  };

  return (
    <JoditEditor
      value={content}
      config={config}
      tabIndex={1} // tabIndex of textarea
      onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
      onChange={(newContent) => {}}
    />
  );
};

export default RichText;
