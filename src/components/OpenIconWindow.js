import { useState } from 'react';
import NewWindow from 'react-new-window';

const OpenIconWindow = (props) => {
  const [iconText, setIconText] = useState('');

  const iconFormChangeHandler = (e) => {
      e.preventDefault();
      props.changeIcon(iconText);
  };

  return (
    <>
      <NewWindow
        title="Icon Change"
        name="Icon Change"
        center="screen"
        features={{ width: 500, height: 350 }}
      >
        <div className="window-container">
          <form onSubmit={iconFormChangeHandler} className="icon-change-form">
            <label htmlFor="icon-text">Icon</label>{' '}
            <input
              value={iconText}
              onChange={(e) => setIconText(e.target.value)}
              className="icon-text"
              type="url"
              id="icon-text"
            />
            <button type="submit">Set Icon</button>
          </form>
        </div>
      </NewWindow>
    </>
  );
};

export default OpenIconWindow;
