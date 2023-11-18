const shortName = "sch";
const longName = "Scholar";
const role = "healer";

const resources = [
    {
        id: "energy",
        name: "Aetherflow III",
        startWith: 0,
        max: 3,
        gainEvery: 20,
        onImage: "/icons/whm/lily_on.png",
        offImage: "/icons/whm/lily_off.png",
    }
]

const actions = [
    {
        id: "dissipation",
        name: "Dissipation",
        image: "https://xivapi.com/i/002000/002810.png",
        type: "mitigation",
        duration: 30,
        recast: 180,
        aetherflowCharges: 3,
        healPotencyPercentSelf: 20
    },
    {
        id: "blessing",
        name: "Fey Blessing",
        image: "https://xivapi.com/i/002000/002854.png",
        type: "heal",
        duration: 0,
        recast: 60,
        potencyOnHit: 320
    },
    {
        id: "excogitation",
        name: "Excogitation",
        image: "https://xivapi.com/i/002000/002813.png",
        type: "heal",
        duration: 45,
        recast: 45,
        aetherflowCost: 1,
        ResolveOnHP: 50,
        ResolveOnSecond: 45,
        healPotencyPercent: 20,
        healTarget: "target"
    },
    {
        id: "protraction",
        name: "Protraction",
        image: "https://xivapi.com/i/002000/002877.png",
        type: "heal",
        duration: 10,
        recast: 60,
        maxHealthPercentIncrease: 10,
        healPercentTarget: 10,
        healPotencyPercentTarget: 10,
        healTarget: "target"
    },
    {
        id: "wdawn",
        name: "Whispering Dawn",
        image: "https://xivapi.com/i/002000/002852.png",
        type: "heal",
        duration: 21,
        recast: 60,
        potencyPerTick: 80
    },
    {
        id: "illumination",
        name: "Fey Illumination",
        image: "https://xivapi.com/i/002000/002853.png",
        type: "mitigation",
        duration: 20,
        recast: 120,
        healPotencyPercent: 10,
        mitigationType: "magic",
        mitigationPercent: 5
    },
    {
        id: "expedient",
        name: "Expedient",
        image: "https://xivapi.com/i/002000/002878.png",
        type: "mitigation",
        duration: 20,
        recast: 120,
        mitigationPercent: 10
    },
    {
        id: "consolation",
        name: "Consolation",
        image: "https://xivapi.com/i/002000/002851.png",
        type: "heal",
        duration: 30,
        recast: 120,
        potencyOnHitCharges: 2,
        potencyOnHit: 250,
        potencyShield: 250
    },
    {
        id: "sacredsoil",
        name: "Sacred Soil",
        image: "https://xivapi.com/i/002000/002804.png",
        type: "mitigation",
        duration: 15,
        recast: 30,
        aetherflowCost: 1,
        potencyPerTick: 100,
        mitigationPercent: 10
    },
    {
        id: "recitation",
        name: "Recitation",
        image: "https://xivapi.com/i/002000/002822.png",
        type: "mitigation",
        duration: 15,
        recast: 90,
    },
    {
        id: "etact",
        name: "Emergency Tactics",
        image: "https://xivapi.com/i/002000/002809.png",
        type: "mitigation",
        duration: 15,
        recast: 15,
    },
    {
        id: "deploy",
        name: "Deployment Tactics",
        image: "https://xivapi.com/i/002000/002808.png",
        type: "mitigation",
        recast: 90,
    },
    {
        id: "lustrate",
        name: "Lustrate",
        image: "https://xivapi.com/i/002000/002805.png",
        type: "heal",
        recast: 1,
        potencyOnHit: 600,
        aetherflowCost: 1,
        healTarget: "target"
    },
    {
        id: "indom",
        name: "Indomitability",
        image: "https://xivapi.com/i/002000/002806.png",
        type: "heal",
        recast: 30,
        potencyOnHit: 400,
        aetherflowCost: 1,
    },
    {
        id: "succor",
        name: "Succor",
        image: "https://xivapi.com/i/002000/002802.png",
        type: "heal",
        potencyOnHit: 200,
        potencyShield: 320
    },
    {
        id: "adlo",
        name: "Adloquium",
        image: "https://xivapi.com/i/002000/002801.png",
        type: "heal",
        potencyOnHit: 300,
        potencyGalvanizeShield: 540,
        potencyCatalyzeShield: 540,
        healTarget: "target"
    },
]

export default {
    shortName,
    longName,
    role,
    resources,
    actions
}