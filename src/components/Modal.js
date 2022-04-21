import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";

const Modal = (props) => {
  // Handler function for remove buddy from friends list
  const deleteBuddyHandler = (e) => {
    e.stopPropagation();
    props.removeMessage();
    props.deleteBuddy();
  };

  // Remove any errors and close modal
  const removeModal = () => {
    props.closeModal();
    props.removeMessage();
  };

  return ReactDOM.createPortal(
    <CSSTransition
      in={props.show}
      unmountOnExit
      timeout={{ enter: 0, exit: 300 }}
    >
      <div
        className={`modal ${props.show ? "show" : ""}`}
        onClick={removeModal}
      >
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h4 className="modal-title">Confirmation</h4>
          </div>
          <div className="modal-body">
            <p>
              Are you sure you want to remove{" "}
              <span style={{ color: "blue", fontWeight: 700 }}>
                {props.buddyName}
              </span>{" "}
              from your friends list?
            </p>
          </div>
          <div className="modal-footer">
            {!props.loading && (
              <>
                {" "}
                <button type="button" onClick={deleteBuddyHandler}>
                  Confirm
                </button>
                <button onClick={removeModal}>Close</button>
                {props.error && <p className="error">{props.error}</p>}
                {props.success && <p className='success'>{props.success}</p>}
              </>
            )}
            {props.loading && <p>Loading...</p>}
          </div>
        </div>
      </div>
    </CSSTransition>,
    document.getElementById("root")
  );
};

export default Modal;
