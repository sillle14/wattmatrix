import { Lobby } from 'boardgame.io/react'
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { WattMatrix } from './Game'
import { WattMatrixTable } from './components/board'
import WattMatrixClient from './App'

import './components/styles/lobby.css'
import './index.css'

const NO_LOBBY = process.env.REACT_APP_NO_LOBBY
const container = document.getElementById('root');
const root = createRoot(container);

if (NO_LOBBY) {
  // Code for local deployment no lobby both players on one screen, no seperate server.
  root.render(
    <StrictMode>
      {/* <WattMatrixClient playerID={null}/> */}
      <WattMatrixClient playerID='0'/>
      <WattMatrixClient playerID='1'/>
      <WattMatrixClient playerID='2'/>
    </StrictMode>
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
  root.render(
    <StrictMode>
      <Lobby
        gameServer={SERVER}
        lobbyServer={SERVER}
        gameComponents={[{game: WattMatrix, board: WattMatrixTable}]}
      />
    </StrictMode>
  )
}
