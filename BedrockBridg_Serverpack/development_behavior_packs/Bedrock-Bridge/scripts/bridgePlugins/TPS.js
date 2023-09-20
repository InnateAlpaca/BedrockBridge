/**
 * TPS (Ticks Per Second) v1.0.1 - BedrockBridge Plugin
 * 
 * This bridge-addon adds a useful command to check TPS.
 * 
 * Installations: in order to insall this plugin paste this file 
 * into `Bedrock-Bridge/scripts/bridgePlugins` and add 
 * the line `import "./TPS"` to `index.js`.
 * 
 * by InnateAlpaca (https://github.com/InnateAlpaca)
 * ideated by Jaso0on
 */

import { system, world, DisplaySlotId } from '@minecraft/server';
import { bridge } from '../addons';

const tags = {
    admin: "admin"
}
const counters = [
    0, 
    0, 
    0,
    20
]
const types = {
    items : 0,
    players : 1,
    mobs : 2,
    tps : 3
}
const score_names = {
    items : "Items",
    players : "Players",
    mobs : "Mobs",
    tps : "TPS"
}

const interval = 20;

const TPSscoreboard = world.scoreboard.getObjective("esploratori:serverstats")??world.scoreboard.addObjective("esploratori:serverstats", "Server Statistics");

TPSscoreboard.getParticipants().forEach(p=>{
    if (!Object.values(score_names).includes(p.displayName))
        TPSscoreboard.removeParticipant(p);
})

bridge.bedrockCommands.registerCommand("tps", (user)=>{
    if (!user.hasTag(tags.admin)){
        user.sendMessage("§cYou are not allowed to run this command.");
        return;
    }

    user.sendMessage("Server statistics:")

    user.sendMessage(`- Current TPS is: ${counters[types.tps].toFixed(2)}`)
    user.sendMessage(`- Online players: ${counters[types.players]}`)
    user.sendMessage(`- Number of mobs: ${counters[types.mobs]}`)
    user.sendMessage(`- Number of items: ${counters[types.items]}`)
}, "get current TPS for the server."); //this is the description which will be visualised in !help

bridge.bedrockCommands.registerCommand("showServerStats", (user)=>{
    if (!user.hasTag(tags.admin)){
        user.sendMessage("§cYou are not allowed to run this command.");
        return;
    }
    system.run(()=>{
        world.scoreboard.setObjectiveAtDisplaySlot(DisplaySlotId.Sidebar, {objective:TPSscoreboard});
        user.sendMessage("§eServer added to sidebar.")
    })
}, "show real-time TPS on players' screen sidebar."); //this is the description which will be visualised in !help

bridge.bedrockCommands.registerCommand("hideServerStats", (user)=>{
    if (!user.hasTag(tags.admin)){
        user.sendMessage("§cYou are not allowed to run this command.");
        return;
    }
    system.run(()=>{
        world.scoreboard.clearObjectiveAtDisplaySlot(DisplaySlotId.Sidebar);
        user.sendMessage("§eServer stats removed from sidebar.")
    })   
}, "hide TPS stats from players' screen."); //this is the description which will be visualised in !help


var last_check = Date.now();
var last_tick = system.currentTick;

system.runInterval(()=>{
    counters[types.tps] = 1000*(system.currentTick-last_tick)/(Date.now()-last_check);
    last_check = Date.now();
    last_tick = system.currentTick;

    TPSscoreboard.setScore(score_names.tps, counters[types.tps]);
    TPSscoreboard.setScore(score_names.players, counters[types.players]);
    TPSscoreboard.setScore(score_names.items, counters[types.items]);
    TPSscoreboard.setScore(score_names.mobs, counters[types.mobs]);
}, interval)

const entity_types = {};

world.afterEvents.entitySpawn.subscribe(({entity})=>{
    if (entity.isValid())
    switch(entity.typeId){
        case "minecraft:item":{
            entity_types[entity.id] = types.items;
            counters[types.items]++; 
            break;
        }
        default: {
            entity_types[entity.id] = types.mobs;            
            counters[types.mobs]++; 
        }
    }
})

world.afterEvents.playerJoin.subscribe(()=>{
    counters[types.players]++;    
})
world.afterEvents.playerLeave.subscribe(()=>{
    counters[types.players]--;    
})
world.afterEvents.entityRemove.subscribe(e=>{
    counters[entity_types[e.removedEntityId]]--;
    delete entity_types[e.removedEntityId];    
})

async function main(){
    TPSscoreboard.setScore(score_names.tps, 20);
    TPSscoreboard.setScore(score_names.players, 0);
    TPSscoreboard.setScore(score_names.mobs, 0);
    TPSscoreboard.setScore(score_names.items, 0);

    for (const dimName of ["overworld", "nether", "the_End"]){
        const dimension = world.getDimension(dimName);
        dimension.getEntities({type: "item"}).forEach(e=>{
            entity_types[e.id] = types.items;
            counters[types.items]++;
        })
        dimension.getEntities({excludeTypes: ["item", "player"]}).forEach(e=>{
            entity_types[e.id] = types.items;
            counters[types.mobs]++;
        })
        await null;
    }

    counters[types.players] = world.getAllPlayers().length
}

main();
