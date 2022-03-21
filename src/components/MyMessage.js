import parse from 'html-react-parser';

const MyMessage = ({ message }) => {
  return (
    <div className="message-row">
      {message?.attachments?.length > 0 ? (
        <img
          src={message.attachments[0].file}
          alt="message-attachment"
          className="message-image"
        />
      ) : (
        <div className="message" style={{ float: 'left', marginRight: '18px' }}>
          <span className="user-message">{`${message.sender.username}: `}</span>{' '}
          {parse(message.text)}
        </div>
      )}
    </div>
  );
};

export default MyMessage;
