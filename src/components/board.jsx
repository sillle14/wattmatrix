import { Component } from 'react';
import { Tab, Tabs } from '@material-ui/core/'

import { 
    BUREAUCRACY, 
    CITY, 
    COIL_STAGE, 
    DISCARD_PP, 
    MAP, 
    MARKETS, 
    REFERENCE, 
    RESOURCE, 
    REGIONS 
} from '../gameStructure'
import { Logs } from './logs'
import { Players, Player}  from './players'
import { TabLabel, TabPanel } from './tabHelpers'
import ActionBar from './actions'
import Map from './map'
import Market from './market'
import Reference from './reference'
import ResourceMarket from './resourceMarket'

import './styles/board.css'

export class WattMatrixTable extends Component {

    constructor(props) {
        super(props)
        this.playerMap = {}
        console.log(this.props.matchData)
        if (this.props.matchData) {
            for (let i = 0; i < this.props.matchData.length; i ++) {
                if (this.props.matchData[i].name) {
                    // Limit to 10 characters
                    this.playerMap[this.props.matchData[i].id] = this.props.matchData[i].name.slice(0, 10)
                } else {
                    this.playerMap[this.props.matchData[i].id] = 'Player ' + i
                }
            }
        } else {
            for (let i = 0; i < this.props.ctx.numPlayers; i ++) {
                this.playerMap[i] = 'Player ' + i
            }
        }
        this.state = {tab: MAP}
        this.switchToTab = this.switchToTab.bind(this)
    }

    switchToTab(newTab) {
        this.setState({tab: newTab})
    }

    render () {
        // Preliminary calculations
        // It is the players turn if they are the current player and there are no active players, or it's bureaucracy and no one is active.
        const notPowered = !!this.props.playerID && !this.props.G.players[this.props.playerID].bureaucracy.hasPowered
        const myTurn = (
            (this.props.playerID === this.props.ctx.currentPlayer && !this.props.ctx.activePlayers) ||
            (this.props.ctx.phase === BUREAUCRACY && notPowered)
        )
        const discardStage = this.props.ctx.activePlayers && Object.values(this.props.ctx.activePlayers).includes(DISCARD_PP)
        const tabs = [MAP, MARKETS, REFERENCE].map(
            (tab) => {
                const warning = myTurn && this.state.tab !== tab && this.props.G.tab === tab
                return <Tab classes={warning ? {root: 'alert-tab'} : {}} key={tab} icon={<TabLabel label={tab} warning={warning}/>} value={tab}/>
            }
        )
        // Player PPs are clickable if they are in the discard phase or if it is bureaucracy and they haven't yet powered.
        const playerPPClickable = (discardStage && this.props.playerID in this.props.ctx.activePlayers) || 
            (this.props.ctx.phase === BUREAUCRACY 
                && notPowered
                && this.props.ctx.activePlayers[this.props.playerID] !== COIL_STAGE)
        return (
            <div className="board">
                <div className="main" id={'main-' + (this.props.playerID || 'spec')}>
                    <Tabs className="tabs" value={this.state.tab} onChange={(e, tab) => {this.switchToTab(tab)}} centered>{tabs}</Tabs>
                    <TabPanel tab={MAP} currentTab={this.state.tab}>
                        <Map 
                            cityStatus={this.props.G.cityStatus}
                            selectedCities={Object.keys(this.props.G.selectedCities)}
                            myTurn={myTurn}
                            cityPhase={this.props.ctx.phase === CITY}
                            selectCity={this.props.moves.selectCity}
                            rerender={this.props.G.rerender}
                            pickRegions={this.props.ctx.phase === REGIONS}
                            selectRegion={this.props.moves.selectRegion}
                            regions={this.props.G.regions}
                        />
                    </TabPanel>
                    <TabPanel tab={MARKETS} currentTab={this.state.tab}>
                        <Market 
                            powerplantMarket={this.props.G.powerplantMarket} 
                            selected={this.props.G.auction.selected}
                            upForAuction={this.props.G.auction.upForAuction}
                            selectPowerplant={this.props.moves.selectPowerplant}
                            myTurn={myTurn}
                            step={this.props.G.step}
                            currentBid={this.props.G.auction.currentBid}
                        /><hr/>
                        <ResourceMarket 
                            resourceMarket={this.props.G.resourceMarket}
                            selectResource={this.props.moves.selectResource}
                            clickable={myTurn && this.props.ctx.phase === RESOURCE}
                            selectedResources={this.props.G.selectedResources}
                        />
                    </TabPanel>
                    <TabPanel tab={REFERENCE} currentTab={this.state.tab}>
                        <Reference 
                            numPlayers={this.props.ctx.numPlayers} 
                            step={this.props.G.step}
                            playerOrder={this.props.G.playerOrder}
                            playerMap={this.playerMap}
                        /><hr/>
                        <Players 
                            players={this.props.G.players} 
                            playerMap={this.playerMap} 
                        />
                    </TabPanel>
                </div>
                <div className="sidebar">
                    {!!this.props.playerID ? <Player 
                        player={this.props.G.players[this.props.playerID]} 
                        playerID={this.props.playerID} 
                        playerMap={this.playerMap}
                        selectPP={discardStage ? this.props.moves.selectToDiscard : this.props.moves.selectToPower}
                        selectedPP={discardStage && this.props.ctx.activePlayers[this.props.playerID] ? this.props.G.auction.toDiscard : null}
                        clickablePP={playerPPClickable}
                    /> : null}
                    <Logs logs={this.props.G.logs} playerMap={this.playerMap} playerID={this.props.playerID}/>
                </div>
                <ActionBar
                    // Basic
                    currentPlayer={this.props.ctx.currentPlayer}
                    playerID={this.props.playerID}
                    player={this.props.G.players[this.props.playerID]} 
                    playerMap={this.playerMap}
                    playerStages={this.props.ctx.activePlayers}
                    phase={this.props.ctx.phase}
                    firstTurn={this.props.G.firstTurn}
                    budget={!!this.props.playerID && this.props.G.players[this.props.playerID].money}
                    pass={this.props.moves.pass}
                    gameover={this.props.ctx.gameover}

                    // Pick regions
                    regions={this.props.G.regions}
                    clearRegions={this.props.moves.clearRegions}
                    confirmRegions={this.props.moves.confirmRegions}

                    // Auction
                    selectedPP={this.props.G.auction.selected}
                    upForAuction={this.props.G.auction.upForAuction}
                    startBidding={this.props.moves.startBidding}
                    makeBid={this.props.moves.makeBid}
                    currentBid={this.props.G.auction.currentBid}
                    passBid={this.props.moves.passBid}
                    passBuyPP={this.props.moves.passBuyPP}
                    // Discard after buy
                    toDiscard={this.props.G.auction.toDiscard}
                    discardPP={this.props.moves.discardPP}
                    discardResources={this.props.moves.discardResources}
                    extraCoal={this.props.G.extraCoal}
                    extraOil={this.props.G.extraOil}
                    
                    // Buy cities
                    selectedCities={this.props.G.selectedCities}
                    connectionCost={this.props.G.connectionCost}
                    clearCities={this.props.moves.clearCities}
                    buyCities={this.props.moves.buyCities}

                    // Buy resources
                    selectedResources={this.props.G.selectedResources}
                    resourceCost={this.props.G.resourceCost}
                    clearResources={this.props.moves.clearResources}
                    buyResources={this.props.moves.buyResources}

                    // Bureaucracy
                    passPowering={this.props.moves.passPowering}
                    clearToPower={this.props.moves.clearToPower}
                    power={this.props.moves.power}
                    spendCoil={this.props.moves.spendCoil}
                />
            </div>
        )
    }
}