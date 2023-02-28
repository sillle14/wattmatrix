import { INVALID_MOVE } from 'boardgame.io/core'

// TODO: Const for regions
const regionGraph = {
    northeast: ['midwest', 'southeast'],
    midwest: ['northeast', 'southeast', 'texas', 'northwest'],
    southeast: ['northeast', 'midwest', 'texas'],
    texas: ['midwest', 'southeast', 'northwest', 'southwest'],
    southwest: ['texas', 'northwest'],
    northwest: ['midwest', 'texas', 'southwest']
}

function checkConnected(regions) {
    let regionSet = new Set()
    regionSet.add(regions[0])
    for (let i = 0; i < regions.length; i++) {
        if (!regionSet.has(regions[i])) {
            return false
        }
        for (let j = 0; j < regionGraph[regions[i]].length; j++) {
            regionSet.add(regionGraph[regions[i]][j])
        }
    }
    return true
}

export function selectRegion({G}, region) {
    // If already selected, unselect.
    if (G.regions.includes(region)) {
        G.regions.splice(G.regions.indexOf(region), 1)
        if (!checkConnected(G.regions)) {
            return INVALID_MOVE
        }
    } else {
        G.regions.push(region)
        if (!checkConnected(G.regions)) {
            return INVALID_MOVE
        }
    }
}

export function clear({G}) {
    G.regions = []
}

export function confirm({G, events}) {
    G.logs.push({move: 'selectRegions', regions: G.regions})
    events.endPhase()
}