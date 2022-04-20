import { useState } from 'react';
const NewUserWelcome = (props) => { 
    const [colorsList, setColorsList] = useState(['rgba(3,152,65,255)', 'rgba(240,123,10,255)', 'rgba(242,8,112,255)', 'rgba(3,158,212,255)', 'rgba(3,152,65,255)', 'rgba(240,123,10,255)', 'rgba(242,8,112,255)', 'rgb(23, 231, 233)', 'rgba(3,152,65,255)', 'rgba(3,158,212,255)'])

    const colorifyHeading = () => {
      const header = 'Astrochat!';
      const colorHeader =[]
      for(let i=0; i<=header.length; i++) {
          colorHeader.push(<span style={{'color' : colorsList[i]}}>{header[i]}</span>)
      }
      return colorHeader
    }
    colorifyHeading()

    
    return (
      <div className='new-user-welcome-container'>  
        <div className='new-user-header'>
        {localStorage.getItem('username')}
          - Instant Message
          <ul className="new-user-header__links">
            <li className="new-user-header__minimize">_</li>
            <li className="new-user-header__maximize">[ ]</li>
            <li className="new-user-header__close">&times;</li>
          </ul>
        </div>
        <div className='new-user-body'>
           <h1>Welcome to <span>{colorifyHeading()}</span></h1>
           <p>To start, click the <button>Add a Buddy</button> located at the bottom of your Buddies list and type in the name of the friend you'd like to chat with!
           <p>Feel free to add <strong>ChattyCathy</strong> to get started!</p>
           </p>   
        </div>
      </div>
      )
}

 export default NewUserWelcome;