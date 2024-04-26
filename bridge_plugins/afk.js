/**
 * AFK - BedrockBridge addon
 * 
 * This bridge-addon provides BedrockBridge with better message parsing between discord and bedrock. 
 * It will translate message formatting codes as much as possible, handle roles, channels, users, emojis...
 * 
 * by InnateAlpaca (https://github.com/InnateAlpaca)
 */

const TIME_LOOP_CHECK = 120;


import { bridge } from '../addons';
import { Player, system, world } from "@minecraft/server";

const player_stats = new Map();

const afk_scoreboard = world.scoreboard.getObjective("esploratori:afk-time")??world.scoreboard.addObjective("esploratori:afk-time", "afk-time");

function distance(v1, v2){// Vector mock as @minecraft/math requires manifest change
    return Math.sqrt((v1.x-v2.x)**2+(v1.y+v2.y)**2+(v1.z+v2.z)**2);
}

class PlayerStats {
    static error=0.1; // 5%

    /**@param {Player} player  */
    constructor(player){
        this.location=player.location;
        this.rotation=player.getViewDirection();
        this.dimension=player.dimension.id;
    }
    
    /**@param {PlayerStats} stat*/
    equals(stat){
        return distance(this.location, stat.location)<PlayerStats.error &&
               distance(this.rotation, stat.rotation)<PlayerStats.error &&
               this.dimension===stat.dimension;
    }
}

bridge.bedrockCommands.registerCommand("get-afk-time", (caller)=>{
    if (afk_scoreboard.hasParticipant(caller)){
        caller.sendMessage(`§oYou have been afk-ing for: ${afk_scoreboard.getScore(caller)} minutes`)  ;
    }
    else {
        caller.sendMessage(`§oYou have been afk-ing for: 0 minutes`);
    } 
}, "get the total afk time for your account")

bridge.bedrockCommands.registerAdminCommand("find-afkers", (caller)=>{
    const afkers = world.getPlayers({tags:["AFK"]});
    caller.sendMessage(`§o${afkers.length} afkers detected: §r${afkers.filter(p=>p.name).join(", ")}`)
}, "get the nametags of players currently afk")

bridge.bedrockCommands.registerAdminCommand("get-player-afk-time", (caller, target)=>{
    const player = target.readPlayer();
    if (player){
        if (afk_scoreboard.hasParticipant(player)){
            caller.sendMessage(`§o${player.name} You has been afk-ing for: ${afk_scoreboard.getScore(player)} minutes`)  ;
        }
        else {
            caller.sendMessage(`§o${player.name} has been afk-ing for: 0 minutes`);
        }
    }
    else {
        caller.sendMessage(`§cPlayer not found`);
    }
    
}, "get the total afk time for another player")

bridge.bedrockCommands.registerAdminCommand("reset-player-afk-time", (caller, target)=>{
    const player = target.readPlayer();
    if (player){
        if (afk_scoreboard.hasParticipant(player)){
            system.run(()=>{
                player.setDynamicProperty("esploratori:afk-time", 0);
                caller.sendMessage(`§e$afk-time for ${player.name} has been reset`);
            })
        }
    }
    else {
        caller.sendMessage(`§cPlayer not found`);
    }
    
}, "get the total afk time for another player")

// Handling reload case with players already online
for (const player of world.getAllPlayers()){
    player_stats.set(player.id, new PlayerStats(player));
}

world.afterEvents.playerSpawn.subscribe(e=>{
    if (e.initialSpawn) return;

    player_stats.set(e.player.id, new PlayerStats(e.player));
})

world.afterEvents.playerLeave.subscribe(e=>{
    player_stats.delete(e.playerId);
})

bridge.events.chatUpStream.subscribe((e, player)=>{
    player_stats.delete(player.id);
})

var time = Date.now();
system.runInterval(()=>{
    const interval = Date.now()-time
    for (const player of world.getAllPlayers()){
        const stat = new PlayerStats(player);

        if (player_stats.get(player.id)?.equals(stat)){ //player is afking
            const total_time = player.getDynamicProperty("esploratori:afk-time")??0;
            total_time += interval;
            player.setDynamicProperty("esploratori:afk-time", total_time)
            afk_scoreboard.setScore(player, Math.floor(total_time/60000));
        }
        else { // player is not afking
            if (player.hasTag("AFK")){
                player.removeTag("AFK");
            }
        }
        player_stats.set(player.id, stat);
    }
    time=Date.now();
}, Math.ceil(TIME_LOOP_CHECK*20));