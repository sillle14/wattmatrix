import { cities } from "../../static/cities"

export default function Edge({edge}) {
    const start = cities[edge.source]
    const end = cities[edge.target]

    const position = { x: Math.min(start.x, end.x) - 25, y: Math.min(start.y, end.y) - 25 }
    // For upward pointing edges, we need to reverse the y coordinates of the line.
    const reverse = (end.x - start.x) * (end.y - start.y) < 0
    const vert = Math.abs(end.y - start.y)
    const dest = { x: Math.abs(end.x - start.x), y: reverse ? 0 : vert }
    const height = vert + 100
    const width = Math.abs(end.x - start.x) + 100
    const origin = { x: 0, y : reverse ? vert : 0 }

    const costLabel = edge.length ? <svg 
        x={(start.x + end.x) / 2} 
        y={(start.y + end.y) / 2} 
        viewBox="-50 -50 100 100" 
        height={100} width={100}
    >
        <circle 
            r={20} 
            stroke="lightgrey" 
            fill="white"
            strokeWidth={5}
            transformOrigin="50% 50%"
        />
        <text 
            cursor="default" 
            textAnchor="middle" 
            fill="black" 
            alignmentBaseline="central" 
            fontSize="25"
            fontWeight="bold"
        >
            {edge.length}
        </text>
    </svg> : null

    return <>
        <svg viewBox={`-50 -50 ${width - 50} ${height - 50}`} height={height} width={width} x={position.x} y={position.y}>
            <line x1={origin.x} y1={origin.y} x2={dest.x} y2={dest.y} stroke="grey" strokeWidth={6} />
        </svg>
        {costLabel}
    </>
}