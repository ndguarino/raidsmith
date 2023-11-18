const shortName = "whm";
const longName = "White Mage";
const role = "healer";

const resources = [
    {
        id: "lily",
        name: "Lilybell",
        startWith: 0,
        max: 3,
        gainEvery: 20,
        onImage: "/icons/whm/lily_on.png",
        offImage: "/icons/whm/lily_off.png",
    }
]

const actions = [
    {
        id: "asylum",
        name: "Asylum",
        image: "https://xivapi.com/i/002000/002632.png",
        type: "heal",
        duration: 24,
        recast: 90,
        potencyPerTick: 100,
    },
    {
        id: "liturgy",
        name: "Liturgy of the Bell",
        image: "https://xivapi.com/i/002000/002649.png",
        type: "heal",
        duration: 20,
        recast: 180,
        potencyOnHit: 400,
        potencyOnHitCharges: 5,
        potencyOnResolve: 200,
    },
    {
        id: "temperance",
        name: "Temperance",
        image: "https://xivapi.com/i/002000/002645.png",
        type: "mitigation",
        duration: 20,
        recast: 120,
        mitigationPercent: 10,
        healPotencyPercent: 20
    },
]

export default {
    shortName,
    longName,
    role,
    resources,
    actions
}