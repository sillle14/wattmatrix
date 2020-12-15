import { GraphView } from 'react-digraph'
import React from 'react'

import { cities, houseCosts } from '../static/cities'
import { edges } from '../static/edges'
import { playerColors } from '../static/playerColors'

import './styles/map.css'

const regionColors = {
    northwest: '#f2bfff',
    southwest: '#42e6f5',
    texas: '#ffa699',
    midwest: '#f8ff94',
    southeast: '#9beba1',
    northeast: '#e8c87d',
}

const EdgeTypes = {
    edge: { 
        shapeId: "#edge",
        shape: (
            <symbol viewBox="0 0 50 50" id="edge" key="0">
            <circle cx="25" cy="25" r="4" stroke="lightgrey" fill="currentColor"> </circle>
            </symbol>
        )
    }
}

function City() {
    const cityPosition = {
        10: {x: 50, y: 23},
        15: {x: 25, y: 52},
        20: {x: 75, y: 52}
    }

    const innerRadius = 18

    const houseClip = "polygon(50% 15%, 80% 33%, 80% 75%, 20% 75%, 20% 33%)"

    return (
        <symbol viewBox="0 0 100 100" id="city" key="0" height="100" width="100">
            <circle cx="50" cy="50" r="50" style={{fill: "var(--region-color)"}}></circle>
            <circle cx={cityPosition[10]['x']} cy={cityPosition[10]['y']} r={innerRadius} fill="lightgrey" stroke="black"></circle>
            <text x={cityPosition[10]['x']} y={cityPosition[10]['y']} textAnchor="middle" fill="black" alignmentBaseline="central" fontSize="21">10</text>
            <circle cx={cityPosition[15]['x']} cy={cityPosition[15]['y']} r={innerRadius} fill="lightgrey" stroke="black">20</circle>
            <text x={cityPosition[15]['x']} y={cityPosition[15]['y']} textAnchor="middle" fill="black" alignmentBaseline="central" fontSize="21">15</text>
            <circle cx={cityPosition[20]['x']} cy={cityPosition[20]['y']} r={innerRadius} fill="lightgrey" stroke="black">15</circle>
            <text x={cityPosition[20]['x']} y={cityPosition[20]['y']} textAnchor="middle" fill="black" alignmentBaseline="central" fontSize="21">20</text>

            <circle 
                cx={cityPosition[10]['x']}
                cy={cityPosition[10]['y']}
                r={innerRadius}
                clipPath={houseClip}
                style={{display: "var(--house-10-display)", fill: "var(--house-10-color"}}
            ></circle>
             <circle 
                cx={cityPosition[15]['x']}
                cy={cityPosition[15]['y']}
                r={innerRadius}
                clipPath={houseClip}
                style={{display: "var(--house-15-display)", fill: "var(--house-15-color"}}
            ></circle>
            <circle 
                cx={cityPosition[20]['x']}
                cy={cityPosition[20]['y']}
                r={innerRadius}
                clipPath={houseClip}
                style={{display: "var(--house-20-display)", fill: "var(--house-20-color"}}
            ></circle>
        </symbol>
    )
}

const NODE_KEY = "id"       // Allows D3 to correctly update DOM
const doNothing = () => {}
const renderDefs = () => <defs><City></City></defs>
// I want this text to be on top of edges...https://github.com/uber/react-digraph/issues/213
const renderNodeText = (data, id, isSelected) => {
    return (
        <text textAnchor="middle">
            <tspan x="0" dy="36" fontSize="20">{data.id}</tspan>
        </text>
    )
}

const regions = {
    northwest: 'M -10 -60 L 750 -60 L 775 100 L 1040 230 L 1040 325 L 660 420 L 510 255 L -50 255 ' +
               ' L -55 220 Q -45 110 -55 -20 L 50 0 Z',
    southwest: 'M -50 265 L 505 265 L 657 432 L 850 382 L 830 800 q -10 0 -20 15 l -40 -20 l -3 -15 ' +
               'l -45 -45 l -50 0 l 0 18 l -175 0 l -150 -65 L 250 700 L 100 625 L 0 500 l -40 -60 c 0 0 10 -55 -20 -75 ' +
               'l 18 -65 Z',
    texas: 'M 860 380 L 1040 335 L 1125 430 L 1395 610 L 1400 780 l -200 0 L 1010 800 l -20 80 ' +
           'l -6 0 q -15 35 0 70 l -30 -10 c -5 -10 0 0 -50 -50 c -30 -45 0 -80 -62 -93 Z',
    midwest: 'M 760 -60 l 230 0 l 50 20 l 10 -7 l 20 12 l 100 5 L 1160 20 l 320 0 l 0 20 l -120 10 ' +
             'c -30 75 -60 150 -10 200 L 1700 480 L 1400 600 L 1138 425 L 1050 330 L 1050 225 L 780 90 Z',
    southeast: 'M 1405 610 L 1410 780 l 80 0 l 30 20 l 30 -20 L 1600 850 l 50 100 a 50 100 -30 0 0 100 30 ' +
               'l 0 -60 L 1680 780 C 1650 700 1700 700 1815 595 L 1860 500 l 10 -60 L 1750 510 L 1707 485 Z',
    northeast: 'M 1370 255 L 1750 500 L 1875 425 l -20 -50 L 1960 270 L 2040 260 L 2020 200 l 75 -120 ' +
               'l -30 -30 l -10 -40 l -30 0 l -10 80 l -130 0 l -60 30 l 0 30 L 1500 240 l 20 -50 l -5 -50 l -20 5 ' +
               'q -30 12 -10 -15 l 10 -10 l 0 -40 l -40 -20 l -50 50 l -10 135 Q 1380 260 1370 255'
}



export default class Map extends React.Component {

    constructor(props) {
        super(props);
        this.renderNode = this.renderNode.bind(this)
        this.renderBackground = this.renderBackground.bind(this)
        this.graphView = React.createRef()
        this.state = {layoutEngineType: 0}
    }

    renderNode (nodeRef, data, index, selected, hovered) {
        let style = {'--region-color': this.props.regions.includes(data.region) ? regionColors[data.region] : 'lightgrey'}
        const citySelected = this.props.selectedCities.includes(data.id) && this.props.myTurn
        if (citySelected) {
            style['outline'] = '5px solid orangered'
        }

        for (let i = 0; i < houseCosts.length; i ++) {
            const playerID = this.props.cityStatus[data.id][i]
            const houseColor = (playerColors[playerID] || {}).houseBackground
            style['--house-' + houseCosts[i] + '-display'] = houseColor === undefined ? 'none' : 'default'
            style['--house-' + houseCosts[i] + '-color'] = houseColor
        }

        let usePointer = this.props.myTurn && this.props.cityPhase && this.props.regions.includes(data.region)

        return (
            <use 
                x="-50" 
                y="-50" 
                xlinkHref="#city" 
                className={'node' + (usePointer ? ' city-selectable' : '')} 
                style={style} 
                cursor={usePointer ? 'pointer' : 'auto'}
            />
        )
    }

    renderBackground = (gridSize) => {
        let regionPaths = []
        for (const region in regions) {
            regionPaths.push(<path
                key={region}
                d={regions[region]} 
                fill={this.props.regions.includes(region) ? regionColors[region] : 'lightgrey'} 
                fillOpacity="0.3" 
                stroke={this.props.regions.includes(region) ? regionColors[region] : 'grey'} 
                strokeWidth="4"
                cursor={this.props.pickRegions && this.props.myTurn ? 'pointer' : 'auto'}
                onClick={() => this.props.selectRegion(region)}
            />)
        }
        return <g>{regionPaths}</g>
    }

    componentDidUpdate(prevProps) {
        // If the activation bit has flipped, rerender the required nodes.
        // See https://stackoverflow.com/a/37950970/6561382 for how the ref works
        // See https://github.com/uber/react-digraph/blob/master/src/components/graph-view.js#L1251 for asyncRenderNode
        if (prevProps.rerender.activate !== this.props.rerender.activate) {
            for (let i = 0; i < this.props.rerender.cities.length; i++) {
                this.graphView.current.asyncRenderNode(cities[this.props.rerender.cities[i]])
            }
        }
    }

    render() {
        return (
        <div name="map" className="graph">
            
            <GraphView  
                readOnly={true}
                nodeKey={NODE_KEY}
                edgeArrowSize={0}
                edgeHandleSize={150}
                showGraphControls={false}
                nodes={this.props.pickRegions ? [] : Object.values(cities)}
                edges={edges}
                edgeTypes={EdgeTypes}
                renderNode={this.renderNode}
                renderNodeText={renderNodeText}
                renderDefs={renderDefs}
                renderBackground={this.renderBackground}
                initialBBox={{x: 0, y: 0, width: 2000, height: 1000}}
                onSelectNode={node => {if (node) {this.props.selectCity(node.id)}}}
                ref={this.graphView} 

                // Not needed
                selected={{}}
                nodeTypes={{}}
                nodeSubtypes={{}}
                onUpdateNode={doNothing}
                onDeleteNode={doNothing}
                onSelectEdge={doNothing}
                onCreateEdge={doNothing}
                onSwapEdge={doNothing}
                onDeleteEdge={doNothing}
            />
        </div>
        );
    }

}