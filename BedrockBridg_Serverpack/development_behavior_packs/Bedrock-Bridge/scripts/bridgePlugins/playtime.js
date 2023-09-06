/**
 * playtime (Players gaming time) - BedrockBridge Plugin
 * 
 * This bridge plugin lets you inquiry the time a player spent on the server. 
 * It handles info as scoreboard, so you can gather it from discord by running /stats.
 * You have two scoreboards: one for session time (in minutes), the other for overall time (in minutes). 
 * The latter is updated when the player leaves the server, while the first is updated each minute.
 * 
 * by InnateAlpaca (https://github.com/InnateAlpaca) 
 */

import { world, system } from '@minecraft/server'
import { bridge } from '../addons'

const scoreboard_name = "esploratori:overall_time", session_scoreboard_name="esploratori:session_time";
const timeScoreboard = world.scoreboard.getObjective(scoreboard_name)??world.scoreboard.addObjective(scoreboard_name, "total play time (min)");
const sessionScoreboard = world.scoreboard.getObjective(session_scoreboard_name)??world.scoreboard.addObjective(session_scoreboard_name, "session time (min)");

const joinTime = new Map();
const scoreboardIds = new Map();

world.getAllPlayers().forEach(async player=>{ //this line is here in case someone runs /reload which will erase stored data for online players
    player.runCommand(`scoreboard players add @s ${scoreboard_name} 0`);
    player.runCommand(`scoreboard players set @s ${session_scoreboard_name} 0`);
    
    scoreboardIds.set(player.id, player.scoreboardIdentity);
    joinTime.set(player.id, Date.now());        
})

world.afterEvents.playerSpawn.subscribe(({player, initialSpawn})=>{
    if (initialSpawn){
        player.runCommand(`scoreboard players add @s ${scoreboard_name} 0`);
        player.runCommand(`scoreboard players set @s ${session_scoreboard_name} 0`);

        scoreboardIds.set(player.id, player.scoreboardIdentity);
        joinTime.set(player.id, Date.now());
    }     
})

world.afterEvents.playerLeave.subscribe(e=>{
    const session_time = Math.floor(1.667e-5*(Date.now()-joinTime.get(e.playerId)));
    // console.log("scoreboard id", scoreboardIds.get(e.playerId).id.toString(), scoreboardIds.get(e.playerId).isValid())
    timeScoreboard.setScore(scoreboardIds.get(e.playerId), timeScoreboard.getScore(scoreboardIds.get(e.playerId))+session_time)
    
    scoreboardIds.delete(e.playerId);    
    joinTime.delete(e.playerId);    
})

bridge.bedrockCommands.registerCommand("gametime", (player)=>{
    var time = timeScoreboard.getScore(player.scoreboardIdentity)+sessionScoreboard.getScore(player.scoreboardIdentity);

    let message = "§oYou have been playing on this server for ";
    const days = Math.floor(time/1440); if(days) message+=`${days}d `; time%=1440;
    const hours = Math.floor(time/60); if(hours) message+= `${hours}h `; time%=60;
    message += `${time}m`;

    if (player.scoreboardIdentity){
        player.sendMessage(message);
    }
}, "Get your play-time in minutes.");

system.runInterval(()=>{
    world.getAllPlayers().forEach(p=>{        
        const session_time = Math.floor(1.667e-5*(Date.now()-joinTime.get(p.id)));
        p.runCommand(`scoreboard players set @s ${session_scoreboard_name} ${session_time}`);
    })
}, 1200);