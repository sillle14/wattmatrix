import { cityPositions, subCityRadius } from '../../static/cities'

const houseClip = "polygon(50% 15%, 80% 33%, 80% 75%, 20% 75%, 20% 33%)"

export default function House({pos, fill}) {
    return <circle 
        cx={cityPositions[pos].x}
        cy={cityPositions[pos].y}
        r={subCityRadius}
        clipPath={houseClip}
        fill={fill}
    ></circle>
}