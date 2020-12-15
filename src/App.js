import { applyMiddleware } from 'redux'
import { Client } from 'boardgame.io/react'
import { SocketIO } from 'boardgame.io/multiplayer'
import logger from 'redux-logger'

import { WattMatrix } from './Game'
import { WattMatrixTable } from './components/board'

// NOTE: Local multiplayer seems to mess up moves (they are taken twice)
const WattMatrixClient = Client({
    game: WattMatrix,
    board: WattMatrixTable, 
    debug: false, 
    multiplayer: SocketIO({ server: 'localhost:8000' }),
    enhancer: applyMiddleware(logger),
    numPlayers: 3
});

export default WattMatrixClient;
