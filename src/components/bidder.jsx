import React from 'react'
import { Button } from '@material-ui/core'

import './styles/bidder.css'

/**
 * Control element for bidding on powerplants
 */
export class Bidder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {bid: parseInt(props.currentBid) + 1};
  
        this.handleChange = this.handleChange.bind(this);
    }
  
    handleChange(event) {
        // Only allow numbers.
        this.setState({bid: event.target.value.replace(/\D/,'')})
    }
  
    render() {
        const validBid = this.state.bid > this.props.currentBid && this.state.bid <= this.props.maxBid
        const passAllowed = this.props.currentBid >= this.props.powerplant
        return (
            <div className="bidder">
                <span>{`Bid more than ${this.props.currentBid} on PP ${this.props.powerplant} ${passAllowed ? 'or pass.' : ''}`}</span>
                <input type="text" value={this.state.bid} onChange={this.handleChange}/>
                <Button color="secondary" variant="contained" disabled={validBid ? '' : 'disabled'} onClick={() => this.props.makeBid(this.state.bid)}>{`Bid ${this.state.bid}`}</Button>
                <Button color="secondary" variant="contained" disabled={passAllowed ? '' : 'disabled'} onClick={() => this.props.pass()}>Pass</Button>
            </div>
        )
    }
}