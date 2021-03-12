import { Lobby } from 'boardgame.io/react'
import React from 'react'
import ReactDOM from 'react-dom'

import { WattMatrix } from './Game'
import { WattMatrixTable } from './components/board'
import WattMatrixClient from './App'

import './components/styles/lobby.css'
import './index.css'

const NO_LOBBY = process.env.REACT_APP_NO_LOBBY

if (NO_LOBBY) {
  // Code for local deployment no lobby both players on one screen, no seperate server.
  ReactDOM.render(
    <React.StrictMode>
      {/* <WattMatrixClient playerID={null}/> */}
      <WattMatrixClient playerID='0'/>
      <WattMatrixClient playerID='1'/>
      <WattMatrixClient playerID='2'/>
    </React.StrictMode>,
    document.getElementById('root')
  );
} else {
  const ENV = process.env.REACT_APP_ENV

  let SERVER
  if (ENV === 'dev') {
    SERVER = `http://${window.location.hostname}:8000`  // Local
  } else {
    SERVER = `https://${window.location.hostname}` // Prod
  }

  // Render the lobby. This relies on a running server.
  ReactDOM.render(
    <React.StrictMode>
      <Lobby
        gameServer={SERVER}
        lobbyServer={SERVER}
        gameComponents={[{game: WattMatrix, board: WattMatrixTable}]}
      />
    </React.StrictMode>,
    document.getElementById('root')
  )
}
