import jobs from "../data/jobs/index.js";

const simulateDamage = (damage, type, activeEffects, players, playerId) => {
    const player = players[playerId];
    let defense = 0;
    if (type === "Magic") defense = player.magicalDefense;
    if (type === "Physical") defense = player.physicalDefense;
    const incomingDefenseMitPct = (100 - (15*defense/1900))/100;
    const roleMit = (jobs[player.job].role === "tank") ? 0.8 : 1;

    return activeEffects.reduce((accumulator, eff) => {
        if (eff.mitigationPercent) {
            if (!eff.mitigationTarget || (eff.mitigationTarget === "self" && eff.player === playerId)) return accumulator * (1 - eff.mitigationPercent/100);
        }
        if (type === "Physical" && eff.mitigationPercentPhysical) {
            if (!eff.mitigationTarget || (eff.mitigationTarget === "self" && eff.player === playerId)) return accumulator * (1 - eff.mitigationPercentPhysical/100);
        }
        if (type === "Magical" && eff.mitigationPercentMagical) {
            if (!eff.mitigationTarget || (eff.mitigationTarget === "self" && eff.player === playerId)) return accumulator * (1 - eff.mitigationPercentMagical/100);
        }
        return accumulator;
    }, damage * incomingDefenseMitPct * roleMit);
}

const simulateDelta = (state, delta, players, timelineItem, settings) => {
    const serverTicks = Math.floor(timelineItem.at/3) - Math.floor((timelineItem.at - delta)/3);

    state.cooldowns = state.cooldowns
        .map(cooldown => Object.assign({}, cooldown, { remaining: cooldown.remaining - delta }))
        .filter(cooldown => cooldown.remaining > 0);
    state.activeEffects = state.activeEffects
        .map(effect => Object.assign({}, effect, { remaining: effect.remaining - delta }))
        .filter(effect => effect.remaining > 0);
    state.players = state.players.map((player) => {
        const resources = Object.fromEntries(Object
            .entries(player.resources)
            .map(([idx, resource]) => {
                if (resource.current === resource.max) return [idx, resource];
                let gain = resource.gain + delta;
                let current = resource.current;
                if (gain >= resource.gainEvery) {
                    current += 1;
                    gain = gain % resource.gainEvery;
                    if (current >= resource.max) gain = 0;
                }

                return [idx, {...resource, gain, current }];
            })
        );
        let health = player.health;
        if (settings.showHp && health > 0) {
            for (let step = 0; step < serverTicks; step++) {
                health = Math.min(health + player.maxHealth * 0.02, player.maxHealth);
            }
        }
        return {...player, resources, health };
    });

    if (settings.showHp)
        state.activeEffects.forEach(eff => {
            if (eff.potencyPerTick && serverTicks > 0) {
                const caster = players[eff.player];
                state.players = state.players.map((player) => {
                    let health = player.health;
                    if (health > 0) {
                        for (let step = 0; step < serverTicks; step++) {
                            health = Math.min(health + (eff.potencyPerTick * caster.potencyMult), player.maxHealth);
                        }
                    }
                    return {...player, health };
                })
            }
        })

    return state;
}

const simulateUsages = (state, usages, players, timelineItem, _settings) => {
    state.casts = [];
    state.reservations = [];

    usages.forEach(usage => {
        const action = jobs[players[usage.player].job].actions.find(action => action.id === usage.id);

        if (action.recast && timelineItem.at >= usage.at - action.recast && timelineItem.at < usage.at) {
            state.reservations = [...state.reservations, { player: usage.player, id: usage.id }];
        }

        if (usage.at === timelineItem.at) {
            const recast = action?.recast;
            const duration = action?.duration;

            if (action) {
                state.casts = [...state.casts, {...action, player: usage.player}];
                if (recast && recast > 0) {
                    state.cooldowns = [...state.cooldowns, {player: usage.player, id: usage.id, remaining: recast}];
                }

                if (duration && duration > 0) {
                    state.activeEffects = [...state.activeEffects, {
                        ...action,
                        player: usage.player,
                        remaining: duration
                    }];
                }

                // TODO handle immediate effects
            }
        }
    })

    return state;
}

const getRandomElements = (arr, n) => {
    const shuffled = [...arr].sort(() => 0.5-Math.random());
    return shuffled.slice(0, n);
}

const simulateTimeline = (state, players, timelineItem, settings) => {
    if (!settings.showHp) return state; // Don't simulate if there's nothing to simulate

    let targets = [];
    let damagePerTarget = timelineItem.damage;
    if (timelineItem.type === "raidwide") {
        targets = [...players.keys()];
    }
    else if (timelineItem.type === "raidwide-shared") {
        targets = [...players.keys()];
        damagePerTarget = damagePerTarget/targets.length;
    }
    else if (timelineItem.type === "autoattack" || timelineItem.type === "tankbuster-main")
        targets = players.map((pl, i) => (pl.subrole === "main-tank" ? i : null)).filter(Boolean);
    else if (timelineItem.type === "tankbuster-both")
        targets = players.map((pl, i) => (jobs[pl.job].role === "tank" ? i : null)).filter(Boolean);
    else if (timelineItem.type === "tankbuster-shared") {
        targets = players.map((pl, i) => (jobs[pl.job].role === "tank" ? i : null)).filter(Boolean);
        damagePerTarget = damagePerTarget/targets.length;
    }
    else if (timelineItem.type === "random") {
        targets = getRandomElements(players.keys(), timelineItem.targets);
    }
    else if (timelineItem.type === "mechanic" || timelineItem.type === "doom") {
        targets = [];
    }
    else if (timelineItem.type === "enrage") {
        const splayers = state.players.map(pl => ({ ...pl, health: 0 }));
        return { ...state, players: splayers };
    }
    else {
        console.warn(`Unknown timeline type: ${timelineItem.type}`, timelineItem);
        targets = [];
    }

    if (targets.length === 0) return state; // Short circuit

    const splayers = state.players.map((playerState, i) => {
        if (!targets.includes(i)) return playerState;

        const damage = simulateDamage(damagePerTarget, timelineItem.damageType, state.activeEffects, players, i);
        return { ...playerState, health: Math.max(0, playerState.health - damage )};
    });

    return {...state, players: splayers};
}
export const simulateState = (timelineItem, lastState, delta, players, usages, settings) => {
    let state = {...lastState};

    // Simulate delta
    if (delta > 0) state = simulateDelta(state, delta, players, timelineItem, settings);

    // Handle usages
    if (delta !== 0) state = simulateUsages(state, usages, players, timelineItem, settings); // For entries at the same location, ignore

    // Simulate timeline
    state = simulateTimeline(state, players, timelineItem, settings);

    // Handle reactions

    return state;
}