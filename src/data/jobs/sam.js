const shortName = "sam";
const longName = "Samurai";
const role = "dps";

const resources = [];

const actions = [
  {
    id: "thirdeye",
    name: "Thirdeye",
    image: "https://xivapi.com/i/003000/003153.png",
    type: "mitigation",
    duration: 4,
    recast: 15,
    mitigationPercent: 10,
  },
  {
    id: "feint",
    name: "Feint",
    image: "https://xivapi.com/i/000000/000307.png",
    type: "mitigation",
    duration: 10,
    recast: 90,
    mitigationPercent: 5,
  },
  {
    id: "wind",
    name: "Second Wind",
    image: "https://xivapi.com/i/064000/064821.png",
    type: "heal",
    duration: 0,
    recast: 120,
    potency: 500,
  },
];

export default {
  shortName,
  longName,
  role,
  resources,
  actions,
};