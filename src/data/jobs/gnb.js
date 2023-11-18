const shortName = "gnb";
const longName = "Gunbreaker";
const role = "tank";

const resources = [

]

const actions = [
    {
        id: "rampart",
        name: "Rampart",
        image: "https://xivapi.com/i/000000/000801.png",
        type: "mitigation",
        duration: 20,
        recast: 90,
        mitigationPercent: 20,
        mitigationTarget: "self",

    },
    {
        id: "nebula",
        name: "Nebula",
        image: "https://xivapi.com/i/003000/003412.png",
        type: "mitigation",
        duration: 15,
        recast: 120,
        mitigationPercent: 30,
        mitigationTarget: "self",
    },
    {
        id: "camouflage",
        name: "Camouflage",
        image: "https://xivapi.com/i/003000/003404.png", //16140
        type: "mitigation",
        duration: 20,
        recast: 90,
        mitigationPercent: 10,
        mitigationTarget: "self",
    },
    {
        id: "superbolide",
        name: "Superbolide",
        image: "https://xivapi.com/i/003000/003416.png",
        type: "mitigation",
        duration: 10,
        recast: 360,
        mitigationPercent: 100,
        playerHealthPercent: 1,
        mitigationTarget: "self",
    },
    {
        id: "hol",
        name: "Heart Of Light",
        image: "https://xivapi.com/i/003000/003424.png",
        type: "mitigation",
        duration: 15,
        recast: 90,
        mitigationPercent: 10,
        mitigationType:"magical", // could have this set to be assumed all unless otherwise stated for the few mits that are only magical

    },
    {
        id: "reprisal",
        name: "Reprisal",
        image: "https://xivapi.com/i/000000/000806.png",
        type: "mitigation",
        duration: 10,
        recast: 60,
        mitigationPercent: 10,
    },
    {
        id: "aurora",
        name: "Aurora",
        image: "https://xivapi.com/i/003000/003415.png",
        type: "heal",
        duration: 18,
        recast: 60,
        charges: 2,
        potencyOnHit: 0,
        potencyPerTick: 200,
        healTarget: "target", // any target for it
    },
    {
        id: "hoc",
        name: "Heart of Corundum",
        image: "https://xivapi.com/i/003000/003430.png",
        type: "mitigation",
        duration: 8,
        recast: 25,
        mitigationPercent: 15,
        mitigationTarget: "target",
    },
    {
        id: "clarity",
        name: "Clarity of Corundum",
        image: "https://xivapi.com/i/003000/003430.png",
        type: "mitigation",
        duration: 4,
        recast: 25,
        mitigationPercent: 15,
        mitigationTarget: "target",
        appliedWith: "hoc", // idea to maybe make it link to the other id so when you put hoc on a person it also adds the rest? idk jsut an idea
    },
    {
        id: "catharsis",
        name: "Catharsis of Corundum",
        image: "https://xivapi.com/i/003000/003430.png",
        type: "heal",
        duration: 20,
        recast: 25,
        ResolveOnHP: 50, //hp percent
        ResolveOnSecond: 20, //Duration it also resolves on if HP threshold isn't met
        potencyOnResolve: 900,
        healTarget: "target",
        appliedWith: "hoc",
    }


]

export default {
    shortName,
    longName,
    role,
    resources,
    actions
}