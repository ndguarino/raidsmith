const shortName = "rpr";
const longName = "Reaper";
const role = "DPS";

const resources = [
]

const actions = [
    {
        id: "crest",
        name: "Arcane Crest",
        image: "https://xivapi.com/i/003000/003632.png",
        type: "heal",
        duration: 15,
        recast: 30,
        potency: 0,
        potencyPerTick: 50,
    },
    {
        id: "feint",
        name: "Feint",
        image: "https://xivapi.com/i/000000/000828.png",
        type: "mitigation",
        duration: 10,
        recast: 90,
        mitigationPercentPhysical: 10,
        mitigationPercentMagical: 5
    },
    {
        id: "wind",
        name: "Second Wind",
        image: "https://xivapi.com/i/000000/000405.png",
        type: "heal",
        duration: 0,
        recast: 120,
        potency: 500
    }
]

export default {
    shortName,
    longName,
    role,
    resources,
    actions
}