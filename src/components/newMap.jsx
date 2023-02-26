import { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { ReactSVGPanZoom, INITIAL_VALUE, fitToViewer, ALIGN_LEFT, ALIGN_TOP } from 'react-svg-pan-zoom';


import { cities } from '../static/cities'
import { edges } from '../static/edges'
import { playerColors } from '../static/playerColors'
import City from './mapElements/city';
import CitySlotsDef from './mapElements/citySlotsDef';
import Regions from './mapElements/regions';


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

const innerRadius = 18

function CitySpace({x, y, cost}) {
    return <>
        <circle cx={x} cy={y} r={innerRadius} fill="lightgrey" stroke="black"></circle>
        <text x={x} y={y} textAnchor="middle" fill="black" alignmentBaseline="central" fontSize="21">{cost}</text>
    </>
}

const cityPosition = {
    10: {x: 50, y: 23},
    15: {x: 25, y: 52},
    20: {x: 75, y: 52}
}

function CityDef() {
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
const doNothing = () => {}
// I want this text to be on top of edges...https://github.com/uber/react-digraph/issues/213
const renderNodeText = (data, id, isSelected) => {
    return (
        <text textAnchor="middle">
            <tspan x="0" dy="36" fontSize="20">{data.id}</tspan>
        </text>
    )
}

export default function Map({regions, pickRegions, myTurn, selectRegion}) {
    const Viewer = useRef(null);
    const GraphRef = useRef(null)

    const [dims, setDims] = useState([400, 400])
    const [value, setValue] = useState(INITIAL_VALUE)

    function handleResize() {
        if (GraphRef.current === null) { return }

        setDims([GraphRef.current.clientWidth, GraphRef.current.clientHeight])
        // Because the `fitToViewer` function on the ref uses the refs value which hasn't updated yet at this point,
        //  we need to manually call the utility with the new values.
        // Note that this means that the we rescale the view after each window resize, but that seems good.
        const nextValue = fitToViewer({
            ...Viewer.current.getValue(), 
            viewerHeight: GraphRef.current.clientHeight, 
            viewerWidth: GraphRef.current.clientWidth
        }, ALIGN_LEFT, ALIGN_TOP);
        Viewer.current.setValue(nextValue);
    }

    useLayoutEffect(() => {
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        // Handle resize once on load.
        handleResize()
    }, [])

    return <div className="graph" ref={GraphRef}>
        <ReactSVGPanZoom
            ref={Viewer}
            width={dims[0]} height={dims[1]}
            detectAutoPan={false}
            background="white"
            tool="auto"
            value={value}
            onChangeTool={doNothing}
            onChangeValue={setValue}
            miniatureProps={{position: 'none'}}
            toolbarProps={{position: 'none'}}
            disableDoubleClickZoomWithToolAuto={true}
            scaleFactor={1.01}
            scaleFactorOnWheel={1.03}
        >
        <svg viewBox="-150 -150 2300 1000">
            <defs><CitySlotsDef/></defs>
            <Regions activeRegions={regions} pickable={pickRegions && myTurn} selectRegion={selectRegion}/>
            <City data={cities['Seattle']} inPlay={true} selected={false} usePointer={false}/>
        </svg>
      </ReactSVGPanZoom>
    </div>
}



// class OldMap extends Component {

//     constructor(props) {
//         super(props);
//         this.renderNode = this.renderNode.bind(this)
//         this.renderBackground = this.renderBackground.bind(this)
//         this.graphView = createRef()
//         this.state = {layoutEngineType: 0}
//     }

//     renderNode (nodeRef, data, index, selected, hovered) {
//         let style = {'--region-color': this.props.regions.includes(data.region) ? regionColors[data.region] : 'lightgrey'}
//         const citySelected = this.props.selectedCities.includes(data.id) && this.props.myTurn
//         if (citySelected) {
//             style['outline'] = '5px solid orangered'
//         }

//         for (let i = 0; i < houseCosts.length; i ++) {
//             const playerID = this.props.cityStatus[data.id][i]
//             const houseColor = (playerColors[playerID] || {}).houseBackground
//             style['--house-' + houseCosts[i] + '-display'] = houseColor === undefined ? 'none' : 'default'
//             style['--house-' + houseCosts[i] + '-color'] = houseColor
//         }

//         let usePointer = this.props.myTurn && this.props.cityPhase && this.props.regions.includes(data.region)

//         return (
//             <use 
//                 x="-50" 
//                 y="-50" 
//                 xlinkHref="#city" 
//                 className={'node' + (usePointer ? ' city-selectable' : '')} 
//                 style={style} 
//                 cursor={usePointer ? 'pointer' : 'auto'}
//             />
//         )
//     }

//     renderBackground = (gridSize) => {
//         let regionPaths = []
//         for (const region in regions) {
//             regionPaths.push(<path
//                 key={region}
//                 d={regions[region]} 
//                 fill={this.props.regions.includes(region) ? regionColors[region] : 'lightgrey'} 
//                 fillOpacity="0.3" 
//                 stroke={this.props.regions.includes(region) ? regionColors[region] : 'grey'} 
//                 strokeWidth="4"
//                 cursor={this.props.pickRegions && this.props.myTurn ? 'pointer' : 'auto'}
//                 onClick={() => this.props.selectRegion(region)}
//             />)
//         }
//         return <g>{regionPaths}</g>
//     }

//     componentDidUpdate(prevProps) {
//         // If the activation bit has flipped, rerender the required nodes.
//         // See https://stackoverflow.com/a/37950970/6561382 for how the ref works
//         // See https://github.com/uber/react-digraph/blob/master/src/components/graph-view.js#L1251 for asyncRenderNode
//         if (prevProps.rerender.activate !== this.props.rerender.activate) {
//             for (let i = 0; i < this.props.rerender.cities.length; i++) {
//                 this.graphView.current.asyncRenderNode(cities[this.props.rerender.cities[i]])
//             }
//         }
//     }

//     render() {
//         return (
//         <div name="map" className="graph">
            
//             <GraphView  
//                 readOnly={true}
//                 nodeKey={NODE_KEY}
//                 edgeArrowSize={0}
//                 edgeHandleSize={150}
//                 showGraphControls={false}
//                 nodes={this.props.pickRegions ? [] : Object.values(cities)}
//                 edges={edges}
//                 edgeTypes={EdgeTypes}
//                 renderNode={this.renderNode}
//                 renderNodeText={renderNodeText}
//                 renderDefs={renderDefs}
//                 renderBackground={this.renderBackground}
//                 initialBBox={{x: 0, y: 0, width: 2000, height: 1000}}
//                 onSelectNode={node => {if (node) {this.props.selectCity(node.id)}}}
//                 ref={this.graphView} 

//                 // Not needed
//                 selected={{}}
//                 nodeTypes={{}}
//                 nodeSubtypes={{}}
//                 onUpdateNode={doNothing}
//                 onDeleteNode={doNothing}
//                 onSelectEdge={doNothing}
//                 onCreateEdge={doNothing}
//                 onSwapEdge={doNothing}
//                 onDeleteEdge={doNothing}
//             />
//         </div>
//         );
//     }

// }