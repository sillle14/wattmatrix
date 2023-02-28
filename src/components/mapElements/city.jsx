import { houseCosts } from '../../static/cities'
import { regionColors } from '../../static/regions'
import { playerColors } from '../../static/playerColors'
import House from './house'

export default function City ({data, inPlay, selected, usePointer, selectCity, houses}) {
    const fill = inPlay ? regionColors[data.region] : 'lightgrey'
    const style = { overflow: 'visible' }
    if (selected) {
        style.outline = '5px solid orangered'
    }
    const textCursor = usePointer ? 'pointer' : 'default'

    const houseComps = houses.map((playerID, idx) => {
        return playerID ? <House pos={houseCosts[idx]} fill={playerColors[playerID].houseBackground} key={idx}/> : null
    })

    return <svg 
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
        {houseComps}
    </svg>
}