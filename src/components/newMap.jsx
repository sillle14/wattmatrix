import { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { ReactSVGPanZoom, INITIAL_VALUE, fitToViewer, ALIGN_LEFT, ALIGN_TOP } from 'react-svg-pan-zoom';


import { cities } from '../static/cities'
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

export default function Map({
    regions, 
    pickRegions,
    myTurn, 
    selectRegion, 
    selectedCities, 
    selectCity, 
    cityPhase, 
    cityStatus
}) {
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

    const cityComps = Object.values(cities).map(city => {
        const inPlay = regions.includes(city.region)
        const selected = selectedCities.includes(city.id) && myTurn
        const usePointer = myTurn && cityPhase && regions.includes(city.region)
        const houses = cityStatus[city.id]
        return <City key={city.id} 
            data={city} 
            inPlay={inPlay} 
            selected={selected} 
            usePointer={usePointer}
            selectCity={selectCity}
            houses={houses}
        />
    })

    return <div className="graph" ref={GraphRef}>
        <ReactSVGPanZoom
            ref={Viewer}
            width={dims[0]} height={dims[1]}
            detectAutoPan={false}
            background="white"
            tool="auto"
            value={value}
            onChangeTool={() => {}}
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
            {pickRegions ? [] : cityComps}
        </svg>
      </ReactSVGPanZoom>
    </div>
}
