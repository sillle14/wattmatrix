import { Fragment } from 'react'
import { cityPositions, subCityRadius } from '../../static/cities'


export default function CitySlotsDef() {
    const slots = Object.entries(cityPositions).map(([cost, pos]) => {
        return <Fragment key={cost}>
            <circle cx={pos.x} cy={pos.y} r={subCityRadius} fill="lightgrey" stroke="black"></circle>
            <text x={pos.x} y={pos.y} cursor="default" textAnchor="middle" fill="black" alignmentBaseline="central" fontSize="21">
                {cost}
            </text>
        </Fragment>
    })

    return <symbol id="city-slots">{slots}</symbol>
}