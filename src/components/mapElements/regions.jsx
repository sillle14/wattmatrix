import { regionPaths, regionColors } from "../../static/regions"

export default function Regions({activeRegions, pickable, selectRegion}) {
    const paths = Object.entries(regionPaths).map(([region, path]) => 
        <path
            key={region}
            d={path} 
            fill={activeRegions.includes(region) ? regionColors[region] : 'lightgrey'} 
            fillOpacity="0.3" 
            stroke={activeRegions.includes(region) ? regionColors[region] : 'grey'} 
            strokeWidth="4"
            cursor={pickable ? 'pointer' : 'auto'}
            onClick={() => selectRegion(region)}
        />
    )

    return <>
        {paths}
    </>
} 