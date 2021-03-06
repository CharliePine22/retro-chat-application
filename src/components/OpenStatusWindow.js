import NewWindow from 'react-new-window';
import { useState, useCallback } from 'react';

const OpenStatusWindow = (props) => {
  const [statusText, setStatusText] = useState('');
  const [characterCount, setCharacterCount] = useState(0);

  const statusFormChangeHandler = (e) => {
      e.preventDefault();
      props.changeStatus(statusText);
  };

  const statusChangeHandler = (e) => {
    if(characterCount < 80) {
    setStatusText(e.target.value)
    setCharacterCount(e.target.value.length);
    } else {
      console.log('none')
    }
  }

  // const setFormattedContent = useCallback(
  //   text => {
  //     setFormattedContent(text.slice(0, 80))
  //   },
  //   [setContent]
  // )

  return (
    <>
      <NewWindow
        title="Status Change"
        name='Status Change'
        center="screen"
        features={{ width: 500, height: 350 }}
      >
        <div className="window-container">
          <form
            onSubmit={statusFormChangeHandler}
            className="status-change-form"
          >
            <label htmlFor="status-text">Status</label> <span className='character-count'>{characterCount}/80</span>
            <textarea
              value={statusText}
              onChange={statusChangeHandler}
              className="status-text"
              type="textbox"
              id="status-text"
              cols="75"
            />
            <div className="status-options">
              <div className='status-submit'>
                <button type='submit'>Set Status</button>
              </div>
              <div className='status-checkmark'>
                <label htmlFor="away">I'm Away</label>
                <input type="checkbox" id="away" />
              </div>
            </div>
          </form>
        </div>
      </NewWindow>
    </>
  );
};

export default OpenStatusWindow;
