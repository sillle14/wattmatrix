import { regionColors } from '../../static/regions'

export default function City ({data, inPlay, selected, usePointer}) {
    const fill = inPlay ? regionColors[data.region] : 'lightgrey'
    const style = { overflow: 'visible' }
    if (selected) {
        style.outline = '5px solid orangered'
    }

    return <svg 
        viewBox="0 0 100 100" 
        height="100" 
        width="100" 
        style={style}
        x={data.x} y={data.y} 
        className={'node' + (usePointer ? ' city-selectable' : '')} 
        cursor={usePointer ? 'pointer' : 'auto'
    }>
        <circle cx="50" cy="50" r="50" fill={fill}/>
        <use xlinkHref="#city-slots"/>
        <text textAnchor="middle" x="50" y="87" fontSize="22" cursor="default">{data.id}</text>
    </svg>
}