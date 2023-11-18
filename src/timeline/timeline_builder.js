import {simulateState} from "./simulation.js";
import jobs from "../data/jobs/index.js";

const buildPlayerTimelineItemData = (timelineItem, players, id, state, usages) => {
    let t = {};
    t[`player${id}_hp`] = {
        type: "gauge",
        player: id,
        colorGradient: ["red", "yellow", "green"],
        overflowColor: "yellow",
        current: state.players[id].health,
        max: players[id].health
    };
    jobs[players[id].job].actions.forEach(action => {
        let astate = 0; // TODO enum
        let usageId = usages.length;
        if (state.casts.find(cast => (cast.player === id && cast.id === action.id))) {
            astate = 3;
            usageId = usages.findIndex((usage) => (usage.player === id && usage.id === action.id && usage.at === timelineItem.at));
        } else if (state.activeEffects.find(cast => (cast.player === id && cast.id === action.id))) {
            astate = 1;
        } else if (state.cooldowns.find(cast => (cast.player === id && cast.id === action.id))) {
            astate = 2;
        } else if (state.reservations.find(cast => (cast.player === id && cast.id === action.id))) {
            astate = -1;
        }
        if (usageId === -1) {
            console.warn("We're fucked");
            usageId = usages.length;
        }
        t[`player${id}_${action.id}`] = {
            type: "action",
            id: action.id,
            player: id,
            at: timelineItem.at,
            image: action.image,
            state: astate,
            usage: usageId,
        }
    });
    jobs[players[id].job].resources.forEach(resource => {
        t[`player${id}_${resource.id}`] = {
            type: "resource",
            id: resource.id,
            player: id,
            at: timelineItem.at,
            offImage: resource.offImage,
            onImage: resource.onImage,
            current: state.players[id].resources[resource.id].current,
            max: 3,
        }
    });

    return t;
}
const buildTimelineItem = (timelineItem, players, state, usages) => {
    return {
        timeline_at: `${Math.floor(timelineItem.at/60)}:${(('0' + timelineItem.at%60).slice(-2))}`,
        timeline_name: timelineItem.name,
        timeline_type: timelineItem.damageType,
        timeline_damage: timelineItem.damage,
        ...players.map((_, i) => buildPlayerTimelineItemData(timelineItem, players, i, state, usages)).reduce((accumulator, value) => Object.assign({}, accumulator, value), {})
    }
}

const buildInitialPlayerState = (player) => {
    return {
        health: player.health,
        maxHealth: player.health,
        role: jobs[player.job].role,
        subrole: player.subrole,
        resources: Object.fromEntries(jobs[player.job].resources.map(resource => ([resource.id, {
            id: resource.id,
            gain: 0,
            current: resource.startWith,
            max: resource.max,
            gainEvery: resource.gainEvery
        }]))),
    }
};

const buildInitialState = (players) => {
    const playerStates = players.map(player => buildInitialPlayerState(player));
    return {
        players: [...playerStates],
        casts: [],
        activeEffects: [],
        cooldowns: [],
        reservations: [],
    }
}

export const buildTimelineData = (timeline, players, usages, settings) => {
    if (!timeline) return [];

    let state = buildInitialState(players);
    let lastTime = -25;

    return timeline.map(timelineItem => {
        state = simulateState(timelineItem, state, timelineItem.at - lastTime, players, usages, settings);
        lastTime = timelineItem.at;
        return buildTimelineItem(timelineItem, players, state, usages, settings);
    });
}