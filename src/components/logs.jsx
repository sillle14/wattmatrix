import React from 'react'
import { animateScroll } from 'react-scroll'
import './styles/logs.css'
import { PlayerName, ResourceName } from './names' 
import { payment, playerSettings } from '../static/reference'

const indent = <span key="span">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>

function Log(props) {
    const log = props.log
    const playerName = <PlayerName playerID={log.playerID} playerMap={props.playerMap}/>
    let details
    switch (log.move) {
        case 'playerOrder':
            const players = log.order.map((id) => <PlayerName key={id} playerID={id} playerMap={props.playerMap}/>)
            details = [
                <span key="header" className="header">{`Setting ${log.initial ? 'Initial' : ''} Player Order:`}</span>,
                <br key="br"></br>,
                <span key="order">{indent}{players}</span>
            ]
            break
        case 'startPhase':
            details = <span className="header">{`Starting Phase: ${log.phase}`}</span>
            break
        case 'startAuction':
            details = <span>{playerName}{`starts the bidding on PP ${log.powerplant}`}</span>
            break
        case 'bid':
            details = <span>{indent}{playerName}{`bids $${log.bid}`}</span>
            break
        case 'passAuction':
            details = <span>{indent}{playerName}{' passes'}</span>
            break
        case 'discard':
            if (log.powerplant) {
                details = <span>{indent}{playerName}{` discards PP ${log.powerplant}`}</span>
            } else {
                details = <span>{indent}{playerName}{' discards '}{<ResourceName resource={log.resource} amount={log.count}/>}</span>
            }
            break
        case 'pass':
            details = <span>{playerName}{' passes'}</span>
            break
        case 'buyPP':
            details = <span>{playerName}{` buys PP ${log.powerplant} for $${log.cost}`}</span>
            break
        case 'buyCities':
            details = [
                <span key="header">{playerName}{ 'buys cities:'}</span>,
                <br key="br"></br>,
                <span key="cities">{indent}{`${log.cities.join(', ')} for $${log.cost}`}</span>,
            ]
            break
        case 'buyResources':
            let resources = []
            for (const r in log.resources) {
                if (log.resources[r] > 0) {
                    resources.push(<ResourceName key={r} resource={r} amount={log.resources[r]}/>)
                }
            }
            details = [
                <span key="header">{playerName}{ 'buys resources:'}</span>,
                <br key="br"></br>,
                <span key="order">{indent}{resources}{` for $${log.cost}`}</span>,
            ]
            break
        case 'power':
            details = [
                <span key="header">{playerName}{` powers ${log.count} cit${log.count !== 1 ? 'ies': 'y'}:`}</span>,
                <br key="br"></br>,
                <span key="earning">{indent}{`Income: $${payment[log.count]}`}</span>,
            ]
            break
        case 'refill':
            details = <span>{'Refilling '}<ResourceName resource={log.resource} amount={log.amount}/></span>
            break
        case 'step':
            details = [
                <div key="header" className="header step-header">{`---- Entering Step ${log.step} ----`}</div>,
                <br key="br"></br>,
                <span key="remove">{indent}{`Powerplant ${log.removed} is removed from the game.`}</span>
            ]
            break
        case 'removePP': 
            let reason
            if (log.allPass) {
                reason = <span key="header">All players have passed:</span>
            } else {
                reason = <span key="header">{`One player has ${log.removed} or more cities:`}</span>
            }
            details = [
                reason,
                <br key="br"></br>,
                <span key="remove">{indent}{`Powerplant ${log.removed} is removed from the game.`}</span>
            ]
            break
        case 'endGame':
            details = [<span key="header" className="header">Game over!</span>, <br key="br"></br>]
            if (log.winnerIDs.length === 1) {
                details.push(<span key="winners"><PlayerName playerID={log.winnerIDs[0]} playerMap={props.playerMap}/>{ 'wins.'}</span>)
            } else {
                const players = log.winnerIDs.map((id) => <PlayerName key={id} playerID={id} playerMap={props.playerMap}/>)
                details.push(<span key="winners">{'Tie Game. Players '}{players}{' win.'}</span>)
            }
            break
        case 'willEnd':
            details = <span>{`${playerSettings[Object.keys(props.playerMap).length].end} cities reached. Game will end after powering.`}</span>
            break
        default:
            break
    }

    return <div>{details}</div>
}

export class Logs extends React.Component {

    constructor(props) {
        super(props);
        this.bottom = React.createRef();
    }

    scrollToBottom = () => {
        animateScroll.scrollToBottom({containerId: `${this.props.playerID}-log`, duration: 0});
    }
    
    componentDidMount() { this.scrollToBottom() }

    componentDidUpdate(prevProps) { 
        if (this.props.logs.length !== prevProps.logs.length) {
            this.scrollToBottom() 
        }
    }

    render () {
        let logs = []
        for (let i = this.props.logs.length - 1; i >= 0; i--) {
            // No logs after game end.
            if (this.props.logs[i].move === 'endGame') { 
                logs = [] 
            }
            logs.push(<Log key={i} log={this.props.logs[i]} playerMap={this.props.playerMap}></Log>)
        }
    
        return (
            <div className="logs">
                <span>Game Log:</span>
                <hr className="log-break"></hr>
                <div className="scroll" id={`${this.props.playerID}-log`}>
                    {logs}
                </div>
            </div>
        )
    }
}