import { cityPositions } from '../../static/cities'

const innerRadius = 18

export default function CitySlotsDef() {
    const slots = Object.entries(cityPositions).map(([cost, pos]) => {
        return <>
            <circle cx={pos.x} cy={pos.y} r={innerRadius} fill="lightgrey" stroke="black"></circle>
            <text x={pos.x} y={pos.y} textAnchor="middle" fill="black" alignmentBaseline="central" fontSize="21">{cost}</text>
        </>
    })


    return <symbol id="city-slots">{slots}</symbol>
}