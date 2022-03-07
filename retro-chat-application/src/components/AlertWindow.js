const AlertWindow = (props) => { 
    return(props.trigger) ? (
        <div className='popup'>
            <div className='popup-inner'>
                <button>close</button>
                {props.children}
            </div>
        </div>
    ) : ""
}  

export default AlertWindow;