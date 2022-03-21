import { useState } from 'react';
const NewUserWelcome = (props) => { 
    const [colorsList, setColorsList] = useState(['rgb(201, 175, 147)', 'rgb(57, 246, 193)', 'rgb(181, 239, 126)', 'rgb(57, 238, 165)', 'rgb(186, 50, 125)', 'rgb(28, 172, 81)', 'rgb(87, 255, 53)', 'rgb(211, 159, 207)', 'rgb(23, 231, 233)'])

    const colorifyHeading = () => {
      const header = 'Astrochat';
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
           <h1>Welcome to <span>{colorifyHeading()}</span>!</h1>
           <p>To start, click the <button>Add a Buddy</button> located at the bottom of your Buddies list and type in the name of the friend you'd like to chat with!</p>
           <p>If you don't have any other screennames yet, go ahead and add ChattyCathy to get started!</p>

        </div>
      </div>
      )
}

 export default NewUserWelcome;