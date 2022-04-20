const Modal = (props) => {
    if(!props.show) {
        return null;
    }

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">Confirmation</h4>
        </div>
        <div className="modal-body">
            <p>Are you sure you want to remove <span style={{color:'blue', fontWeight:700}}>{props.buddyName}</span> from your friends list?</p> 
        </div>
        <div className="modal-footer">
          <button type='button' onClick={props.deleteBuddy}>Confirm</button>
          <button onClick={props.closeModal}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
