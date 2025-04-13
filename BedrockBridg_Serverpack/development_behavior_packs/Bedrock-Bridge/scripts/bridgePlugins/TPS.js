/**
 * TPS (Ticks Per Second) @version 1.1.0 - BedrockBridge Plugin
 * 
 * This bridge-addon adds a useful command to check TPS.
 * 
 * Installations: in order to insall this plugin paste this file 
 * into `Bedrock-Bridge/scripts/bridgePlugins` and add 
 * the line `import "./TPS"` to `index.js`.
 * Admin tag is "esploratori:admin", so to be able to run commands
 * 
 * by InnateAlpaca (https://github.com/InnateAlpaca)
 * ideated by Jaso0on
 */

import { system, world, DisplaySlotId, DimensionTypes, Dimension } from '@minecraft/server';
import { bridge } from '../addons';
import { bridgeDirect } from "../BridgeDirect";

// report TPS lags to discord
const discord_report_enabled = true; 
// how long before sending another report if one has just been sent (in ticks), avoid spamming
const discord_delay = 1200; // 1 min
// minimum value for TPS to trigger a report to discord
const discord_report_min = 5;

/**Update interval (ticks) for stats shown in the scoreboard. 20 ticks is 1 second.*/
const interval = 20;

const types = {
    items: 0,
    players: 1,
    mobs: 2,
    tps: 3
}

const counters = [
    0,
    0,
    0,
    20
]

const score_names = {
    items: "Items",
    players: "Players",
    mobs: "Mobs",
    tps: "TPS"
}

const TPSscoreboard = world.scoreboard.getObjective("esploratori:serverstats")??world.scoreboard.addObjective("esploratori:serverstats", "Server Statistics");

TPSscoreboard.getParticipants().forEach(p => {
    if (!Object.values(score_names).includes(p.displayName))
        TPSscoreboard.removeParticipant(p);
})

const dimensions = {
    [DimensionTypes.get("overworld").typeId]: world.getDimension("overworld"),
    [DimensionTypes.get("nether").typeId]: world.getDimension("nether"),
    [DimensionTypes.get("the_end").typeId]: world.getDimension("the_end")
}

function  getCurrentCount(filter){
    let count = 0;
    for (const {typeId : dim} of DimensionTypes.getAll()){
        count+=dimensions[dim].getEntities(filter).length
    }
    return count;
}

/**Set the relevant counter, making sure that the actual count is syncronized with the world status*/
function setCounters(){
    counters[0] = getCurrentCount({ type: "minecraft:item" })
    counters[1] = world.getAllPlayers().length
    counters[2] = getCurrentCount({ excludeTypes: ["minecraft:item", "minecraft:player"] })
}

world.afterEvents.entitySpawn.subscribe(e=>{
    switch (e.entity.typeId){
        case "minecraft:item": {
            counters[0]++
            break;
        }
        case "minecraft:player": {
            break;
        }
        default: {
            counters[2]++
        }
    }
})

world.beforeEvents.entityRemove.subscribe(e=>{
    switch (e.removedEntity.typeId) {
        case "minecraft:item": {
            counters[0]--
            break;
        }
        case "minecraft:player": { 
            break; // for some reason entity spawn doesn't work with players
        }
        default: {
            counters[2]--
        }
    }
})

world.afterEvents.playerJoin.subscribe(() => {
    counters[types.players]++;  
})
world.afterEvents.playerLeave.subscribe(() => {
    counters[types.players]--;
})

world.afterEvents.playerSpawn.subscribe(()=>{
    setCounters(); // player might load a new area
})

bridge.bedrockCommands.registerAdminCommand("tps", (user)=>{
    user.sendMessage("Server statistics:")

    user.sendMessage(`- Current TPS is: ${counters[types.tps].toFixed(2)}`)
    user.sendMessage(`- Online players: ${counters[types.players]}`)
    user.sendMessage(`- Number of mobs: ${counters[types.mobs]}`)
    user.sendMessage(`- Number of items: ${counters[types.items]}`)
}, "get current TPS for the server."); //this is the description which will be visualised in !help

bridge.bedrockCommands.registerAdminCommand("showServerStats", (user)=>{
    world.scoreboard.setObjectiveAtDisplaySlot(DisplaySlotId.Sidebar, {objective:TPSscoreboard});
    user.sendMessage("§eServer added to sidebar.");    
}, "show real-time TPS on players' screen sidebar."); //this is the description which will be visualised in !help

bridge.bedrockCommands.registerAdminCommand("hideServerStats", (user)=>{
    world.scoreboard.clearObjectiveAtDisplaySlot(DisplaySlotId.Sidebar);
    user.sendMessage("§eServer stats removed from sidebar.")
       
}, "hide TPS stats from players' screen."); //this is the description which will be visualised in !help

var last_check = Date.now();
var last_tick = system.currentTick;

if (discord_report_enabled){
    bridge.events.bridgeInitialize.subscribe(e=>{
        e.registerAddition("discord_direct")
    })
}

let last_report = system.currentTick;
/** Report TPS drop to discord*/
function report(){
    const current = system.currentTick
    if (discord_report_enabled && bridgeDirect.ready && current - last_report > discord_delay){
        const message = `A TPS drop has been detected on your server!\n\n- TPS: \`${Math.round(counters[types.tps])}\`\n- Entities: \`${counters[types.players] + counters[types.items] + counters[types.mobs]}\`\n- Players: ` + 
                        world.getAllPlayers().map(player => `\`${player.name}\` (${player.dimension.getEntities({ maxDistance: 64, location: player.location }).length})`).join(", ")
        bridgeDirect.sendEmbed({
            title: "TPS Drop",
            description: message,
            color: 15548997
        })

        last_report = current;
    }
}

system.runInterval(()=>{
    counters[types.tps] = 1000*(system.currentTick-last_tick)/(Date.now()-last_check);
    last_check = Date.now();
    last_tick = system.currentTick;

    TPSscoreboard.setScore(score_names.tps, counters[types.tps]);
    TPSscoreboard.setScore(score_names.players, counters[types.players]);
    TPSscoreboard.setScore(score_names.items, counters[types.items]);
    TPSscoreboard.setScore(score_names.mobs, counters[types.mobs]);

    if (counters[types.tps]<=discord_report_min){
        report();
    }
}, interval)


system.run(()=>{
    setCounters();

    TPSscoreboard.setScore(score_names.tps, counters[types.tps]);
    TPSscoreboard.setScore(score_names.players, counters[types.players]);
    TPSscoreboard.setScore(score_names.items, counters[types.items]);
    TPSscoreboard.setScore(score_names.mobs, counters[types.mobs])
})
    