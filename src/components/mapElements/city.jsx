import { regionColors } from '../../static/regions'

export default function City ({data, inPlay, selected, usePointer, selectCity}) {
    // TODO: Add houses
    const fill = inPlay ? regionColors[data.region] : 'lightgrey'
    const style = { overflow: 'visible' }
    if (selected) {
        style.outline = '5px solid orangered'
    }
    const textCursor = usePointer ? 'pointer' : 'default'

    return <svg 
        viewBox="0 0 100 100" 
        height="100"
        width="100" 
        style={style}
        x={data.x} y={data.y} 
        cursor={usePointer ? 'pointer' : 'auto'}
        onClick={() => selectCity(data.id)}
    >
        <circle cx="50" cy="50" r="50" fill={fill}/>
        <use xlinkHref="#city-slots"/>
        <text textAnchor="middle" x="50" y="87" fontSize="22" cursor={textCursor}>{data.id}</text>
    </svg>
}