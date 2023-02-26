import { regionColors } from '../../static/regions'

export default function City ({data, inPlay, selected, usePointer}) {
    let style = {'--region-color': inPlay ? regionColors['northwest'] : 'lightgrey'}
    if (selected) {
        style['outline'] = '5px solid orangered'
    }

    return (
        // <use 
        //     x="-50" 
        //     y="-50" 
        //     xlinkHref="#city" 
        //     className={'node' + (usePointer ? ' city-selectable' : '')} 
        //     style={style} 
        //     cursor={usePointer ? 'pointer' : 'auto'}
        // />
        <svg viewBox="0 0 100 100" height="100" width="100" x={data.x} y={data.y} className={'node' + (usePointer ? ' city-selectable' : '')} style={style} cursor={usePointer ? 'pointer' : 'auto'}>
            <circle cx="50" cy="50" r="50" style={{fill: "var(--region-color)"}}/>
            <use xlinkHref="#city-slots"/>
            <text textAnchor="middle" x="50" y="87" fontSize="20">{data.id}</text>
        </svg>
    )
}