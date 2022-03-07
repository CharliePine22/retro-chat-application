const MyMessage = ({ message }) => { 
    console.log(message)
    if(message?.attachments?.length > 0) {
        return (
            <img src={message.attachments[0].file} alt='message-attachment' className='message-image' />
        )
    }
    return (
        <div className='message' style={{ float:'left', marginRight: '18px'}}>
            <span className='user-message'>{`${message.sender.username}:`}</span> {message.text}
        </div>
    )
}

export default MyMessage