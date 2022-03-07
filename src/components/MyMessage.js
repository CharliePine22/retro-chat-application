import parse from 'html-react-parser';

const MyMessage = ({ message, messageStyles }) => { 
    const msgText = `<p style={${messageStyles}}>${message.text}</p>`
    console.log(messageStyles)
    if(message?.attachments?.length > 0) {
        return (
            <img src={message.attachments[0].file} alt='message-attachment' className='message-image' />
        )
    }
    return (
        <div className='message' style={{ float:'left', marginRight: '18px'}}>
            <span className='user-message'>{`${message.sender.username}:`}</span> <span style={{messageStyles}}>{parse(message.text)}</span>
        </div>
    )
}

export default MyMessage